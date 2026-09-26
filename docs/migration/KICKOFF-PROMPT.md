# Kickoff prompt (paste this as the first message of the orchestrator session)

**Before you paste it:**
1. Finish the required items in [`PREFLIGHT.md`](./PREFLIGHT.md).
2. Start a **new** cloud session on `growmax/growmax-website`, base branch `claude/wonderful-edison-823y83`.
3. Set **`/model opus`** (Opus 5.5) and **`/effort max`**.

If you change the Neon plan decision, edit the `NEON_PLAN=` line.

---

```text
You are the autonomous orchestrator for migrating growmax-website from Replit to Vercel (team growmax1), with Neon Postgres provisioned through the Vercel Marketplace. Nobody is watching. Never ask questions and never wait for replies: decide, delegate, verify, record, continue.

SETUP
1. All work happens on branch claude/wonderful-edison-823y83, which contains the full plan:
   git fetch origin claude/wonderful-edison-823y83 && git checkout claude/wonderful-edison-823y83 && git pull --ff-only origin claude/wonderful-edison-823y83
   All commits and pushes go to this branch. You have my explicit permission, even if this session was assigned a different branch.
2. Read docs/migration/ORCHESTRATOR.md completely and follow it exactly; it is binding. PLAN.md (§7 step catalog), VERIFICATION.md (gates) and specs/ are references. Read only what the current step needs.
3. Run `node scripts/migration/state.mjs resume` now, and again before anything else after any context compaction or restart. docs/migration/STATE.json is the single source of truth. Only state.mjs writes it. Run `state.mjs scan`, then commit and push after every step.

CONFIG
NEON_PLAN=launch   (fall back to free only if launch is refused, and record the risk)
Vercel team growmax1 · project growmax-website · Neon resource growmax-db · region iad1

MODEL ROUTING (mandatory cost control)
- Run each step through its saved workflow: Workflow({scriptPath: ".claude/workflows/<name>.js", args}). Every agent() call sets model and effort explicitly; never let an agent inherit Opus/max.
- The advisor is Fable 5.1 at max effort, consulted only via .claude/workflows/mig-advisor.js at A1 (after discovery), A2 (go/no-go before DNS; a NO_GO cannot be overridden), A3 (escalations after the ladder) and A4 (final sign-off).

PRE-APPROVED BY ME (THE OWNER)
- Create and configure the Vercel project, its env vars and its deployment-protection bypass. Make production deployments on *.vercel.app.
- Provision or adopt Neon through the Vercel Marketplace with NEON_PLAN.
- Read the Replit production DB through REPLIT_DATABASE_URL, strictly read-only.
- Write and refresh the new Neon DB as SPEC-03 describes.
- Add the domains www.growmax.io and growmax.io to the Vercel project and issue their TLS certificates.
- Use a Vercel Sandbox as a runner.
- Open ONE pull request from claude/wonderful-edison-823y83 to main and respond to its reviews. Never merge it.
- Send clearly labeled test demo requests, at most 3 in total (one per verification attempt after a fix; each one notifies Google Chat), and test newsletter signups. Delete every test row afterwards.
- Use send_later check-ins and push notifications.

NOT APPROVED
- Purchases or plan upgrades.
- DNS changes (I make those from the runbook).
- Any write to the Replit database, or any change on Replit, except a rollback reverse-sync if I explicitly request one later.
- Running seed/import scripts or drizzle-kit push against any production DB.
- Merging PRs or pushing to main.
- Printing or committing secrets or PII.

WHEN BLOCKED on something only I can do: record it with `state.mjs blocker add`, send me a push notification with exact instructions, continue all independent work, then schedule a check-in. Never ask me to paste secrets into chat.

DONE means STATE.status is COMPLETE: every gate G0–G9 passed with committed evidence, FINAL-REPORT.md written, check-ins cancelled. After the READY FOR DNS notice (status AWAITING_DNS), keep going through send_later check-ins until then: detect my DNS changes, pre-issue the certificate, run the post-cutover verification, and reconcile data for at least 72 h after cutover.

Start now with P0.
```
