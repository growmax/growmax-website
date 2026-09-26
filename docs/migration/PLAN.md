# Growmax website: Replit → Vercel + Neon migration plan

> **Live state is in [`STATE.json`](./STATE.json).** This document is the plan and doesn't change during the run.
> Operating rules for the autonomous orchestrator are in [`ORCHESTRATOR.md`](./ORCHESTRATOR.md).
> Plan authored 2026-09-26 on branch `claude/wonderful-edison-823y83`.

---

## 1. Objective and definition of done

Move `www.growmax.io` from its Replit autoscale deployment and Replit Postgres to a Vercel project (team `growmax1`) backed by Neon Postgres provisioned **through the Vercel Marketplace**. The move must not lose any data, must not change behavior visible to users or search engines, and must not cause downtime.

The migration is **done** when every gate in [`VERIFICATION.md`](./VERIFICATION.md) (G0–G9) is `passed` with committed evidence, and specifically:

1. `https://www.growmax.io` is served by Vercel, with valid TLS for `www.growmax.io` and `growmax.io`.
2. Every URL in the pre-migration baseline returns the same status code, redirect target, canonical, title, meta description, robots directives, JSON-LD and normalized visible text as it did on Replit. The only exceptions are differences listed in the allowlist and approved by the advisor.
3. Every row that existed in the Replit production DB at cutover exists byte-for-byte in Neon (per-table fingerprints match), and every row written to Replit during DNS propagation has been reconciled into Neon.
4. Forms (demo request, including the Google Chat notification; newsletter) and the admin CMS (login, create, edit, delete) work on Vercel.
5. At least 72 h of post-cutover monitoring show no availability regression.
6. The owner has a decommission checklist and a tested rollback path. Replit stays intact until the owner decommissions it.

## 2. Scope

**In scope:** Vercel project and settings, Neon provisioning through Vercel, schema and data migration, the code changes Vercel needs (minimal set), availability hardening (gated), parity verification, zero-downtime cutover choreography, post-cutover reconciliation and monitoring, rollback procedures, documentation.

**Out of scope, and never done autonomously:**
- DNS changes. The owner makes them using the generated runbook.
- Purchases or plan upgrades. The owner does these; they're pre-flight decisions.
- Merging PRs to `main`. CODEOWNERS requires `@growmax/guardians`.
- Any write to the Replit DB. The only exception is the owner-invoked rollback procedure in SPEC-07.
- Deleting or changing anything on Replit.
- Redesigns, dependency upgrades, or refactors not listed in SPEC-02.
- Rotating third-party secrets. The owner does this; it's recommended in the decommission checklist.

## 3. Current state (discovered 2026-09-26)

