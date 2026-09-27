#!/usr/bin/env node
// scripts/migration/db/runner-guards.selftest.mjs
//
// Self-test for runner.mjs's non-Sandbox guard logic (SPEC-03 §0.5): does
// NOT spin up a real Vercel Sandbox (no VERCEL_TOKEN / network / billable
// resource needed) -- it exercises execWithDstGuard() and
// assertDstIdentityIsSafe() directly, which are pure functions of env vars
// and STATE.json.
//
// Usage: node runner-guards.selftest.mjs [--out file]

import { writeFileSync, mkdtempSync, writeFileSync as writeFile, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { execWithDstGuard, assertDstIdentityIsSafe } from "./runner.mjs";

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.error(`${ok ? "PASS" : "FAIL"} ${name}`);
}

function withEnv(vars, fn) {
  const saved = {};
  for (const k of Object.keys(vars)) saved[k] = process.env[k];
  Object.assign(process.env, vars);
  return Promise.resolve()
    .then(fn)
    .finally(() => {
      for (const [k, v] of Object.entries(saved)) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    });
}

async function main() {
  const dir = mkdtempSync(path.join(tmpdir(), "runner-guards-selftest-"));

  // --- Scenario 1: exec --with-dst without --confirm-pre-cutover refuses,
  // exactly like pg_restore's own dedicated subcommand does. ---
  try {
    const stateFile = path.join(dir, "state-noconfirm.json");
    writeFile(stateFile, JSON.stringify({ status: "IN_PROGRESS", facts: {} }));
    let refused = false;
    await withEnv({ DST_URL: "postgresql://dst.example.com/db" }, async () => {
      try {
        await execWithDstGuard({ confirmPreCutover: false, stateFile });
      } catch (e) {
        refused = /--confirm-pre-cutover/.test(e.message);
      }
    });
    record("exec --with-dst: refuses without --confirm-pre-cutover", refused);
  } catch (e) {
    record("exec --with-dst: refuses without --confirm-pre-cutover", false, String(e.stack || e));
  }

  // --- Scenario 2: STATE.status POST_CUTOVER / ROLLED_BACK / COMPLETE all
  // refuse exec --with-dst even with --confirm-pre-cutover, matching the
  // blocking finding this file was added to close (a post-cutover
  // `runner.mjs exec --with-dst -- pg_restore ...` must not silently wipe
  // the now-authoritative Neon target). ---
  for (const status of ["POST_CUTOVER", "ROLLED_BACK", "COMPLETE"]) {
    try {
      const stateFile = path.join(dir, `state-${status}.json`);
      writeFile(stateFile, JSON.stringify({ status, facts: {} }));
      let refused = false;
      await withEnv({ DST_URL: "postgresql://dst.example.com/db" }, async () => {
        try {
          await execWithDstGuard({ confirmPreCutover: true, stateFile });
        } catch (e) {
          refused = new RegExp(status).test(e.message);
        }
      });
      record(`exec --with-dst: refuses when STATE.status is ${status}`, refused);
    } catch (e) {
      record(`exec --with-dst: refuses when STATE.status is ${status}`, false, String(e.stack || e));
    }
  }

  // --- Scenario 3: facts.cutover.detectedAt set refuses exec --with-dst
  // even with --confirm-pre-cutover and a non-terminal STATE.status. ---
  try {
    const stateFile = path.join(dir, "state-detectedAt.json");
    writeFile(stateFile, JSON.stringify({ status: "IN_PROGRESS", facts: { cutover: { detectedAt: "2026-09-26T00:00:00Z" } } }));
    let refused = false;
    await withEnv({ DST_URL: "postgresql://dst.example.com/db" }, async () => {
      try {
        await execWithDstGuard({ confirmPreCutover: true, stateFile });
      } catch (e) {
        refused = /detectedAt/.test(e.message);
      }
    });
    record("exec --with-dst: refuses when facts.cutover.detectedAt is set", refused);
  } catch (e) {
    record("exec --with-dst: refuses when facts.cutover.detectedAt is set", false, String(e.stack || e));
  }

  // --- Scenario 4: exec --with-dst refuses when STATE.json is missing
  // entirely (no guard == refuse, never silently proceed). ---
  try {
    const missingStateFile = path.join(dir, "does-not-exist.json");
    let refused = false;
    await withEnv({ DST_URL: "postgresql://dst.example.com/db" }, async () => {
      try {
        await execWithDstGuard({ confirmPreCutover: true, stateFile: missingStateFile });
      } catch (e) {
        refused = /STATE\.json not found/.test(e.message);
      }
    });
    record("exec --with-dst: refuses when STATE.json is missing", refused);
  } catch (e) {
    record("exec --with-dst: refuses when STATE.json is missing", false, String(e.stack || e));
  }

  // --- Scenario 5: a DST_URL that is actually the source by identity (a
  // pooled alias) is refused before any of the above even runs. ---
  try {
    let refused = false;
    await withEnv(
      {
        SRC_URL: "postgresql://ep-foo.us-east-2.aws.neon.tech/db",
        DST_URL: "postgresql://ep-foo-pooler.us-east-2.aws.neon.tech/db",
      },
      async () => {
        try {
          assertDstIdentityIsSafe("selftest");
        } catch (e) {
          refused = /same host|Refusing to treat the source/.test(e.message);
        }
      }
    );
    record("exec --with-dst: a pooled-alias DST_URL matching the source is refused", refused);
  } catch (e) {
    record("exec --with-dst: a pooled-alias DST_URL matching the source is refused", false, String(e.stack || e));
  }

  rmSync(dir, { recursive: true, force: true });

  const allPass = results.every((r) => r.ok === true);
  const out = {
    checkedAt: new Date().toISOString(),
    note: "Pure guard-logic self-test for runner.mjs (no Vercel Sandbox spun up).",
    allPass,
    scenarios: results,
  };
  const json = JSON.stringify(out, null, 2);
  process.stdout.write(json + "\n");
  const outIdx = process.argv.indexOf("--out");
  if (outIdx !== -1) writeFileSync(process.argv[outIdx + 1], json);
  process.exitCode = allPass ? 0 : 1;
}

main().catch((e) => {
  console.error(String(e.stack || e));
  process.exitCode = 1;
});
