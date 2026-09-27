export const meta = {
  name: 'mig-p6b-ready',
  description: 'Cutover readiness parts: P6.3 domains + ACME challenges, P6.4 final full refresh + sequence gap + verify + redeploy + quick parity, P6.5 render the owner runbook',
  whenToUse: 'Growmax Vercel migration P6.3 / P6.4 / P6.5 (pass args.part)',
  phases: [
    { title: 'Domains', detail: 'implementer sonnet/high + scout haiku/low' },
    { title: 'Refresh', detail: 'db-operator opus/high + verifier sonnet/medium' },
    { title: 'Runbook', detail: 'baseline re-capture haiku/low + implementer sonnet/medium' },
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
if (!['P6.3', 'P6.4', 'P6.5'].includes(a.part)) throw new Error('args.part must be P6.3 | P6.4 | P6.5')
// Validate everything up front: a missing arg must fail BEFORE the irreversible-ish refresh runs.
if (a.part === 'P6.4') for (const k of ['sha', 'runLabel', 'gapStart']) if (!a[k]) throw new Error(`mig-p6b-ready P6.4: args.${k} required`)
if (a.part === 'P6.5' && !a.runLabel) throw new Error('mig-p6b-ready P6.5: args.runLabel required')
// NOTE: the nested mig-p5-deploy-verify call MUST keep skipSuite:true — workflow nesting is one level only.

if (a.part === 'P6.3') {
  phase('Domains')
  const add = await agent(role('implementer') +
    `Step P6.3 per docs/migration/specs/SPEC-01-infrastructure.md §6 (read it): add www.growmax.io and growmax.io (308 → www.growmax.io) to project growmax-website (idempotent), capture verification TXT records if unverified, the LIVE recommended records (recommendedIPv4 for BOTH www and the apex: A1 C5, since www is switched with an A record because a CNAME cannot coexist with the replit-verify TXT; also record recommendedCNAME for reference only), and the ACME DNS-01 challenge TXT records via \`npx --yes vercel@latest certs issue www.growmax.io growmax.io --challenge-only --scope growmax1\`. Do NOT issue the cert yet and do NOT touch DNS. Write ${EV}/P6.3-domains.json and return facts.dns.target {wwwIPv4, apexIPv4, wwwCnameReferenceOnly, acme:[{name,value}], verify:[{name,value}]}.`,
    { label: 'P6.3 domains', phase: 'Domains', model: 'sonnet', effort: 'high', schema: RESULT })
  const check = await agent(role('scout') +
    `Independently confirm (Vercel MCP via ToolSearch or CLI) that both domains are on project growmax-website with growmax.io redirecting 308 to www.growmax.io, and that ${EV}/P6.3-domains.json contains non-empty recommended records and ACME challenges for both names. Report pass/fail per item.`,
    { label: 'P6.3 check', phase: 'Domains', model: 'haiku', effort: 'low', schema: RESULT })
  return { status: add?.status === 'pass' && check?.status === 'pass' ? 'pass' : 'fail', add, check }
}

if (a.part === 'P6.4') {
  phase('Refresh')
  const refresh = await agent(role('db-operator') +
    `Step P6.4 final refresh per docs/migration/specs/SPEC-03-data-migration.md §4 "Refresh-mode guard" and "After the P6.4 refresh" (read §0, §4, §5). First confirm yourself that www.growmax.io still resolves to 34.111.179.208 (Replit); if not, STOP with status "blocked". Data-loss pre-check (added at P5.1: the production domain growmax-website.vercel.app is public, so a real submission can reach Neon before cutover): compare the ids of demo_requests and newsletter_subscriptions on the target and the source with fingerprint.mjs --rows (never print row contents). Any target-only row (all migration test rows must already be deleted) means a real submission would be erased: STOP with status "blocked", export those rows to docs/migration/.scratch/ only (never into evidence), and report their ids and created_at. Record the pre-check in the evidence. Then: sync.mjs full-refresh --confirm-pre-cutover, sync.mjs gap with GAP_START=${a.gapStart || '(STATE.sync.gapStart)'}. DB runner: ${a.dbPath || '(STATE.facts.paths.db)'}. Write ${EV}/P6.4-refresh.json (counts, final sequence values).`,
    { label: 'P6.4 refresh+gap', phase: 'Refresh', model: 'opus', effort: 'high', schema: RESULT })
  if (refresh?.status !== 'pass') return { status: refresh?.status || 'fail', refresh }
  const verify = await agent(role('verifier') +
    `Independently verify the final refresh: FRESH sync.mjs verify (all tables counts + md5 equal) + schema-diff.mjs --accept-pg-major 18 empty (A1 C2; tool rules in SPEC-03 §1; require its JSON output with empty === true, not just exit 0; per A3 C-A3-6 record the git hash-object of schema-diff.mjs you ran (reviewed 1b26f04b7cccd16da82675aa58991ff98b7f231a or a later opus-reviewed hash), confirm that schema-diff.selftest.mjs ran its real-data case rather than skipping it, and that ignored.schemas lists only _system on a and only _migration (plus neon_auth if present) on b) + every sequence's next value == GAP_START (VERIFICATION.md G6 check 6.4). Write ${EV}/P6.4-verify.json.`,
    { label: 'P6.4 verify', phase: 'Refresh', model: 'sonnet', effort: 'medium', schema: RESULT })
  if (verify?.status !== 'pass') return { status: 'fail', refresh, verify }
  const redeploy = await workflow({ scriptPath: '.claude/workflows/mig-p5-deploy-verify.js' }, {
    step: 'P6.4-redeploy', sha: a.sha, runLabel: a.runLabel, deployMode: a.deployMode, paths: a.paths, skipSuite: true,
  })
  const quick = await agent(role('verifier') +
    `Quick parity of DB-driven URLs after the redeploy (VERIFICATION.md check 6.5): with the harness, capture and compare https://www.growmax.io vs ${a.baseB || redeploy?.deploy?.facts?.productionAlias || '(new production alias)'} (bypass headers) for /blog, /sitemap.xml, /llms.txt, /llms-full.txt, /api/blog and 5 blog posts, plus 3 DB redirects. Do NOT run functional write tests (the sequence gap is live). Write ${EV}/P6.4-quick-parity.json.`,
    { label: 'P6.4 quick parity', phase: 'Refresh', model: 'sonnet', effort: 'medium', schema: RESULT })
  return { status: quick?.status === 'pass' ? 'pass' : 'fail', refresh, verify, redeploy, quick }
}

phase('Runbook')
const baseline = await agent(role('scout') +
  `Step P6.5 part 0: re-capture the live-Replit baseline (www.growmax.io still on Replit) with the harness: parity/urls.mjs then capture.mjs --base https://www.growmax.io → ${EV}/P6.5-baseline-manifest.json (raw bodies to docs/migration/.scratch/raw-p6.5). The inventory count must be ≥ the P1.3 inventory. Write ${EV}/P6.5-baseline-summary.json in the standard evidence shape (verifier field "scout/haiku-low", checks: inventory count, exhausted retries = 0).`,
  { label: 'P6.5 baseline', phase: 'Runbook', model: 'haiku', effort: 'low', schema: RESULT })
if (baseline?.status !== 'pass') return { status: 'fail', baseline }
const runbook = await agent(role('implementer') +
  `Step P6.5 part 1: render docs/migration/CUTOVER-RUNBOOK.md from its template, replacing EVERY {{…}} with live values from docs/migration/STATE.json, ${EV}/P1.4-dns-baseline.json, ${EV}/P6.3-domains.json and the latest suite summaries (A2 fields: write "pending advisor review" — the orchestrator fills them after A2). Apex guidance: if the P1.4 baseline shows the apex already 301/308-redirecting over valid HTTPS to https://www.growmax.io, say "no change needed"; otherwise give the exact A-record replacement with Vercel's recommended IPv4 and the rollback values. Only list records that actually change; state explicitly which records must never be touched. Include the _vercel verification TXT if the domain is unverified and a CAA addition (0 issue "letsencrypt.org") if existing CAA records would block issuance. Verify with grep that no "{{" remains except the two A2 fields. Write ${EV}/P6.5-runbook.json.`,
  { label: 'P6.5 runbook', phase: 'Runbook', model: 'sonnet', effort: 'medium', schema: RESULT })
return { status: runbook?.status || 'fail', baseline, runbook }
