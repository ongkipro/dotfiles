'use strict';

process.stdout.write(`${JSON.stringify({
    success: false,
    error_code: 'legacy_debug_entrypoint_disabled',
    error: 'scout_debug.js is disabled because it used stealth automation and persisted raw Meta page HTML. Use scout.js for the official Ad Library API or perform an ordinary user-driven manual review.',
}, null, 2)}\n`);
process.exitCode = 2;
