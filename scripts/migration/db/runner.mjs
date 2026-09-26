#!/usr/bin/env node
// scripts/migration/db/runner.mjs
//
// Runs pg_dump/pg_restore (or any of the other db/*.mjs scripts) inside a
// named Vercel Sandbox via the @vercel/sandbox SDK (SPEC-03 §1), because raw
// TCP 5432 from this container is blocked. Secrets are read from
// process.env and passed to `sandbox.runCommand({ env })` as plain in-process
// function arguments -- never through an MCP tool call, and never printed.
//
// Usage:
//   node runner.mjs versions                          # proves pg_dump/pg_restore major
//   node runner.mjs fixtures --out-dir docs/migration/.scratch
//   node runner.mjs pg_dump   -- <pg_dump args...>     # write "$SRC_URL" literally where the source
//   node runner.mjs pg_restore --confirm-pre-cutover [--state-file F] -- <pg_restore args...>
//                                                       # URL goes, "$DST_URL"/"$DST_URL_UNPOOLED" where
//                                                       # the target goes -- these run through `bash -lc`
//                                                       # and expand from the real env var; the secret
//                                                       # value itself never appears in argv. pg_restore
//                                                       # refuses a "$SRC_URL" token: it only ever writes
//                                                       # to the target. Any pg_dump/pg_restore/exec call
//                                                       # that references DST_URL/DST_URL_UNPOOLED refuses
//                                                       # if that value's identity matches the source. A
//                                                       # pg_restore that references DST_* additionally
//                                                       # requires --confirm-pre-cutover and re-runs
//                                                       # sync.mjs's own pre-copy guards (STATE not
//                                                       # POST_CUTOVER/ROLLED_BACK, no
//                                                       # facts.cutover.detectedAt, and the DNS guard) --
//                                                       # this is what stops a single post-cutover
//                                                       # runner.mjs call from wiping the now-authoritative
//                                                       # Neon target.
//   node runner.mjs full-refresh --confirm-pre-cutover [--state-file F] [--gap-start N]
//                                                       # The one sanctioned end-to-end copy: guards, then
//                                                       # pg_dump(SRC) -> pg_restore --clean --if-exists
//                                                       # (DST_URL_UNPOOLED) inside the Sandbox, then
//                                                       # gap -> verify -> watermark init back in this
//                                                       # process via sync.mjs's init-watermarks (neon-https).
//                                                       # Prefer this over a raw pg_restore --clean call.
//   node runner.mjs exec [--with-dst] [--confirm-pre-cutover] [--state-file F] -- <any command> [args...]
//                                                       # $SRC_URL_RO is a read-only-scoped source URL
//                                                       # (never the raw source), always available.
//                                                       # $DST_URL/$DST_URL_UNPOOLED are added only with
//                                                       # --with-dst, which runs the same source-identity
//                                                       # check as pg_dump/pg_restore above AND the same
//                                                       # pre-cutover guards as the dedicated pg_restore
//                                                       # subcommand (--confirm-pre-cutover, STATE not
//                                                       # POST_CUTOVER/ROLLED_BACK/COMPLETE, no
//                                                       # facts.cutover.detectedAt, the DNS guard) -- an
//                                                       # arbitrary command with target write access is
//                                                       # exactly as destructive as pg_restore itself and
//                                                       # must never bypass those checks. Use
//                                                       # `exec -- bash -lc '...'` when the command itself
//                                                       # needs shell expansion.
//
// The Sandbox is named "growmax-migration-runner" and reused across calls
// (Sandbox.getOrCreate). This bare project exists ONLY to host it: never
// link Git, deploy, add env vars, or change its settings here (P3.1 owns
// that).

import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { fetch as undiciFetch, EnvHttpProxyAgent } from "undici";
import { Sandbox } from "@vercel/sandbox";
import { maskUrl, connectionIdentity } from "./lib.mjs";
import { runPreCopyGuards, runInitWatermarks } from "./sync.mjs";

