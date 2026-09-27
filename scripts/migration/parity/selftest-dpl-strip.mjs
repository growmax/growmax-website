#!/usr/bin/env node
// P8.3 tool-footgun self-test for normalizeHtmlNoise's `?dpl=` strip (lib/extract.mjs).
//
// The strip regex used to be /[?&]dpl=[^&"'\s]+/, whose value class also consumed a
// backslash. Inside embedded RSC flight data (self.__next_f.push([1,"..."]) JS string
// literals) a Vercel ref ends in an ESCAPED quote, `...js?dpl=dpl_abc\"`, so the old strip
// turned `\"` into `"`, closing the JS string literal early: joinFlightPushStrings lost the
// push, extractEmbeddedBlogPosts threw, and the tie-permutation proof failed on every
// Vercel-served /blog page. The value class now also stops at a backslash.
//
// Cases:
//   (1) an escaped-quote RSC payload with ?dpl= parses after normalizeHtmlNoise, to the same
//       posts as the raw body, with no dpl left; the old regex (inlined here) breaks it, so
//       this case would catch a regression;
//   (2) the /blog tie-permutation self-compare on that normalized payload passes;
//   (3) plain HTML attribute dpl values are stripped exactly as before (fixed expected
//       strings, and identical to the old regex's output);
//   (4) randomized: for inputs with no backslash, the new and old regex give identical
//       output (the fix only changes inputs where a backslash follows a dpl value).
//
// No network, no database. Usage: node selftest-dpl-strip.mjs [--out <evidence.json>]
// Exit code 0 only if every case passes.

import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { normalizeHtmlNoise, extractEmbeddedBlogPosts } from './lib/extract.mjs'
import { checkPageTiePermutation } from './tie-permutation.mjs'

const DPL = 'dpl_SelftestOnly000000000000000'

