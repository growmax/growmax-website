#!/usr/bin/env node
// SPEC-04 §3: fetch every URL in an inventory and extract a manifest.
//
// Usage:
//   node capture.mjs --base <origin> --urls <inventory.json> --out <manifest.json> \
//     [--raw-dir <dir>] [--bypass-secret-file <f>] [--resolve host:443:ip ...] \
//     [--concurrency 4] [--ua "growmax-migration-verifier/1.0"] [--compact]
//
// --compact (A1 C9): /api/blog is stored as a per-slug sha256 + jsonArrayLength + a slug
// multiset instead of the full canonical JSON; other bulky text fields become a hash + a
// short preview. Raw bodies still go to --raw-dir regardless of --compact. compare.mjs
// handles full vs full, compact vs full and full vs compact without needing this flag.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fetchOnce, buildResolveDispatcher, normalizeLocation } from './lib/fetcher.mjs'
import {
  extractHtml,
  extractSitemap,
  extractEmbeddedBlogPosts,
  normalizeText,
  sha256,
  sha256Text,
  canonicalStringify,
  safeFileName,
  decodeImageDimensions,
} from './lib/extract.mjs'

const COMPACT_TEXT_PREVIEW_CHARS = 300

/**
 * A1 C9 (compact manifest mode): the per-slug + array-level compact fields for /api/blog,
 * derived from the ALREADY-PARSED array — same canonicalisation (canonicalStringify) as
 * full mode's per-slug strings, just hashed instead of kept verbatim. Exported so
 * selftest.mjs can derive a compact manifest offline (from an already-captured full
 * manifest's raw bytes) through this exact same code path, without a second live capture.
 */
export function buildCompactBlogArrayFields(parsed) {
  const jsonBySlugHash = {}
  const slugMultiset = {}
  for (const item of parsed) {
    if (item && item.slug) {
      jsonBySlugHash[item.slug] = sha256Text(canonicalStringify(item))
      slugMultiset[item.slug] = (slugMultiset[item.slug] || 0) + 1
    }
  }
  return { jsonArrayLength: parsed.length, jsonBySlugHash, slugMultiset }
}

/** Compact-mode fields for a bulky text/plain body (e.g. llms-full.txt): a hash for
 *  comparison plus a short preview for diagnostics, instead of the full normalized text. */
export function buildCompactTextFields(normalizedText) {
  return { textHash: sha256Text(normalizedText), textPreview: normalizedText.slice(0, COMPACT_TEXT_PREVIEW_CHARS) }
}

// SPEC-04 addendum (pre-existing coverage gap, reviewer recommendation before P5.2): /blog
// and /blog?page=N (and no other page — verified: the home page embeds no such array) render
// their post list entirely client-side from an RSC-embedded prop. Scoped narrowly to these
// two URL shapes so this never runs (and never risks a false ambiguous-array error) on any
// other page.
// Exported so compare.mjs's checkEmbeddedPostsCoverage() checks the SAME URL shape a real
// capture attempted extraction on, rather than a second, potentially-drifting copy.
export const EMBEDDED_POST_LIST_URL_RE = /^\/blog(?:\?page=\d+)?$/

/** Full-mode fields for a page's embedded post list: the ordered slug list plus a per-slug
 *  canonical-JSON map, mirroring buildCompactBlogArrayFields's shape for /api/blog so
 *  compare.mjs can reuse the same "hash a full-mode side on the fly" pattern. Exported (like
 *  buildCompactEmbeddedPostsFields) so selftest.mjs can build both modes' mutation fixtures
 *  through this exact same code path. */
export function buildFullEmbeddedPostsFields(posts) {
  const embeddedPostsBySlug = {}
  for (const item of posts) if (item && item.slug) embeddedPostsBySlug[item.slug] = canonicalStringify(item)
  return { embeddedPostsSlugOrder: posts.map((p) => p.slug), embeddedPostsBySlug }
}

/** Compact-mode fields for a page's embedded post list: the ordered slug list plus a
 *  per-slug sha256 map, instead of the full canonical JSON per post. Exported so selftest.mjs
 *  can derive a compact manifest offline through this exact same code path. */
