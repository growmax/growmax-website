# SPEC-05: Cutover (DNS/TLS choreography and check-in loop)

Steps: P6.3, P6.5, P6.6, P7.1, P8.1. The owner changes DNS; the orchestrator prepares, detects, verifies and reconciles.

## 1. Preconditions for `READY_FOR_DNS` (gate G6)

- G5 and G6a passed on the **current** production deployment (verified SHA recorded in `facts.vercel.verifiedSha`).
- Final full refresh done, sequence gap applied, G6 data checks passed (SPEC-03 §4).
- Domains added to the project. Recommended records and ACME challenges captured.
- `CUTOVER-RUNBOOK.md` filled in with **live** values (no placeholders left: `grep -c '{{' == 0`).
- Advisor A2 verdict is `GO` or `GO_WITH_CONDITIONS` (the conditions are written into the runbook as owner prerequisites, for example "upgrade to Vercel Pro first").

## 2. Owner's DNS steps (the runbook renders these with live values)

| Step | When | Change | Traffic impact |
|---|---|---|---|
| 0 | ≥ 24 h before cutover (ideally at pre-flight) | Lower the TTL of the `www` record, and of the apex records if you'll change them, to **300 s** | none |
| A | Any time after READY | Add the TXT records `_acme-challenge.www` (and `_acme-challenge` for the apex) with the values shown, plus a `_vercel` TXT **only** if the runbook lists one | none |
| B | After the orchestrator says "certificate ready" (or right away, if you accept a possible TLS warning for a few minutes) | `www`: delete `A 34.111.179.208`, then add `CNAME www → <recommendedCNAME>` | cutover |
| C (optional) | With B, or later | Apex: **only if** the P1.4 baseline shows the apex *not* already redirecting cleanly over HTTPS to `https://www.growmax.io`. Replace the four Squarespace `A` records with Vercel's recommended IPv4; Vercel then answers 308 → `www` | apex only |
| Never | n/a | Don't touch MX, SPF/DKIM/DMARC TXT, Google/Microsoft verification TXT, or Replit's verification TXT (needed for rollback until decommission) | n/a |

## 3. Detection state machine (evaluated at every check-in)

Lookups run through DNS-over-HTTPS (`https://dns.google/resolve?name=…&type=…`, `https://cloudflare-dns.com/dns-query` with `accept: application/dns-json`) from the container when reachable, otherwise `dig` in the Sandbox runner. Query both public resolvers **and** the authoritative nameservers recorded in P1.4 (`facts.dns.ns`).

```
WAITING_TXT ──(_acme-challenge TXT matches on authoritative NS)──▶ TXT_PRESENT
TXT_PRESENT ──(vercel certs issue www.growmax.io growmax.io succeeds;
               curl --resolve www.growmax.io:443:<vercel-ip> shows a valid cert, from the Sandbox)──▶ CERT_READY  [notify owner: "switch www now"]
{WAITING_TXT, TXT_PRESENT, CERT_READY} ──(authoritative www answer → Vercel target)──▶ SWITCHED  [set facts.cutover.detectedAt; status POST_CUTOVER]
SWITCHED ──(public resolvers mixed)──▶ PROPAGATING
PROPAGATING ──(both public resolvers → Vercel on 2 consecutive check-ins)──▶ PROPAGATED
```

- If `SWITCHED` is reached without `CERT_READY`, Vercel issues the certificate through HTTP-01. Check TLS at every check-in and switch to 15-minute check-ins until the cert is valid. If it's still invalid after 60 min, it's a SEV2 incident (notify the owner and consider rolling DNS back per SPEC-07).
- Record every transition with `state.mjs set facts.cutover.state "\"…\""` and a `LOG.md` line.

## 4. Check-in routine (P7.1 and P8)

Each wake:

1. Run the ORCHESTRATOR §1 resume. Don't re-read specs unless the routine needs them.
2. Advance the DNS/TLS state machine (§3).
3. `sync.mjs delta` → `verify --below-gap` (WF `mig-sync-delta`). If `blogChanged`, redeploy production with the same SHA and quick-check the DB-driven URLs.
4. Health, with the scout and the bypass header before cutover:
   - `/`, `/blog`, one post, `/sitemap.xml`, `/api/blog` → 200.
   - Runtime errors since the last check → 0 unexplained.
5. Once cutover is detected: on the first check-in after `SWITCHED`, run P8.1 and P8.2 (full suite against the real domain). Run the smoke subset of it daily after that.
6. Commit **only if something changed**: rows synced, a state transition, an incident, or a gate. Otherwise update nothing in git (no commit spam).
7. Re-arm `send_later`:
   - 60 min normally
   - 15 min for the first 2 h after `SWITCHED`, or while TLS is invalid
   - every 6 h after 14 days in `AWAITING_DNS`
   - stop, after a final notification, after 30 days in `AWAITING_DNS` (resumable)

## 5. Notifications (PushNotification plus a session message)

| Event | Message essentials |
|---|---|
| READY_FOR_DNS | "Vercel is verified and ready. Open docs/migration/CUTOVER-RUNBOOK.md. Step A first (TXT records), then wait for the 'certificate ready' notice." Include any A2 conditions (e.g. upgrade to Pro). |
| CERT_READY | "TLS certificate for www.growmax.io is live on Vercel. Do step B now: CNAME www → `<value>`." |
| SWITCHED | "DNS switch detected at `<time>`. Post-cutover verification running." |
| SEV1/SEV2 incident | What broke, current impact, and the rollback instruction (SPEC-07 R2) if it's warranted |
| G8 passed | "72 h reconciliation complete, zero data loss, site healthy. Remaining owner tasks: …" |
| COMPLETE | Link to FINAL-REPORT.md and the decommission checklist |

## 6. After cutover: PR and deployments

- Update the PR description: cutover done, evidence links, and a request that `@growmax/guardians` merge.
- Before the merge, production deploys only through the API (by SHA).
- After the merge, pushes to `main` deploy automatically. The ignore guard passes because `docs/migration/PLAN.md` is on `main`.
- Tell the owner that from now on, site changes go through GitHub → Vercel. Republishing from Replit no longer changes the live site.
