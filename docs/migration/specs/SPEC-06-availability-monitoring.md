# SPEC-06: Availability design, monitoring, incident response

## 1. What "100% availability" means here

1. **During the migration:** zero user-visible downtime.
   - Replit keeps serving until DNS moves.
   - Both origins serve identical content while DNS propagates.
   - TLS is pre-issued.
   - Rollback is a DNS revert with TTL 300 s.
2. **After the migration:** availability at least as good as Replit, with graceful degradation. Marketing pages must survive a database outage, and no failure mode may cache wrong content (404s, generic titles) for search engines.

## 2. Design elements

| Element | Setting | Why |
|---|---|---|
| Vercel plan | **Pro** (owner pre-flight) | Hobby is non-commercial only, pauses projects when limits are exceeded, and allows cron at most daily |
| Function region | `iad1`, co-located with Neon `aws-us-east-1` | One-digit-millisecond DB round trips |
| Compute | Fluid compute + `attachDatabasePool` (M2) | Connection hygiene across suspensions |
| DB connections | Pooled `DATABASE_URL` at runtime; unpooled only for migrations | PgBouncer absorbs concurrency spikes |
| Neon plan | `launch` (recommended) | Free-tier compute quota exhaustion would **suspend the DB**. Scale-to-zero off for production if the plan allows (owner, optional) |
| Static pages | ~40 marketing pages are SSG, served from the edge | Unaffected by function or DB outages |
| Blog | `/blog` ISR (existing) + `/blog/[slug]` ISR (H1) + `/api/blog` ISR 300 s (H4) | Serves the last good copy during DB incidents; big cut in DB load and cost |
| Middleware | Redirect lookup capped at 5 s, fail-open (H3); page-level redirect fallback (H1) | A slow DB never blocks blog pages, and a redirected URL is never cached as a 404 |
| Pool connect timeout | 10 s (H3) | No hung functions |
| Webhook | `after()` (M3) | Notifications survive instance suspension |
| Deploy safety | Production = verified SHA only; ignore-step guard; skew protection (Pro); instant rollback | No unverified code reaches production |

### Failure-mode table

| Failure | Marketing pages | Blog (cached) | Blog (uncached) | Forms | Admin |
|---|---|---|---|---|---|
| Neon down | ✅ | ✅ stale | ❌ 500 (never a cached 404) | ❌ 500, user can retry | ❌ |
| Neon slow | ✅ | ✅ | ⚠ slow | ⚠ slow | ⚠ |
| Function region incident | ✅ (edge) | ✅ (edge cache) | ❌ | ❌ | ❌ |
| Bad deploy | Instant rollback (`mcp__Vercel__request_rollback`) | | | | |
| DNS/TLS | Pre-issued cert; DNS revert in minutes | | | | |

## 3. Monitoring

**During P7–P8 (orchestrator check-ins, hourly):**
- Health checks on the key URLs.
- Vercel runtime errors since the last check (`get_runtime_errors`).
- Delta sync results.
- DNS/TLS state.
- Anything abnormal → incident (§4).

**After hand-off (P8.4 adds this to the PR; it runs once merged to `main`, because scheduled workflows run only on the default branch):**
`.github/workflows/uptime.yml`:
- `schedule: "*/15 * * * *"` + `workflow_dispatch`.
- A single job that `curl`s these URLs with `--fail --max-time 20` and one retry, asserting on status and a content marker (for example `<title>` contains `Growmax`, sitemap contains `<urlset`):
  - `https://www.growmax.io/`
  - `/blog`
  - `/demo`
  - `/sitemap.xml`
  - `/robots.txt`
  - `/api/blog`
  - one blog post
- On failure the job fails, and GitHub notifies the workflow's owner. If the repo secret `ALERT_WEBHOOK_URL` exists (the owner decides; it can be a Google Chat webhook), it also posts a short alert. No secrets are committed.

**Recommended owner settings (listed in FINAL-REPORT):**
- Vercel spend management / usage alerts.
- Neon usage alerts.
- Optionally a log drain (Pro) and the Vercel Firewall bot-protection managed ruleset.

## 4. Incident response (orchestrator, while active)

| Sev | Definition | Orchestrator action |
|---|---|---|
| SEV1 | Site down, widespread 5xx, forms failing, or TLS invalid for > 15 min after cutover | 1. If the cause is the latest deploy: `request_rollback` to the previous verified production deployment. 2. Notify the owner immediately with the diagnosis and, if the cause isn't deploy-related, the **DNS rollback instruction** (SPEC-07 R2). 3. Advisor A3. 4. Check-ins every 15 min. |
| SEV2 | Partial degradation (a route broken, elevated errors, perf > 2× baseline) | Escalation ladder, fix forward via the branch (verified before deploy), notify the owner with the ETA and plan |
| SEV3 | Cosmetic or non-user-facing | Log, fix in a normal step, mention it in the final report |

The orchestrator **cannot** change DNS. For anything that needs a DNS revert, it gives the owner the exact record to restore and why.