// @vercel/sandbox's internal API client pins its own plain `undici.Agent` as
// the fetch `dispatcher` on every request (it does not read HTTPS_PROXY /
// NODE_USE_ENV_PROXY itself), which this container's egress requires. Passing
// a `fetch` override is the one escape hatch the SDK exposes: we re-fetch
// through undici's EnvHttpProxyAgent and let our override's `dispatcher` win
// over the one the SDK bakes into the options object.
const proxyAgent = process.env.HTTPS_PROXY || process.env.https_proxy ? new EnvHttpProxyAgent() : null;
function proxiedFetch(url, opts) {
  return undiciFetch(url, proxyAgent ? { ...opts, dispatcher: proxyAgent } : opts);
}

const SANDBOX_NAME = "growmax-migration-runner";
const DEFAULT_TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes; Hobby cap is 45 min

// Only these exact env var names, referenced at the END of an argument
// (optionally wrapped in a double quote, e.g. a bare "$SRC_URL" positional or
// a `--dbname="$DST_URL_UNPOOLED"` flag -- the two forms SPEC-03 §4's own
// examples use) are ever expanded unquoted inside a bash -lc command line
// built from operator-supplied args. Everything else -- including the
// literal prefix in front of the token, e.g. `--dbname=` -- is single-quoted,
// so no other argument content can inject shell syntax. This is how
// "$SRC_URL"/"$DST_URL_UNPOOLED" in an operator's pg_dump/pg_restore args
// actually expand from the real env var instead of being passed as a
// literal, inert string (which used to nudge operators toward typing the
// real secret into argv instead).
const ENV_TOKEN_SUFFIX_RE = /^(.*?)"?\$(SRC_URL|DST_URL_UNPOOLED|DST_URL)"?$/;

