export const meta = {
  name: 'mig-p0-preflight',
  description: 'P0.2 pre-flight: connector scope, secrets presence, network matrix, tooling and source-DB identity, then a synthesized G0 verdict',
  whenToUse: 'Growmax Vercel migration step P0.2',
  phases: [
    { title: 'Checks', detail: '4 scouts (opus/low) + source identity (opus/medium)' },
    { title: 'Synthesize', detail: 'verifier (opus/medium) writes P0.2-preflight.json' },
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
const SCOUT = 'Follow the role rules in .claude/agents/migration-scout.md. '
const VERIFIER = 'Follow the role rules in .claude/agents/migration-verifier.md. '
const EV = 'docs/migration/evidence'
const cfg = args || {}

phase('Checks')
const checks = await parallel([
  () => agent(SCOUT +
    `Network matrix for the migration. From this container, test HTTPS reachability (curl -sS -o /dev/null -w '%{http_code}' -m 20) of: https://www.growmax.io/, https://growmax.io/, https://www.growmax.io/api/blog, https://api.vercel.com/v2/user (expect 401/403 = reachable), https://vercel.com/, https://growmax-website.vercel.app/ (any HTTP code = reachable), https://console.neon.tech/, https://dns.google/resolve?name=www.growmax.io&type=A, https://registry.npmjs.org/. A curl "CONNECT tunnel failed, response 403" means BLOCKED by the egress policy. ` +
    `Also test the Neon HTTPS transport: if the source hostname ends with .neon.tech, curl -sS -o /dev/null -w '%{http_code}' https://HOSTNAME/sql (any HTTP status = reachable; a proxy 403 CONNECT failure = blocked). Also test raw TCP 5432: parse the host from $REPLIT_DATABASE_URL without printing the URL (node -e "console.log(new URL(process.env.REPLIT_DATABASE_URL).hostname)") and run timeout 8 bash -c '</dev/tcp/HOST/5432'. ` +
    `Decide facts.paths = {web: "container"|"sandbox", db: "neon-https"|"container-tcp"|"sandbox-sdk", dump: "sandbox-sdk"|"container-tcp"|"node-etl", vercelApi: "cli"|"mcp", visual: "container"|"none"} following docs/migration/ORCHESTRATOR.md §11 and SPEC-03 §1 (cli and sandbox-sdk need api.vercel.com reachable AND $VERCEL_TOKEN present). Write ${EV}/P0.2-network.json.`,
    { label: 'network', phase: 'Checks', model: 'opus', effort: 'low', schema: RESULT }),
  () => agent(SCOUT +
    `Secrets presence check. For each of REPLIT_DATABASE_URL, VERCEL_TOKEN, ADMIN_PASSWORD, SESSION_SECRET report ONLY present:boolean and length (never values). For REPLIT_DATABASE_URL also report whether it parses as a URL, its protocol, hostname kind ("neon" if the hostname ends with .neon.tech, "internal" if it has no dot, else "other") — the hostname itself may be recorded, never user/password. SESSION_SECRET is optional (>=32 chars if present). Missing REPLIT_DATABASE_URL, VERCEL_TOKEN or ADMIN_PASSWORD is severity "blocker" with the owner action from docs/migration/PREFLIGHT.md. Write ${EV}/P0.2-secrets.json.`,
    { label: 'secrets', phase: 'Checks', model: 'opus', effort: 'low', schema: RESULT }),
  () => agent(SCOUT +
    `Vercel access check for team slug growmax1 (id ${cfg.teamId || 'team_r7yanNuXwyp3P3jzhnxkDNaD'}). (1) Load the Vercel MCP tools via ToolSearch and call mcp__Vercel__list_projects with that teamId — 403 means the connector lacks team scope (blocker: reconnect the Vercel connector at https://claude.ai/customize/connectors granting team growmax1). (2) If $VERCEL_TOKEN is set and api.vercel.com is reachable: run \`npx --yes vercel@latest whoami\` and \`npx --yes vercel@latest teams ls\` (token is read from the env var automatically — never pass --token). (3) Record the team's billing plan (hobby/pro) if visible (mcp__Vercel__get_team or get_auth_user). Hobby = severity "major" (not blocker) with owner action "upgrade to Pro". (4) Whether the Neon integration is already installed on the team, if determinable. Write ${EV}/P0.2-vercel.json.`,
    { label: 'vercel', phase: 'Checks', model: 'opus', effort: 'low', schema: RESULT }),
  () => agent(SCOUT +
    `Tooling check: node -v (need 22.x), npm -v, \`npm ci --ignore-scripts --dry-run\` or a real \`npm ci\` in the repo root (must succeed), psql/pg_dump versions, /usr/lib/postgresql/16/bin/postgres present, Playwright Chromium launch: node -e "require('playwright-core')" may be absent — instead check /opt/pw-browsers exists and list it. Free disk (df -h .). Write ${EV}/P0.2-tooling.json.`,
    { label: 'tooling', phase: 'Checks', model: 'opus', effort: 'low', schema: RESULT }),
  () => agent(VERIFIER +
    `Source-DB identity check per docs/migration/specs/SPEC-03-data-migration.md §2 (read it). Connect to $REPLIT_DATABASE_URL READ-ONLY from the container with a small throwaway Node script that reads the URL from process.env (never from your prompt or a tool argument): run \`npm --prefix scripts/migration ci\` first, then use @neondatabase/serverless (neon() with sql.transaction([...], {readOnly:true, isolationLevel:'RepeatableRead'}), NODE_USE_ENV_PROXY=1) if the host ends with .neon.tech, else pg over TCP. Treat timestamp-without-time-zone values as UTC strings (SPEC-03 §1). Do NOT create any Vercel project or sandbox in P0. If no transport reaches the source from the container, record check 0.4 as "deferred" (P4.1 will run it via the runner) — that is not a failure by itself. Fetch the live https://www.growmax.io/api/blog from the container. Compare published slugs + updated_at exactly as the spec says. Record server_version, pgMajor, hostKind, table list with exact row counts (counts only — no row contents, no PII). Never print the connection string. If the source is unreachable from every runner, report status "blocked" with the F-EXPORT owner instructions from SPEC-03 §6. Write ${EV}/P0.2-source.json. NEVER type a secret value (connection string, password, token) into any tool call or prompt — scripts read them from environment variables only (SPEC-03 §0.2).`,
    { label: 'source-identity', phase: 'Checks', model: 'opus', effort: 'medium', schema: RESULT }),
])
const got = checks.filter(Boolean)
if (got.length < checks.length) log(`${checks.length - got.length} pre-flight check agent(s) returned nothing — synthesis will treat them as failed`)

phase('Synthesize')
const verdict = await agent(VERIFIER +
  `Synthesize gate G0 from these pre-flight results (JSON): ${JSON.stringify(checks)}\n` +
  `Read the evidence files they list and docs/migration/VERIFICATION.md (G0 table). Gate passes only if checks 0.1–0.7 pass (0.8 Hobby is flagged, not blocking); a missing result counts as a failed check. ` +
  `Put into facts: {paths:{web,db,vercelApi,visual}, vercelPlan, source:{pgMajor, hostKind, tables:{name:count}}, neonInstalled}. List every blocker with its exact owner action. Write ${EV}/P0.2-preflight.json in the standard evidence shape.`,
  { label: 'G0-synthesis', phase: 'Synthesize', model: 'opus', effort: 'medium', schema: RESULT })
return { verdict, checks }
