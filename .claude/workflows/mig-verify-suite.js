export const meta = {
  name: 'mig-verify-suite',
  description: 'Reusable verification suite: parity vs a reference, functional tests, visual diff, logs + perf, then a synthesized suite verdict',
  whenToUse: 'Growmax Vercel migration P5.2 / P6.2 / P8.2 (called as a child workflow)',
  phases: [
    { title: 'Suite', detail: 'parity, functional, visual (sonnet/medium) + logs/perf (haiku/low)' },
    { title: 'Synthesize', detail: 'verifier sonnet/medium' },
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
for (const k of ['step', 'baseB', 'mode', 'runLabel']) if (!a[k]) throw new Error(`mig-verify-suite: args.${k} required`)
const ref = a.baseA ? `reference A = fresh capture of ${a.baseA}` : `reference A = baseline manifest ${a.baselineManifest || EV + '/P1.3-baseline-manifest.json'}`
const ctx = `Suite for step ${a.step}, mode ${a.mode}, runLabel ${a.runLabel}. Target B = ${a.baseB}${a.bypass ? ' (send the protection-bypass headers; secret in docs/migration/.scratch/bypass-secret, re-fetch from the project if missing)' : ''}; ${ref}. Network paths: ${JSON.stringify(a.paths || {})} (use the Sandbox runner for anything the container cannot reach; IP-pinned captures only in the sandbox). Harness spec: docs/migration/specs/SPEC-04-verification.md. `

phase('Suite')
const [parity, functional, visual, logsPerf] = await parallel([
  () => agent(role('verifier') + ctx +
    `Parity: run parity/urls.mjs (inventory must be ≥ the P1.3 inventory count; any shrink is a failure) then capture.mjs for B${a.baseA ? ' and A (capture both within minutes of each other)' : ''}, then compare.mjs with docs/migration/evidence/allowlist.json. On data-freshness diffs, re-sync is the orchestrator's job — just classify them. ${a.pinnedReplit ? 'Additionally capture A2 = Replit pinned by IP (--resolve www.growmax.io:443:34.111.179.208, sandbox only) and compare B vs A2, report-only. ' : ''}Write ${EV}/${a.step}-parity.json (compact diff ≤200KB).`,
    { label: `${a.step} parity`, phase: 'Suite', model: 'sonnet', effort: 'medium', schema: RESULT }),
  () => agent(role('verifier') + ctx +
    `Functional: run functional/run.mjs --base ${a.baseB} --mode ${a.mode} --run-label ${a.runLabel}${a.allowDemoTest ? ' --allow-demo-test (F2 runs exactly once; check Vercel runtime logs for "[webhook] delivered")' : ' (F2 must NOT run)'}. Verify cleanup: no rows labeled vercel-migration-test-${a.runLabel} remain in Neon. Write ${EV}/${a.step}-functional.json (no PII).`,
    { label: `${a.step} functional`, phase: 'Suite', model: 'sonnet', effort: 'medium', schema: RESULT }),
  () => agent(role('verifier') + ctx +
    `Visual: if the container can reach both sites run visual/run.mjs per SPEC-04 §7 and inspect any 0.5–3% diff PNG yourself; otherwise status "pass" with facts.visual="not_run" and the reason. Write ${EV}/${a.step}-visual.json.`,
    { label: `${a.step} visual`, phase: 'Suite', model: 'sonnet', effort: 'medium', schema: RESULT }),
  () => agent(role('scout') + ctx +
    `Logs + perf: (1) Vercel runtime errors since the deployment for project growmax-website (Vercel MCP get_runtime_errors / get_runtime_logs level error|fatal, via ToolSearch) — list them; errors caused by our own functional tests must be labeled as such. (2) run perf/run.mjs (report-only). Write ${EV}/${a.step}-logs-perf.json.`,
    { label: `${a.step} logs+perf`, phase: 'Suite', model: 'haiku', effort: 'low', schema: RESULT }),
])

phase('Synthesize')
const summary = await agent(role('verifier') +
  `Synthesize the ${a.step} suite verdict per docs/migration/specs/SPEC-04-verification.md §9 and the matching gate in docs/migration/VERIFICATION.md. Inputs: parity=${JSON.stringify(parity)} functional=${JSON.stringify(functional)} visual=${JSON.stringify(visual)} logsPerf=${JSON.stringify(logsPerf)}. A missing (null) input is a failure. Write ${EV}/${a.step}-suite-summary.json.`,
  { label: `${a.step} synthesis`, phase: 'Synthesize', model: 'sonnet', effort: 'medium', schema: RESULT })
return { summary, parity, functional, visual, logsPerf }