| Area | Fact | Source |
|---|---|---|
| App | Next.js ^15.5.18 App Router, React 19, Tailwind v4, Drizzle ORM (`pg` Pool) + `@neondatabase/serverless` HTTP driver in `middleware.ts` | `package.json`, `lib/db.ts`, `middleware.ts` |
| Runtime on Replit | `next start -p 5000`, autoscale deployment, `nodejs-20` module, `postgresql-16` module | `.replit` |
| DB tables | `demo_requests`, `newsletter_subscriptions`, `blog_posts` (154+ rows, JSONB `sections`), `blog_redirects`. Unknown extra tables are possible (e.g. a legacy `session` table from `connect-pg-simple`) | `shared/schema.ts`, `package.json` |
| Env vars used | `DATABASE_URL`, `SESSION_SECRET` (≥32 chars, **import-time throw**), `ADMIN_PASSWORD`, `NODE_ENV` | grep |
| Secret in code | Google Chat webhook URL (key + token) hardcoded in `app/api/demo-requests/route.ts`; also in git history | grep |
| Build needs DB | `/blog` (ISR 3600) and `/sitemap.xml`, `/llms*.txt` query the DB at build. `lib/db.ts` and `lib/session.ts` throw at import if env vars are missing, so **env vars must exist at build time** | code |
| Serverless hazard | Demo-request webhook is fire-and-forget (`fetch()` not awaited). On Vercel it can be dropped when the function suspends, so it needs `after()` | code |
| Load hazard | Every blog post view fetches the full uncached `/api/blog` (all posts with full content) client-side. That's a function invocation, a DB query and roughly MBs per view | `BlogPostClient.tsx` |
| Redirects | ~66 `next.config.ts` redirects (GSC list first; `/arc` and `/arc/ai/connect` are duplicated with different targets, **first match wins, keep as-is**), plus DB-driven 301s in `middleware.ts` (`blog_redirects`) | code |
| DNS | `www.growmax.io` A → `34.111.179.208` (Replit). Apex `growmax.io` → `198.49.23.144/145`, `198.185.159.144/145` (Squarespace; probably forwarding/DNS host). NS/MX/TXT still to capture in P1.4 | `getent` |
| Vercel | User `admin@growmax.io`, **Hobby plan**, only scope is team `growmax1` (`team_r7yanNuXwyp3P3jzhnxkDNaD`). No projects, no domains | Vercel MCP |
| Vercel connector | **403 on every `growmax1`-scoped call**: the token isn't authorized for the team | Vercel MCP |
| Cloud network | Trusted level: package registries, GitHub and `*.googleapis.com` only. **Blocked:** `growmax.io`, `api.vercel.com`, `vercel.com`, `*.neon.tech`, `replit.com`, raw TCP 5432 | curl probes |
| Credentials | No `REPLIT_DATABASE_URL`, `VERCEL_TOKEN`, `ADMIN_PASSWORD` or `SESSION_SECRET` in the environment | env names |
| Git | Repo `growmax/growmax-website`; CODEOWNERS `* @growmax/guardians`; no CI workflows; Replit syncs its workspace to `main` | `.github/` |
| Tooling | Node 22.22.2, npm 10.9.7, psql/pg_dump 16.13, Python 3.11, Playwright + Chromium at `/opt/pw-browsers` | local |

## 4. Target state

```
Visitors ──DNS (owner switches www CNAME; apex optional)──▶ Vercel Edge (team growmax1, project growmax-website)
                                                            │  Next.js 15 on Node 22.x, Fluid compute, functions in iad1
                                                            │  middleware (edge) ── Neon HTTP driver ──┐
                                                            └─ route handlers / RSC ── pg Pool ────────┤  pooled DATABASE_URL
                                                                                                        ▼
                                                            Neon Postgres via Vercel Marketplace (resource "growmax-db",
                                                            AWS us-east-1 / iad1, same PG major version as source)
Replit deployment + Replit DB: untouched, kept as hot rollback until the owner decommissions it (≥ 7 days after G8).
```

## 5. Pre-flight blockers (owner actions before the orchestrator starts)

These are the reason the run would stop immediately if skipped. Details and exact steps are in [`PREFLIGHT.md`](./PREFLIGHT.md).

1. **Reconnect the Vercel connector with access to team `growmax1`.** Today every team call returns 403.
2. **Cloud environment network access → Full** (or a custom allowlist). Raw TCP 5432 is not assumed; DB work runs in a Vercel Sandbox by default.
3. **Environment variables:** `REPLIT_DATABASE_URL` (the *production* DB of the live deployment), `VERCEL_TOKEN` (scoped to `growmax1`), `ADMIN_PASSWORD`, optionally `SESSION_SECRET`.
4. **Decisions:** upgrade Vercel to **Pro** (Hobby is non-commercial only and pauses on limits). Choose the Neon plan (`launch` recommended; `free` can exhaust compute quota, which would take the DB down).
5. Recommended: Vercel GitHub App access to the repo, the Neon integration installed on the team, and the `www` TTL lowered to 300 s.

## 6. Strategy

