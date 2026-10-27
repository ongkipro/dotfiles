#!/usr/bin/env python3
"""Read-only Meta reporting adapter. One JSON request on stdin, one on stdout.
--plan validates and describes scope without SDK, environment, or network access.

Uses the official SDK installed beside the Meta CLI without changing its version.
Schemas reviewed against facebook-python-business-sdk tag 24.0.1 on 2026-10-27:
https://github.com/facebook/facebook-python-business-sdk/tree/24.0.1
The SDK request version is recorded; no server version is inferred from it.
"""

import copy
import datetime as dt
import importlib.metadata
import json
import os
import re
import sys
import time


LEVELS = ("account", "campaign", "adset", "ad")
ACCOUNT_FIELDS = ("id", "account_id", "name", "account_status", "currency", "timezone_name")
RESOURCE_FIELDS = {
    "campaigns": ("id", "account_id", "name", "objective", "status", "configured_status",
                  "effective_status", "daily_budget", "lifetime_budget", "created_time", "updated_time"),
    "adsets": ("id", "account_id", "campaign_id", "name", "status", "configured_status",
               "effective_status", "daily_budget", "lifetime_budget", "optimization_goal", "billing_event",
               "promoted_object", "targeting", "start_time", "end_time", "attribution_spec",
               "is_dynamic_creative", "created_time", "updated_time"),
    "ads": ("id", "account_id", "campaign_id", "adset_id", "name", "status", "configured_status",
            "effective_status", "creative{id}", "conversion_domain", "tracking_specs", "created_time", "updated_time"),
    "creatives": ("id", "account_id", "name", "status", "title", "body", "object_type",
                  "object_story_id", "effective_object_story_id", "object_story_spec", "asset_feed_spec",
                  "image_hash", "image_url", "thumbnail_url", "video_id", "link_url", "object_url",
                  "object_store_url", "template_url", "url_tags", "call_to_action_type", "product_set_id",
                  "instagram_permalink_url", "effective_instagram_media_id", "degrees_of_freedom_spec"),
}
RESOURCE_REQUIRED_FIELDS = {
    "campaigns": ("id", "account_id"),
    "adsets": ("id", "account_id", "campaign_id"),
    "ads": ("id", "account_id", "campaign_id", "adset_id"),
    "creatives": ("id", "account_id"),
}
RESOURCE_STATUSES = {
    "campaigns": ("ACTIVE", "ARCHIVED", "DELETED", "IN_PROCESS", "PAUSED", "WITH_ISSUES"),
    "adsets": ("ACTIVE", "ARCHIVED", "CAMPAIGN_PAUSED", "DELETED", "IN_PROCESS", "PAUSED", "WITH_ISSUES"),
    "ads": ("ACTIVE", "ADSET_PAUSED", "ARCHIVED", "CAMPAIGN_PAUSED", "DELETED", "DISAPPROVED", "IN_PROCESS",
            "PAUSED", "PENDING_BILLING_INFO", "PENDING_REVIEW", "PREAPPROVED", "WITH_ISSUES"),
}
INSIGHT_FIELDS = ("account_id", "account_name", "account_currency", "date_start", "date_stop",
                  "spend", "impressions", "reach", "frequency", "clicks", "inline_link_clicks",
                  "outbound_clicks", "actions", "action_values", "purchase_roas", "website_purchase_roas",
                  "video_thruplay_watched_actions")
# Deliberately bounded surface; unsupported combinations fail visibly at Meta.
BREAKDOWNS = frozenset(("age", "gender", "country", "region", "dma", "device_platform",
                        "impression_device", "publisher_platform", "platform_position", "conversion_destination"))
DATE_PRESETS = frozenset(("today", "yesterday", "this_month", "last_month", "this_quarter", "last_quarter",
                         "this_year", "last_year", "last_3d", "last_7d", "last_14d", "last_28d", "last_30d",
                         "last_90d", "this_week_mon_today", "this_week_sun_today", "last_week_mon_sun",
                         "last_week_sun_sat", "maximum", "data_maximum"))
