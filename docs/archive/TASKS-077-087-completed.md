# Completed task records — TASK-077 and TASK-087

## TASK-077 — Cross-model intent and language guidance

- Requirement: `REQ-CROSS-MODEL-LANGUAGE`.
- Final evidence: `RUN-20260910T183355Z-0cd4d108` ended `PASS`.
- Reopen only when a supplied dialogue case demonstrates meaning loss, missed authorization, or language ambiguity attributable to the shared communication contract.

## TASK-087 — Adapters state facts, not working style

- Requirement: `REQ-RUNTIME-STYLE-AUTONOMY`.
- Final evidence: `RUN-20260916T124335Z-d49d49ff` ended `PASS`.
- Implementation commit: `c8dc0ab0d4792cb944c1ba1c94b1ef453f966a3f`.
- Reopen only if a runtime adapter starts prescribing delegation, planning depth, search behavior, or another runtime-owned working style again.
