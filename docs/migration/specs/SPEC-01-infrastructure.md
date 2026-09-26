# SPEC-01: Infrastructure (Vercel project, Neon, env vars, protection, domains, runner)

Steps: P3.1–P3.5, P6.3. Gate: G3 (and part of G6). Executor: implementer (sonnet/high); read-back by scout (haiku/low).

All operations must be **idempotent**: read first, create only if missing, and converge settings to the values below. Record every id in `STATE.json → facts.vercel` / `facts.neon` via `state.mjs set`.

## 1. Identity and scope

| Item | Value |
|---|---|
| Team | slug `growmax1`, id `team_r7yanNuXwyp3P3jzhnxkDNaD` (verify in P0; the owner may have created a different team, in which case use what P0 recorded) |
| Project name | `growmax-website` |
| Repo | `growmax/growmax-website`, production branch `main` |
| Control plane | Vercel CLI (`npx --yes vercel@latest …`) authenticated by the `VERCEL_TOKEN` env var (never `--token` in argv) + `--scope growmax1`; Vercel MCP for reads/logs/fallback |

## 2. Project (P3.1)

1. Look up `growmax-website` in the team (`mcp__Vercel__get_project` / `vercel project ls`). If it exists, reuse it.
2. If missing, try in this order:
   a. `mcp__Vercel__create_git_project {repo: "growmax/growmax-website", teamId, projectName: "growmax-website", deploy: false}` (Git-connected).
   b. If that fails because the Vercel GitHub App lacks repo access: `vercel project add growmax-website --scope growmax1`, then `vercel link --yes --project growmax-website --scope growmax1` in the repo root. Record `facts.vercel.deployMode = "cli"` (otherwise `"git"`) and add blocker `B-GITAPP` (non-blocking, recommended owner action) with the exact install path: GitHub → Settings → Applications → Vercel → Configure → grant `growmax-website`.
3. Converge settings (`mcp__Vercel__update_project` or `vercel project` / REST `PATCH /v9/projects/{id}`):
   - `framework: "nextjs"`, `nodeVersion: "22.x"`, build/install/output commands `null` (auto-detect: runs `npm run build`).
   - `resourceConfig.functionDefaultRegions: ["iad1"]`, `resourceConfig.fluid: true`.
   - `commandForIgnoringBuildStep`: `[ -f docs/migration/PLAN.md ] && exit 1 || exit 0` (exit 1 = build, exit 0 = skip). Commits that predate this migration (old `main`) never deploy, so production stays on the verified SHA until the PR merges.
   - `enableProductionFeedback: false` (no toolbar on production).
   - Keep the default deployment protection (Standard: previews and generated URLs are protected; production custom domains are public).
   - If the team is on Pro: enable skew protection (`vercel project protection enable growmax-website --skew`).
4. Record `facts.vercel.projectId`, `projectName`, `deployMode`, `productionAliases` (from `get_project` → `targets.production.alias` after the first production deploy).

## 3. Neon via Vercel Marketplace (P3.2)

1. **Adopt, don't duplicate.** List Marketplace resources in the team: `vercel integration list --format json`. If that isn't available, run `vercel integration --help`, or use REST `GET /v1/storage/stores?teamId=…`. If a Neon resource named `growmax-db` exists, adopt it.
2. **Provision if missing** (from the linked repo directory):
   ```bash
   npx --yes vercel@latest integration add neon --help            # read product + metadata keys first
   npx --yes vercel@latest integration add neon --name growmax-db --plan "$NEON_PLAN" \
       -m region=<AWS us-east-1 / Washington D.C. value from --help> -m version=<source PG major> \
       -e production -e preview --no-env-pull --scope growmax1
   ```
   - `NEON_PLAN` comes from the kickoff prompt (`launch` recommended). If that plan is refused (no payment method), retry with `free` and add risk note R6 to `LOG.md`. **Never buy credits or add-ons.**
   - PG version: same major as the source (from P1.1 `facts.source.pgMajor`). If that isn't offered, use the lowest offered version ≥ source.
   - If the CLI needs an interactive terms acceptance (integration not installed on the team): add blocker `B-NEON-TERMS` ("Vercel → Marketplace → Neon → Install → accept terms; don't create a database"), continue with P2, re-check at the next check-in.