ATTRIBUTION_WINDOWS = frozenset(("1d_click", "7d_click", "28d_click", "1d_view", "1d_ev", "dda", "default",
                                "skan_click", "skan_view", "skan_click_second_postback", "skan_view_second_postback",
                                "skan_click_third_postback", "skan_view_third_postback"))
PAGE_SIZE = 100
ATTEMPTS = 3
TIMEOUT = (10, 60)


class ProviderError(Exception):
    def __init__(self, code, message, **details):
        super().__init__(message)
        self.detail = {"code": code, "message": message, **details}


def require(condition, message):
    if not condition:
        raise ProviderError("INVALID_REQUEST", message)


def date_value(value):
    if not isinstance(value, str) or not re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        raise ValueError("invalid date")
    return dt.date.fromisoformat(value)


def validate(request):
    require(isinstance(request, dict), "Request must be a JSON object.")
    require(not set(request) - {"operation", "account_id", "since", "until", "date_preset", "levels",
                               "breakdowns", "attribution", "action_report_time", "max_pages"},
            "Request contains unsupported parameters.")
    operation = request.get("operation")
    require(operation in ("accounts", "collect", "insights"), "Unsupported operation.")
    result = copy.deepcopy(request)
    pages = result.setdefault("max_pages", 100)
    require(type(pages) is int and 1 <= pages <= 1000, "max_pages must be an integer from 1 to 1000.")
    if operation == "accounts":
        require(not set(request) - {"operation", "max_pages"}, "Account discovery accepts only max_pages.")
        return result
    require(isinstance(result.get("account_id"), str) and
            re.fullmatch(r"act_[1-9]\d*", result["account_id"]) is not None,
            "account_id must be act_ followed by a positive numeric account ID.")
    preset = result.get("date_preset")
    if preset is not None:
        require(operation == "insights" and isinstance(preset, str) and preset in DATE_PRESETS,
                "date_preset is supported only for Insights and must be a supported preset.")
        require(result.get("since") is None and result.get("until") is None, "Use absolute dates or date_preset, not both.")
        result.update(since=None, until=None)
    else:
        try:
            since, until = date_value(result.get("since")), date_value(result.get("until"))
        except (ValueError, TypeError):
            raise ProviderError("INVALID_REQUEST", "since and until must be valid YYYY-MM-DD dates.") from None
        require(since <= until, "since must be on or before until.")
    levels = result.setdefault("levels", list(LEVELS))
    require(isinstance(levels, list) and 1 <= len(levels) <= 4 and
            all(isinstance(value, str) and value in LEVELS for value in levels) and len(set(levels)) == len(levels),
            "levels must be a nonempty unique list of account, campaign, adset, ad.")
    breakdowns = result.setdefault("breakdowns", [])
    require(isinstance(breakdowns, list) and len(breakdowns) <= len(BREAKDOWNS) and
            all(isinstance(value, str) and value in BREAKDOWNS for value in breakdowns) and
            len(set(breakdowns)) == len(breakdowns), "breakdowns contains an unsupported or repeated dimension.")
    attribution = result.setdefault("attribution", {})
    require(isinstance(attribution, dict) and not set(attribution) - {
        "action_attribution_windows", "use_account_attribution_setting", "use_unified_attribution_setting"},
        "attribution contains unsupported parameters.")
    for key in ("use_account_attribution_setting", "use_unified_attribution_setting"):
        require(key not in attribution or type(attribution[key]) is bool, "Attribution setting flags must be boolean.")
    require(not (attribution.get("use_account_attribution_setting") and attribution.get("use_unified_attribution_setting")),
            "Select one attribution setting source.")
    if "action_attribution_windows" in attribution:
        windows = attribution["action_attribution_windows"]
        require(isinstance(windows, list) and bool(windows) and
                all(isinstance(value, str) and value in ATTRIBUTION_WINDOWS for value in windows) and
                len(set(windows)) == len(windows), "Attribution windows contain unsupported or repeated values.")
        require(not (attribution.get("use_account_attribution_setting") or attribution.get("use_unified_attribution_setting")),
                "Explicit attribution windows cannot be combined with an attribution setting source.")
    report_time = result.setdefault("action_report_time", "conversion")
    require(report_time in ("conversion", "impression", "mixed", "lifetime"), "Unsupported action_report_time.")
    return result


