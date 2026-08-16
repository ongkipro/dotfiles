---
name: Backup verification boundary
description: Keep backup topology and credentials device-local; retain only verification invariants here.
type: reference
---

Backup schedules, destinations, hostnames, key locations, retention counts, and
logs are device-local or repository operational state and must not be stored in
tracked shared memory.

Stable invariant: a backup is evidence only after restoreability is tested.
Verify database decryption and restore in an isolated environment, verify object
counts or checksums for uploaded assets, and record only a non-sensitive artifact
reference in release evidence.
