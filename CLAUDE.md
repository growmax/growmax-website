# Growmax website

Corporate site for Growmax: Next.js 15 App Router, React 19, Tailwind v4, Drizzle ORM on Postgres. Architecture, routes and design notes are in `replit.md`.

## Vercel migration in progress

`docs/migration/` holds an active Replit → Vercel + Neon migration.
- **If you are the migration orchestrator:** follow `docs/migration/ORCHESTRATOR.md` §1 now, and again after every compaction. Run `node scripts/migration/state.mjs resume`.
- **Everyone else:** don't edit `docs/migration/STATE.json` or `LOG.md`, and don't touch the migration branch's `.claude/workflows/mig-*` files.

Standing rules, which apply to every session and every subagent:
- Never run `scripts/seed-*.ts`, `scripts/import-*.ts`, `scripts/enhance-*.ts` or `npm run db:push` against a real (Replit or Neon) database.
- The Replit database (`REPLIT_DATABASE_URL`) is **read-only** for automation: `SET default_transaction_read_only = on`.
- Never print, log or commit secrets, connection strings or PII (demo requests and newsletter emails). Dumps and raw data go only in `docs/migration/.scratch/` (gitignored). Run `node scripts/migration/state.mjs scan` before committing.
- Keep the code Replit-compatible (port 5000 `dev`/`start` scripts stay) until the owner decommissions Replit.
- Every workflow `agent()` call sets `model` and `effort` explicitly. Nothing should inherit the orchestrator's Opus/max.