export function buildCompactEmbeddedPostsFields(posts) {
  const embeddedPostsBySlugHash = {}
  for (const item of posts) if (item && item.slug) embeddedPostsBySlugHash[item.slug] = sha256Text(canonicalStringify(item))
  return { embeddedPostsSlugOrder: posts.map((p) => p.slug), embeddedPostsBySlugHash }
}

const KNOWN_HOSTS = ['www.growmax.io', 'growmax.io', '*.vercel.app']

function parseArgs(argv) {
  const out = { resolve: [] }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const key = a.slice(2)
    const next = argv[i + 1]
    if (key === 'resolve') {
      out.resolve.push(next)
      i++
      continue
    }
    if (next === undefined || next.startsWith('--')) {
      out[key] = true
    } else {
      out[key] = next
      i++
    }
  }
  return out
}

function classifyContentType(contentType) {
  return (contentType || '').split(';')[0].trim().toLowerCase()
}

async function captureOne(entry, base, opts) {
  const { dispatcher, bypassSecret, ua, rawDir, compact = false } = opts
  const target = /^https?:\/\//.test(entry.url) ? entry.url : new URL(entry.url, base).toString()

  // Most entries are same-site relative URLs, but the post-cutover set (SPEC-04 §2.8) is
  // absolute (http://www.growmax.io/, https://growmax.io/, ...) and reaches a third-party
  // host (Squarespace pre-cutover, or growmax.io itself once DNS moves) — never send the
  // Vercel protection-bypass secret there (per review); only the Vercel deployment host
  // being captured (`base`) is ever meant to see it.
  const targetIsBaseHost = new URL(target).host === new URL(base).host
  const effectiveBypassSecret = targetIsBaseHost ? bypassSecret : undefined

  const r = await fetchOnce(target, { dispatcher, bypassSecret: effectiveBypassSecret, ua })
  if (!r.ok) {
    return {
      url: entry.url,
      source: entry.source,
      error: String(r.error?.message || r.error || 'fetch failed'),
      attempts: r.attempts,
      ...(entry.expect ? { expect: entry.expect } : {}),
    }
  }

  const { res, buf, attempts } = r
  const contentType = classifyContentType(res.headers.get('content-type'))
  const location = normalizeLocation(res.headers.get('location'), target, KNOWN_HOSTS)

  const record = {
    url: entry.url,
    source: entry.source,
    status: res.status,
    location,
    contentType,
    headers: {
      'x-robots-tag': res.headers.get('x-robots-tag'),
      'cache-control': res.headers.get('cache-control'),
      'content-encoding': res.headers.get('content-encoding'),
      'strict-transport-security': res.headers.get('strict-transport-security'),
    },
    bytes: buf.length,
    sha256: sha256(buf),
    attempts,
    ...(entry.expect ? { expect: entry.expect } : {}),
  }

  if (rawDir) {
    const safeName = safeFileName(entry.url)
    await mkdir(rawDir, { recursive: true })
    await writeFile(path.join(rawDir, `${safeName}.bin`), buf)
  }

  // Redirect (3xx) stub bodies are not spec-relevant to diff: SPEC-04 §4's compare table
  // only asks for status/location/contentType/x-robots-tag on every response, and body-level
  // fields for 2xx HTML / sitemap / JSON / text. Empirically, Next.js's redirect responses on
  // this site sometimes report `content-type: text/plain` and sometimes `text/html` for the
  // *exact same*, correct {status, location, body} — confirmed by repeated concurrent sampling
  // where only the header flips while the tiny stub body (the destination path) never changes
  // and never leaks between URLs. That's real, pre-existing origin non-determinism, invisible
  // to users/search engines (they act on Location + status, not a redirect's body or its
  // content-type). So it's never treated as parity-significant for 3xx (see compare.mjs).
  const isRedirect = res.status >= 300 && res.status < 400
  if (isRedirect) return record

  // HTML extraction (only for 2xx HTML documents; 404s only need status+title per §4).
  if (contentType === 'text/html') {
    try {
      const html = buf.toString('utf8')
      const extracted = extractHtml(html, target)
      record.html = extracted.fields
      record.jsonLdHash = extracted.jsonLdHash
      record.visibleTextHash = extracted.visibleTextHash
      record.internalLinks = extracted.internalLinks
      record.images = extracted.images
      record.assetRefs = extracted.assetRefs
      if (rawDir) {
        const safeName = safeFileName(entry.url)
        record.rawTextFile = `${safeName}.text.txt`
        await writeFile(path.join(rawDir, `${safeName}.text.txt`), extracted.visibleText)
      }

      // SPEC-04 addendum: /blog + /blog?page=N embed their post list as an RSC prop, never
      // as HTML the rest of this extraction can see (0/172 titles, 0 /blog/<slug> links).
      // A parse failure here is its OWN error field, separate from htmlError, so it can
      // never be silently absent the way an empty [] would be — and it never discards the
      // rest of `record.html` that DID extract successfully.
      if (EMBEDDED_POST_LIST_URL_RE.test(entry.url)) {
        try {
          const posts = extractEmbeddedBlogPosts(html)
          Object.assign(record, compact ? buildCompactEmbeddedPostsFields(posts) : buildFullEmbeddedPostsFields(posts))
        } catch (err) {
          record.embeddedPostsError = String(err.message || err)
        }
      }
    } catch (err) {
      record.htmlError = String(err.message || err)
    }
  } else if (contentType === 'application/xml' || contentType === 'text/xml' || entry.url.endsWith('.xml')) {
    try {
      record.sitemapEntries = extractSitemap(buf.toString('utf8'))
    } catch (err) {
      record.xmlError = String(err.message || err)
    }
  } else if (contentType === 'application/json') {
    try {
      const parsed = JSON.parse(buf.toString('utf8'))
      const isBlogArray = entry.url === '/api/blog' && Array.isArray(parsed)
      if (compact && isBlogArray) {
        // A1 C9 (compact manifest mode): drop the duplicated whole-array canonical string
        // and the full per-slug canonical strings (up to several MB each for /api/blog);
        // keep jsonArrayLength + a slug multiset + a per-slug sha256, which is everything
        // compare.mjs needs to still detect a changed field, array length or slug set.
        Object.assign(record, buildCompactBlogArrayFields(parsed))
      } else {
        record.jsonCanonical = canonicalStringify(parsed)
        record.jsonHash = sha256(Buffer.from(record.jsonCanonical, 'utf8'))
        // /api/blog is compared per-slug with every field preserved. jsonBySlug alone drops
        // slug-less items and collapses duplicate slugs (per review), so also record the raw
        // array length: compare.mjs compares it (and the multiset of slugs) alongside the
        // per-slug diffs, so a duplicated or slug-less item on either side still surfaces.
        if (isBlogArray) {
          record.jsonArrayLength = parsed.length
          record.jsonBySlug = {}
          for (const item of parsed) {
            if (item && item.slug) record.jsonBySlug[item.slug] = canonicalStringify(item)
          }
        } else {
          record.json = parsed
        }
      }
    } catch (err) {
      record.jsonError = String(err.message || err)
    }
  } else if (contentType === 'text/plain') {
    const normalized = normalizeText(buf.toString('utf8'))
    if (compact) {
      // A1 C9: other bulky fields (e.g. llms-full.txt's full text dump) become a hash too,
      // with a short preview kept for diagnostics rather than the full body.
      Object.assign(record, buildCompactTextFields(normalized))
    } else {
      record.text = normalized
    }
  }

  return record
}

