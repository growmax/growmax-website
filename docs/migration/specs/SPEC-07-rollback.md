# SPEC-07: Rollback procedures and decommission

Replit (app, custom domain and database) stays untouched until the owner decommissions it after G9 **and** 7 more days of zero Replit traffic. That makes every rollback below possible.

## R0: Before the DNS switch (no user impact)

Nothing to roll back, because users are still on Replit. To abandon the migration: stop the orchestrator, then have the **owner** delete the Vercel project and the Neon resource if wanted. The orchestrator never deletes them on its own.

## R1: Bad Vercel deployment after cutover

1. `mcp__Vercel__request_rollback {projectId, deploymentId: <previous verified production deployment>}`. This is instant and doesn't rebuild.
2. Verify the smoke subset, and record the incident.
3. Fix forward on the branch → full verification → deploy.

## R2: Full rollback to Replit (owner action; minutes)

1. At the DNS host, **restore `www` to `A 34.111.179.208`**: delete the Vercel CNAME. Restore the apex records from `evidence/P1.4-dns-baseline.json` if they were changed. TTL 300 s means most clients move within minutes.
2. Replit still has the domain and its certificate configured, because nothing on Replit was touched. Traffic resumes there.
3. **Data written on Vercel after cutover** has ids ≥ `GAP_START` and stays safe in Neon. It is **not** copied back automatically.
   - At the next check-in the orchestrator detects `www` back on Replit and sets status `ROLLED_BACK`.
   - It runs `sync.mjs reverse-delta --dry-run` and notifies the owner with the counts per table, without printing PII.
   - The actual `reverse-delta` (a write to Replit) runs **only** when the owner explicitly asks for it in a session prompt. It then uses `--i-understand-this-writes-to-replit` + `ALLOW_SOURCE_WRITES=1`, and verifies afterwards that every Neon row with id ≥ `GAP_START` exists in Replit.
4. The ids can't collide because Replit ids stay below `GAP_START`.

## R3: Data problem in Neon

- **Before cutover:** `sync.mjs full-refresh --confirm-pre-cutover` rebuilds Neon from Replit.
- **After cutover:** the owner uses Neon point-in-time restore (a branch at a timestamp, via `vercel integration open neon growmax-db`). Then re-run `delta` from Replit for any source rows that are missing. The orchestrator prepares the exact timestamp and plan; the owner executes the PITR in the console.

## R4: Abandon after cutover

R2, then R0 (the owner deletes the Vercel resources once the data decision is made).

## 5. Decommission checklist (owner; delivered in FINAL-REPORT.md)

Do these only after G9 **and** 7 consecutive days with zero new Replit rows (the delta reports show it) and no Replit deployment traffic.

1. Take a final `pg_dump` of the Replit DB and store it encrypted somewhere you control.
2. Stop the Replit deployment. Remove the custom domain in Replit, then delete Replit's verification TXT record at the DNS host.
3. **Rotate secrets:**
   - Regenerate the Google Chat webhook (the old one is in git history) and update `GOOGLE_CHAT_WEBHOOK_URL` in Vercel.
   - Consider rotating `ADMIN_PASSWORD` and `SESSION_SECRET`.
   - Revoke the migration's `VERCEL_TOKEN`.
   - Remove `REPLIT_DATABASE_URL`, `VERCEL_TOKEN` and the other secrets from the Claude cloud environment.
   - Delete the Replit database.
4. Ask `@growmax/guardians` to merge the migration PR if they haven't yet. After the merge, keep or remove the ignore-step guard (`commandForIgnoringBuildStep`).
5. Update `replit.md` (or add a README section) to document the Vercel hosting and deploy flow: GitHub `main` → Vercel production.
6. Review the Vercel spend limits and Neon usage alerts. Consider adding bot protection for the forms (pre-existing gap).