function shQuote(s) {
  return `'${String(s).replace(/'/g, `'\\''`)}'`;
}

/** Returns the env var name an arg references (SRC_URL/DST_URL/
 * DST_URL_UNPOOLED), or null if it doesn't reference one. */
function envTokenIn(a) {
  const m = ENV_TOKEN_SUFFIX_RE.exec(String(a));
  return m ? m[2] : null;
}

function shArg(a) {
  const str = String(a);
  const m = ENV_TOKEN_SUFFIX_RE.exec(str);
  if (!m) return shQuote(str);
  const [, prefix, varName] = m;
  // Concatenated shell words (e.g. '--dbname='"$DST_URL_UNPOOLED") form ONE
  // argument to the command -- the quoted literal prefix, directly followed
  // by the unquoted (so it expands) variable reference.
  return prefix ? `${shQuote(prefix)}"$${varName}"` : `"$${varName}"`;
}

function shJoin(args) {
  return args.map(shArg).join(" ");
}

/** A connection string with `default_transaction_read_only=on` baked into
 * its own `options` query parameter, so ANY session opened with it -- psql,
 * an arbitrary exec command, whatever -- is read-only at the Postgres level,
 * without a shell-wide PGOPTIONS env var that would also (wrongly) force a
 * same-invocation DST_URL session read-only.
 *
 * The query string is built by hand with encodeURIComponent rather than via
 * `URLSearchParams#set`/`#toString`: WHATWG URLSearchParams serializes a
 * space as `+` (application/x-www-form-urlencoded), but libpq's URI parser
 * only decodes `%XX` escapes, so a literal `+` in `options` would reach
 * Postgres unchanged and it would try (and fail) to recognize a GUC named
 * `+default_transaction_read_only`. encodeURIComponent always emits `%20`
 * for space, which libpq does decode correctly. */
function readOnlyScopedUrl(url) {
  const roOpt = "-c default_transaction_read_only=on";
  try {
    const u = new URL(url);
    // Read (and remove) any existing `options` value via URLSearchParams --
    // safe for *decoding* regardless of `+`-vs-`%20` -- then rebuild the
    // whole query string ourselves so nothing gets re-serialized through
    // URLSearchParams's own (space -> `+`) encoder. This keeps every other
    // existing parameter (e.g. `sslmode`) intact.
    const existingOptions = u.searchParams.get("options");
    u.searchParams.delete("options");
    const mergedOptions = existingOptions ? `${existingOptions} ${roOpt}` : roOpt;
    const parts = [];
    for (const [k, v] of u.searchParams) {
      parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
    }
    parts.push(`options=${encodeURIComponent(mergedOptions)}`);
    u.search = `?${parts.join("&")}`;
    return u.toString();
  } catch {
    // `new URL(url)` threw (malformed URL) -- fall back to a plain string
    // append. encodeURIComponent still guarantees %20, never `+`.
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}options=${encodeURIComponent(roOpt)}`;
  }
}

function readState() {
  const p = "docs/migration/STATE.json";
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, "utf8"));
}

const DEFAULT_STATE_FILE = "docs/migration/STATE.json";

/** Refuses when a DST_URL/DST_URL_UNPOOLED value's identity (normalized:
 * lowercase, `-pooler` suffix stripped, port/userinfo/query ignored -- see
 * lib.mjs's connectionIdentity) matches SRC_URL or REPLIT_DATABASE_URL. This
 * is the check pg_restore's own token check (it refuses a literal "$SRC_URL"
 * argument) never made: a DST_* env var can be WRONG -- pointed at the
 * source's pooled alias, a differently-cased copy of the same host, or the
 * source itself -- without ever spelling "$SRC_URL", and this catches that
 * case before any command runs. */
function assertDstIdentityIsSafe(label) {
  const dstCandidates = [process.env.DST_URL, process.env.DST_URL_UNPOOLED].filter(Boolean);
  const sourceCandidates = [process.env.SRC_URL, process.env.REPLIT_DATABASE_URL].filter(Boolean);
  for (const dstUrl of dstCandidates) {
    const dstIdentity = connectionIdentity(dstUrl);
    for (const srcUrl of sourceCandidates) {
      if (dstIdentity === connectionIdentity(srcUrl)) {
        throw new Error(
          `${label} refused: a DST_URL/DST_URL_UNPOOLED value's identity matches SRC_URL/REPLIT_DATABASE_URL ` +
            `(same host after ignoring a -pooler suffix/case/port/userinfo/query, or the literal same value). ` +
            `Refusing to treat the source as a restore target.`
        );
      }
    }
  }
}

/** Guard for `exec --with-dst`: an arbitrary command with target write access
 * is exactly as destructive as pg_restore itself (a raw pg_restore, a psql
 * DROP/TRUNCATE, ...), so it must run the identical pre-cutover checks the
 * dedicated pg_restore subcommand requires -- never just the source-identity
 * check. Exported (and free of any Sandbox dependency) so it can be unit
 * tested directly, without spinning up a real Sandbox. */
async function execWithDstGuard({ confirmPreCutover, stateFile }) {
  assertDstIdentityIsSafe("runner.mjs exec --with-dst");
  await runPreCopyGuards({ confirmPreCutover, stateFile }, "runner.mjs exec --with-dst");
}

function resolveTeamAndProject() {
  const state = readState();
  const teamId = process.env.VERCEL_TEAM_ID || state?.config?.teamId || "team_r7yanNuXwyp3P3jzhnxkDNaD";
  const projectId = process.env.VERCEL_PROJECT_ID || state?.facts?.vercel?.projectId || "prj_nSpDPuYWavGmtXm4nmcwiVWWgVXu";
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("Missing VERCEL_TOKEN (never type it into a tool call; it must be a real env var)");
  return { teamId, projectId, token };
}

async function getRunner() {
  const { teamId, projectId, token } = resolveTeamAndProject();
  const sandbox = await Sandbox.getOrCreate({
    name: SANDBOX_NAME,
    teamId,
    projectId,
    token,
    timeout: DEFAULT_TIMEOUT_MS,
    resources: { vcpus: 2 },
    fetch: proxiedFetch,
  });
  return sandbox;
}