1. **Parity first, then hardening.** Deploy the minimal-change build, prove parity (G5), then apply availability hardening as a separate change and prove parity again (G6a). Every change is isolated and verified on its own.
2. **Replit is never touched.** It keeps serving until the owner flips DNS and remains the rollback target. The source DB is opened **read-only** (`BEGIN READ ONLY` / `default_transaction_read_only=on`) in every automated session.
3. **Zero-downtime cutover:**
   - Both origins serve identical content during DNS propagation.
   - The TLS certificate for `www.growmax.io` is **pre-issued on Vercel via DNS-01** (`vercel certs issue … --challenge-only`) before the CNAME moves, so there's no TLS gap.
   - TTL is lowered in advance, so rollback is a DNS revert that takes effect within minutes.
4. **No lost writes (sequence-gap technique).**
   - At the final pre-cutover refresh, every Neon `serial` sequence is moved to `GAP_START = 1,000,000`, or ≥ 10× the source max id if that's larger.
   - Writes that still land on Replit during propagation get ids `< GAP_START`. Writes on Vercel get ids `≥ GAP_START`, so they can never collide.
   - An idempotent, additive **delta sync** copies Replit stragglers into Neon with their original ids. It runs at every check-in until 72 h have passed **and** Replit has seen 24 h with no new rows.
   - The same property makes a **reverse sync** collision-free if a rollback is ever needed.
5. **Independent verification.** The agent that does a step never certifies it. A separate verifier agent re-derives the evidence, and the orchestrator checks it against gate criteria. Evidence files are committed; PII never is.
6. **Resumable by construction.** All progress lives in git (`STATE.json`, `LOG.md`, `evidence/`) and is pushed after every step. A fresh session, or the same session after compaction, resumes from `node scripts/migration/state.mjs resume`.

## 7. Phase and step catalog

