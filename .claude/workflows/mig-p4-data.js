export const meta = {
  name: 'mig-p4-data',
  description: 'P4.1-P4.3: target pre-checks and full pg_dump(read-only)->pg_restore copy by the DB operator, then an independent fingerprint/schema verification, one diagnose-and-fix round',
  whenToUse: 'Growmax Vercel migration steps P4.1-P4.3',
  phases: [
    { title: 'Copy', detail: 'db-operator opus/high in the runner' },
    { title: 'Verify', detail: 'verifier opus/medium (G4)' },
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
const ctx = `DB transport: ${a.dbPath || '(STATE.facts.paths.db)'}; dump path: ${a.dumpPath || '(STATE.facts.paths.dump)'}; identity check at P0: ${a.identity || '(STATE gates/evidence P0.2-source.json)'}. SRC_URL comes from $REPLIT_DATABASE_URL; DST_URL / DST_URL_UNPOOLED come from docs/migration/.scratch/.env.production (vercel env pull; gitignored). Run scripts with node --env-file; pg_dump/pg_restore only through scripts/migration/db/runner.mjs (@vercel/sandbox SDK). NEVER type a secret value into any tool call or prompt (SPEC-03 §0.2). `

// Amended 2026-09-26 per advisor A1 condition C2 plus the P0/P1 carry-forwards.
const C2 = ' A1 C2 (binding): the target is the new Neon resource growmax-db-iad1 (store_5rcRxxSXMtnl4VA2 / morning-fog-77978305); PG major >= 16 is accepted. At P4.1, record the target\'s exact server_version, plus datcollate, datctype and the locale provider (datlocprovider) of the target database. Require code-point collation (C / C.UTF-8-equivalent, matching the source\'s C.UTF-8). A non-C locale is a BLOCKER (return status blocked: the resource must be recreated), never a warning. Also assert that the unpooled DST host is in us-east-1 and differs from the source host, and that the connected store is not the sin1 store store_IsJjgV1qX1w7nvrP. Keep P4.2 exactly as SPEC-03 §4 (pg_dump 16.x in the Sandbox; pg_restore --exit-on-error --single-transaction), so that a failed restore leaves Neon empty. Before the copy, re-prove pg_dump/pg_restore major >= 16 inside the Sandbox (P0 carry-forward), and re-check that a $SRC_URL_RO session shows default_transaction_read_only=on and rejects a write (P1 follow-up). Set NODE_USE_ENV_PROXY=1 in the environment of every node process that uses the neon-https transport. If the session\'s permission system refuses a command, STOP: report the exact command and the refusal reason, and never work around it.'
phase('Copy')
let copy = await agent(role('db-operator') + ctx +
  `Steps P4.1 (pre-checks — including the SPEC-03 §2 identity check FIRST if P0 recorded it as deferred) and P4.2 (full copy) exactly per docs/migration/specs/SPEC-03-data-migration.md §0, §2 and §4 (read them). Initial load, not refresh: the target public schema must be empty; if it is not, stop and report. Write ${EV}/P4.1-prechecks.json and ${EV}/P4.2-copy.json (TOC summary, row counts, read-only proof, durations).` + C2,
  { label: 'P4.1-4.2 copy', phase: 'Copy', model: 'opus', effort: 'high', schema: RESULT })

let verify = null
for (let round = 1; round <= 2; round++) {
  phase('Verify')
  verify = await agent(role('verifier') + ctx +
    `Step P4.3: independently verify the copy with a FRESH run of scripts/migration/db/sync.mjs verify and schema-diff.mjs --accept-pg-major 18 (A1 C2; tool rules in SPEC-03 §1; require its JSON output with empty === true, not just exit 0) (source read-only), against docs/migration/VERIFICATION.md G4 checks 4.1–4.5. Write ${EV}/P4.3-verify.json and ${EV}/P4.3-schema-diff.json (round ${round}). Also confirm from P4.1-prechecks.json, re-deriving it yourself with a read-only query, that the target collation is code-point (A1 C2) and that the target host is us-east-1 and not the source. Standard evidence shape, checkedAt from date -u.` + C2,
    { label: `P4.3 verify r${round}`, phase: 'Verify', model: 'opus', effort: 'medium', schema: RESULT })
  if (verify?.status === 'pass') return { status: 'pass', copy, verify, rounds: round }
  if (round === 2) break
  phase('Copy')
  copy = await agent(role('db-operator') + ctx +
    `P4.3 verification failed: ${JSON.stringify(verify)}. Diagnose the root cause (use fingerprint.mjs --rows to locate differing ids; never print row contents) and fix it on the TARGET only (re-running the copy into an empty target is allowed before cutover). Update ${EV}/P4.2-copy.json with the diagnosis.`,
    { label: 'P4 diagnose+fix', phase: 'Copy', model: 'opus', effort: 'high', schema: RESULT })
}
return { status: 'fail', copy, verify, rounds: 2 }
