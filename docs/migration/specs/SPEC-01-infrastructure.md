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

1. Look for an existing project first: by name `growmax-website`, **and** by repo (`mcp__Vercel__list_projects {teamId, repo: "growmax-website"}` / `vercel project ls`). The owner may have created one while connecting Neon. If one is linked to `growmax/growmax-website`, reuse it (whatever its name), and record its name in `facts.vercel.projectName` and every later step. Never create a second project for the same repo.
2. If missing, try in this order:
   a. `mcp__Vercel__create_git_project {repo: "growmax/growmax-website", teamId, projectName: "growmax-website", deploy: false}` (Git-connected).
   b. If that fails because the Vercel GitHub App lacks repo access: `vercel project add growmax-website --scope growmax1`, then `vercel link --yes --project growmax-website --scope growmax1` in the repo root. Record `facts.vercel.deployMode = "cli"` (otherwise `"git"`) and add blocker `B-GITAPP` (non-blocking, recommended owner action) with the exact install path: GitHub → Settings → Applications → Vercel → Configure → grant `growmax-website`.
3. Converge settings (`mcp__Vercel__update_project` or `vercel project` / REST `PATCH /v9/projects/{id}`):
   - `framework: "nextjs"`, `nodeVersion: "22.x"`, build/install/output commands `null` (auto-detect: runs `npm run build`).
   - `resourceConfig.functionDefaultRegions: ["iad1"]`, `resourceConfig.fluid: true`.
   - `commandForIgnoringBuildStep`: `[ "$VERCEL_ENV" = "production" ] && [ -f docs/migration/PLAN.md ] && exit 1 || exit 0` (exit 1 = build, exit 0 = skip).
     - Only production builds of commits that contain the plan run.
     - Old `main` commits never reach production.
     - The ~50 step commits on the branch don't create preview builds that would fail (empty DB, refresh in progress) or queue ahead of the by-SHA production deploy on a single-build plan.
     - Production deploys are made explicitly (§ P5 workflow), so previews aren't needed.
   - `enableProductionFeedback: false` (no toolbar on production).
   - Keep the default deployment protection (Standard: previews and generated URLs are protected; production custom domains are public).
   - If the team is on Pro: enable skew protection (`vercel project protection enable growmax-website --skew`).
4. Record `facts.vercel.projectId`, `projectName`, `deployMode`, `productionAliases` (from `get_project` → `targets.production.alias` after the first production deploy).

## 3. Neon via Vercel Marketplace (P3.2)

> **Addendum 2026-09-26 (A1 condition C1, binding; supersedes step 1 below).** The owner's project `rapid-recipe-07132564` (store `store_IsJjgV1qX1w7nvrP`, confusingly named `growmax-website`) is in **sin1**, and region can't be changed after creation. In session the owner authorized a new database and had the Neon installation `icfg_tEtDWAPJTdmHAD8eL9GtfV5H` upgraded to **Launch** (`launch_v3`, applied and read back). So P3.2 **provisions a new resource** with step 2's command, amended:
> `npx --yes vercel@latest integration add neon --name growmax-db-iad1 -m region=<the iad1 / us-east-1 value from --help> -e production --no-env-pull --scope growmax1`
> - No `-m version` flag (the Neon metadata schema exposes only region and auth). Neon Auth off. No `--plan` other than confirming the already-applied `launch_v3`: if the CLI shows any purchase or plan-change confirmation, stop with a blocker, and never pick `free`.
> - PG major ≥ 16 is accepted (17 or 18 expected; A1 C2). Record `facts.neon.pgVersion` from the Neon side. P4.1 adds the collation, region and host checks.
> - Never delete, modify, connect or pull env from the sin1 resource. Its ids live in `facts.neon.legacySin1`, and it's on the owner's decommission checklist.
> - Steps 3–6 below apply to `growmax-db-iad1`.

1. **(Superseded by the addendum above.) Adopt the owner's Neon project. Don't provision another.** On 2026-09-26 the owner installed the Neon integration and created Neon project **`rapid-recipe-07132564`** (`STATE.config.neonProjectId`).
   - Find the Marketplace resource backed by that Neon project: `vercel integration list --format json`, or REST `GET /v1/storage/stores?teamId=…` and match the Neon project id in its metadata/`externalResourceId`. Adopt it whatever its name, and record `facts.neon.resourceName`.
   - Record its region and PG major version. If the region isn't AWS us-east-1 / iad1, or the PG major is lower than the source's, **don't recreate it**: log it as a risk for A1 to judge (a lower major version is a blocker only if `pg_restore` fails).
   - Accept whichever Vercel environments the owner connected it to. The ignore guard skips previews anyway.
   - Only if no resource matches that id do you fall through to step 2, and then only after the A1 advisor agrees.
