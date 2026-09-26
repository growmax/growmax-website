export const meta = {
  name: 'mig-p3-infra',
  description: 'P3.1-P3.5: Vercel project + settings + ignore guard, Neon via Vercel Marketplace, sensitive env vars via stdin, protection bypass, then independent read-back',
  whenToUse: 'Growmax Vercel migration steps P3.1-P3.5',
  phases: [
    { title: 'Provision', detail: 'implementer sonnet/high, sequential' },
    { title: 'Read-back', detail: 'scout haiku/low, independent (G3)' },
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
const ctx = `Config: team slug growmax1 (id ${a.teamId || 'team_r7yanNuXwyp3P3jzhnxkDNaD'}), project growmax-website, Neon resource growmax-db, region iad1, NEON_PLAN=${a.neonPlan || 'launch'}, source PG major=${a.pgMajor || '(see STATE.facts.source.pgMajor)'}, control plane=${a.vercelApi || '(see STATE.facts.paths.vercelApi)'}. `

phase('Provision')
const prov = await agent(role('implementer') + ctx +
  `Steps P3.1–P3.4 exactly per docs/migration/specs/SPEC-01-infrastructure.md §1–§5 (read it fully), in order, idempotently (read first, create only if missing, converge settings). Secrets only via env/stdin; never print values; never use --token in argv; never put a secret value in an MCP tool call (use the CLI with stdin, not mcp__Vercel__create_project_env, for secret values). Production target only (no preview). Prove \`vercel env pull --environment=production docs/migration/.scratch/.env.production\` yields pooled + unpooled target URLs (record hosts only). If Neon provisioning needs an interactive terms acceptance, return status "blocked" with ownerAction for B-NEON-TERMS but still finish P3.1, P3.3, P3.4. Write ${EV}/P3.1-project.json, ${EV}/P3.2-neon.json, ${EV}/P3.3-env.json (names/targets/types only), ${EV}/P3.4-bypass.json (never the secret; store it only in docs/migration/.scratch/bypass-secret mode 600). Return facts {vercel:{projectId, projectName, deployMode, productionAliases}, neon:{resourceName, resourceId, region, pgVersion, plan, pooledHost, unpooledHost}}.`,
  { label: 'P3.1-3.4 provision', phase: 'Provision', model: 'sonnet', effort: 'high', schema: RESULT })

phase('Read-back')
const readback = await agent(role('scout') +
  `Step P3.5: independently read back the Vercel/Neon configuration (Vercel MCP tools via ToolSearch and/or \`npx --yes vercel@latest project inspect growmax-website\`, \`vercel env ls production\`, \`vercel env ls preview\`) and check EVERY item of docs/migration/specs/SPEC-01-infrastructure.md §8 (including the production-only ignore guard and that the env pull yields target URLs — hosts only). Do not trust the provisioning report: ${JSON.stringify(prov?.facts || {})}. Env var values must never be printed. Write ${EV}/P3.5-infra-readback.json with one check per §8 bullet.`,
  { label: 'P3.5 read-back', phase: 'Read-back', model: 'haiku', effort: 'low', schema: RESULT })
return { provision: prov, readback }