def utc_now():
    return dt.datetime.now(dt.timezone.utc).isoformat().replace("+00:00", "Z")


def planned_scope(request):
    """Canonical scope from a validated request; no SDK or environment access."""
    if request["operation"] == "accounts":
        return {}
    scope = {key: copy.deepcopy(request[key]) for key in
             ("since", "until", "levels", "breakdowns", "attribution", "action_report_time")}
    scope["collection_contract_version"] = 1
    scope["inventory_filters"] = ({resource: {"effective_status": list(RESOURCE_STATUSES[resource])}
                                   if resource in RESOURCE_STATUSES else {} for resource in RESOURCE_FIELDS}
                                  if request["operation"] == "collect" else {})
    scope["inventory_fields"] = ({resource: list(fields) for resource, fields in RESOURCE_FIELDS.items()}
                                 if request["operation"] == "collect" else {})
    scope["required_inventory_fields"] = ({resource: list(fields) for resource, fields in RESOURCE_REQUIRED_FIELDS.items()}
                                          if request["operation"] == "collect" else {})
    if request.get("date_preset"):
        scope["date_preset"] = request["date_preset"]
    return scope


def plan(request):
    request = validate(request)
    return {"request": request, "scope": planned_scope(request)}


def create_api():
    token = os.environ.get("ACCESS_TOKEN", "")
    if not token.strip():
        raise ProviderError("AUTH_REQUIRED", "ACCESS_TOKEN must be supplied through the process environment.")
    try:
        from facebook_business.api import FacebookAdsApi
        from facebook_business.session import FacebookSession
        version = importlib.metadata.version("facebook-business")
    except (ImportError, importlib.metadata.PackageNotFoundError):
        raise ProviderError("SDK_UNAVAILABLE", "Run the provider with the installed Meta CLI's Python environment.") from None
    return FacebookAdsApi(FacebookSession(access_token=token, timeout=TIMEOUT), enable_debug_logger=False), version


def safe_error(error):
    """Never stringify SDK/HTTP exceptions: their text contains URLs and params."""
    if isinstance(error, ProviderError):
        return error.detail
    from facebook_business.exceptions import FacebookRequestError
    from requests.exceptions import ConnectionError, Timeout
    if isinstance(error, FacebookRequestError):
        code, subcode, status = error.api_error_code(), error.api_error_subcode(), error.http_status()
        retryable = (error.api_transient_error() is True or
                     status in (429, 500, 502, 503, 504) or code in (1, 2, 4, 17, 32, 613, 80004))
        result = {"code": "API_ERROR", "message": "Meta rejected the reporting request.", "retryable": retryable}
        for key, value in (("api_code", code), ("api_subcode", subcode), ("http_status", status)):
            if type(value) is int:
                result[key] = value
        return result
    if isinstance(error, (Timeout, ConnectionError)):
        return {"code": "TRANSPORT_ERROR", "message": "Meta reporting transport failed.", "retryable": True}
    return {"code": "PROVIDER_ERROR", "message": "Meta reporting failed without a valid response.", "retryable": False}


def api_get(api, path, params, sleep):
    for attempt in range(ATTEMPTS):
        try:
            response = api.call("GET", path, params=copy.deepcopy(params))
            status = response.status()
            if type(status) is not int:
                raise ProviderError("MALFORMED_RESPONSE", "Meta response omitted its HTTP status.")
            if not 200 <= status < 300:
                raise ProviderError("HTTP_ERROR", "Meta returned an unsuccessful HTTP status.",
                                    http_status=status, retryable=status in (429, 500, 502, 503, 504))
            body = response.json()
            if not isinstance(body, dict) or "error" in body:
                raise ProviderError("MALFORMED_RESPONSE", "Meta returned an invalid response object.")
            return body
        except Exception as error:
            detail = safe_error(error)
            if detail.get("retryable") and attempt < ATTEMPTS - 1:
                sleep(2 ** attempt)
                continue
            raise ProviderError(**{**detail, "attempts": attempt + 1}) from None


