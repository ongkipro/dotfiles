# Kelola Project Memory

Advisory stable references only. The Kelola repository owns execution state,
requirements, implementation truth, operations, and release authority.

- [Single deploy owner](feedback_auto_deploy.md) — use the repository-owned workflow and never run concurrent deploy paths.
- [Deployment boundary](reference_deploy.md) — current production truth and recovery commands belong in the Kelola repository.
- [Repliz integration location](project_repliz_integration_location.md) — stable product navigation reference.
- [Base UI store crash](feedback_baseui_store_crash.md) — avoid the known rerender failure path in fetch-triggering controls.
- [Tatacuan API shape](reference_tatacuan_api.md) — integration response-shape reference.
- [Deploy collision](feedback_deploy_collision.md) — serialize dependency and build mutations.
- [Deploy patch failure](feedback_deploy_nginx_patch.md) — non-critical optional patches must not abort core recovery.
- [Parallel development](project_parallel_dev.md) — inspect worktree and origin state before attributing changes.
- [MCP provider fit](project_mcp_provider_fit.md) — match provider authentication and transport requirements.
- [Recurrence cleanup](project_recurrence_dup_cleanup.md) — close the creation race before deterministic, tenant-scoped cleanup.
- [Notification tenant backfill](project_notif_workspace_backfill.md) — enforce tenant scope at write/read boundaries and classify legacy orphans.
- [Package install evidence](feedback_npm_install_sandbox.md) — verify the installed artifact rather than trusting piped exit output.
- [Agent space scope](reference_agent_space_scope.md) — enforce access scope at a shared authorization chokepoint.
- [Telegram bot pool](reference_telegram_bot_pool.md) — integration capability and ownership constraint.
- [Upload storage boundary](project_disk_uploads_growth.md) — keep uploads outside deploy-managed source paths and verify durability.
- [Kelola memory ownership](project_dotfiles_memory_sync.md) — advisory context only; canonical policy and repository evidence retain authority.
- [Backup verification boundary](reference_local_backup.md) — keep topology device-local and require restore evidence.
