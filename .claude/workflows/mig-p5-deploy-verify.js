export const meta = {
  name: 'mig-p5-deploy-verify',
  description: 'Deploy a verified SHA to Vercel production (vercel.app), wait for READY, then run the verification suite as a child workflow',
  whenToUse: 'Growmax Vercel migration P5.1-P5.2 and P6.2 (and redeploys after data refresh)',
  phases: [
    { title: 'Deploy', detail: 'scout haiku/low; build-failure triage sonnet/medium' },
    { title: 'Verify', detail: 'child workflow mig-verify-suite' },
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
for (const k of ['step', 'sha', 'runLabel']) if (!a[k]) throw new Error(`mig-p5-deploy-verify: args.${k} required`)

phase('Deploy')
let deploy = await agent(role('scout') +
  `Create a PRODUCTION deployment of commit ${a.sha} (branch claude/wonderful-edison-823y83) for Vercel project growmax-website in team growmax1. deployMode=${a.deployMode || '(STATE.facts.vercel.deployMode)'}: if "git" use mcp__Vercel__create_deployment with gitSource {type:"github", org:"growmax", repo:"growmax-website", ref:"claude/wonderful-edison-823y83", sha:"${a.sha}"} and target "production"; if "cli": make a worktree of that SHA (git worktree add docs/migration/.scratch/deploy-${a.sha} ${a.sha}), run \`npx --yes vercel@latest link --yes --project growmax-website --scope growmax1\` inside it, confirm .vercel/project.json projectId equals ${a.projectId || 'STATE.facts.vercel.projectId'} (abort otherwise — never let the CLI create a new project), then \`npx --yes vercel@latest deploy --prod --yes --scope growmax1\`; remove the worktree afterwards. Poll (mcp__Vercel__get_deployment) until READY or ERROR (max 20 min). Return facts {deploymentId, url, productionAlias, state, sha}. On ERROR include the last 80 build-log lines (mcp__Vercel__list_deployment_events). ` +
  // Added at P5.1 (orchestrator): the by-SHA deploy must be the aliased production deployment, and protection must hold (P3.4 access check).
  `After READY, also: (1) Alias check: with mcp__Vercel__get_project (targets.production) or mcp__Vercel__list_deployment_aliases, confirm the project's *.vercel.app production alias(es) now point to THIS deployment id, not an older one such as the failed dpl_EAGE1AULX1P1xY2vKtDBUMRhcmw7; if not, status "fail". Return facts.productionAliases (every production alias) and facts.aliasedDeploymentId. (2) Protection check on the first production alias: GET / without any bypass header must return 401 or 403 (deployment protection covers *.vercel.app); GET / with only the header x-vercel-protection-bypass must return 200 with the app's own HTML (for example a <title> containing Growmax). Read the value from docs/migration/.scratch/bypass-secret into a shell variable and pass the header on stdin (printf 'x-vercel-protection-bypass: %s\\n' "$B" | curl -sS -o /dev/null -w '%{http_code}' -H @- URL), never on argv or in any output. Record both status codes, never the secret. Write ${EV}/${a.step}-deploy.json with checks for READY, the build log having no errors, the alias check and the protection check.`,
  { label: `${a.step} deploy`, phase: 'Deploy', model: 'haiku', effort: 'low', schema: RESULT })
if (deploy?.status !== 'pass') {
  const triage = await agent(role('verifier') +
    `The production deployment failed: ${JSON.stringify(deploy)}. Classify the failure (code / config / env / transient-infra) with evidence from the build log and name the smallest fix. Do not change anything.`,
    { label: `${a.step} triage`, phase: 'Deploy', model: 'sonnet', effort: 'medium', schema: RESULT })
  return { status: 'fail', deploy, triage }
}
if (a.skipSuite) return { status: 'pass', deploy }

phase('Verify')
const url = a.baseB || deploy.facts?.productionAlias || deploy.facts?.url
const suiteStep = a.suiteStep || (a.step === 'P5.1' ? 'P5.2' : a.step)
const suite = await workflow({ scriptPath: '.claude/workflows/mig-verify-suite.js' }, {
  step: suiteStep, baseA: a.baseA || 'https://www.growmax.io', baseB: url, bypass: true, mode: 'pre',
  runLabel: a.runLabel, allowDemoTest: !!a.allowDemoTest, paths: a.paths || {},
})
return { status: suite?.summary?.status || 'fail', deploy, suite }