def account_record(row, expected=None):
    if not isinstance(row, dict) or not isinstance(row.get("id"), str) or not re.fullmatch(r"act_[1-9]\d*", row["id"]):
        raise ProviderError("ACCOUNT_MISMATCH", "Account response lacks a valid account identity.")
    if row.get("account_id") != row["id"][4:] or (expected and row["id"] != expected):
        raise ProviderError("ACCOUNT_MISMATCH", "Account response does not match the requested identity.")
    record = {field: row.get(field) for field in ACCOUNT_FIELDS}
    try:
        json.dumps(record, allow_nan=False)
    except (TypeError, ValueError, RecursionError):
        raise ProviderError("MALFORMED_RESPONSE", "Account response is not valid JSON data.") from None
    return record


def row_identity(row, resource, account_id, query=None, currency=None):
    if not isinstance(row, dict):
        raise ProviderError("INVALID_ROW", "Meta returned a row that is not an object.")
    try:
        json.dumps(row, allow_nan=False)
    except (TypeError, ValueError, RecursionError):
        raise ProviderError("INVALID_ROW", "Meta returned a row that is not valid JSON data.") from None
    if resource == "accounts":
        return account_record(row)["id"]
    if row.get("account_id") != account_id[4:]:
        raise ProviderError("ACCOUNT_MISMATCH", "A reporting row does not match the requested account.")
    required = [field for field in RESOURCE_REQUIRED_FIELDS[resource] if field != "account_id"] if not query else []
    if query:
        depth = LEVELS.index(query["level"])
        required.extend(level + "_id" for level in LEVELS[1:depth + 1])
        if any(row.get(level + "_id") for level in LEVELS[depth + 1:]):
            raise ProviderError("GRAIN_MISMATCH", "Insights returned a different entity level.")
        if row.get("account_currency") not in (None, currency):
            raise ProviderError("CURRENCY_MISMATCH", "Insights returned a different account currency.")
        try:
            start, stop = date_value(row.get("date_start")), date_value(row.get("date_stop"))
            if start > stop or (query["since"] and
                                (start < date_value(query["since"]) or stop > date_value(query["until"]))):
                raise ValueError("scope mismatch")
        except (ValueError, TypeError):
            raise ProviderError("DATE_MISMATCH", "Insights returned an invalid or out-of-scope date bucket.") from None
        if any(key not in row or row[key] is None for key in query["breakdowns"]):
            raise ProviderError("GRAIN_MISMATCH", "Insights omitted a requested breakdown dimension.")
    if any(not isinstance(row.get(key), str) or not re.fullmatch(r"[1-9]\d*", row[key]) for key in required):
        raise ProviderError("INVALID_ROW", "A reporting row is missing a required entity or parent ID.")
    identity = [row.get(key) for key in required] or [row["account_id"]]
    if query:
        identity += [row["date_start"], row["date_stop"]] + [row[key] for key in query["breakdowns"]]
    return json.dumps(identity, sort_keys=True, separators=(",", ":"), allow_nan=False)