async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length)
  let idx = 0
  async function worker() {
    while (true) {
      const i = idx++
      if (i >= items.length) return
      results[i] = await fn(items[i], i)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return results
}

/**
 * Fetch every unique same-site asset referenced by any captured page (SPEC-04 §3): the
 * `assetRefs` extract.mjs collects (img src/srcset, <source srcset>, link icon/preload/
 * stylesheet), none of which any other part of the harness ever fetches. Records
 * status + contentType for every ref, plus a sha256 for anything that isn't a hashed
 * /_next/static/<build>/... name (those are compared by status only — see compare.mjs).
 * A missing public/ asset, a broken image optimizer (400/500), or a 404'd JS/CSS chunk all
 * surface here instead of passing silently.
 */
async function captureAssets({ entries, base, dispatcher, bypassSecret, ua, concurrency = 4 }) {
  const refs = new Set()
  for (const e of entries) {
    for (const ref of e.assetRefs || []) refs.add(ref)
  }
  const refList = [...refs]
  const fetched = await mapWithConcurrency(refList, concurrency, async (ref) => {
    const target = new URL(ref, base).toString()
    const r = await fetchOnce(target, { dispatcher, bypassSecret, ua })
    if (!r.ok)
      return { ref, entry: { error: String(r.error?.message || r.error || 'fetch failed'), attempts: r.attempts } }
    const contentType = classifyContentType(r.res.headers.get('content-type'))
    const isHashedNext = /^\/_next\/static\//.test(ref)
    const isNextImage = /^\/_next\/image(?:\?|$)/.test(ref)
    const entry = { status: r.res.status, contentType, attempts: r.attempts }
    if (isNextImage) {
      // Replit's Next/sharp optimizer and Vercel's own Image Optimization never emit
      // byte-identical output for the same source+params, so sha256 always "fails" here
      // regardless of migration health — record decoded dimensions instead (see compare.mjs,
      // which compares /_next/image by status/contentType/dimensions, never sha256).
      const dim = decodeImageDimensions(r.buf)
      if (dim) {
        entry.width = dim.width
        entry.height = dim.height
      }
    } else if (!isHashedNext) {
      entry.sha256 = sha256(r.buf)
    } else if (contentType === 'text/css') {
      // Per review: a hashed /_next/static/... ref was only ever checked for 2xx (a
      // different, unrelated build legitimately uses a different filename), so a real CSS
      // content regression was never caught. CSS is textual and content-hashed by Next.js
      // itself, so hashing the fetched bytes here and comparing the multiset of CSS sha256s
      // across sides (compare.mjs's compareAssetMaps) is cheap and name-independent.
      entry.sha256 = sha256(r.buf)
    }
    return { ref, entry }
  })
  const assets = {}
  for (const { ref, entry } of fetched) assets[ref] = entry
  return assets
}

export async function capture({ base, urls, rawDir, bypassSecretFile, resolve, concurrency = 4, ua, compact = false }) {
  const bypassSecret = bypassSecretFile ? (await readFile(bypassSecretFile, 'utf8')).trim() : undefined
  const dispatcher = await buildResolveDispatcher(resolve)

  const results = await mapWithConcurrency(urls, concurrency, (entry) =>
    captureOne(entry, base, { dispatcher, bypassSecret, ua, rawDir, compact }),
  )

  const assets = await captureAssets({ entries: results, base, dispatcher, bypassSecret, ua, concurrency })

  return {
    capturedAt: new Date().toISOString(),
    base,
    count: results.length,
    entries: results,
    assets,
    compact: !!compact,
    // Manifest-level marker (per review): declares this manifest came from capture code
    // that ATTEMPTS embeddedPosts extraction for /blog-like URLs, so compare.mjs's
    // checkEmbeddedPostsCoverage() can require it there without misjudging an OLDER
    // manifest (captured before this feature existed) by a rule it couldn't have satisfied.
    harness: { embeddedPosts: 1 },
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!args.base || !args.urls || !args.out) {
    console.error(
      'Usage: node capture.mjs --base <origin> --urls <inventory.json> --out <manifest.json> ' +
        '[--raw-dir <dir>] [--bypass-secret-file <f>] [--resolve host:443:ip] [--concurrency 4] ' +
        '[--ua <ua>] [--compact]',
    )
    process.exit(2)
  }
  const inventory = JSON.parse(await readFile(args.urls, 'utf8'))
  const urlEntries = inventory.urls || inventory.list || inventory
  const manifest = await capture({
    base: args.base,
    urls: urlEntries,
    rawDir: args['raw-dir'],
    bypassSecretFile: args['bypass-secret-file'],
    resolve: args.resolve,
    concurrency: args.concurrency ? Number(args.concurrency) : 4,
    ua: args.ua,
    compact: !!args.compact,
  })
  await mkdir(path.dirname(args.out), { recursive: true })
  await writeFile(args.out, JSON.stringify(manifest, null, 2))
  const errors = manifest.entries.filter((e) => e.error).length
  console.log(`Captured ${manifest.count} URLs (${errors} fetch errors) -> ${args.out}`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
