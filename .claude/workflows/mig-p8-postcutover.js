export const meta = {
  name: 'mig-p8-postcutover',
  description: 'Post-cutover: P8.1 DNS/TLS verification on the real domain + P8.2 full suite vs baseline (and vs Replit pinned), or P8.4 monitoring hand-off (uptime workflow)',
  whenToUse: 'Growmax Vercel migration P8.1-P8.2 (args.part "verify") or P8.4 (args.part "monitoring")',
  phases: [
    { title: 'Verify', detail: 'scout opus/low + child mig-verify-suite' },
    { title: 'Monitoring', detail: 'implementer opus/medium + reviewer opus/high' },
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
if (!['verify', 'monitoring'].includes(a.part)) throw new Error('args.part must be verify | monitoring')

if (a.part === 'verify') {
  phase('Verify')
  const dnsTls = await agent(role('scout') +
    `Step P8.1 (VERIFICATION.md G8a checks 8a.1–8a.2): www.growmax.io on authoritative + public resolvers → Vercel target ${JSON.stringify(a.dnsTarget || '(STATE.facts.dns.target)')}; valid TLS for www.growmax.io (and growmax.io if the apex moved): issuer, SANs, expiry; http://www.growmax.io/ → 308/301 to https; https://growmax.io/ → redirect to https://www.growmax.io/ (compare with the P1.4 baseline apex behavior). DoH resolvers from the container; authoritative NS only via the sandbox runner if needed. Write ${EV}/P8.1-dns-tls.json in the standard evidence shape (step "P8.1", gate "G8a", status, checkedAt, verifier, checks[], artifacts).${a.note ? ' ' + a.note : ''}`,
    { label: 'P8.1 dns+tls', phase: 'Verify', model: 'opus', effort: 'low', schema: RESULT })
  const suite = await workflow({ scriptPath: '.claude/workflows/mig-verify-suite.js' }, {
    step: 'P8.2', baselineManifest: a.baselineManifest || `${EV}/P6.5-baseline-manifest.json`, baselineRawDir: a.baselineRawDir, baseB: 'https://www.growmax.io', bypass: false,
    mode: 'post', runLabel: a.runLabel, allowDemoTest: !!a.allowDemoTest /* A3 C-A3-8(d): the last demo test is reserved for P8.2 on www.growmax.io */, paths: a.paths || {}, pinnedReplit: true,
  })
  return { status: dnsTls?.status === 'pass' && suite?.summary?.status === 'pass' ? 'pass' : 'fail', dnsTls, suite }
}

phase('Monitoring')
const mon = await agent(role('implementer') +
  `Step P8.4 per docs/migration/specs/SPEC-06-availability-monitoring.md §3: add .github/workflows/uptime.yml (schedule */15, workflow_dispatch; curl --fail --max-time 20 with one retry and content-marker assertions for https://www.growmax.io/, /blog, /demo, /sitemap.xml, /robots.txt, /api/blog and one blog post; optional alert POST only if secrets.ALERT_WEBHOOK_URL is set; no secrets committed). Validate the YAML parses (python3 -c "import yaml,sys;yaml.safe_load(open('.github/workflows/uptime.yml'))" or node). Write ${EV}/P8.4-monitoring.json.${a.note ? ' ' + a.note : ''}`,
  { label: 'P8.4 uptime workflow', phase: 'Monitoring', model: 'opus', effort: 'medium', schema: RESULT })
const rev = await agent(role('reviewer') +
  `Review .github/workflows/uptime.yml against SPEC-06 §3: correct URLs and markers, cannot leak secrets, fails loudly, no write permissions needed (set permissions: contents: read). Return approve/blocking.${a.reviewNote ? ' ' + a.reviewNote : ''}`,
  { label: 'P8.4 review', phase: 'Monitoring', model: 'opus', effort: 'high', ...(a.noAgentTypes ? {} : { agentType: 'migration-reviewer' }), schema: { type: 'object', properties: { approve: { type: 'boolean' }, blocking: { type: 'array', items: { type: 'object', properties: { issue: { type: 'string' } }, required: ['issue'] } } }, required: ['approve', 'blocking'] } })
return { status: mon?.status === 'pass' && rev?.approve && !rev.blocking.length ? 'pass' : 'fail', mon, rev }