async function run(sandbox, params) {
  const finished = await sandbox.runCommand(params);
  const [stdout, stderr] = await Promise.all([
    finished.stdout ? finished.stdout() : Promise.resolve(""),
    finished.stderr ? finished.stderr() : Promise.resolve(""),
  ]);
  return { exitCode: finished.exitCode, stdout: maskUrl(stdout), stderr: maskUrl(stderr) };
}

// The dump/restore pair used against the real source (PostgreSQL 16.15) must
// be version 16 specifically, not just ">= 16": pg_dump's custom-format
// container version has changed across major releases (a v18 dump cannot be
// read by a v16 pg_restore), and local-verification fixtures need to be
// restorable by this container's own pg_restore 16.x. The sandbox image's
// default apt repo only ships the newest major (whatever that is), so pin
// postgresql-client-16 explicitly via the PGDG apt repo.
const PG_TARGET_MAJOR = 16;

/** Installs the Postgres 16 client tools if not already present. */
async function ensureToolchain(sandbox) {
  const check = await run(sandbox, { cmd: "bash", args: ["-lc", "pg_dump --version 2>/dev/null || true"] });
  const already = /PostgreSQL\)\s+(\d+)/.exec(check.stdout);
  if (already && Number(already[1]) === PG_TARGET_MAJOR) return { installed: false, versionCheck: check };

  const setupRepo = await run(sandbox, {
    cmd: "bash",
    args: [
      "-lc",
      [
        "sudo apt-get update -qq",
        "sudo apt-get install -y -qq curl ca-certificates gnupg lsb-release",
        "curl -fsSL https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo gpg --dearmor -o /usr/share/keyrings/pgdg.gpg",
        `. /etc/os-release; CODENAME=$(lsb_release -cs 2>/dev/null || echo $VERSION_CODENAME); ` +
          `for CAND in "$CODENAME" noble jammy; do ` +
          `echo "deb [signed-by=/usr/share/keyrings/pgdg.gpg] http://apt.postgresql.org/pub/repos/apt $CAND-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list >/dev/null; ` +
          `sudo apt-get update -qq && apt-cache show postgresql-client-${PG_TARGET_MAJOR} >/dev/null 2>&1 && break; ` +
          `done`,
      ].join(" && "),
    ],
    timeoutMs: 5 * 60 * 1000,
  });

  const install = await run(sandbox, {
    cmd: "bash",
    args: ["-lc", `sudo apt-get install -y -qq postgresql-client-${PG_TARGET_MAJOR}`],
    timeoutMs: 5 * 60 * 1000,
  });

  const verify = await run(sandbox, { cmd: "bash", args: ["-lc", `/usr/lib/postgresql/${PG_TARGET_MAJOR}/bin/pg_dump --version`] });
  const verifiedMajor = /PostgreSQL\)\s+(\d+)/.exec(verify.stdout)?.[1];
  if (Number(verifiedMajor) !== PG_TARGET_MAJOR) {
    throw new Error(
      `Failed to install postgresql-client-${PG_TARGET_MAJOR} in the Sandbox: ${JSON.stringify({ setupRepo, install, verify })}`
    );
  }

  // Make the pinned version the default on PATH for the rest of this session.
  await run(sandbox, {
    cmd: "bash",
    args: [
      "-lc",
      `sudo update-alternatives --install /usr/bin/pg_dump pg_dump /usr/lib/postgresql/${PG_TARGET_MAJOR}/bin/pg_dump 100 ` +
        `--slave /usr/bin/pg_restore pg_restore /usr/lib/postgresql/${PG_TARGET_MAJOR}/bin/pg_restore ` +
        `--slave /usr/bin/psql psql /usr/lib/postgresql/${PG_TARGET_MAJOR}/bin/psql`,
    ],
  });

  return { installed: true, setupRepo, install, verify };
}