def paginate(api, path, params, max_pages, resource, account_id=None, query=None, currency=None, sleep=time.sleep):
    rows, errors, seen_cursors, seen_rows = [], [], set(), set()
    exhausted = False
    for page_number in range(max_pages):
        try:
            body = api_get(api, path, params, sleep)
            if not isinstance(body.get("data"), list):
                raise ProviderError("MALFORMED_RESPONSE", "Meta edge response is missing its data array.")
            for row in body["data"]:
                try:
                    identity = row_identity(row, resource, account_id, query, currency)
                    if identity in seen_rows:
                        raise ProviderError("DUPLICATE_ROW", "Meta repeated a reporting row in the same query.")
                    seen_rows.add(identity)
                    fields = query["fields"] + query["breakdowns"] if query else ACCOUNT_FIELDS if resource == "accounts" else RESOURCE_FIELDS[resource]
                    wanted = {field.split("{", 1)[0] for field in fields}
                    rows.append({key: value for key, value in row.items() if key in wanted})
                except ProviderError as error:
                    if len(errors) < 100:
                        errors.append(error.detail)
            paging = body.get("paging", {})
            if not isinstance(paging, dict):
                raise ProviderError("MALFORMED_PAGING", "Meta returned invalid pagination metadata.")
            next_page = paging.get("next")
            if next_page is None:
                exhausted = True
                break
            if not isinstance(next_page, str) or not next_page:
                raise ProviderError("MALFORMED_PAGING", "Meta returned an invalid next-page marker.")
            cursors = paging.get("cursors")
            after = cursors.get("after") if isinstance(cursors, dict) else None
            if not isinstance(after, str) or not after or len(after) > 8192 or any(ord(char) < 32 for char in after):
                raise ProviderError("MALFORMED_PAGING", "Meta continuation lacks a valid after cursor.")
            if after in seen_cursors:
                raise ProviderError("PAGINATION_LOOP", "Meta repeated a pagination cursor.")
            seen_cursors.add(after)
            if page_number + 1 == max_pages:
                raise ProviderError("PAGE_LIMIT", "Collection stopped at max_pages before pagination was exhausted.")
            params = {**params, "after": after}
        except ProviderError as error:
            errors.append(error.detail)
            break
    return {"status": "partial" if rows and errors else "unavailable" if errors else "complete",
            "pagination_exhausted": exhausted, "rows": rows, "errors": errors}


def redact(value, token=""):
    if isinstance(value, dict):
        return {key: redact(item, token) for key, item in value.items()
                if key.lower() not in {"access_token", "appsecret_proof", "authorization"}}
    if isinstance(value, list):
        return [redact(item, token) for item in value]
    if isinstance(value, str):
        if token:
            value = value.replace(token, "[REDACTED]")
        return re.sub(r"(?i)([?&](?:access_token|appsecret_proof)=)[^&#\s]*", r"\1[REDACTED]", value)
    return value


