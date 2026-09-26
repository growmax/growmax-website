export const meta = {
  name: 'mig-p1-discovery',
  description: 'P1.1-P1.5 discovery: source DB inventory/fingerprints, parity harness build + mutation self-test + adversarial review, live baseline, DNS baseline, code audit',
  whenToUse: 'Growmax Vercel migration steps P1.1-P1.5 (A1 advisor runs separately via mig-advisor)',
  phases: [
    { title: 'Discover', detail: 'DB inventory (sonnet/high), harness (sonnet/high), DNS (haiku/low), audit (sonnet/medium)' },
    { title: 'Review', detail: 'reviewer opus/high over harness + DB scripts, up to 2 fix rounds' },
    { title: 'Baseline', detail: 'capture live site with the reviewed harness (haiku/low) + verify (sonnet/medium)' },
  ],
}

const RESULT = {
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['pass', 'fail', 'blocked'] },
    summary: { type: 'string' },
    evidenceFiles: { type: 'array', items: { type: 'string' } },
    facts: { type: 'object' },
    issues: { type: 'array', items: { type: 'object', properties: { severity: { type: 'string', enum: ['blocker', 'major', 'minor', 'info'] }, description: { type: 'string' }, ownerAction: { type: 'string' } }, required: ['severity', 'description'] } },
  },
  required: ['status', 'summary', 'evidenceFiles', 'issues'],
}
const REVIEW = {
  type: 'object',
  properties: {
    approve: { type: 'boolean' },
    blocking: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, issue: { type: 'string' }, fix: { type: 'string' } }, required: ['issue'] } },
    nonBlocking: { type: 'array', items: { type: 'object', properties: { file: { type: 'string' }, issue: { type: 'string' } }, required: ['issue'] } },
  },
  required: ['approve', 'blocking'],
}
const EV = 'docs/migration/evidence'
const a = args || {}
const paths = a.paths || {}
const only = a.only || ['P1.1', 'P1.2', 'P1.3', 'P1.4', 'P1.5']
const role = r => `Follow the role rules in .claude/agents/migration-${r}.md. `
const RT = a.noAgentTypes ? {} : { agentType: 'migration-reviewer' }
const OWN = 'Directory ownership: P1.1 owns scripts/migration/db/ only; P1.2 owns scripts/migration/{parity,functional,visual,perf}/ only. scripts/migration/package.json already pins the dependencies (pg, @neondatabase/serverless, ws, node-html-parser, pixelmatch, pngjs, playwright-core, @vercel/sandbox) — run `npm --prefix scripts/migration ci`; do not edit package.json unless a dependency is truly missing (P1.2 only). NEVER type a secret value into any tool call or prompt; scripts read env vars (SPEC-03 §0.2). '
const runnerNote = `Network paths decided in P0 (facts.paths): ${JSON.stringify(paths)}. DB transport per SPEC-03 §1 (neon-https from the container preferred; pg_dump only via scripts/migration/db/runner.mjs using the @vercel/sandbox SDK). ` + OWN

