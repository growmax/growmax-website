# Pre-flight checklist (owner, before starting the orchestrator)

The orchestrator is fully autonomous once these are in place. Its first step (P0) re-checks every item and stops with exact instructions if something is missing. Nothing is lost if you re-run it later.

Checked on 2026-09-26 from the planning session:
- The Vercel connector gets **403** on team `growmax1`.
- Cloud network is **Trusted**; `growmax.io`, `api.vercel.com` and `*.neon.tech` are blocked.
- **No** credentials are present.
- Vercel is on **Hobby**.

## Required

| # | What | Where | Why |
|---|---|---|---|
| 1 | **Reconnect the Vercel connector with access to team `growmax1`** | https://claude.ai/customize/connectors → Vercel → disconnect → connect. On Vercel's consent screen, grant the **growmax1** team (not only your personal scope) | Every team-scoped call currently returns 403 |
| 2 | **Network access → Full** (or Custom with: `growmax.io`, `*.growmax.io`, `*.vercel.app`, `vercel.com`, `*.vercel.com`, `api.vercel.com`, `*.neon.tech`, `dns.google`, `cloudflare-dns.com`, plus the Trusted defaults) | Cloud environment menu in the session title bar → **Edit** → Network access | Crawl the live site and Vercel deployments, and use the Vercel CLI |
| 3 | Environment variable **`REPLIT_DATABASE_URL`** = the **production** DB connection string the live Replit deployment uses | Same dialog → Environment variables | Source of the data migration. P0 proves it's production by comparing it with the live `/api/blog` |
| 4 | Environment variable **`VERCEL_TOKEN`**: a Vercel access token scoped to `growmax1`, expiry ≥ 30 days | Vercel → Account Settings → Tokens → Create (scope: growmax1). Then add it in the environment dialog | Neon provisioning, env vars via stdin, TLS pre-issuance (`vercel certs issue --challenge-only`), none of which the MCP can do |
| 5 | Environment variable **`ADMIN_PASSWORD`** = the current admin CMS password | Environment dialog | Admin login must keep working unchanged on Vercel |

Never paste secrets into chat. Environment variables are read when a session **starts**, so set them first, then start the orchestrator session.

## Decisions (strongly recommended)

| # | Decision | Recommendation |
|---|---|---|
| D1 | **Vercel plan** | **Upgrade `growmax1` to Pro** (Vercel → Settings → Billing). Hobby is for non-commercial use only and pauses projects when limits are exceeded, which is incompatible with a company site and a 100% availability goal. The orchestrator never purchases. Without Pro it still builds and verifies everything, but the go/no-go makes "upgrade to Pro" a condition before you switch DNS. |
| D2 | **Neon plan** (set in the kickoff prompt: `NEON_PLAN=launch`) | **launch** (usage-based). On `free`, running out of compute quota **suspends the database**. If `launch` needs a payment method that isn't there, the orchestrator falls back to `free` and flags it. |

## Recommended (avoids a possible mid-run stop)

| # | What | Where | If skipped |
|---|---|---|---|
| R1 ✅ (owner, 2026-09-26; proven at P3.1) | Grant the **Vercel GitHub App** access to `growmax/growmax-website` | GitHub → org `growmax` → Settings → GitHub Apps → Vercel → Configure → add the repo | Falls back to CLI deployments (works; no automatic deploys from `main` until connected) |
| R2 ✅ (owner, 2026-09-26: integration installed, Neon project `rapid-recipe-07132564` created; the orchestrator adopts it) | Install the **Neon integration** on `growmax1` | Vercel → Marketplace → Neon → Install | The CLI may need an interactive terms acceptance → blocker `B-NEON-TERMS` |
| R3 | **Lower the TTL of the `www` DNS record to 300 s** (≥ 24 h before cutover) | Your DNS host (the apex resolves to Squarespace IPs, so probably Squarespace Domains) | Rollback and propagation take as long as the old TTL |
| R4 | Optional **`SESSION_SECRET`** (current Replit value) as an environment variable | Environment dialog | A new secret is generated and admins log in once more |
| R5 | Tell editors: **content freeze** in the Replit admin from the "READY FOR DNS" notification until 24 h after you switch DNS | n/a | Post-cutover sync still reconciles edits, but a freeze is cleaner |

## Starting the orchestrator

1. Start a **new** cloud session on repo `growmax/growmax-website`, base branch **`claude/wonderful-edison-823y83`** (so `CLAUDE.md`, the agents, the workflows and the compaction hook load at startup).
2. Set the model and effort: `/model opus` (Opus 5.5) and `/effort max`, or pick them in the UI.
3. Paste the prompt from [`KICKOFF-PROMPT.md`](./KICKOFF-PROMPT.md).