2. **Provision only if step 1 found nothing and A1 agreed** (from the linked repo directory):
   ```bash
   npx --yes vercel@latest integration add neon --help            # read product + metadata keys first
   npx --yes vercel@latest integration add neon --name growmax-db --plan "$NEON_PLAN" \
       -m region=<AWS us-east-1 / Washington D.C. value from --help> -m version=<source PG major> \
       -e production --no-env-pull --scope growmax1
   ```
   - `NEON_PLAN` comes from the kickoff prompt (`launch` recommended). If that plan is refused (no payment method), retry with `free` and add risk note R6 to `LOG.md`. **Never buy credits or add-ons.**
   - PG version: same major as the source (from P1.1 `facts.source.pgMajor`). If that isn't offered, use the lowest offered version ≥ source.
   - If the CLI needs an interactive terms acceptance (integration not installed on the team): add blocker `B-NEON-TERMS` ("Vercel → Marketplace → Neon → Install → accept terms; don't create a database"), continue with P2, re-check at the next check-in.
3. **Connect** (if `integration add` didn't): `vercel integration resource connect <adopted resource name> <project name> -e production --yes --format=json`.
   - **Production only.** Previews are skipped by the ignore guard, and Neon preview branching would only burn compute. If the integration enables per-preview branching by default, turn it off.
4. **Verify env var names** (names only, never values): `vercel env ls production` / `mcp__Vercel__filter_project_envs`. Required: `DATABASE_URL` = **pooled** URL (host contains `-pooler`), and an unpooled URL (`DATABASE_URL_UNPOOLED`, or `POSTGRES_URL_NON_POOLING`). If the integration used different names, add `DATABASE_URL` as type **encrypted** (not sensitive, so it can still be pulled), production only, with the pooled value. Pipe it CLI-to-CLI without echoing.
   - **Prove the target URLs are obtainable.** `vercel env pull --environment=production docs/migration/.scratch/.env.production` must yield a pooled and an unpooled URL; record the **hosts only**.
   - If the integration made them sensitive (unpullable), create `MIGRATION_DST_URL_UNPOOLED` (encrypted, production) from the integration's connection info via `vercel integration` output, or else raise blocker `B-DSTURL` (the owner copies the unpooled connection string into the cloud environment as `NEON_DATABASE_URL_UNPOOLED`).
5. Record `facts.neon`: `resourceName`, `resourceId`, `region`, `pgVersion`, `plan`, `pooledHost`, `unpooledHost` (**host names only**).
6. **Recommended owner setting** (no API): in the Neon console (`vercel integration open neon <adopted resource name>`) turn off scale-to-zero for the production branch compute if the plan allows it. Add it as a non-blocking recommendation in the runbook.

## 4. Environment variables (P3.3)

Set with type **sensitive**, target `production` only, **via stdin** (`printf '%s' "$VAL" | vercel env add NAME production --sensitive --scope growmax1`). Use upsert semantics: if a variable exists, replace it only if the value differs. The CLI can't show sensitive values, so decide by provenance.

| Name | Value source | Notes |
|---|---|---|
| `SESSION_SECRET` | env `SESSION_SECRET` if present and ≥ 32 chars; otherwise `openssl rand -base64 48 \| tr -d '\n'` | Reusing Replit's value keeps admin cookies valid across the cutover; a new value only forces admins to log in again |
| `ADMIN_PASSWORD` | env `ADMIN_PASSWORD` (**required**; missing → blocker `B-ADMINPW`) | Same password as Replit keeps editors' workflow unchanged |
| `GOOGLE_CHAT_WEBHOOK_URL` | Extract from `git show origin/main:app/api/demo-requests/route.ts` (the `webhookUrl` constant) | Needed after M3 moves it out of code. Recommend rotation in the decommission checklist (it's in git history) |
| `DATABASE_URL` (+ unpooled) | Neon integration | Managed by the integration; don't touch unless §3.4 says so |

Never set `NODE_ENV` or `TZ`. **Build-time requirement:** `lib/db.ts` and `lib/session.ts` throw at import, so these must exist for production *before* the first build.

## 5. Protection bypass for automation (P3.4)

- Generate once: `vercel project protection enable growmax-website --protection-bypass --format json`, or REST `PATCH /v1/projects/{id}/protection-bypass {"generate":{}}`, or `mcp__Vercel__update_project_protection_bypass`.
- Store the secret only in `docs/migration/.scratch/bypass-secret` (mode 600). Re-fetch from the project (`protectionBypass`) if the container was recycled. **Never commit it.**
- Harness requests send **only** `x-vercel-protection-bypass: <secret>` on every request. **Don't** send `x-vercel-set-bypass-cookie`: it makes the edge answer with a cookie-setting redirect, which would false-fail every status/redirect comparison.
- Access check: `GET https://<prod-alias>/` with the header → 200. Without it, a protected generated URL → 401/403. Record both.

## 6. Domains and certificates (P6.3; do not do this earlier)

1. `mcp__Vercel__add_project_domain` → `www.growmax.io` (no redirect). Then `growmax.io` with `redirect: "www.growmax.io", redirectStatusCode: 308`. Adding a domain has **no effect on live traffic**; it only shows "Invalid configuration" until DNS changes.
2. If the response says `verified: false`, capture the `verification[]` TXT records for the runbook. The cutover state machine won't attempt cert issuance until the domain is verified (`DOMAIN_VERIFIED`, SPEC-05 §3). Poll with `vercel domains verify` or `mcp__Vercel__get_project_domain`.
   - **CAA:** if `growmax.io` has CAA records, at least one must permit `letsencrypt.org`. Otherwise the runbook tells the owner to add `0 issue "letsencrypt.org"` alongside the existing ones.
3. Get the **live** recommended records (don't hardcode them): `vercel domains inspect www.growmax.io`, or REST `GET /v6/domains/www.growmax.io/config?projectIdOrName=growmax-website` → `recommendedIPv4` for **both** `www` and the apex (A1 C5, 2026-09-26: `www` switches via an A record, because a CNAME can't coexist with the replit-verify TXT at `www`). `recommendedCNAME` is recorded for reference only. Record them in `facts.dns.target`.
4. **Pre-issue TLS (DNS-01):** `vercel certs issue www.growmax.io growmax.io --challenge-only --scope growmax1` → capture the `_acme-challenge` TXT names and values for the runbook (step A). After the owner adds them (detected in P7), run `vercel certs issue www.growmax.io growmax.io --scope growmax1`, then verify: `curl -sI https://www.growmax.io --resolve www.growmax.io:443:<recommended IPv4>` must succeed with a valid cert.

## 7. Vercel Sandbox runner (pg_dump/pg_restore; fallback transport)

**Secrets must never pass through a model tool call** (SPEC-03 §0.2). So the Sandbox is driven **only** by `scripts/migration/db/runner.mjs`, a container Node script using the `@vercel/sandbox` SDK. MCP sandbox tools may be used only for secret-free inspection (listing, logs, stopping).

1. `runner.mjs` authenticates with `VERCEL_TOKEN` + team id + project id (needs `api.vercel.com`). It creates or reuses the named Sandbox `growmax-migration-runner`: project `growmax-website`, region `iad1`, 2 vCPU / 4 GB, network allow-all.
2. Tooling inside: `which pg_dump || sudo dnf install -y postgresql<major>` (major ≥ source major). If that's impossible, use the Node ETL fallback (SPEC-03 §4).
3. It uploads `scripts/migration/` (without `node_modules`), runs `npm ci` there, and executes commands with `env` built from `process.env` (`SRC_URL` ← `REPLIT_DATABASE_URL`, `DST_URL*` ← `.scratch/.env.production`). It streams masked output and downloads the result files into `.scratch/`.
4. If `api.vercel.com` is blocked, the Sandbox path is unavailable. `neon-https` must then carry everything, and a `pg_dump` requirement becomes the Node ETL.
5. At P9.2 stop and delete it. Record `facts.runner = {name, sandboxId}` (no secrets).

## 8. G3 read-back checklist (scout, independent)

- Project exists in team `growmax1`; framework nextjs; node 22.x; region iad1; fluid on; ignore-step command exact; deployMode recorded.
- Neon resource connected to **production only** (no preview branching). `DATABASE_URL` host contains `-pooler`. An unpooled var is present. Region iad1 / us-east-1. PG major recorded.
- `vercel env pull --environment=production` yields pooled and unpooled target URLs (hosts recorded, values never shown).
- `SESSION_SECRET`, `ADMIN_PASSWORD`, `GOOGLE_CHAT_WEBHOOK_URL` exist for production (type sensitive).
- Ignore-step command is exactly the production-only guard in §2.3.
- Protection bypass secret exists (don't print it); access check results recorded.
- **A1 C3 (2026-09-26):** `functionDefaultRegions` equals the Neon resource's region (iad1). nodeVersion is 22.x (the bare project started on 24.x), framework nextjs, fluid on, and skew protection on (team is Pro). P3.1's evidence shows the ignore-step command was read back byte-exact **before** Git was connected. The connected Neon resource is `growmax-db-iad1`, not the sin1 store `store_IsJjgV1qX1w7nvrP`.
- Evidence: `evidence/P3.5-infra-readback.json`.