The executor column uses the roles defined in [`ORCHESTRATOR.md` §4](./ORCHESTRATOR.md#4-model-and-effort-routing). `WF` means a saved workflow in `.claude/workflows/`.

| Step | What | Executor (model / effort) | Gate |
|---|---|---|---|
| **P0 Pre-flight** | | | |
| P0.1 | Bootstrap: check out branch, read manual, `state.mjs resume`, set `IN_PROGRESS` | Orchestrator | n/a |
| P0.2 | Pre-flight checks: connector scope, secrets present, network matrix, tooling, source-DB identity (is it really production?) | WF `mig-p0-preflight` (scout haiku/low ×4, verifier sonnet/medium ×2) | **G0** |
| **P1 Discovery and baseline** | | | |
| P1.1 | Source DB inventory and per-table fingerprints (read-only) | WF `mig-p1-discovery` → db-operator (sonnet/high) | G1 |
| P1.2 | Build the parity harness (SPEC-04), self-test including a known-bad fixture, adversarial review | implementer (sonnet/high) → reviewer (opus/high) | G1 |
| P1.3 | Capture the live-site baseline (all sitemap URLs, redirects, special routes, negatives) | scout (haiku/low) runs harness | G1 |
| P1.4 | DNS, TLS and domain baseline (NS, A, CNAME, MX, TXT, CAA; apex behavior; cert issuer) | scout (haiku/low) | G1 |
| P1.5 | Code compatibility audit (confirm SPEC-02 list, find anything missed) | verifier (sonnet/medium) | G1 |
| P1.6 | **Advisor review A1**: facts vs plan, adjustments | WF `mig-advisor` (fable/max) | **G1** |
| **P2 Code readiness (minimal)**, can run in parallel with P3 | | | |
| P2.1 | Implement M1–M5 (SPEC-02) | WF `mig-p2-code` → implementer (sonnet/high) | G2 |
| P2.2 | Local verification: `npm ci`, `tsc`, `next build` + `next start` against a local PG16 seeded from source (blog tables only), smoke | verifier (sonnet/medium) | G2 |
| P2.3 | Adversarial review and fix loop (max 2 rounds) | reviewer (opus/high) | G2 |
| P2.4 | Commit and push (orchestrator) | Orchestrator | **G2** |
| **P3 Infrastructure** | | | |
| P3.1 | Create or reuse Vercel project `growmax-website` (Git-connected if possible), settings, ignored-build-step guard | WF `mig-p3-infra` → implementer (sonnet/high) | G3 |
| P3.2 | Neon via Vercel Marketplace: adopt `growmax-db` or provision it (iad1, same PG major as source), connect to production only | implementer | G3 |
| P3.3 | Env vars (sensitive, via CLI stdin): `SESSION_SECRET`, `ADMIN_PASSWORD`, `GOOGLE_CHAT_WEBHOOK_URL` | implementer | G3 |
| P3.4 | Protection bypass for automation; access check | implementer | G3 |
| P3.5 | Independent read-back of all config | scout (haiku/low) | **G3** |
| **P4 Data migration** | | | |
| P4.1 | Target pre-checks (empty, version, extensions) | WF `mig-p4-data` → db-operator (opus/high) | G4 |
| P4.2 | Full copy: `pg_dump` (read-only) → `pg_restore` into the unpooled URL; `ANALYZE` | db-operator (opus/high) in Sandbox runner | G4 |
| P4.3 | Independent verification: counts, fingerprints, schema diff, sequences | verifier (sonnet/medium) | **G4** |
| **P5 Deploy and verify (minimal build)** | | | |
| P5.1 | Production deployment (`*.vercel.app`) from the branch SHA | WF `mig-p5-deploy-verify` → scout (haiku/low) | G5 |
| P5.2 | Verification suite: parity vs live Replit, functional (one labeled demo request), visual, logs, performance | child WF `mig-verify-suite` (sonnet/medium ×3, haiku/low ×1, synthesis sonnet/medium) | G5 |
| P5.3 | Triage and fix loop (escalation ladder) | implementer / reviewer / advisor | **G5** |
| P5.4 | Open PR to `main` (ready for review; never merge) with evidence summary | Orchestrator | n/a |
| **P6 Hardening and cutover readiness** | | | |
| P6.1 | Implement H1–H4 (SPEC-02) + local verification + review | WF `mig-p6a-harden` (sonnet/high → sonnet/medium → opus/high) | G6a |
| P6.2 | Commit, deploy, rerun verification suite (regression; no demo request) | WF `mig-p5-deploy-verify` | **G6a** |
| P6.3 | Add domains `www.growmax.io` (primary) and `growmax.io` (308 → www); collect recommended DNS records and ACME DNS-01 challenges | WF `mig-p6b-ready` → implementer (sonnet/high) | G6 |
| P6.4 | Final full refresh of Neon from Replit, sequence gap, verification | db-operator (opus/high) + verifier (sonnet/medium) | G6 |
| P6.5 | Re-capture the live-Replit baseline (`P6.5-baseline-manifest.json`, used by P8.2), generate the filled-in `CUTOVER-RUNBOOK.md`; **advisor go/no-go A2** | implementer (sonnet/medium) → WF `mig-advisor` (fable/max) | **G6** |
| P6.6 | Notify the owner (push notification + session message); status `AWAITING_DNS` | Orchestrator | n/a |
| **P7 Await DNS (check-in loop, hourly via `send_later`)** | | | |
| P7.1 | Hourly cheap probe (haiku/low): domain verified? ACME TXT → issue cert → verify → notify; `www` switch → P8. Delta sync every 6 h (sonnet/medium) | Orchestrator + WF `mig-sync-delta` (`mode` probe/full) | n/a |
| **P8 Post-cutover** | | | |
| P8.1 | DNS and TLS verification on the real domain (www, apex, http→https) | WF `mig-p8-postcutover` → scout (haiku/low) | G8a |
| P8.2 | Full verification suite on `https://www.growmax.io` vs baseline, and vs Replit pinned by IP | child WF `mig-verify-suite` | **G8a** |
| P8.3 | Reconciliation: delta hourly for 24 h, then every 3 h, for ≥ 72 h and until Replit shows 24 h with no new rows (hard stop at 7 days with an owner decision); reconciliation audit | WF `mig-sync-delta` | **G8b** |
| P8.4 | Monitoring hand-off (uptime workflow added to the PR, final check-in schedule) | implementer (sonnet/medium) | G8b |
| **P9 Close-out** | | | |
| P9.1 | Final report + **advisor sign-off A4** | Orchestrator + WF `mig-advisor` (fable/max) | **G9** |
| P9.2 | Clean up (cancel triggers, delete sandboxes, status `COMPLETE`), decommission checklist for the owner | Orchestrator | G9 |

Advisor **A3** is not a step. It's the escalation path any failing gate takes after the ladder (ORCHESTRATOR §6).

**Dependencies:** P1 → {P2 ∥ P3} → P4 (needs P3) → P5 (needs P2, P4) → P6 → P7 → P8 → P9.

## 8. Risk register

| ID | Risk | L | I | Mitigation |
|---|---|---|---|---|
| R1 | The provided `REPLIT_DATABASE_URL` is the **dev** DB, not the one production uses | M | H | P0.2 identity check: published slugs and `updated_at` must match live `/api/blog` exactly, otherwise G0 fails |
| R2 | Source DB not reachable from outside Replit (non-Neon/internal host) | L–M | H | Fallback F-EXPORT in SPEC-03: owner uploads a `pg_dump` to Google Drive; content freeze + second dump at cutover |
| R3 | Raw TCP blocked in the cloud container | H | M | Neon HTTPS/WebSocket transport from the container for everything but `pg_dump`/`pg_restore`, which run in a Vercel Sandbox driven by the SDK (D9) |
| R4 | Webhook dropped on serverless (fire-and-forget) | H | H | M3: `after()` from `next/server` + delivery log line; verified by the one labeled test in P5.2 |
| R5 | Hobby plan: non-commercial ToS, pauses when limits are exceeded | H (if not upgraded) | H | Pre-flight decision. A2 makes "upgrade to Pro" a hard condition before the DNS switch |
| R6 | Neon Free compute quota exhausted → DB suspended | M | H | Neon `launch` plan; H1/H4 caching cuts DB hits; usage check at every check-in |
| R7 | TLS gap at cutover | M | M | DNS-01 pre-issuance (P6.3/P7); fallback: Vercel HTTP-01 auto-issue within minutes |
| R8 | Split-brain writes during propagation | H | M | Sequence gap + additive delta sync + Google Chat notifications fire from both stacks |
| R9 | Team keeps editing on Replit (pushes to `main`) during migration | M | M | Merge `origin/main` into the branch before P6.4 and rerun verification; ignored-build-step guard stops old `main` commits from reaching Vercel production; content freeze advised |
| R10 | Parity false-pass (buggy harness) | M | H | Harness self-test with a known-bad fixture + adversarial review (P1.2) |
| R11 | Server timezone differences change rendered dates | L | L | Harness flags date-only text diffs; the advisor decides (both runtimes are expected to be UTC) |
| R12 | Orchestrator context overrun / compaction | H | M | State in git, SessionStart `compact` hook, CLAUDE.md re-injection, workflows keep orchestrator context small |
| R13 | Secrets or PII leaked into git or logs | L | H | `state.mjs scan` before every commit; evidence holds counts and hashes only; dumps live only in `.scratch/` (gitignored) or the Sandbox |
| R14 | Seed scripts accidentally run against Neon | L | H | Forbidden by CLAUDE.md and ORCHESTRATOR; data only comes from the source copy |
| R15 | Owner never flips DNS / session idles out | M | L | Check-ins re-armed every hour; resumable from git in a fresh session |

## 9. Decisions (ADR-lite)

- **D1 Neon through Vercel Marketplace** (owner requirement). Resource `growmax-db`, region iad1 / `aws-us-east-1`, same PG major version as the source if offered.
- **D2 Keep `pg` + Drizzle** (no driver swap). Add `attachDatabasePool` (Fluid compute) and use the pooled URL at runtime and the unpooled URL for migrations.
- **D3 Production deploys by SHA through the API** until the PR merges. An ignored-build-step guard skips any commit that lacks `docs/migration/PLAN.md`, so old `main` commits can't reach production.
- **D4 `pg_dump`/`pg_restore` of the whole `public` schema** (not just the Drizzle tables), `--no-owner --no-privileges`, for maximum fidelity.
- **D5 Sequence gap** `GAP_START = max(1_000_000, 10 × max source id)` for collision-free forward and reverse sync.
- **D6 Minimal changes (M) before hardening (H)**, each verified separately.
- **D7 Keep Replit-compatible code** (port-5000 scripts remain) so a rollback never needs a code change.
- **D8 Explicit model and effort on every agent call.** Workflow agents otherwise inherit the orchestrator's Opus / max.
- **D9 Secrets never pass through a model tool call.** DB work uses the Neon HTTPS/WebSocket driver from the container (both DBs are Neon-hosted), and `pg_dump`/`pg_restore` run in a Vercel Sandbox driven by the `@vercel/sandbox` SDK from a container script. Values flow only through environment variables.
- **D10 Delta sync uses a persisted per-table watermark** (`_migration.sync_state` in Neon) plus a late-commit window, and reconciles by natural key. It never resurrects rows deleted on the target.
- **D11 Previews are disabled** by the production-only ignore guard, and Neon is connected to production only. All verification targets the explicit production deployment.

## 10. Expected timeline

P0–P6: one continuous run (a few hours of wall-clock, dominated by builds and verification). P7: however long the owner takes to change DNS. P8: ≥ 72 h of hourly check-ins (cheap). P9: under 1 h.

## 11. Document map

| File | Purpose |
|---|---|
| [`ORCHESTRATOR.md`](./ORCHESTRATOR.md) | Operating manual: resume procedure, loop, routing, escalation, authorizations |
| [`PREFLIGHT.md`](./PREFLIGHT.md) | Owner checklist before starting |
| [`VERIFICATION.md`](./VERIFICATION.md) | Gates G0–G9: criteria, evidence, verifier |
| [`specs/SPEC-01-infrastructure.md`](./specs/SPEC-01-infrastructure.md) | Vercel project, Neon, env vars, protection, domains |
| [`specs/SPEC-02-code-changes.md`](./specs/SPEC-02-code-changes.md) | M1–M5 minimal changes, H1–H4 hardening |
| [`specs/SPEC-03-data-migration.md`](./specs/SPEC-03-data-migration.md) | Inventory, copy, fingerprints, sequence gap, delta and reverse sync |
| [`specs/SPEC-04-verification.md`](./specs/SPEC-04-verification.md) | Parity harness, functional, visual, perf, logs |
| [`specs/SPEC-05-cutover-dns.md`](./specs/SPEC-05-cutover-dns.md) | DNS/TLS choreography, check-in loop |
| [`specs/SPEC-06-availability-monitoring.md`](./specs/SPEC-06-availability-monitoring.md) | Availability design, monitoring, incidents |
| [`specs/SPEC-07-rollback.md`](./specs/SPEC-07-rollback.md) | Rollback per phase |
| [`CUTOVER-RUNBOOK.md`](./CUTOVER-RUNBOOK.md) | Owner's DNS runbook (template, filled in at P6.5) |
| [`KICKOFF-PROMPT.md`](./KICKOFF-PROMPT.md) | The single prompt that starts the orchestrator |
| [`STATE.json`](./STATE.json) / [`LOG.md`](./LOG.md) / [`evidence/`](./evidence/) | Live state, journal, proof |
