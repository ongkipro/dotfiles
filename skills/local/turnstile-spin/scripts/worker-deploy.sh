#!/usr/bin/env bash
# Historical upstream artifact retained by the bundle's no-delete policy.
# Turnstile Spin gates an existing backend; it never deploys a Worker.

set -u

echo "worker-deploy: unsupported: Turnstile Spin must use the customer's existing backend" >&2
printf '%s\n' '{"status":"error","reason":"extra_infrastructure_out_of_scope"}'
exit 2
