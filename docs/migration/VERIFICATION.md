# Verification gates G0–G9

The live pass/fail status of each gate is in `STATE.json → gates`. A gate is `passed` only when **every** check below passes, verified by an agent **other than** the one that did the work, with evidence committed under `docs/migration/evidence/`. When the inputs of a passed gate change (code, config, data, deployment), mark it `pending` and re-verify.

Evidence file shape (all gates):
```json
{"step":"P4.3","gate":"G4","status":"pass|fail","checkedAt":"<ISO>","verifier":"<role/model>",
 "checks":[{"name":"…","expected":"…","actual":"…","pass":true}],
 "artifacts":{"…":"…"},"notes":"…"}
```
No PII, secrets or connection strings, ever.

---

## G0: Pre-flight (P0.2)
| # | Check | Verifier | Evidence |
|---|---|---|---|
| 0.1 | Vercel MCP can read team `growmax1` (`list_projects` → 200) | scout | `P0.2-vercel.json` |
| 0.2 | `VERCEL_TOKEN` is valid for `growmax1` (`vercel whoami` + `vercel teams ls` show the team) **or** the MCP-only path is recorded along with its limits | scout | `P0.2-vercel.json` |
| 0.3 | `REPLIT_DATABASE_URL` is present and parses; reachable via the chosen DB path; `server_version` recorded | verifier | `P0.2-source.json` |
| 0.4 | **Source identity:** published slugs and `updated_at` equal live `/api/blog` (SPEC-03 §2). May be `deferred` only if no transport reaches the source from the container; P4.1 must then run it before any copy | verifier | `P0.2-source.json` |
| 0.5 | `ADMIN_PASSWORD` present (length only is recorded) | scout | `P0.2-secrets.json` |
| 0.6 | Network matrix: every required capability has a working path (web, DB, Vercel API) → `facts.paths` | scout | `P0.2-network.json` |
| 0.7 | Tooling: Node 22, `npm ci` OK, `pg_dump` ≥ source major available in the chosen DB runner, Playwright Chromium launches (or visual marked not-runnable) | scout | `P0.2-tooling.json` |
| 0.8 | Plan facts recorded: Vercel plan (Hobby/Pro), Neon plan target. Hobby is **flagged, not blocking** | scout | `P0.2-vercel.json` |

## G1: Discovery and baseline (P1.1–P1.6)
| # | Check | Verifier | Evidence |
|---|---|---|---|
| 1.1 | Source inventory + fingerprints committed; non-Drizzle tables listed; `GAP_START` computed and recorded | verifier | `P1.1-source-inventory.json`, `P1.1-source-fingerprint.json` |
| 1.2 | Harness self-test: every mutation detected, the order-insensitive case not flagged, determinism OK | reviewer | `P1.2-harness-selftest.json` |
| 1.3 | Reviewer approves the harness (no blocking finding) | reviewer | `P1.2-harness-review.json` |
| 1.4 | Baseline captured: ≥ 250 URLs (or the shortfall explained), 0 URLs with exhausted network retries | verifier | `P1.3-url-inventory.json`, `P1.3-baseline-summary.json` |
| 1.5 | DNS baseline: NS, `www`/apex records, MX, TXT, CAA; apex HTTP(S) behavior; current cert issuer/expiry | scout | `P1.4-dns-baseline.json` |
| 1.6 | Code audit confirms the SPEC-02 list; any addition is approved by A1 | verifier | `P1.5-code-audit.json` |
| 1.7 | Advisor **A1** = `GO` or `GO_WITH_CONDITIONS` (conditions tracked as blockers/tasks) | advisor | `A1-advisor.json` |

## G2: Minimal code changes (P2.1–P2.4)
| # | Check | Verifier | Evidence |
|---|---|---|---|
| 2.1 | Diff limited to SPEC-02 M1–M4; webhook text byte-identical; no `chat.googleapis.com` left in app code | reviewer | `P2.3-review.json` |
| 2.2 | `npm ci`, `npm run check`, `npm run build` pass (local PG16) | verifier | `P2.2-local-verify.json` |
| 2.3 | Local smoke: every indexable route 200; 5 posts 200; negatives 404; every config redirect matches; sitemap/robots/llms/API OK; admin login OK / wrong password 401 | verifier | `P2.2-local-verify.json` |
| 2.4 | M3 mock-webhook test: exactly one POST with the exact text; unset variable → warning + 201 | verifier | `P2.2-local-verify.json` |
| 2.5 | Secret scan clean; commit pushed; SHA recorded in `facts.git.mSha` | orchestrator | `LOG.md` |

## G3: Infrastructure (P3.1–P3.5)
All the items in SPEC-01 §8, re-read independently by the scout → `P3.5-infra-readback.json`.

## G4: Data migration (P4.1–P4.3)
| # | Check | Verifier | Evidence |
|---|---|---|---|
| 4.0 | Source identity passed (at P0.2, or at P4.1 if it was deferred) | verifier | `P0.2-source.json` / `P4.1-prechecks.json` |
| 4.1 | Identical table sets in `public` | verifier | `P4.3-verify.json` |
| 4.2 | For every table, `srcCount == dstCount` and `srcMd5 == dstMd5` (fresh run by the verifier) | verifier | `P4.3-verify.json` |
| 4.3 | `schema-diff` empty (ignoring owner/ACL/comments; tool rules in SPEC-03 §1; run with `--accept-pg-major 18` per A1 C2) | verifier | `P4.3-schema-diff.json` |
| 4.4 | Every sequence's next value > the table's max id; extensions match | verifier | `P4.3-verify.json` |
| 4.5 | The source was accessed read-only (the script log shows `default_transaction_read_only=on`) | verifier | `P4.2-copy.json` |

