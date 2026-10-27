#!/usr/bin/env python3
"""Offline contract tests: actual installed SDK, substituted HTTP, no credentials.

Run with the Python beside `meta`, e.g.:
~/.local/share/pipx/venvs/meta-ads/bin/python bin/_dotads-meta-provider-test.py
"""

import copy
import builtins
import importlib.metadata
import importlib.util
import io
import json
import os
from pathlib import Path
import socket
import sys
import unittest
from unittest.mock import patch
from urllib.parse import urlsplit

from facebook_business.api import FacebookAdsApi
from facebook_business.session import FacebookSession
from requests.exceptions import Timeout


SPEC = importlib.util.spec_from_file_location("dotads_provider", Path(__file__).with_name("_dotads-meta-provider.py"))
provider = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(provider)
SDK_VERSION = importlib.metadata.version("facebook-business")
TOKEN = "synthetic-offline-token-DO-NOT-USE"
ACCOUNT = {"id": "act_123", "account_id": "123", "name": "Fixture Account", "currency": "IDR",
           "timezone_name": "Asia/Jakarta", "account_status": 1}
REQUEST = {"operation": "collect", "account_id": "act_123", "since": "2026-09-01", "until": "2026-09-30"}


def insight(level="ad", **values):
    row = {"account_id": "123", "account_currency": "IDR", "date_start": "2026-09-01",
           "date_stop": "2026-09-30", "spend": "123.45", "impressions": "42"}
    for entity, identity in (("campaign", "10"), ("adset", "20"), ("ad", "30")):
        if provider.LEVELS.index(entity) <= provider.LEVELS.index(level):
            row[entity + "_id"] = identity
    return {**row, **values}


class HTTPResponse:
    def __init__(self, body, status=200):
        self.text = body if isinstance(body, str) else json.dumps(body)
        self.status_code = status
        self.headers = {"Content-Type": "application/json"}


class Transport:
    def __init__(self, routes):
        self.routes = {key: list(value) for key, value in routes.items()}
        self.calls = []

    def __call__(self, method, url, **kwargs):
        self.calls.append({"method": method, "url": url, **copy.deepcopy(kwargs)})
        if method != "GET" or urlsplit(url).netloc != "graph.facebook.com":
            raise AssertionError("Provider attempted an unexpected transport target or mutation")
        parts = urlsplit(url).path.strip("/").split("/")
        key = "/".join(parts[1:])
        if key not in self.routes or not self.routes[key]:
            raise AssertionError("Unexpected fixture request")
        response = self.routes[key].pop(0)
        if isinstance(response, Exception):
            raise response
        return response if isinstance(response, HTTPResponse) else HTTPResponse(response)


def base_routes():
    return {"act_123": [ACCOUNT], "act_123/campaigns": [{"data": [{"id": "10", "account_id": "123"}]}],
            "act_123/adsets": [{"data": [{"id": "20", "account_id": "123", "campaign_id": "10"}]}],
            "act_123/ads": [{"data": [{"id": "30", "account_id": "123", "campaign_id": "10", "adset_id": "20",
                                        "creative": {"id": "40"}}]}],
            "act_123/adcreatives": [{"data": [{"id": "40", "account_id": "123"}]}],
            "act_123/insights": [{"data": [insight(level)]} for level in provider.LEVELS]}


