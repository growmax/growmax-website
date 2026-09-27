# Replit → Vercel + Neon migration

**Status:** see [`STATE.json`](./STATE.json), or run `node scripts/migration/state.mjs resume`.

| If you are… | Read |
|---|---|
| The owner, about to start | [`PREFLIGHT.md`](./PREFLIGHT.md) → [`KICKOFF-PROMPT.md`](./KICKOFF-PROMPT.md) |
| The orchestrator | [`ORCHESTRATOR.md`](./ORCHESTRATOR.md) (binding), then the current step's row in [`PLAN.md`](./PLAN.md) §7 |
| Checking progress or proof | [`VERIFICATION.md`](./VERIFICATION.md), [`LOG.md`](./LOG.md), [`evidence/`](./evidence/) |
| Switching DNS | [`CUTOVER-RUNBOOK.md`](./CUTOVER-RUNBOOK.md) (only once it's rendered, i.e. no `{{…}}` left) |
| Rolling back | [`specs/SPEC-07-rollback.md`](./specs/SPEC-07-rollback.md) |

Here's how the pieces fit together:

- **`STATE.json`** is the single source of truth. **`scripts/migration/state.mjs`** is its only writer.
- A SessionStart hook in **`.claude/settings.json`** injects `state.mjs resume --hook` at start, on resume and after every compaction. `CLAUDE.md` holds the standing rules, and it's also re-read after compaction.
- The per-phase workflows in **`.claude/workflows/mig-*.js`** set a model and effort on every agent. The role files in **`.claude/agents/migration-*.md`** hold each role's rules.
