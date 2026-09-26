export const meta = {
  name: 'mig-p4-data',
  description: 'P4.1-P4.3: target pre-checks and full pg_dump(read-only)->pg_restore copy by the DB operator, then an independent fingerprint/schema verification, one diagnose-and-fix round',
  whenToUse: 'Growmax Vercel migration steps P4.1-P4.3',
  phases: [
    { title: 'Copy', detail: 'db-operator opus/high in the runner' },
    { title: 'Verify', detail: 'verifier sonnet/medium (G4)' },
  ],
}
const RESULT = {
  type: "object",
  properties: {
    status: { type: "string", enum: ["pass", "fail", "blocked"] },
    summary: { type: "string" },
    evidenceFiles: { type: "array", items: { type: "string" } },
    facts: { type: "object" },
    issues: { type: "array", items: { type: "object", properties: { severity: { type: "string", enum: ["blocker", "major", "minor", "info"] }, description: { type: "string" }, ownerAction: { type: "string" } }, required: ["severity", "description"] } },
  },
  required: ["status", "summary", "evidenceFiles", "issues"],
}
const EV = "docs/migration/evidence"
const role = r => `Follow the role rules in .claude/agents/migration-${r}.md. `
const a = args || {}
const ctx = `DB runner: ${a.dbPath || '(STATE.facts.paths.db)'}; runner facts: ${JSON.stringify(a.runner || {})}. SRC_URL comes from $REPLIT_DATABASE_URL; DST_URL / DST_URL_UNPOOLED come from the Vercel project env (vercel env pull --environment=production docs/migration/.scratch/.env.production — gitignored; never print). `

phase('Copy')
let copy = await agent(role('db-operator') + ctx +
  `Steps P4.1 (pre-checks) and P4.2 (full copy) exactly per docs/migration/specs/SPEC-03-data-migration.md §0 and §4 (read them). Initial load, not refresh: the target public schema must be empty; if it is not, stop and report. Write ${EV}/P4.1-prechecks.json and ${EV}/P4.2-copy.json (TOC summary, row counts, read-only proof, durations).`,
  { label: 'P4.1-4.2 copy', phase: 'Copy', model: 'opus', effort: 'high', schema: RESULT })

let verify = null
for (let round = 1; round <= 2; round++) {
  phase('Verify')
  verify = await agent(role('verifier') + ctx +
    `Step P4.3: independently verify the copy with a FRESH run of scripts/migration/db/sync.mjs verify and schema-diff.mjs (source read-only), against docs/migration/VERIFICATION.md G4 checks 4.1–4.5. Write ${EV}/P4.3-verify.json and ${EV}/P4.3-schema-diff.json (round ${round}).`,
    { label: `P4.3 verify r${round}`, phase: 'Verify', model: 'sonnet', effort: 'medium', schema: RESULT })
  if (verify?.status === 'pass') return { status: 'pass', copy, verify, rounds: round }
  if (round === 2) break
  phase('Copy')
  copy = await agent(role('db-operator') + ctx +
    `P4.3 verification failed: ${JSON.stringify(verify)}. Diagnose the root cause (use fingerprint.mjs --rows to locate differing ids; never print row contents) and fix it on the TARGET only (re-running the copy into an empty target is allowed before cutover). Update ${EV}/P4.2-copy.json with the diagnosis.`,
    { label: 'P4 diagnose+fix', phase: 'Copy', model: 'opus', effort: 'high', schema: RESULT })
}
return { status: 'fail', copy, verify, rounds: 2 }