async function versionsCommand(sandbox) {
  const toolchain = await ensureToolchain(sandbox);
  const dumpV = await run(sandbox, { cmd: "pg_dump", args: ["--version"] });
  const restoreV = await run(sandbox, { cmd: "pg_restore", args: ["--version"] });
  const psqlV = await run(sandbox, { cmd: "psql", args: ["--version"] });

  const parseMajor = (s) => {
    const m = /PostgreSQL\)\s+(\d+)/.exec(s) || /pg_dump \(PostgreSQL\) (\d+)/.exec(s);
    return m ? Number(m[1]) : null;
  };

  return {
    checkedAt: new Date().toISOString(),
    sandbox: sandbox.name,
    toolchainInstalled: toolchain.installed,
    pg_dump: { raw: dumpV.stdout.trim(), major: parseMajor(dumpV.stdout) },
    pg_restore: { raw: restoreV.stdout.trim(), major: parseMajor(restoreV.stdout) },
    psql: { raw: psqlV.stdout.trim(), major: parseMajor(psqlV.stdout) },
  };
}

async function fixturesCommand(sandbox, { outDir }) {
  const srcUrl = process.env.SRC_URL || process.env.REPLIT_DATABASE_URL;
  if (!srcUrl) throw new Error("Missing SRC_URL/REPLIT_DATABASE_URL");

  await ensureToolchain(sandbox);

  const schemaDump = "/tmp/schema.dump";
  const blogDump = "/tmp/blog-tables.dump";

  // Run through `bash -lc` so `"$SRC_URL"` expands from the real environment
  // variable set via `env` below -- the connection string is never written
  // into the args array (which would otherwise be echoed back in command
  // metadata) or into this script's own output.
  const schema = await run(sandbox, {
    cmd: "bash",
    args: [
      "-lc",
      `pg_dump "$SRC_URL" --format=custom --no-owner --no-privileges --schema=public --schema-only --file=${schemaDump}`,
    ],
    env: { SRC_URL: srcUrl },
  });

  const blog = await run(sandbox, {
    cmd: "bash",
    args: [
      "-lc",
      `pg_dump "$SRC_URL" --format=custom --no-owner --no-privileges --schema=public --table=blog_posts --table=blog_redirects --file=${blogDump}`,
    ],
    env: { SRC_URL: srcUrl },
  });

  if (schema.exitCode !== 0) throw new Error(`pg_dump (schema) failed: ${schema.stderr}`);
  if (blog.exitCode !== 0) throw new Error(`pg_dump (blog tables) failed: ${blog.stderr}`);

  mkdirSync(outDir, { recursive: true });
  const localSchema = `${outDir}/schema.dump`;
  const localBlog = `${outDir}/blog-tables.dump`;
  await sandbox.downloadFile({ path: schemaDump }, { path: localSchema }, { mkdirRecursive: true });
  await sandbox.downloadFile({ path: blogDump }, { path: localBlog }, { mkdirRecursive: true });

  return {
    checkedAt: new Date().toISOString(),
    schemaDump: localSchema,
    blogTablesDump: localBlog,
  };
}

/** The one sanctioned end-to-end copy path (SPEC-03 §4): guards -> pg_dump
 * (SRC) -> pg_restore --clean --if-exists (DST_URL_UNPOOLED) inside the
 * Sandbox -> gap/verify/watermark-init back in this (container) process via
 * sync.mjs's init-watermarks (which works over neon-https; raw TCP 5432 is
 * blocked from here, which is why the dump/restore themselves run in the
 * Sandbox). Prefer this over a raw `runner.mjs pg_restore -- --clean ...`
 * call: it runs the pre-copy guards exactly once, in the right place, before
 * anything destructive happens. */