3. **Connect** (if `integration add` didn't): `vercel integration resource connect growmax-db growmax-website -e production -e preview --yes --format=json`.
4. **Verify env var names** (names only, never values): `vercel env ls production` / `mcp__Vercel__filter_project_envs`. Required: `DATABASE_URL` = **pooled** URL (host contains `-pooler`), and an unpooled URL (`DATABASE_URL_UNPOOLED`, or `POSTGRES_URL_NON_POOLING`). If the integration used different names, add `DATABASE_URL` (sensitive, production + preview) with the pooled value. Pipe it CLI-to-CLI without echoing.
5. Record `facts.neon`: `resourceName`, `resourceId`, `region`, `pgVersion`, `plan`, `pooledHost`, `unpooledHost` (**host names only**).
6. **Recommended owner setting** (no API): in the Neon console (`vercel integration open neon growmax-db`) turn off scale-to-zero for the production branch compute if the plan allows it. Add it as a non-blocking recommendation in the runbook.

## 4. Environment variables (P3.3)

Set with type **sensitive**, targets `production` and `preview`, **via stdin** (`printf '%s' "$VAL" | vercel env add NAME production --sensitive --scope growmax1`; repeat for `preview`). Use upsert semantics: if a variable exists, replace it only if the value differs. The CLI can't show sensitive values, so decide by provenance.

| Name | Value source | Notes |
|---|---|---|
| `SESSION_SECRET` | env `SESSION_SECRET` if present and ≥ 32 chars; otherwise `openssl rand -base64 48 \| tr -d '\n'` | Reusing Replit's value keeps admin cookies valid across the cutover; a new value only forces admins to log in again |
| `ADMIN_PASSWORD` | env `ADMIN_PASSWORD` (**required**; missing → blocker `B-ADMINPW`) | Same password as Replit keeps editors' workflow unchanged |
| `GOOGLE_CHAT_WEBHOOK_URL` | Extract from `git show origin/main:app/api/demo-requests/route.ts` (the `webhookUrl` constant) | Needed after M3 moves it out of code. Recommend rotation in the decommission checklist (it's in git history) |
| `DATABASE_URL` (+ unpooled) | Neon integration | Managed by the integration; don't touch unless §3.4 says so |

Never set `NODE_ENV` or `TZ`. **Build-time requirement:** `lib/db.ts` and `lib/session.ts` throw at import, so these must exist for production and preview *before* the first build.

## 5. Protection bypass for automation (P3.4)

- Generate once: `vercel project protection enable growmax-website --protection-bypass --format json`, or REST `PATCH /v1/projects/{id}/protection-bypass {"generate":{}}`, or `mcp__Vercel__update_project_protection_bypass`.
- Store the secret only in `docs/migration/.scratch/bypass-secret` (mode 600). Re-fetch from the project (`protectionBypass`) if the container was recycled. **Never commit it.**
- Harness requests send `x-vercel-protection-bypass: <secret>` and `x-vercel-set-bypass-cookie: true`.
- Access check: `GET https://<prod-alias>/` with the header → 200. Without it, a protected generated URL → 401/403. Record both.

## 6. Domains and certificates (P6.3; do not do this earlier)

1. `mcp__Vercel__add_project_domain` → `www.growmax.io` (no redirect). Then `growmax.io` with `redirect: "www.growmax.io", redirectStatusCode: 308`. Adding a domain has **no effect on live traffic**; it only shows "Invalid configuration" until DNS changes.
2. If the response says `verified: false`, capture the `verification[]` TXT records for the runbook.
3. Get the **live** recommended records (don't hardcode them): `vercel domains inspect www.growmax.io`, or REST `GET /v6/domains/www.growmax.io/config?projectIdOrName=growmax-website` → `recommendedCNAME` (and `recommendedIPv4` for the apex). Record them in `facts.dns.target`.
4. **Pre-issue TLS (DNS-01):** `vercel certs issue www.growmax.io growmax.io --challenge-only --scope growmax1` → capture the `_acme-challenge` TXT names and values for the runbook (step A). After the owner adds them (detected in P7), run `vercel certs issue www.growmax.io growmax.io --scope growmax1`, then verify: `curl -sI https://www.growmax.io --resolve www.growmax.io:443:<recommended IPv4>` must succeed with a valid cert.

## 7. Vercel Sandbox runner (default DB runner; HTTP fallback)

Use it when P0 recorded `facts.paths.db = "sandbox"` (expected, since raw TCP 5432 isn't available in the cloud container).

1. `mcp__Vercel__create_sandboxes_v4` with `projectId: growmax-website`, `name: "growmax-migration-runner"`, `region: "iad1"`, `persistent: true`, `resources: {vcpus: 2, memory: 4096}`, `timeout: 2700000`, `networkPolicy: {mode: "allow-all"}`. Reuse it by name if it exists (`mcp__Vercel__get_named_sandbox`).
2. Tooling: `which psql pg_dump || sudo dnf install -y postgresql<major>` (major ≥ source major). Fallback: `npx --yes pg-dump-restore` is **not** acceptable. Use the Node ETL fallback in SPEC-03 §4 instead.
3. Upload scripts: tar+gzip `scripts/migration/` → base64 → `mcp__Vercel__write_session_files` to `/home/vercel-sandbox/work`.
4. Run with `mcp__Vercel__run_session_command` (`wait: true`). Secrets go in the per-command `env` (`SRC_URL`, `DST_URL`), never in `args`. Outputs are masked by the scripts themselves.
5. Pull the results back (`mcp__Vercel__read_session_file`) and write evidence locally.
6. Delete or stop at P9.2. Record `facts.runner = {name, sessionId}`.

## 8. G3 read-back checklist (scout, independent)

- Project exists in team `growmax1`; framework nextjs; node 22.x; region iad1; fluid on; ignore-step command exact; deployMode recorded.
- Neon resource connected to production and preview; `DATABASE_URL` host contains `-pooler`; unpooled var present; region iad1 / us-east-1; PG major recorded.
- `SESSION_SECRET`, `ADMIN_PASSWORD`, `GOOGLE_CHAT_WEBHOOK_URL` exist for production and preview (type sensitive).
- Protection bypass secret exists (don't print it); access check results recorded.
- Evidence: `evidence/P3.5-infra-readback.json`.
