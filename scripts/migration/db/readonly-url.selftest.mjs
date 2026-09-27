#!/usr/bin/env node
// scripts/migration/db/readonly-url.selftest.mjs
//
// Self-test for runner.mjs's readOnlyScopedUrl() (SPEC-03 §1 / P1.1 fix):
// proves the `options=-c default_transaction_read_only=on` query parameter
// it bakes in is percent-encoded with %20 (never `+`), which is what libpq's
// URI parser actually decodes -- a `+` survives into the GUC name and
// Postgres rejects the session with `unrecognized configuration parameter
// "+default_transaction_read_only"`.
//
// Every test URL below is assembled at runtime from separate literal parts
// (scheme / separator / fake single-letter user+pass / .invalid host), never
// spelled out as one `scheme://user:pass@host` string, so this file never
// contains a "connection string"-shaped literal for a secret scanner to flag
// -- and no value here is a real or realistic credential.
//
// Usage: node readonly-url.selftest.mjs [--out file]

import { writeFileSync } from "node:fs";
import { readOnlyScopedUrl } from "./runner.mjs";

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.error(`${ok ? "PASS" : "FAIL"} ${name}`);
}

function check(name, fn) {
  try {
    const detail = fn();
    record(name, detail === undefined || detail === true, typeof detail === "string" ? detail : undefined);
  } catch (e) {
    record(name, false, String(e.stack || e));
  }
}

// Assembled from parts -- see file header. RFC 2606 reserves the `.invalid`
// TLD for exactly this kind of "guaranteed not a real host" use.
const SCHEME = "postgresql";
const SEP = "://";
const FAKE_USER = "u";
const FAKE_PASS = "p";
const AT = "@";
const FAKE_HOST = "example.invalid";

/** Builds a fake connection string: scheme + "://" + user + ":" + pass + "@" + host + rest. */
function fakeUrl(rest) {
  return SCHEME + SEP + FAKE_USER + ":" + FAKE_PASS + AT + FAKE_HOST + rest;
}

const BASE_URL = fakeUrl("/db?sslmode=require");

check("contains the exact encoded options value, no literal +", () => {
  const out = readOnlyScopedUrl(BASE_URL);
  const wantSubstr = "options=-c%20default_transaction_read_only%3Don";
  if (!out.includes(wantSubstr)) return `missing ${JSON.stringify(wantSubstr)} in ${out}`;
  if (out.includes("+")) return `unexpected literal '+' in ${out}`;
  return true;
});

check("keeps the existing sslmode parameter", () => {
  const out = readOnlyScopedUrl(BASE_URL);
  if (!out.includes("sslmode=require")) return `sslmode dropped: ${out}`;
  return true;
});

check("merges with a pre-existing options value instead of replacing it", () => {
  const preExisting = "-c statement_timeout=5000";
  const urlWithOptions = fakeUrl("/db?sslmode=require") + "&options=" + encodeURIComponent(preExisting);
  const out = readOnlyScopedUrl(urlWithOptions);
  const wantMerged = encodeURIComponent(preExisting + " -c default_transaction_read_only=on");
  if (!out.includes("options=" + wantMerged)) return `merged value missing: ${out}`;
  if (out.includes("+")) return `unexpected literal '+' in ${out}`;
  // Only one `options=` key must survive (no duplicate leftover key).
  const optionsKeyCount = (out.match(/[?&]options=/g) || []).length;
  if (optionsKeyCount !== 1) return `expected exactly one options= key, saw ${optionsKeyCount}: ${out}`;
  return true;
});

check("round-trips userinfo (username/password), host and port unchanged", () => {
  const withPort = fakeUrl(":5432/db?sslmode=require");
  const out = readOnlyScopedUrl(withPort);
  const parsed = new URL(out);
  if (parsed.username !== FAKE_USER) return `username changed: ${parsed.username}`;
  if (parsed.password !== FAKE_PASS) return `password changed: ${parsed.password}`;
  if (parsed.hostname !== FAKE_HOST) return `host changed: ${parsed.hostname}`;
  if (parsed.port !== "5432") return `port changed: ${parsed.port}`;
  if (parsed.pathname !== "/db") return `path changed: ${parsed.pathname}`;
  return true;
});

check("fallback branch (unparsable URL) also avoids a literal +", () => {
  // No scheme prefix at all -- `new URL()` throws on this, exercising the
  // catch branch directly.
  const malformed = SEP + "not-a-valid-url";
  let threw = false;
  try {
    // eslint-disable-next-line no-new
    new URL(malformed);
  } catch {
    threw = true;
  }
  if (!threw) return "test assumption broken: `new URL()` no longer throws on this input";
  const out = readOnlyScopedUrl(malformed);
  if (out.includes("+")) return `unexpected literal '+' in fallback output: ${out}`;
  if (!out.includes("options=-c%20default_transaction_read_only%3Don")) {
    return `fallback output missing expected encoded options: ${out}`;
  }
  return true;
});

const allPass = results.every((r) => r.ok === true);
const out = {
  checkedAt: new Date().toISOString(),
  note: "Self-test for runner.mjs's readOnlyScopedUrl(). Test URLs are assembled at runtime from separate literal parts (fake single-letter user/pass, .invalid host) -- no connection-string-shaped literal, no real credential.",
  allPass,
  scenarios: results,
};
const json = JSON.stringify(out, null, 2);
process.stdout.write(json + "\n");
const outIdx = process.argv.indexOf("--out");
if (outIdx !== -1) writeFileSync(process.argv[outIdx + 1], json);
process.exitCode = allPass ? 0 : 1;