## G5: Minimal build verified on Vercel (P5.1–P5.3)
| # | Check | Verifier | Evidence |
|---|---|---|---|
| 5.1 | Production deployment `READY` for `facts.git.mSha`; build log has no errors | scout | `P5.1-deploy.json` |
| 5.2 | Parity vs live Replit: `failedUnallowed == 0` across 100% of the inventory; the allowlist contains only advisor-approved entries | verifier | `P5.2-parity.json` |
| 5.3 | Functional F1, F3–F11 pass; F2 (demo request; ≤ 3 in total over the migration) passes with `[webhook] delivered 2xx` in the logs; test rows deleted | verifier | `P5.2-functional.json` |
| 5.4 | Visual pass or `not_run` with a reason; no new console errors | verifier | `P5.2-visual.json` |
| 5.5 | Runtime logs read **after** the functional tests over a recorded window that actually contains the test traffic: 0 unexplained errors. Perf report attached (flags reviewed by the orchestrator) | scout | `P5.2-logs-perf.json` |

## G6a: Hardening verified (P6.1–P6.2)
| # | Check | Verifier | Evidence |
|---|---|---|---|
| 6a.1 | Diff limited to SPEC-02 H1–H6 (H5 and H6 added at P6.2); reviewer approves | reviewer | `P6.1-review.json`, `P6.2-fix-review.json` |
| 6a.2 | Local verification incl. H-only checks (cached post survives a DB stop; admin edit revalidates) and SPEC-02 local step 8 (H5, H6) | verifier | `P6.1-local-verify.json`, `P6.2-fix-local-verify.json` |
| 6a.3 | Deployment `READY` for `facts.git.hSha`; full suite passes again (no F2) | verifier | `P6.2-suite-summary.json` |

## G6: Ready for DNS (P6.3–P6.6)
| # | Check | Verifier | Evidence |
|---|---|---|---|
| 6.1 | `origin/main` merged into the branch; suites re-run if that brought changes | orchestrator | `LOG.md` |
| 6.2 | Domains `www.growmax.io` (primary) and `growmax.io` (308 → www) on the project; recommended records captured | scout | `P6.3-domains.json` |
| 6.3 | ACME DNS-01 challenge records captured for both names; domain verification state recorded (the runbook includes `_vercel` TXT if unverified); CAA absent or permits `letsencrypt.org` (else the runbook adds it) | scout | `P6.3-domains.json` |
| 6.4 | Final full refresh verified (G4 checks again) and every sequence's next value == `GAP_START` | verifier | `P6.4-verify.json` |
| 6.5 | Production redeployed after the refresh; DB-driven URLs (`/blog`, sitemap, llms, `/api/blog`, 5 posts) at parity | verifier | `P6.4-quick-parity.json` |
| 6.5b | Fresh live-Replit baseline captured after the merge and refresh (`P6.5-baseline-manifest.json`), with an inventory count ≥ P1.3 | verifier | `P6.5-baseline-summary.json` |
| 6.6 | `CUTOVER-RUNBOOK.md` fully rendered (no `{{…}}`), incl. current and new values for every record touched | orchestrator | runbook |
| 6.7 | Advisor **A2** = `GO` or `GO_WITH_CONDITIONS`. **A NO_GO can't be overridden** | advisor | `A2-advisor.json` |

## G8a: Post-cutover verification (P8.1–P8.2)
| # | Check | Verifier | Evidence |
|---|---|---|---|
| 8a.1 | Authoritative and public resolvers point `www` to Vercel | scout | `P8.1-dns-tls.json` |
| 8a.2 | Valid certificate for `www.growmax.io` (and the apex, if moved); HTTP→HTTPS redirect; apex → `https://www.growmax.io` | scout | `P8.1-dns-tls.json` |
| 8a.3 | Full suite vs the **P6.5** baseline passes (plus vs Replit pinned by IP from the Sandbox, if still reachable) | verifier | `P8.2-suite-summary.json` |
| 8a.4 | No open SEV1/SEV2 | orchestrator | `STATE.json` |

## G8b: Reconciliation and monitoring (P8.3–P8.4)
| # | Check | Verifier | Evidence |
|---|---|---|---|
| 8b.1 | ≥ 72 h since `facts.cutover.detectedAt` | orchestrator | `STATE.json` |
| 8b.2 | Last 24 h: 0 new source rows, **or** the 7-day hard stop was reached with the residual rows and the owner decision recorded (SPEC-05 §4) | verifier | `P8.3-sync-*.json` |
| 8b.3 | Reconciliation audit (SPEC-03 §7): every source row with `id < GAP_START` is reconciled (same id and hash / target newer for `blog_posts` / matched by natural key / logged `target_deleted`) | verifier | `P8.3-final-audit.json` |
| 8b.4 | Uptime workflow added to the PR; runbook for the owner updated | reviewer | `P8.4-monitoring.json` |

## G9: Close-out (P9.1–P9.2)
| # | Check | Verifier | Evidence |
|---|---|---|---|
| 9.1 | `FINAL-REPORT.md`: summary, gate table with evidence links, residual risks, pre-existing issues found (for example drafts reachable by slug, no bot protection on the forms), decommission checklist | orchestrator | report |
| 9.2 | Advisor **A4** sign-off | advisor | `A4-advisor.json` |
| 9.3 | Check-in triggers cancelled, Sandbox deleted, `.scratch/` removed, status `COMPLETE` | scout | `P9.2-cleanup.json` |
