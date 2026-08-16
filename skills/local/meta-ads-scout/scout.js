'use strict';

function emit(payload) {
    process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
}

function fail(errorCode, error, details = {}) {
    emit({
        success: false,
        source: 'meta_ad_library_api',
        error_code: errorCode,
        error,
        ...details,
    });
    process.exitCode = errorCode === 'invalid_configuration' || errorCode === 'invalid_arguments' ? 2 : 1;
}

async function run() {
    const keyword = process.argv[2];
    const country = process.argv[3];
    const accessToken = process.env.META_ACCESS_TOKEN;
    const apiVersion = process.env.META_GRAPH_API_VERSION;
    const adType = process.env.META_AD_TYPE || 'ALL';
    const maxResults = Number(process.env.META_AD_MAX_RESULTS || '25');

    if (!keyword || keyword.length > 100 || !/^[A-Z]{2}$/.test(country || '')) {
        fail('invalid_arguments', 'Usage: scout.js <keyword up to 100 characters> <two-letter uppercase country code>');
        return;
    }
    if (!accessToken || !/^v\d+\.\d+$/.test(apiVersion || '')) {
        fail(
            'invalid_configuration',
            'Set META_ACCESS_TOKEN from an existing secret store and META_GRAPH_API_VERSION after checking the current Meta Graph API reference.',
        );
        return;
    }
    if (!['ALL', 'EMPLOYMENT_ADS', 'FINANCIAL_PRODUCTS_AND_SERVICES_ADS', 'HOUSING_ADS', 'POLITICAL_AND_ISSUE_ADS'].includes(adType)) {
        fail('invalid_configuration', 'META_AD_TYPE is not a documented Ads Archive ad_type value.');
        return;
    }
    if (!Number.isInteger(maxResults) || maxResults < 1 || maxResults > 100) {
        fail('invalid_configuration', 'META_AD_MAX_RESULTS must be an integer from 1 through 100.');
        return;
    }

    const fields = [
        'id',
        'ad_creation_time',
        'ad_delivery_start_time',
        'ad_delivery_stop_time',
        'ad_snapshot_url',
        'page_id',
        'page_name',
        'ad_creative_bodies',
        'ad_creative_link_captions',
        'ad_creative_link_descriptions',
        'ad_creative_link_titles',
        'publisher_platforms',
    ];
    const endpoint = new URL(`https://graph.facebook.com/${apiVersion}/ads_archive`);
    endpoint.searchParams.set('search_terms', keyword);
    endpoint.searchParams.set('ad_reached_countries', JSON.stringify([country]));
    endpoint.searchParams.set('ad_type', adType);
    endpoint.searchParams.set('ad_active_status', 'ALL');
    endpoint.searchParams.set('fields', fields.join(','));
    endpoint.searchParams.set('limit', String(Math.min(100, maxResults)));

    const data = [];
    let after;
    let hasMore = false;

    try {
        do {
            if (after) {
                endpoint.searchParams.set('after', after);
            }
            const response = await fetch(endpoint, {
                headers: { Authorization: `Bearer ${accessToken}` },
                signal: AbortSignal.timeout(30_000),
            });
            const body = await response.json().catch(() => null);

            if (!response.ok || !body || !Array.isArray(body.data)) {
                const apiError = body?.error;
                fail('meta_api_request_failed', apiError?.message || `Meta API returned HTTP ${response.status}.`, {
                    http_status: response.status,
                    api_error: apiError ? {
                        type: apiError.type,
                        code: apiError.code,
                        error_subcode: apiError.error_subcode,
                        is_transient: apiError.is_transient,
                    } : undefined,
                });
                return;
            }

            data.push(...body.data.slice(0, maxResults - data.length));
            after = body.paging?.cursors?.after;
            hasMore = Boolean(after);
        } while (data.length < maxResults && after);

        emit({
            success: true,
            source: 'meta_ad_library_api',
            retrieved_at: new Date().toISOString(),
            api_version: apiVersion,
            filters: {
                search_terms: keyword,
                ad_reached_countries: [country],
                ad_type: adType,
                ad_active_status: 'ALL',
            },
            count: data.length,
            truncated: data.length === maxResults && hasMore,
            data,
        });
    } catch (error) {
        fail('meta_api_request_failed', error instanceof Error ? error.message : String(error));
    }
}

run();