class ProviderTests(unittest.TestCase):
    def setUp(self):
        # No inherited credential can reach a test. Both network escape paths fail.
        self.environment = patch.dict(os.environ, {}, clear=True)
        self.environment.start()
        self.network = patch.object(socket.socket, "connect", side_effect=AssertionError("Real network forbidden"))
        self.blocked_network = self.network.start()
        self.http = patch("requests.sessions.Session.request", side_effect=AssertionError("Uncontrolled HTTP forbidden"))
        self.blocked_http = self.http.start()
        self.addCleanup(self.environment.stop)
        self.addCleanup(self.network.stop)
        self.addCleanup(self.http.stop)

    def tearDown(self):
        self.assertEqual(self.blocked_network.call_count, 0, "A real socket was attempted")
        self.assertEqual(self.blocked_http.call_count, 0, "HTTP escaped the controlled SDK session")

    def collect(self, routes=None, request=None):
        self.transport = Transport(base_routes() if routes is None else routes)
        self.api = FacebookAdsApi(FacebookSession(access_token=TOKEN, timeout=provider.TIMEOUT))
        self.delays = []
        with patch.object(self.api._session.requests, "request", side_effect=self.transport):
            return provider.run(REQUEST if request is None else request, api=self.api,
                                sdk_version=SDK_VERSION, sleep=self.delays.append)

    def insights(self, pages, **params):
        return self.collect({"act_123": [ACCOUNT], "act_123/insights": pages},
                            {**REQUEST, "operation": "insights", "levels": ["ad"], **params})

    def test_validation_precedes_sdk_and_credentials(self):
        invalid = [None, [], {}, {"operation": "unknown"}, {"operation": "accounts", "account_id": "act_123"},
                   {**REQUEST, "access_token": TOKEN}, {**REQUEST, "account_id": "123"},
                   {**REQUEST, "account_id": "act_123/ads"}, {**REQUEST, "account_id": "act_0"},
                   {**REQUEST, "since": "2026-02-30"}, {**REQUEST, "since": "2026-9-01"},
                   {**REQUEST, "until": "2026-08-01"}, {**REQUEST, "date_preset": "last_7d"},
                   {**REQUEST, "operation": "insights", "date_preset": "last_7d"},
                   {**REQUEST, "levels": []}, {**REQUEST, "levels": ["ad", "ad"]},
                   {**REQUEST, "levels": ["creative"]}, {**REQUEST, "levels": [{}]},
                   {**REQUEST, "breakdowns": ["made_up"]}, {**REQUEST, "breakdowns": ["country", "country"]},
                   {**REQUEST, "max_pages": True}, {**REQUEST, "max_pages": 0}, {**REQUEST, "max_pages": 1001},
                   {**REQUEST, "attribution": {"made_up": True}},
                   {**REQUEST, "attribution": {"use_account_attribution_setting": "true"}},
                   {**REQUEST, "attribution": {"action_attribution_windows": ["7d_view"]}},
                   {**REQUEST, "attribution": {"action_attribution_windows": ["7d_click"], "use_unified_attribution_setting": True}},
                   {**REQUEST, "attribution": {"use_account_attribution_setting": True, "use_unified_attribution_setting": True}},
                   {**REQUEST, "action_report_time": "made_up"}]
        with patch.object(provider, "create_api") as factory:
            for request in invalid:
                with self.subTest(request=request), self.assertRaises(provider.ProviderError) as caught:
                    provider.run(request)
                self.assertEqual(caught.exception.detail["code"], "INVALID_REQUEST")
            factory.assert_not_called()

    def test_real_sdk_is_configured_without_performing_http(self):
        with patch.dict(os.environ, {"ACCESS_TOKEN": TOKEN}):
            api, version = provider.create_api()
        self.assertEqual(version, SDK_VERSION)
        self.assertEqual(api._api_version, FacebookAdsApi.API_VERSION)
        self.assertEqual(api._session.timeout, (10, 60))
        self.assertFalse(api._enable_debug_logger)
        self.assertEqual(api._num_requests_attempted, 0)

    def test_declared_fields_filters_and_parameters_exist_in_installed_sdk(self):
        from facebook_business.adobjects.adaccount import AdAccount
        from facebook_business.adobjects.adcreative import AdCreative
        from facebook_business.adobjects.ad import Ad
        from facebook_business.adobjects.adset import AdSet
        from facebook_business.adobjects.campaign import Campaign
        from facebook_business.adobjects.adsinsights import AdsInsights
        fields = [(AdAccount, provider.ACCOUNT_FIELDS), (AdsInsights, provider.INSIGHT_FIELDS)]
        objects = {"campaigns": Campaign, "adsets": AdSet, "ads": Ad, "creatives": AdCreative}
        fields += [(objects[resource], names) for resource, names in provider.RESOURCE_FIELDS.items()]
        for model, names in fields:
            self.assertTrue({field.split("{", 1)[0] for field in names}.issubset(set(vars(model.Field).values())))
        for resource, statuses in provider.RESOURCE_STATUSES.items():
            self.assertTrue(set(statuses).issubset(set(vars(objects[resource].EffectiveStatus).values())))
        self.assertTrue(provider.ATTRIBUTION_WINDOWS.issubset(set(vars(AdsInsights.ActionAttributionWindows).values())))
        self.assertTrue(provider.DATE_PRESETS.issubset(set(vars(AdsInsights.DatePreset).values())))
        self.assertTrue(provider.BREAKDOWNS.issubset(set(vars(AdsInsights.Breakdowns).values())))

    def test_accounts_paginate_using_cursor_without_following_next_url(self):
        other = {**ACCOUNT, "id": "act_456", "account_id": "456"}
        result = self.collect({"me/adaccounts": [
            {"data": [ACCOUNT], "paging": {"next": "https://evil.invalid/?access_token=" + TOKEN, "cursors": {"after": "cursor-a"}}},
            {"data": [other], "paging": {"cursors": {"after": "last-cursor"}}}]}, {"operation": "accounts"})
        self.assertEqual([row["id"] for row in result["accounts"]], ["act_123", "act_456"])
        self.assertEqual(result["coverage"], {"status": "complete", "pagination_exhausted": True})
        self.assertEqual(self.transport.calls[1]["params"]["after"], "cursor-a")
        self.assertTrue(all(call["url"].endswith("/me/adaccounts") for call in self.transport.calls))
        self.assertNotIn(TOKEN, json.dumps(result))

    def test_accounts_empty_success_and_denial_are_distinct(self):
        result = self.collect({"me/adaccounts": [{"data": []}]}, {"operation": "accounts"})
        self.assertEqual(result["coverage"]["status"], "complete")
        self.assertEqual(result["accounts"], [])
        denied = {"error": {"code": 190, "message": "secret " + TOKEN, "error_subcode": 463}}
        result = self.collect({"me/adaccounts": [HTTPResponse(denied, 400)]}, {"operation": "accounts"})
        self.assertEqual(result["coverage"], {"status": "unavailable", "pagination_exhausted": False})
        self.assertEqual(result["errors"][0]["api_code"], 190)
        self.assertNotIn(TOKEN, json.dumps(result))

    def test_collect_requires_all_resources_and_preserves_all_requested_levels(self):
        result = self.collect()
        self.assertEqual(result["schema_version"], 1)
        self.assertEqual(set(result["resources"]), set(provider.RESOURCE_FIELDS))
        self.assertTrue(all(resource["status"] == "complete" for resource in result["resources"].values()))
        self.assertEqual([row["query"]["level"] for row in result["insights"]], list(provider.LEVELS))
        self.assertTrue(all(row["coverage"]["status"] == "complete" for row in result["insights"]))
        self.assertEqual(result["source"]["sdk_version"], SDK_VERSION)
        self.assertEqual(result["source"]["api_version"], self.api._api_version)
        self.assertIsNone(result["source"]["effective_api_version"])
        self.assertLessEqual(result["source"]["started_at"], result["source"]["finished_at"])
        self.assertNotIn("actions", result["insights"][0]["rows"][0])
        self.assertEqual(len(self.transport.calls), 9)

    def test_insights_uses_explicit_grain_dates_breakdowns_and_attribution(self):
        policy = {"action_attribution_windows": ["7d_click", "1d_view"]}
        result = self.insights([{"data": [insight(country="ID")]}], breakdowns=["country"],
                               attribution=policy, action_report_time="impression")
        query = result["insights"][0]["query"]
        wire = self.transport.calls[-1]["params"]
        self.assertEqual(wire["level"], "ad")
        self.assertEqual(json.loads(wire["time_range"]), {"since": REQUEST["since"], "until": REQUEST["until"]})
        self.assertEqual(json.loads(wire["action_attribution_windows"]), ["7d_click", "1d_view"])
        self.assertEqual(json.loads(wire["breakdowns"]), ["country"])
        self.assertEqual(wire["time_increment"], "all_days")
        self.assertEqual(wire["action_report_time"], "impression")
        self.assertIn("ad_id", json.loads(wire["fields"]))
        self.assertEqual(query["attribution"], policy)
        self.assertEqual(result["resources"], {})

    def test_date_preset_is_preserved_without_inventing_absolute_dates(self):
        request = {"operation": "insights", "account_id": "act_123", "date_preset": "last_7d", "levels": ["ad"],
                   "attribution": {"use_unified_attribution_setting": True}}
        result = self.collect({"act_123": [ACCOUNT], "act_123/insights": [{"data": []}]}, request)
        query, wire = result["insights"][0]["query"], self.transport.calls[-1]["params"]
        self.assertIsNone(query["since"])
        self.assertIsNone(query["until"])
        self.assertEqual(query["date_preset"], "last_7d")
        self.assertEqual(wire["date_preset"], "last_7d")
        self.assertNotIn("time_range", wire)
        self.assertEqual(wire["use_unified_attribution_setting"], "true")

    def test_account_identity_and_context_fail_before_inventory(self):
        invalid = [{**ACCOUNT, "id": "act_456", "account_id": "456"}, {**ACCOUNT, "account_id": "456"},
                   {**ACCOUNT, "currency": None}, {**ACCOUNT, "timezone_name": ""}]
        for account in invalid:
            with self.subTest(account=account), self.assertRaises(provider.ProviderError):
                self.collect({"act_123": [account]})
            self.assertEqual(len(self.transport.calls), 1)

    def test_missing_optional_account_name_uses_verified_account_id(self):
        routes = base_routes()
        routes["act_123"] = [{key: value for key, value in ACCOUNT.items() if key != "name"}]
        result = self.collect(routes)
        self.assertEqual(result["account"]["name"], "act_123")
        self.assertTrue(all(item["coverage"]["status"] == "complete" for item in result["insights"]))

    def test_supported_outbound_and_video_metrics_are_preserved_without_invented_aliases(self):
        result = self.insights([{"data": [insight(outbound_clicks=[{"action_type": "outbound_click", "value": "3"}],
            video_thruplay_watched_actions=[{"action_type": "video_view", "value": "7"}])]}])["insights"][0]
        self.assertIn("outbound_clicks", result["query"]["fields"])
        self.assertIn("video_thruplay_watched_actions", result["query"]["fields"])
        self.assertNotIn("video_3_sec_watched_actions", result["query"]["fields"])
        self.assertEqual(result["rows"][0]["outbound_clicks"][0]["value"], "3")
        self.assertEqual(result["rows"][0]["video_thruplay_watched_actions"][0]["value"], "7")

    def test_bad_rows_do_not_discard_valid_partial_rows_or_other_resources(self):
        routes = base_routes()
        routes["act_123/campaigns"] = [{"data": [{"id": "10", "account_id": "123"}, {"id": "11", "account_id": "456"}]}]
        routes["act_123/adcreatives"] = [HTTPResponse({"error": {"code": 200, "message": TOKEN}}, 400)] * 2
        result = self.collect(routes)
        campaign = result["resources"]["campaigns"]
        self.assertEqual(campaign["status"], "partial")
        self.assertTrue(campaign["pagination_exhausted"])
        self.assertEqual([row["id"] for row in campaign["rows"]], ["10"])
        self.assertEqual(result["resources"]["creatives"]["status"], "unavailable")
        self.assertEqual(result["resources"]["ads"]["status"], "complete")
        self.assertEqual(result["insights"][0]["coverage"]["status"], "complete")

    def test_inventory_declares_status_scope_and_optional_field_fallback_stays_partial(self):
        routes = base_routes()
        routes["act_123/adsets"] = [HTTPResponse({"error": {"code": 100, "message": TOKEN}}, 400),
                                   {"data": [{"id": "20", "account_id": "123", "campaign_id": "10"}]}]
        result = self.collect(routes)
        self.assertEqual(result["scope"]["collection_contract_version"], 1)
        for resource in ("campaigns", "adsets", "ads"):
            self.assertIn("ARCHIVED", result["resources"][resource]["query"]["effective_status"])
            self.assertIn("DELETED", result["resources"][resource]["query"]["effective_status"])
            self.assertEqual(result["scope"]["inventory_filters"][resource]["effective_status"],
                             result["resources"][resource]["query"]["effective_status"])
        adsets = result["resources"]["adsets"]
        self.assertEqual(result["scope"]["inventory_fields"]["adsets"], adsets["query"]["fields"])
        self.assertEqual(result["scope"]["required_inventory_fields"]["adsets"], adsets["query"]["fetched_fields"])
        self.assertEqual(adsets["status"], "partial")
        self.assertEqual(len(adsets["rows"]), 1)
        self.assertEqual(adsets["errors"][0]["api_code"], 100)
        self.assertIn("targeting", adsets["query"]["fields"])
        self.assertEqual(adsets["query"]["fetched_fields"], ["id", "account_id", "campaign_id"])
        self.assertEqual(adsets["observed_fields"], ["account_id", "campaign_id", "id"])
        self.assertTrue(adsets["pagination_exhausted"])

    def test_canonical_scope_contains_full_and_required_inventory_field_contracts(self):
        planned = provider.plan(REQUEST)
        collected = self.collect()
        for resource in provider.RESOURCE_FIELDS:
            self.assertEqual(planned["scope"]["inventory_fields"][resource], collected["resources"][resource]["query"]["fields"])
            self.assertEqual(planned["scope"]["required_inventory_fields"][resource], list(provider.RESOURCE_REQUIRED_FIELDS[resource]))
            self.assertTrue(set(planned["scope"]["required_inventory_fields"][resource]).issubset(
                planned["scope"]["inventory_fields"][resource]))
        # A requested-field change must change scope even with an unchanged contract version.
        changed_fields = {**provider.RESOURCE_FIELDS, "campaigns": provider.RESOURCE_FIELDS["campaigns"] + ("buying_type",)}
        with patch.object(provider, "RESOURCE_FIELDS", changed_fields):
            changed = provider.plan(REQUEST)["scope"]
        self.assertNotEqual(planned["scope"], changed)
        self.assertEqual(planned["scope"]["collection_contract_version"], changed["collection_contract_version"])
        # Required identity changes are independently part of scope semantics.
        required = {**provider.RESOURCE_REQUIRED_FIELDS, "campaigns": ("id", "account_id", "name")}
        with patch.object(provider, "RESOURCE_REQUIRED_FIELDS", required):
            self.assertNotEqual(planned["scope"], provider.plan(REQUEST)["scope"])

    def test_insight_identity_parent_dates_currency_and_breakdown_are_required(self):
        invalid = [insight(account_id="456"), insight(ad_id=None), insight(campaign_id=None),
                   insight(adset_id="act_20"), insight(date_start="2026-08-01"), insight(date_stop="not-a-date"),
                   insight(date_start="2026-09-30", date_stop="2026-09-01"), insight(account_currency="MYR"),
                   {key: value for key, value in insight().items() if key != "ad_id"}]
        for row in invalid:
            with self.subTest(row=row):
                result = self.insights([{"data": [row, insight(ad_id="31")]}])["insights"][0]
                self.assertEqual(result["coverage"]["status"], "partial")
                self.assertEqual(len(result["rows"]), 1)
                self.assertEqual(result["rows"][0]["ad_id"], "31")
        missing_dimension = self.insights([{"data": [insight()]}], breakdowns=["country"])["insights"][0]
        self.assertEqual(missing_dimension["errors"][0]["code"], "GRAIN_MISMATCH")
        wrong_level = self.insights([{"data": [insight()]}], levels=["account"])["insights"][0]
        self.assertEqual(wrong_level["coverage"]["status"], "unavailable")

    def test_same_entity_different_breakdowns_remain_separate_and_duplicates_fail(self):
        rows = [insight(country="ID"), insight(country="MY")]
        result = self.insights([{"data": rows}], breakdowns=["country"])["insights"][0]
        self.assertEqual(result["coverage"]["status"], "complete")
        self.assertEqual(len(result["rows"]), 2)
        result = self.insights([{"data": rows + [rows[0]]}], breakdowns=["country"])["insights"][0]
        self.assertEqual(result["coverage"]["status"], "partial")
        self.assertEqual(result["errors"][0]["code"], "DUPLICATE_ROW")
        self.assertEqual(len(result["rows"]), 2)

    def test_loop_and_page_limit_preserve_partial_rows(self):
        page = {"data": [insight()], "paging": {"next": "ignored", "cursors": {"after": "same"}}}
        result = self.insights([page], max_pages=1)["insights"][0]
        self.assertEqual(result["coverage"], {"status": "partial", "pagination_exhausted": False})
        self.assertEqual(result["errors"][0]["code"], "PAGE_LIMIT")
        second = copy.deepcopy(page)
        second["data"][0]["ad_id"] = "31"
        result = self.insights([page, second])["insights"][0]
        self.assertEqual(result["errors"][0]["code"], "PAGINATION_LOOP")
        self.assertEqual(len(result["rows"]), 2)
        self.assertEqual(len(self.transport.calls), 3)

    def test_empty_success_final_cursor_and_malformed_responses(self):
        result = self.insights([{"data": [], "paging": {"cursors": {"after": "last"}}}])["insights"][0]
        self.assertEqual(result["coverage"], {"status": "complete", "pagination_exhausted": True})
        invalid = [{}, {"data": {}}, {"data": [None]}, {"data": [], "paging": []},
                   {"data": [], "paging": {"next": "ignored"}}, {"data": [], "paging": {"next": True}},
                   {"data": [], "paging": {"next": "ignored", "cursors": {"after": "bad\ncursor"}}},
                   HTTPResponse("{broken"), {"data": [insight(spend=float("nan"))]}]
        for page in invalid:
            with self.subTest(page=page):
                result = self.insights([page])["insights"][0]
                self.assertEqual(result["coverage"]["status"], "unavailable")
                self.assertTrue(result["errors"])
                self.assertFalse(result["rows"])

    def test_transient_api_failure_retries_but_permission_denial_does_not(self):
        transient = HTTPResponse({"error": {"code": 2, "is_transient": True, "message": TOKEN}}, 503)
        result = self.insights([transient, transient, {"data": [insight()]}])["insights"][0]
        self.assertEqual(result["coverage"]["status"], "complete")
        self.assertEqual(self.delays, [1, 2])
        denied = HTTPResponse({"error": {"code": 200, "error_subcode": 99, "message": TOKEN}}, 400)
        result = self.insights([denied])["insights"][0]
        self.assertEqual(len(self.transport.calls), 2)
        self.assertEqual(self.delays, [])
        self.assertEqual(result["errors"][0]["attempts"], 1)
        self.assertEqual(result["errors"][0]["api_subcode"], 99)
        self.assertNotIn(TOKEN, json.dumps(result))

    def test_rate_error_and_timeout_are_bounded_with_partial_preservation(self):
        rate = HTTPResponse({"error": {"code": 80004, "message": TOKEN}}, 400)
        result = self.insights([rate, rate, rate])["insights"][0]
        self.assertEqual(result["errors"][0]["attempts"], 3)
        self.assertEqual(self.delays, [1, 2])
        page = {"data": [insight()], "paging": {"next": "ignored", "cursors": {"after": "next"}}}
        result = self.insights([page, Timeout(TOKEN), Timeout(TOKEN), Timeout(TOKEN)])["insights"][0]
        self.assertEqual(result["coverage"], {"status": "partial", "pagination_exhausted": False})
        self.assertEqual(result["errors"][0]["code"], "TRANSPORT_ERROR")
        self.assertEqual(len(result["rows"]), 1)
        self.assertNotIn(TOKEN, json.dumps(result))

    def test_nonstandard_http_failure_with_data_body_is_not_success(self):
        result = self.insights([HTTPResponse({"data": []}, 500)] * 3)["insights"][0]
        self.assertEqual(result["coverage"]["status"], "unavailable")
        self.assertEqual(result["errors"][0]["http_status"], 500)
        self.assertEqual(result["errors"][0]["attempts"], 3)

    def test_nested_credentials_and_raw_exception_text_never_reach_output(self):
        routes = base_routes()
        routes["act_123/adcreatives"][0]["data"][0].update(
            name=TOKEN, object_story_spec={"access_token": TOKEN, "link_data": {"link": "https://example.test/?access_token=" + TOKEN}})
        with patch.dict(os.environ, {"ACCESS_TOKEN": TOKEN}):
            result = self.collect(routes)
        text = json.dumps(result)
        self.assertNotIn(TOKEN, text)
        self.assertNotIn('"access_token":', text)
        result = self.insights([ValueError("https://graph.facebook.com/?access_token=" + TOKEN)])["insights"][0]
        self.assertEqual(result["errors"][0]["code"], "PROVIDER_ERROR")
        self.assertNotIn("graph.facebook.com", json.dumps(result))
        self.assertNotIn(TOKEN, json.dumps(result))

    def test_stdin_protocol_errors_are_json_and_sanitized_without_sdk_access(self):
        samples = ["{broken", '{"operation":"accounts","operation":"collect"}',
                   '{"operation":"accounts","max_pages":NaN}', '"' + TOKEN + '"', "x" * 65537,
                   json.dumps({"operation": "accounts"})]
        for raw in samples:
            with self.subTest(raw_length=len(raw)), patch.object(sys, "stdin", io.StringIO(raw)), \
                    patch.object(sys, "stdout", io.StringIO()) as output, patch.object(sys, "argv", ["provider"]):
                status = provider.main()
                result = json.loads(output.getvalue())
                self.assertEqual(status, 1)
                self.assertIn(result["error"]["code"], ("INVALID_REQUEST", "AUTH_REQUIRED"))
                self.assertNotIn(TOKEN, output.getvalue())

    def test_stdin_protocol_success_uses_real_sdk_with_controlled_http(self):
        api = FacebookAdsApi(FacebookSession(access_token=TOKEN, timeout=provider.TIMEOUT))
        transport = Transport(base_routes())
        with patch.object(api._session.requests, "request", side_effect=transport), \
                patch.object(provider, "create_api", return_value=(api, SDK_VERSION)), \
                patch.object(sys, "stdin", io.StringIO(json.dumps(REQUEST))), \
                patch.object(sys, "stdout", io.StringIO()) as output, patch.object(sys, "argv", ["provider"]):
            status = provider.main()
        result = json.loads(output.getvalue())
        self.assertEqual(status, 0)
        self.assertEqual(len(result["insights"]), 4)
        self.assertEqual(len(output.getvalue().splitlines()), 1)
        self.assertEqual(result["source"]["sdk_version"], SDK_VERSION)

    def test_plan_stdout_matches_collection_scope_without_sdk_environment_or_network(self):
        import_call = builtins.__import__

        def no_sdk_import(name, *args, **kwargs):
            if name.startswith("facebook_business"):
                raise AssertionError("Plan must not import the SDK")
            return import_call(name, *args, **kwargs)

        class NoEnvironment(dict):
            def get(self, *args, **kwargs):
                raise AssertionError("Plan must not access credentials or environment")

            def __getitem__(self, key):
                raise AssertionError("Plan must not access credentials or environment")

        with patch.object(provider, "create_api", side_effect=AssertionError("SDK initialization forbidden")) as factory, \
                patch.object(provider.os, "environ", NoEnvironment()), \
                patch("builtins.__import__", side_effect=no_sdk_import), \
                patch.object(sys, "stdin", io.StringIO(json.dumps(REQUEST))), \
                patch.object(sys, "stdout", io.StringIO()) as output, patch.object(sys, "argv", ["provider", "--plan"]):
            status = provider.main()
        planned = json.loads(output.getvalue())
        factory.assert_not_called()
        self.assertEqual(status, 0)
        self.assertEqual(len(output.getvalue().splitlines()), 1)
        self.assertEqual(planned["request"], provider.validate(REQUEST))
        self.assertEqual(planned["scope"], self.collect()["scope"])
        self.assertEqual(planned["scope"]["collection_contract_version"], 1)
        self.assertIn("DELETED", planned["scope"]["inventory_filters"]["ads"]["effective_status"])

    def test_plan_preserves_insights_preset_scope_and_rejects_invalid_scope(self):
        request = {"operation": "insights", "account_id": "act_123", "levels": ["ad"], "date_preset": "last_7d"}
        with patch.object(provider, "create_api", side_effect=AssertionError("SDK initialization forbidden")):
            planned = provider.plan(request)
            self.assertIsNone(planned["scope"]["since"])
            self.assertIsNone(planned["scope"]["until"])
            self.assertEqual(planned["scope"]["date_preset"], "last_7d")
            self.assertEqual(planned["scope"]["inventory_filters"], {})
            self.assertEqual(planned["scope"]["inventory_fields"], {})
            self.assertEqual(planned["scope"]["required_inventory_fields"], {})
            self.assertEqual(provider.validate(planned["request"]), planned["request"])
            self.assertEqual(provider.plan({"operation": "accounts"})["scope"], {})
            with patch.object(sys, "stdin", io.StringIO(json.dumps({**REQUEST, "account_id": "wrong"}))), \
                    patch.object(sys, "stdout", io.StringIO()) as output, patch.object(sys, "argv", ["provider", "--plan"]):
                status = provider.main()
            self.assertEqual(status, 1)
            self.assertEqual(json.loads(output.getvalue())["error"]["code"], "INVALID_REQUEST")


if __name__ == "__main__":
    unittest.main(verbosity=2)