async function fullRefreshCommand(sandbox, { confirmPreCutover, stateFile, gapStart }) {
  await runPreCopyGuards({ confirmPreCutover, stateFile }, "runner.mjs full-refresh");
  assertDstIdentityIsSafe("runner.mjs full-refresh");

  const srcUrl = process.env.SRC_URL || process.env.REPLIT_DATABASE_URL;
  if (!srcUrl) throw new Error("Missing SRC_URL/REPLIT_DATABASE_URL");
  const dstUrlUnpooled = process.env.DST_URL_UNPOOLED || process.env.DST_URL;
  if (!dstUrlUnpooled) throw new Error("Missing DST_URL_UNPOOLED/DST_URL");

  await ensureToolchain(sandbox);

  const dumpFile = "/tmp/full-refresh.dump";
  const dump = await run(sandbox, {
    cmd: "bash",
    args: ["-lc", `pg_dump "$SRC_URL" --format=custom --no-owner --no-privileges --schema=public --file=${dumpFile}`],
    env: { SRC_URL: srcUrl },
  });
  if (dump.exitCode !== 0) throw new Error(`full-refresh: pg_dump failed: ${dump.stderr}`);

  const restore = await run(sandbox, {
    cmd: "bash",
    args: [
      "-lc",
      `pg_restore --clean --if-exists --no-owner --no-privileges --exit-on-error --single-transaction ` +
        `--dbname="$DST_URL_UNPOOLED" ${dumpFile}`,
    ],
    env: { DST_URL_UNPOOLED: dstUrlUnpooled },
  });
  if (restore.exitCode !== 0) throw new Error(`full-refresh: pg_restore failed: ${restore.stderr}`);

  const initArgs = {
    srcEnv: process.env.SRC_URL ? "SRC_URL" : "REPLIT_DATABASE_URL",
    dstEnv: "DST_URL",
    srcTransport: "neon-https",
    dstTransport: "neon-https",
    confirmPreCutover,
    stateFile,
    gapStart: gapStart ?? null,
  };
  const initResult = await runInitWatermarks(initArgs);

  return {
    checkedAt: new Date().toISOString(),
    dump: { exitCode: dump.exitCode },
    restore: { exitCode: restore.exitCode },
    init: initResult,
  };
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const sandbox = await getRunner();
  try {
    let out;
    if (cmd === "versions") {
      out = await versionsCommand(sandbox);
    } else if (cmd === "fixtures") {
      const outDirIdx = rest.indexOf("--out-dir");
      const outDir = outDirIdx !== -1 ? rest[outDirIdx + 1] : "docs/migration/.scratch";
      out = await fixturesCommand(sandbox, { outDir });
    } else if (cmd === "pg_dump" || cmd === "pg_restore") {
      const dashIdx = rest.indexOf("--");
      // Runner-level flags (--confirm-pre-cutover, --state-file) live BEFORE
      // the `--` separator; everything after it is passed through verbatim to
      // pg_dump/pg_restore itself.
      const flags = dashIdx !== -1 ? rest.slice(0, dashIdx) : [];
      const passthroughArgs = dashIdx !== -1 ? rest.slice(dashIdx + 1) : rest;
      const confirmPreCutover = flags.includes("--confirm-pre-cutover");
      const stateFileIdx = flags.indexOf("--state-file");
      const stateFile = stateFileIdx !== -1 ? flags[stateFileIdx + 1] : DEFAULT_STATE_FILE;

      const referencedVars = new Set(passthroughArgs.map(envTokenIn).filter(Boolean));
      const usesSrc = referencedVars.has("SRC_URL");
      const usesDst = referencedVars.has("DST_URL") || referencedVars.has("DST_URL_UNPOOLED");
      if (cmd === "pg_restore" && usesSrc) {
        throw new Error(
          "pg_restore refused: it must never reference $SRC_URL (it only ever writes to the target); use $DST_URL_UNPOOLED"
        );
      }
      if (usesDst) {
        // Catches a DST_* value that is actually the source by identity (a
        // pooled alias, a differently-cased host, or literally the same
        // value) regardless of which command this is -- cheap and always
        // safe to run.
        assertDstIdentityIsSafe(`runner.mjs ${cmd}`);
      }
      if (cmd === "pg_restore" && usesDst) {
        // The destructive step: never run a pg_restore against the target
        // without the same pre-cutover guards full-refresh itself requires.
        // This is what stops a single post-cutover call from wiping the
        // now-authoritative Neon target (SPEC-03 §0.5/§4).
        await runPreCopyGuards({ confirmPreCutover, stateFile }, "runner.mjs pg_restore");
      }
      const env = {};
      if (usesSrc) {
        const srcUrl = process.env.SRC_URL || process.env.REPLIT_DATABASE_URL;
        if (!srcUrl) throw new Error("Missing SRC_URL/REPLIT_DATABASE_URL");
        env.SRC_URL = srcUrl;
      }
      if (usesDst) {
        if (process.env.DST_URL) env.DST_URL = process.env.DST_URL;
        if (process.env.DST_URL_UNPOOLED) env.DST_URL_UNPOOLED = process.env.DST_URL_UNPOOLED;
      }
      const cmdLine = `${cmd} ${shJoin(passthroughArgs)}`;
      out = await run(sandbox, { cmd: "bash", args: ["-lc", cmdLine], env });
    } else if (cmd === "full-refresh") {
      const confirmPreCutover = rest.includes("--confirm-pre-cutover");
      const stateFileIdx = rest.indexOf("--state-file");
      const stateFile = stateFileIdx !== -1 ? rest[stateFileIdx + 1] : DEFAULT_STATE_FILE;
      const gapStartIdx = rest.indexOf("--gap-start");
      const gapStart = gapStartIdx !== -1 ? Number(rest[gapStartIdx + 1]) : null;
      out = await fullRefreshCommand(sandbox, { confirmPreCutover, stateFile, gapStart });
    } else if (cmd === "exec") {
      const dashIdx = rest.indexOf("--");
      const flags = dashIdx !== -1 ? rest.slice(0, dashIdx) : [];
      const passthrough = dashIdx !== -1 ? rest.slice(dashIdx + 1) : rest;
      const withDst = flags.includes("--with-dst");
      const confirmPreCutover = flags.includes("--confirm-pre-cutover");
      const stateFileIdx = flags.indexOf("--state-file");
      const stateFile = stateFileIdx !== -1 ? flags[stateFileIdx + 1] : DEFAULT_STATE_FILE;
      const realCmd = passthrough[0];
      const realArgs = passthrough.slice(1);
      if (withDst) {
        // See execWithDstGuard's own comment: without this, a single
        // post-cutover `exec --with-dst` call could wipe the
        // now-authoritative Neon target with no confirm flag, no STATE
        // check and no DNS check.
        await execWithDstGuard({ confirmPreCutover, stateFile });
      }
      const env = {};
      const srcUrl = process.env.SRC_URL || process.env.REPLIT_DATABASE_URL;
      if (srcUrl) env.SRC_URL_RO = readOnlyScopedUrl(srcUrl);
      if (withDst) {
        if (process.env.DST_URL) env.DST_URL = process.env.DST_URL;
        if (process.env.DST_URL_UNPOOLED) env.DST_URL_UNPOOLED = process.env.DST_URL_UNPOOLED;
      }
      out = await run(sandbox, { cmd: realCmd, args: realArgs, env });
    } else {
      throw new Error(`Unknown runner command: ${cmd}. Use versions|fixtures|pg_dump|pg_restore|full-refresh|exec`);
    }
    process.stdout.write(JSON.stringify(out, null, 2) + "\n");
    // Pass-through commands must fail the calling workflow when the command
    // inside the Sandbox failed -- printing {exitCode:1,...} and still
    // exiting 0 made a failed pg_restore look like success.
    if (cmd === "pg_dump" || cmd === "pg_restore" || cmd === "exec") {
      process.exitCode = out.exitCode || 0;
    }
  } catch (err) {
    console.error("[runner] error:", maskUrl(err?.message ?? String(err)));
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  getRunner,
  ensureToolchain,
  versionsCommand,
  fixturesCommand,
  run,
  assertDstIdentityIsSafe,
  execWithDstGuard,
  fullRefreshCommand,
  readOnlyScopedUrl,
};