/** The pre-fix normalizeHtmlNoise, verbatim, for the "old vs new" comparisons only. */
function oldNormalizeHtmlNoise(html) {
  return html
    .replace(/\/_next\/static\/[^/"'\s]+\//g, '/_next/static/<build>/')
    .replace(/[?&]dpl=[^&"'\s]+/g, '')
    .replace(/\snonce=["'][^"']*["']/g, '')
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) out[a.slice(2)] = true
    else {
      out[a.slice(2)] = next
      i++
    }
  }
  return out
}

const POSTS = [
  { id: 2, title: 'Second "quoted" post', category: 'Eng', date: '2026-02-01', slug: 'second-post', author: 'A', excerpt: 'x', published: true },
  { id: 1, title: 'First post', category: 'Eng', date: '2026-01-01', slug: 'first-post', author: 'B', excerpt: 'y', published: true },
]
const CREATED_AT_BY_SLUG = { 'second-post': '2026-02-01T00:00:00.000Z', 'first-post': '2026-01-01T00:00:00.000Z' }

/** A Vercel-shaped /blog body: <link>/<script> attrs with ?dpl= plus an RSC flight payload
 *  whose import row ("I[...]") lists chunk refs with ?dpl= right before an escaped quote,
 *  in the SAME push() string literal as the post list row (as on the live page). */
function vercelBlogHtml() {
  const chunk = (n) => `static/chunks/${n}-0123456789abcdef.js?dpl=${DPL}`
  const importRow = `2:I[1402,${JSON.stringify(['2619', chunk(2619), '5330', chunk(5330)])},"default"]\n`
  const postsRow = `3:${JSON.stringify(['$', '$L2', null, { initialPosts: POSTS }])}\n`
  const pushLiteral = JSON.stringify(importRow + postsRow) // escapes every " as \"
  return (
    '<!DOCTYPE html><html lang="en"><head>' +
    `<link rel="stylesheet" href="/_next/static/css/b5162b0c557fcf76.css?dpl=${DPL}" data-precedence="next"/>` +
    `<script src="/_next/static/chunks/webpack-725eb186f623cc2b.js?dpl=${DPL}" async=""></script>` +
    '</head><body><main><h1>Blog</h1></main>' +
    `<script>self.__next_f.push([1,${pushLiteral}])</script>` +
    '</body></html>'
  )
}

const cases = [
  [
    'escaped-quote-rsc-payload-with-dpl-parses',
    () => {
      const raw = vercelBlogHtml()
      const precondition = raw.includes(`?dpl=${DPL}\\"`) // the footgun shape is present
      const normalized = normalizeHtmlNoise(raw)
      const rawPosts = extractEmbeddedBlogPosts(raw)
      let normalizedPosts = null
      let normalizedError = null
      try {
        normalizedPosts = extractEmbeddedBlogPosts(normalized)
      } catch (err) {
        normalizedError = String(err.message || err)
      }
      let oldError = null
      try {
        extractEmbeddedBlogPosts(oldNormalizeHtmlNoise(raw))
      } catch (err) {
        oldError = String(err.message || err)
      }
      const samePosts = JSON.stringify(normalizedPosts) === JSON.stringify(rawPosts) && JSON.stringify(rawPosts) === JSON.stringify(POSTS)
      const dplGone = !normalized.includes('dpl=')
      const escapesKept = normalized.includes('0123456789abcdef.js\\"')
      return {
        pass: precondition && samePosts && dplGone && escapesKept && oldError !== null,
        detail: { precondition, samePosts, dplGone, escapesKept, normalizedError, oldRegexBreaksIt: oldError },
      }
    },
  ],
  [
    'blog-tie-permutation-self-compare-on-normalized-vercel-payload',
    () => {
      const normalized = normalizeHtmlNoise(vercelBlogHtml())
      const r = checkPageTiePermutation({
        url: '/blog',
        kind: 'blog-embedded-json',
        rawTextA: normalized,
        rawTextB: normalized,
        createdAtBySlug: CREATED_AT_BY_SLUG,
      })
      const oldNormalized = oldNormalizeHtmlNoise(vercelBlogHtml())
      const rOld = checkPageTiePermutation({
        url: '/blog',
        kind: 'blog-embedded-json',
        rawTextA: oldNormalized,
        rawTextB: oldNormalized,
        createdAtBySlug: CREATED_AT_BY_SLUG,
      })
      return { pass: r.pass === true && rOld.pass === false, detail: { newPass: r.pass, newReason: r.reason, oldPass: rOld.pass, oldReason: rOld.reason } }
    },
  ],
  [
    'plain-html-attribute-dpl-values-stripped-identically',
    () => {
      const inputs = [
        [`<link rel="stylesheet" href="/_next/static/css/a.css?dpl=${DPL}" data-precedence="next"/>`, '<link rel="stylesheet" href="/_next/static/<build>/a.css" data-precedence="next"/>'],
        [`<script src='/_next/static/chunks/b.js?dpl=${DPL}' async></script>`, "<script src='/_next/static/<build>/b.js' async></script>"],
        [`<img src="/x.png?v=2&dpl=${DPL}&w=64">`, '<img src="/x.png?v=2&w=64">'],
        [`<img src="/x.png?dpl=${DPL}&w=64">`, '<img src="/x.png&w=64">'],
        [`<a href=/p?dpl=${DPL} class=x>`, '<a href=/p class=x>'],
        [`<img srcset="/a.png?dpl=${DPL} 1x, /b.png?dpl=${DPL} 2x">`, '<img srcset="/a.png 1x, /b.png 2x">'],
        [`<link href="/_next/static/abcBuildId/_buildManifest.js?dpl=${DPL}">`, '<link href="/_next/static/<build>/_buildManifest.js">'],
        ['<script nonce="abc123">x</script><a href="/no-dpl?q=1">', '<script>x</script><a href="/no-dpl?q=1">'],
        [`<a href="/p?adpl=keep&dpl=">`, '<a href="/p?adpl=keep&dpl=">'],
      ]
      const rows = inputs.map(([input, expected]) => {
        const got = normalizeHtmlNoise(input)
        const old = oldNormalizeHtmlNoise(input)
        return { input, expected, got, ok: got === expected && got === old }
      })
      return { pass: rows.every((r) => r.ok), detail: { failing: rows.filter((r) => !r.ok), total: rows.length } }
    },
  ],
  [
    'randomized-backslash-free-inputs-unchanged-vs-old-regex',
    () => {
      // Deterministic LCG so a failure is reproducible.
      let seed = 0x5eed1234
      const rand = (n) => {
        seed = (Math.imul(seed, 1103515245) + 12345) >>> 0
        return seed % n
      }
      const alphabet = ['?', '&', 'dpl=', 'dpl_', '"', "'", ' ', '\n', '\t', 'a', 'Z', '9', '/', '=', '_', '-', '.', '<', '>', 'nonce=', '/_next/static/', 'x']
      let mismatches = []
      for (let i = 0; i < 20000; i++) {
        let s = ''
        const len = 1 + rand(40)
        for (let j = 0; j < len; j++) s += alphabet[rand(alphabet.length)]
        if (normalizeHtmlNoise(s) !== oldNormalizeHtmlNoise(s)) mismatches.push(s)
      }
      return { pass: mismatches.length === 0, detail: { samples: 20000, mismatches: mismatches.slice(0, 5) } }
    },
  ],
]

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const checks = []
  for (const [name, fn] of cases) {
    try {
      const r = await fn()
      checks.push({ name, pass: !!r.pass, detail: r.detail })
    } catch (err) {
      checks.push({ name, pass: false, detail: { error: String(err.stack || err) } })
    }
  }
  const pass = checks.every((c) => c.pass)
  const passed = checks.filter((c) => c.pass).length
  if (args.out) {
    await mkdir(path.dirname(args.out), { recursive: true })
    await writeFile(args.out, JSON.stringify({ kind: 'P8.3-dpl-strip-selftest', generatedAt: new Date().toISOString(), pass, passed, total: checks.length, checks }, null, 2))
  }
  console.log(`dpl-strip self-test: ${pass ? 'PASS' : 'FAIL'} (${passed}/${checks.length})`)
  for (const c of checks) {
    console.log(`  ${c.pass ? 'PASS' : 'FAIL'}  ${c.name}`)
    if (!c.pass) console.log(`        ${JSON.stringify(c.detail).slice(0, 1500)}`)
  }
  console.log(`SUMMARY selftest-dpl-strip.mjs: ${passed}/${checks.length} PASS, ${checks.length - passed} FAIL, 0 DEFERRED`)
  process.exit(pass ? 0 : 1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
