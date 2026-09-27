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
const ctx = `Suite for step ${a.step}, mode ${a.mode}, runLabel ${a.runLabel}. Target B = ${a.baseB}${a.bypass ? ' (send ONLY the x-vercel-protection-bypass header — never x-vercel-set-bypass-cookie; secret in docs/migration/.scratch/bypass-secret, re-fetch from the project if missing; first run the SPEC-04 §5.4 protected-deployment probe and fail as "harness" if it does not return responses from the app itself)' : ''}; ${ref}. Network paths: ${JSON.stringify(a.paths || {})} (use the Sandbox runner for anything the container cannot reach; IP-pinned captures only in the sandbox). Harness spec: docs/migration/specs/SPEC-04-verification.md. Before running any harness script, run npm --prefix scripts/migration ci --no-audit --no-fund if scripts/migration/node_modules lacks a dependency declared in scripts/migration/package.json (container restarts drop it). Never source docs/migration/.scratch/.env.production wholesale for a process that also needs ADMIN_PASSWORD or SESSION_SECRET: vercel env pull writes sensitive vars as the literal "[SENSITIVE]"; map only DATABASE_URL / DATABASE_URL_UNPOOLED in-process. Write evidence in the standard shape {step, gate: "G5" (or the step's gate), status: "pass"|"fail", checkedAt from date -u +%FT%TZ, verifier: "<role> (<model>/<effort>)", checks: [{name, expected, actual, pass}], artifacts}. `

phase('Suite')
const [parity, functional, visual] = await parallel([
  () => agent(role('verifier') + ctx +
    `Parity: run parity/urls.mjs (inventory must be ≥ the P1.3 inventory count; any shrink is a failure) then capture.mjs for B${a.baseA ? ' and A (capture both within minutes of each other)' : ''}, then compare.mjs with docs/migration/evidence/allowlist.json. On data-freshness diffs, re-sync is the orchestrator's job — just classify them. ${a.pinnedReplit ? 'Additionally capture A2 = Replit pinned by IP (--resolve www.growmax.io:443:34.111.179.208, sandbox only) and compare B vs A2, report-only. ' : ''}Write ${EV}/${a.step}-parity.json (compact diff ≤200KB).`,
    { label: `${a.step} parity`, phase: 'Suite', model: 'sonnet', effort: 'medium', schema: RESULT }),
  () => agent(role('verifier') + ctx +
    `Functional: run functional/run.mjs --base ${a.baseB} --mode ${a.mode} --run-label ${a.runLabel}${a.allowDemoTest ? ' --allow-demo-test (F2 runs exactly once; check Vercel runtime logs for "[webhook] delivered")' : ' (F2 must NOT run)'}${a.carryF2From ? `. F2 is carried from ${a.carryF2From}: confirm that file's deployment id equals ${a.deploymentId || '(the deployment under test)'} and that its F2 passed with a delivered 2xx webhook log and 0 residual rows, then record F2 as carried (file and checkedAt) in your evidence` : ''}.${a.f9Browser ? ' Also corroborate F9 (logout) in a real browser, because the browser cookie engine is the ground truth: with playwright-core and Chromium (executablePath /opt/pw-browsers/chromium; never run playwright install) and the x-vercel-protection-bypass header in extraHTTPHeaders, log in through /admin/login with ADMIN_PASSWORD from the container env (never from .env.production), confirm fetch("/api/admin/session") from the page reports isAdmin true, log out (POST /api/admin/logout from the page with credentials, or the UI logout control), then confirm fetch("/api/admin/session") reports isAdmin false and the context holds no growmax-admin cookie with a non-empty value. Record the logout Set-Cookie attributes (name, Path, Max-Age, Expires; never the value) and both results. F9 passes only if run.mjs F9 and the browser check both pass.' : ''} Verify cleanup: no rows labeled vercel-migration-test-${a.runLabel} remain in Neon. Write ${EV}/${a.step}-functional.json (no PII).`,
    { label: `${a.step} functional`, phase: 'Suite', model: 'sonnet', effort: 'medium', schema: RESULT }),
  () => agent(role('verifier') + ctx +
    `Visual: if the container can reach both sites run visual/run.mjs per SPEC-04 §7 and inspect any 0.5–3% diff PNG yourself; otherwise status "pass" with facts.visual="not_run" and the reason. Write ${EV}/${a.step}-visual.json.`,
    { label: `${a.step} visual`, phase: 'Suite', model: 'sonnet', effort: 'medium', schema: RESULT }),
])
// Logs run AFTER functional so the window contains the test traffic (SPEC-04 §9).
const logsPerf = await agent(role('scout') + ctx +
  `Logs + perf (after the functional tests finished): (1) Vercel runtime logs for project growmax-website over an explicit since/until window covering this suite (Vercel MCP get_runtime_logs / get_runtime_errors via ToolSearch). Record since, until and the plan's log retention. List errors; label those caused by our own functional tests. If the window contains NO log lines at all although tests ran, status is "fail" (nothing was examined). ${a.allowDemoTest ? 'Confirm the "[webhook] delivered" line is present. ' : (a.carryF2From ? `F2 did not run in this suite (carried from ${a.carryF2From}), so no webhook line is expected in this window. ` : '')}(2) run perf/run.mjs (report-only). Write ${EV}/${a.step}-logs-perf.json.`,
  { label: `${a.step} logs+perf`, phase: 'Suite', model: 'haiku', effort: 'low', schema: RESULT })

phase('Synthesize')
const summary = await agent(role('verifier') +
  `Synthesize the ${a.step} suite verdict per docs/migration/specs/SPEC-04-verification.md §9 and the matching gate in docs/migration/VERIFICATION.md. Inputs: parity=${JSON.stringify(parity)} functional=${JSON.stringify(functional)} visual=${JSON.stringify(visual)} logsPerf=${JSON.stringify(logsPerf)}. A missing (null) input is a failure.${a.carryF2From ? ` F2 did not run in this suite by design: it is satisfied by ${a.carryF2From} (same deployment ${a.deploymentId || ''}) when the functional verifier confirmed that.` : ''} Write ${EV}/${a.step}-suite-summary.json.`,
  { label: `${a.step} synthesis`, phase: 'Synthesize', model: 'sonnet', effort: 'medium', schema: RESULT })
return { summary, parity, functional, visual, logsPerf }