phase('Discover')
const tasks = {
  'P1.1': () => agent(role('db-operator') + runnerNote +
    `Step P1.1 per docs/migration/specs/SPEC-03-data-migration.md §0, §1, §3, §5 (read them). Implement scripts/migration/db/{lib,inventory,fingerprint,schema-diff,sync,runner}.mjs exactly per §1/§5 (Node 22 ESM; transports neon-https / container-tcp / sandbox-sdk; persisted watermarks in _migration.sync_state; natural-key reconciliation; late-commit window; never resurrect target deletions; every §0 invariant and guard). Then, READ-ONLY against $REPLIT_DATABASE_URL: run inventory + fingerprint, write ${EV}/P1.1-source-inventory.json and ${EV}/P1.1-source-fingerprint.json (counts/md5 only), produce the no-PII fixtures docs/migration/.scratch/schema.dump and docs/migration/.scratch/blog-tables.dump in the container, and export the public DB redirect list (old_path,new_path) to ${EV}/P1.1-db-redirects.json. Compute GAP_START = max(1000000, 10*max id) and return it in facts.gapStart, plus facts.source {pgMajor, hostKind, tables, maxIds, extensions, extraTables}. Self-test every sync.mjs mode and guard against a throwaway local PG16 with two databases as source/target (SPEC-02 local PG recipe), including deletion, late-commit and natural-key-conflict scenarios; write ${EV}/P1.1-sync-selftest.json. Never self-test against the real source or Neon.`,
    { label: 'P1.1 db inventory', phase: 'Discover', model: 'sonnet', effort: 'high', schema: RESULT }),
  'P1.2': async () => {
    const built = await agent(role('implementer') + runnerNote +
      `Step P1.2: build the parity harness exactly per docs/migration/specs/SPEC-04-verification.md §1–§5 (read it fully): scripts/migration/package.json (+ lockfile via npm install inside scripts/migration), parity/{urls,capture,compare,selftest}.mjs, functional/run.mjs, visual/run.mjs, perf/run.mjs. Use NODE_USE_ENV_PROXY=1 for fetch in the container. Run selftest.mjs against the live site (or via the sandbox if web=="sandbox") and write ${EV}/P1.2-harness-selftest.json. Every mutation in §5.2 must be detected; determinism check must pass.`,
      { label: 'P1.2 build harness', phase: 'Discover', model: 'sonnet', effort: 'high', schema: RESULT })
    return built
  },
  'P1.4': () => agent(role('scout') + runnerNote +
    `Step P1.4 DNS/TLS baseline. Using DNS-over-HTTPS (curl 'https://dns.google/resolve?name=NAME&type=TYPE') or dig in the sandbox, record for growmax.io and www.growmax.io: NS, SOA, A, AAAA, CNAME, MX, TXT, CAA; identify the DNS provider from NS. Also record apex/www HTTP behavior: curl -sI for http://growmax.io/, https://growmax.io/, http://www.growmax.io/, https://www.growmax.io/ (status, location, server), and the current TLS cert issuer/subject/SANs/expiry for www.growmax.io and growmax.io (openssl s_client -servername ... or curl -v). Write ${EV}/P1.4-dns-baseline.json and return facts.dns {provider, ns, wwwRecords, apexRecords, apexBehavior}.`,
    { label: 'P1.4 dns baseline', phase: 'Discover', model: 'haiku', effort: 'low', schema: RESULT }),
  'P1.5': () => agent(role('verifier') +
    `Step P1.5 code compatibility audit (read-only). Read docs/migration/specs/SPEC-02-code-changes.md, then audit the app (app/, lib/, components/, middleware.ts, next.config.ts, package.json) for anything that behaves differently on Vercel (serverless/Fluid, Edge middleware, build-time env/DB needs, fire-and-forget promises, filesystem writes, long-running timers, in-memory state, hardcoded hosts/ports, secrets in code). Confirm or refute each M/H item and list anything missing with file:line. Write ${EV}/P1.5-code-audit.json.`,
    { label: 'P1.5 code audit', phase: 'Discover', model: 'sonnet', effort: 'medium', schema: RESULT }),
}
const discovered = {}
await parallel(Object.keys(tasks).filter(k => only.includes(k)).map(k => async () => { discovered[k] = await tasks[k]() }))