def run(request, api=None, sdk_version=None, sleep=time.sleep):
    request = validate(request)
    started = utc_now()
    if api is None:
        api, sdk_version = create_api()
    source = {"kind": "META_BUSINESS_SDK", "sdk_version": sdk_version,
              "api_version": api._api_version, "effective_api_version": None, "started_at": started}
    if request["operation"] == "accounts":
        result = paginate(api, ("me", "adaccounts"), {"fields": list(ACCOUNT_FIELDS), "limit": PAGE_SIZE},
                          request["max_pages"], "accounts", sleep=sleep)
        response = {"accounts": result.pop("rows"), "coverage": {key: result[key] for key in ("status", "pagination_exhausted")},
                    "errors": result["errors"], "source": source}
    else:
        account_id = request["account_id"]
        account = account_record(api_get(api, (account_id,), {"fields": list(ACCOUNT_FIELDS)}, sleep), account_id)
        # Reporting context is required; do not publish an apparently complete unknown-currency report.
        if not all(isinstance(account[field], str) and account[field].strip() for field in ("currency", "timezone_name")):
            raise ProviderError("ACCOUNT_CONTEXT_UNAVAILABLE", "Account response omitted currency or timezone.")
        if not isinstance(account["name"], str) or not account["name"].strip():
            account["name"] = account_id
        scope = planned_scope(request)
        response = {"schema_version": 1, "source": source, "account": account, "scope": scope, "resources": {}, "insights": []}
        if request["operation"] == "collect":
            for resource, fields in RESOURCE_FIELDS.items():
                edge = "adcreatives" if resource == "creatives" else resource
                params = {"fields": list(fields), "limit": PAGE_SIZE}
                if resource in RESOURCE_STATUSES:
                    params["effective_status"] = list(RESOURCE_STATUSES[resource])
                result = paginate(api, (account_id, edge), params, request["max_pages"], resource,
                                  account_id=account_id, sleep=sleep)
                fetched_fields = list(fields)
                # A denied optional field must not discard an accessible core inventory.
                # This bounded fallback stays partial; it cannot satisfy the full field request.
                if not result["rows"] and any(error.get("api_code") in (100, 200) for error in result["errors"]):
                    fetched_fields = list(RESOURCE_REQUIRED_FIELDS[resource])
                    core = paginate(api, (account_id, edge), {**params, "fields": fetched_fields},
                                    request["max_pages"], resource, account_id=account_id, sleep=sleep)
                    core["errors"] = result["errors"] + core["errors"]
                    core["status"] = "partial" if core["rows"] else "unavailable"
                    result = core
                result["query"] = {"account_id": account_id, "edge": edge, **params, "fetched_fields": fetched_fields}
                result["observed_fields"] = sorted({key for row in result["rows"] for key in row})
                response["resources"][resource] = result
        for level in request["levels"]:
            fields = list(INSIGHT_FIELDS)
            for entity in LEVELS[1:LEVELS.index(level) + 1]:
                fields.extend((entity + "_id", entity + "_name"))
            query = {"account_id": account_id, "since": request["since"], "until": request["until"],
                     "level": level, "fields": fields, "breakdowns": request["breakdowns"], "time_increment": "all_days",
                     "attribution": request["attribution"], "action_report_time": request["action_report_time"]}
            params = {"fields": fields, "level": level, "breakdowns": request["breakdowns"], "time_increment": "all_days",
                      "limit": PAGE_SIZE, "action_report_time": request["action_report_time"], **request["attribution"]}
            if request.get("date_preset"):
                query["date_preset"] = params["date_preset"] = request["date_preset"]
            else:
                params["time_range"] = {"since": request["since"], "until": request["until"]}
            result = paginate(api, (account_id, "insights"), params, request["max_pages"], "insights",
                              account_id=account_id, query=query, currency=account["currency"], sleep=sleep)
            response["insights"].append({"query": query, "coverage": {key: result[key] for key in ("status", "pagination_exhausted")},
                                         "rows": result["rows"], "errors": result["errors"]})
    source["finished_at"] = utc_now()
    return redact(response, os.environ.get("ACCESS_TOKEN", ""))


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError("duplicate key")
        result[key] = value
    return result


def main():
    try:
        plan_only = sys.argv[1:] == ["--plan"]
        if len(sys.argv) != 1 and not plan_only:
            raise ProviderError("INVALID_REQUEST", "Pass the JSON request on stdin; only --plan is supported as an option.")
        raw = sys.stdin.read(65537)
        if len(raw) > 65536:
            raise ProviderError("INVALID_REQUEST", "JSON request exceeds 64 KiB.")
        try:
            request = json.loads(raw, object_pairs_hook=unique_object,
                                 parse_constant=lambda value: (_ for _ in ()).throw(ValueError("nonfinite")))
        except (ValueError, RecursionError):
            raise ProviderError("INVALID_REQUEST", "stdin must contain one valid JSON request without duplicate keys.") from None
        result, status = plan(request) if plan_only else run(request), 0
    except ProviderError as error:
        result, status = {"error": error.detail}, 1
    except Exception:
        result, status = {"error": {"code": "PROVIDER_ERROR", "message": "Meta reporting provider failed safely."}}, 1
    try:
        payload = json.dumps(result, ensure_ascii=True, allow_nan=False, separators=(",", ":"))
    except (TypeError, ValueError, RecursionError):
        payload = '{"error":{"code":"PROVIDER_ERROR","message":"Meta reporting response could not be encoded safely."}}'
        status = 1
    print(payload)
    return status


if __name__ == "__main__":
    sys.exit(main())