phase('Review')
// Mandatory adversarial review of BOTH the harness and the DB scripts, after both are built (no race).
const needReview = only.includes('P1.1') || only.includes('P1.2')
// args.maxRounds (default 3) lets the orchestrator add fix+review rounds (escalation ladder rung 3) by resuming a
// run: rounds 1-3 keep byte-identical prompts, so their completed agents replay from the cache.
const maxRounds = a.maxRounds || 3
let review = null
for (let round = 1; needReview && round <= maxRounds; round++) {
  const prevBlocking = review?.blocking || []
  const converge = round >= 4
    ? ` Round ${round} is a convergence round. First check that each blocking finding from the previous round is really fixed and that the fixes introduced no regression: ${JSON.stringify(prevBlocking)}. Then re-scan both the harness and the DB scripts. Count as BLOCKING only defects that could (a) let parity pass while the sites differ in a way users or search engines would notice, (b) lose, duplicate, corrupt or resurrect data, (c) write to the source DB, (d) bypass a safety guard (read-only source, full-refresh/cutover guards, targeting of test writes), or (e) leak a secret or PII; everything else goes in nonBlocking. Your role is read-only, so return the review JSON; the orchestrator persists it as ${EV}/P1.2-harness-review.json.`
    : ''
  review = await agent(role('reviewer') +
    `Adversarially review (round ${round}): (1) the parity harness scripts/migration/{parity,functional,visual,perf} against docs/migration/specs/SPEC-04-verification.md and ${EV}/P1.2-harness-selftest.json — can it PASS while www.growmax.io and the Vercel deployment differ in a way users or search engines would notice? (2) scripts/migration/db/*.mjs against SPEC-03 §0/§1/§5 and ${EV}/P1.1-sync-selftest.json — read-only enforcement on the source, secrets only via env (runner.mjs must use the @vercel/sandbox SDK, never MCP), masking, idempotency, watermark/late-commit/natural-key/target-deletion rules, gap handling, the full-refresh guard, and reverse-delta write guards. Write ${EV}/P1.2-harness-review.json. For each blocking finding set file so it can be routed.` + converge,
    { label: `P1 review r${round}`, phase: 'Review', model: 'opus', effort: 'high', schema: REVIEW, ...RT })
  if (!review) break
  if (review.approve && !review.blocking.length) break
  if (round === maxRounds) break
  // Round 3 reads args.extraFixesFile (its nonBlocking list); later rounds read args.extraFixesByRound[round]
  // (its orchestrator-curated actionableNonBlocking list). Round >= 4 is escalation rung 4: opus deep fix.
  const xf = (a.extraFixesByRound && a.extraFixesByRound[round]) || (round === 3 ? a.extraFixesFile : null)
  const extra = !xf ? '' : round === 3
    ? ` Also read the nonBlocking findings in ${xf} and fix the ones in your directory, unless a fix would conflict with the spec or reach outside your directory; list any you skip and why.`
    : ` Also read the actionableNonBlocking list in ${xf} and fix the ones in your directory, unless a fix would conflict with the spec or reach outside your directory; list any you skip and why.`
  const deep = round >= 4
    ? ` This is escalation rung 4 (deep fix): apply each finding's fix precisely, add a self-test case that would have caught each regression, and change nothing outside the findings' scope.`
    : ''
  const fixModel = round >= 4 ? 'opus' : 'sonnet'
  const dbFix = review.blocking.filter(b => (b.file || '').includes('scripts/migration/db'))
  const hFix = review.blocking.filter(b => !(b.file || '').includes('scripts/migration/db'))
  await parallel([
    ...(dbFix.length || extra ? [() => agent(role('db-operator') + runnerNote + `Fix these blocking review findings in scripts/migration/db/ and re-run the sync self-test (${EV}/P1.1-sync-selftest.json): ${JSON.stringify(dbFix)}` + extra + deep,
      { label: `P1.1 fix r${round}`, phase: 'Review', model: fixModel, effort: 'high', schema: RESULT })] : []),
    ...(hFix.length || extra ? [() => agent(role('implementer') + runnerNote + `Fix these blocking review findings in the parity harness, re-run selftest.mjs and rewrite ${EV}/P1.2-harness-selftest.json: ${JSON.stringify(hFix)}` + extra + deep,
      { label: `P1.2 fix r${round}`, phase: 'Review', model: fixModel, effort: 'high', schema: RESULT })] : []),
  ])
}
const reviewOk = !needReview || (review && review.approve && !review.blocking.length)
if (needReview && !reviewOk) log(`P1 review still has blocking findings after ${maxRounds - 1} fix rounds — P1.3 skipped, orchestrator must escalate`)

phase('Baseline')
let baseline = null
const ready = reviewOk && discovered['P1.2']?.status === 'pass' && (discovered['P1.1']?.status === 'pass' || !only.includes('P1.1'))
if (only.includes('P1.3') && ready) {
  const cap = await agent(role('scout') + runnerNote +
    `Step P1.3: capture the live-site baseline with the reviewed harness. Run parity/urls.mjs (sitemap from https://www.growmax.io, config redirects, DB redirects from ${EV}/P1.1-db-redirects.json, special/negative routes per SPEC-04 §2) → ${EV}/P1.3-url-inventory.json; then parity/capture.mjs --base https://www.growmax.io → manifest ${EV}/P1.3-baseline-manifest.json (compact, no raw bodies; raw bodies to docs/migration/.scratch/raw-baseline). Report URL counts per source and any URL whose retries were exhausted.`,
    { label: 'P1.3 capture', phase: 'Baseline', model: 'haiku', effort: 'low', schema: RESULT })
  baseline = await agent(role('verifier') +
    `Verify the P1.3 baseline against docs/migration/VERIFICATION.md check 1.4: ≥250 URLs (or explained shortfall), 0 exhausted retries, every sitemap URL present, every config redirect source present, every DB redirect present. Capture result: ${JSON.stringify(cap)}. Write ${EV}/P1.3-baseline-summary.json.`,
    { label: 'P1.3 verify', phase: 'Baseline', model: 'sonnet', effort: 'medium', schema: RESULT })
} else if (only.includes('P1.3')) {
  log('P1.3 skipped: harness or DB inventory did not pass')
}
return { discovered, review, baseline }
