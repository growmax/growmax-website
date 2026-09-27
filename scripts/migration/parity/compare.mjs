#!/usr/bin/env node
// SPEC-04 §4: compare manifest A vs manifest B (+ allowlist) -> diff.json.
// Exit code 0 only if failedUnallowed == 0.

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { realpathSync } from 'node:fs'
import path from 'node:path'
import { createTwoFilesPatch, firstNLines } from './lib/diff.mjs'
import { sha256Text, normalizeText, safeFileName, CANONICAL_PRODUCTION_HOSTS } from './lib/extract.mjs'
import { EMBEDDED_POST_LIST_URL_RE } from './capture.mjs'

// A1 C10: /api/blog is ~50% of Vercel's 4.5MB function body cap at 171 posts (~2.27MB); a
// WARNING (never a failure) above this threshold at ~260 posts gives advance notice. Exact
// value from the advisor text (A1-advisor.json condition C10's "3.5MB"), not an approximation.
const BLOG_API_SIZE_WARNING_BYTES = 3_500_000

/** A1 C10: always record /api/blog's decoded byte size + array length for BOTH sides (never
 *  only when over the threshold — the reviewer needs the numbers to judge trend, not just a
 *  boolean), and warn (never fail) whichever side(s) exceed the threshold. `bytes` and
 *  `jsonArrayLength` are captured in both full and compact mode (see capture.mjs), so this
 *  needs no mode awareness. */
function checkBlogApiSize(manifestA, manifestB) {
  const sizes = {}
  const warnings = []
  for (const [side, manifest] of [['a', manifestA], ['b', manifestB]]) {
    const e = manifest?.entries?.find((entry) => entry.url === '/api/blog')
    sizes[side] = {
      present: !!e,
      bytes: typeof e?.bytes === 'number' ? e.bytes : null,
      jsonArrayLength: typeof e?.jsonArrayLength === 'number' ? e.jsonArrayLength : null,
    }
    if (e && typeof e.bytes === 'number' && e.bytes > BLOG_API_SIZE_WARNING_BYTES) {
      warnings.push({ side, url: '/api/blog', bytes: e.bytes, arrayLength: e.jsonArrayLength ?? null, thresholdBytes: BLOG_API_SIZE_WARNING_BYTES })
    }
  }
  return { sizes, warnings, thresholdBytes: BLOG_API_SIZE_WARNING_BYTES }
}

const REPORT_ONLY_HEADERS = new Set([
  'cache-control',
  'content-encoding',
  'strict-transport-security',
  'server',
  'age',
  'date',
  'etag',
])

const DATE_RE = /\b(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{2,4}|Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b/i

function fieldCategory(field) {
  if (field === 'presence') return 'other'
  if (field === 'status') return 'status'
  if (field === 'location') return 'redirect'
  if (field === 'x-robots-tag') return 'seo'
  if (['title', 'description', 'robots', 'canonical', 'lang', 'ogTwitter', 'jsonLdHash', 'sitemapEntries'].includes(field))
    return 'seo'
  if (['h1s', 'visibleTextHash', 'internalLinks', 'images', 'json', 'jsonBySlug', 'text'].includes(field))
    return 'content'
  return 'other'
}

function isEqualJson(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}

const HASHED_ASSET_PREFIX_RE = /^\/_next\/static\/[^/]+\//
const NEXT_IMAGE_RE = /^\/_next\/image(?:\?|$)/

const HEX_RUN_RE = /[0-9a-f]{8,}/gi

/**
 * Normalize a build-hashed /_next/static/... ref to a stable placeholder, for comparing
 * asset REFERENCES (not the assets themselves — see compareAssetMaps) across two different
 * builds. Two substitutions, both needed:
 *  - the per-build directory segment right after /_next/static/ (e.g. a buildId directory
 *    for /_next/static/<buildId>/_buildManifest.js) — the same substitution
 *    normalizeHtmlNoise (extract.mjs) applies for hashing/comparing HTML text;
 *  - any 8+ character hex run embedded IN THE FILENAME ITSELF (e.g.
 *    /_next/static/chunks/1255-b28ea36bf0cdbd65.js), which normalizeHtmlNoise's
 *    directory-only substitution leaves untouched — Next.js content-hashes chunk/css/media
 *    filenames this way, and that hash changes on every build that touches the chunk's
 *    content even when the directory segment ("chunks", "css", "media", ...) does not.
 *    Without this second step, comparing hashed assetRefs by name would fail on every
 *    single deploy (SPEC-02's own changes included), pushing operators toward broad
 *    allowlist entries that also hide a genuinely missing/renamed chunk.
 * Scoped to /_next/static/ refs only — an ordinary (non-hashed) asset ref, a `/_next/image`
 * query string, or any other same-site path is returned unchanged.
 */
/**
 * Strip only the `dpl` query parameter (Vercel's skew-protection deployment id, appended to
 * every script/css/preload URL it serves) from an assetRef, at COMPARE time only — capture.mjs
 * still fetches the ref's real, un-stripped URL (dpl is required for the request to actually
 * resolve on Vercel), and extract.mjs still keeps assetRefs raw for that reason (see there).
 * Every other query parameter, and their relative order, is left exactly as captured: only the
 * literal key `dpl` is removed (via URLSearchParams, so a value is never guessed/assumed), and
 * a trailing empty `?` is dropped rather than left dangling. A different asset path, a changed
 * non-dpl parameter, or an added/removed asset are untouched by this and still diff normally.
 */
function stripDplQueryParam(ref) {
  const qIndex = ref.indexOf('?')
  if (qIndex === -1) return ref
  const pathPart = ref.slice(0, qIndex)
  const params = new URLSearchParams(ref.slice(qIndex + 1))
  if (!params.has('dpl')) return ref
  params.delete('dpl')
  const rest = params.toString()
  return rest ? `${pathPart}?${rest}` : pathPart
}

function normalizeAssetRef(ref) {
  const deployed = stripDplQueryParam(ref)
  if (!HASHED_ASSET_PREFIX_RE.test(deployed)) return deployed
  return deployed.replace(HASHED_ASSET_PREFIX_RE, '/_next/static/<build>/').replace(HEX_RUN_RE, '<hash>')
}

function normalizeAssetRefList(refs) {
  return (refs || []).map(normalizeAssetRef)
}

/**
 * Reclassify one side's internal/external links the way a fixed isSameSite (extract.mjs)
 * would have, entirely from what's already in the manifest — no raw HTML re-extraction (and
 * so no rawDir dependency) needed. `externalLinks` entries are full absolute URLs (their host
 * is recoverable directly); `internalLinks` entries are already path+search only. A
 * byte-identical absolute href to one of CANONICAL_PRODUCTION_HOSTS (www.growmax.io /
 * growmax.io) that landed in `externalLinks` — because the page was captured from a
 * non-canonical host (e.g. growmax-website.vercel.app), or because this manifest predates
 * this fix — moves into `internalLinks` as path+search, matching how the identical href is
 * already classified on a side captured from a canonical host. This is what lets comparing
 * two manifests captured from DIFFERENT origins (or an older manifest against a newer one)
 * treat a byte-identical link the same way regardless of which origin captured which side,
 * without needing to re-capture. A third-party host is left in `externalLinks` untouched; a
 * genuinely different internal path is unaffected (still diffs).
 */
function reclassifyLinks(internalLinks, externalLinks) {
  const internal = new Set(internalLinks || [])
  const external = []
  for (const href of externalLinks || []) {
    let u = null
    try {
      u = new URL(href)
    } catch {
      // not a parseable absolute URL; leave it in externalLinks as-is
    }
    if (u && CANONICAL_PRODUCTION_HOSTS.includes(u.host.toLowerCase())) {
      internal.add(u.pathname + (u.search || ''))
    } else {
      external.push(href)
    }
  }
  return { internalLinks: [...internal].sort(), externalLinks: external.sort() }
}

function multisetOf(list) {
  const m = new Map()
  for (const item of list) m.set(item, (m.get(item) || 0) + 1)
  return m
}

function multisetsEqual(a, b) {
  if (a.size !== b.size) return false
  for (const [k, v] of a) if (b.get(k) !== v) return false
  return true
}

function isStatus2xx(status) {
  return typeof status === 'number' && status >= 200 && status < 300
}

function compareEntry(a, b, opts) {
  const diffs = []

  if (!a || !b) {
    return [{ field: 'presence', category: 'other', a: a ? 'present' : 'missing', b: b ? 'present' : 'missing' }]
  }
  if (a.error || b.error) {
    diffs.push({ field: 'fetch', category: 'other', a: a.error || 'ok', b: b.error || 'ok' })
    return diffs
  }

  if (a.status !== b.status) diffs.push({ field: 'status', category: 'status', a: a.status, b: b.status })
  if (a.location !== b.location) diffs.push({ field: 'location', category: 'redirect', a: a.location, b: b.location })

  const bothRedirect = a.status >= 300 && a.status < 400 && b.status >= 300 && b.status < 400
  if (a.contentType !== b.contentType) {
    // See capture.mjs: a redirect's content-type is real, pre-existing, and SEO/user-invisible
    // origin non-determinism (confirmed empirically), not a parity signal — report-only there.
    if (bothRedirect) {
      diffs.push({ field: 'contentType', category: 'report-only', a: a.contentType, b: b.contentType, reportOnly: true })
    } else {
      diffs.push({ field: 'contentType', category: 'other', a: a.contentType, b: b.contentType })
    }
  }
  if ((a.headers?.['x-robots-tag'] || null) !== (b.headers?.['x-robots-tag'] || null))
    diffs.push({
      field: 'x-robots-tag',
      category: 'seo',
      a: a.headers?.['x-robots-tag'] ?? null,
      b: b.headers?.['x-robots-tag'] ?? null,
    })

  for (const h of REPORT_ONLY_HEADERS) {
    const av = a.headers?.[h]
    const bv = b.headers?.[h]
    if (av !== undefined && bv !== undefined && av !== bv) {
      diffs.push({ field: h, category: 'report-only', a: av, b: bv, reportOnly: true })
    }
  }
  if (a.bytes !== b.bytes) diffs.push({ field: 'bytes', category: 'report-only', a: a.bytes, b: b.bytes, reportOnly: true })

  // fetcher.mjs silently retries transient 502/503/504s. A retry that both sides needed is
  // real, pre-existing origin flakiness worth recording but not failing on; a retry that ONLY
  // B needed (A came back clean on the first try) is a live signal of intermittent trouble on
  // the migration target (e.g. a cold start, a slow DB) that a bare failedUnallowed==0 gate
  // would otherwise let straight through.
  if (typeof b.attempts === 'number' && b.attempts > 1) {
    const aAttempts = typeof a.attempts === 'number' ? a.attempts : 1
    const diff = { field: 'retried', category: 'other', a: aAttempts, b: b.attempts }
    if (aAttempts > 1) diff.reportOnly = true
    diffs.push(diff)
  }

  const both404 = a.status === 404 && b.status === 404
  if (both404) {
    if ((a.html?.title ?? null) !== (b.html?.title ?? null))
      diffs.push({ field: 'title', category: 'seo', a: a.html?.title ?? null, b: b.html?.title ?? null })
    return diffs
  }

  const is2xxHtml = a.contentType === 'text/html' && a.status >= 200 && a.status < 300

  if (is2xxHtml) {
    const fa = a.html || {}
    const fb = b.html || {}
    // Reclassified once up front (see reclassifyLinks) and used by BOTH the externalLinks and
    // internalLinks comparisons below, since a link that moves out of externalLinks lands in
    // internalLinks.
    const reclassA = reclassifyLinks(a.internalLinks, fa.externalLinks)
    const reclassB = reclassifyLinks(b.internalLinks, fb.externalLinks)
    for (const f of ['title', 'description', 'robots', 'canonical', 'lang']) {
      if ((fa[f] ?? null) !== (fb[f] ?? null))
        diffs.push({ field: f, category: fieldCategory(f), a: fa[f] ?? null, b: fb[f] ?? null })
    }
    if (!isEqualJson(fa.h1s || [], fb.h1s || []))
      diffs.push({ field: 'h1s', category: 'content', a: fa.h1s, b: fb.h1s })
    if (!isEqualJson(fa.ogTwitter || {}, fb.ogTwitter || {}))
      diffs.push({ field: 'ogTwitter', category: 'seo', a: fa.ogTwitter, b: fb.ogTwitter })
    // Per review: head-level SEO coverage gaps — a second (injected) robots meta, a
    // googlebot-specific override, hreflang alternates/pagination links, alt text and
    // external link targets were never compared before.
    if (!isEqualJson(fa.robotsAll || [], fb.robotsAll || []))
      diffs.push({ field: 'robotsAll', category: 'seo', a: fa.robotsAll, b: fb.robotsAll })
    if (!isEqualJson(fa.googlebotAll || [], fb.googlebotAll || []))
      diffs.push({ field: 'googlebotAll', category: 'seo', a: fa.googlebotAll, b: fb.googlebotAll })
    if (!isEqualJson(fa.alternateLinks || [], fb.alternateLinks || []))
      diffs.push({ field: 'alternateLinks', category: 'seo', a: fa.alternateLinks, b: fb.alternateLinks })
    if ((fa.prevLink ?? null) !== (fb.prevLink ?? null))
      diffs.push({ field: 'prevLink', category: 'seo', a: fa.prevLink ?? null, b: fb.prevLink ?? null })
    if ((fa.nextLink ?? null) !== (fb.nextLink ?? null))
      diffs.push({ field: 'nextLink', category: 'seo', a: fa.nextLink ?? null, b: fb.nextLink ?? null })
    if (!isEqualJson(fa.imgAlts || [], fb.imgAlts || []))
      diffs.push({ field: 'imgAlts', category: 'content', a: fa.imgAlts, b: fb.imgAlts })
    if (!isEqualJson(reclassA.externalLinks, reclassB.externalLinks))
      diffs.push({ field: 'externalLinks', category: 'content', a: reclassA.externalLinks, b: reclassB.externalLinks })
    if (a.jsonLdHash !== b.jsonLdHash)
      diffs.push({ field: 'jsonLdHash', category: 'seo', a: a.jsonLdHash, b: b.jsonLdHash })
    if (a.visibleTextHash !== b.visibleTextHash) {
      diffs.push({
        field: 'visibleTextHash',
        category: null, // resolved after raw text is loaded, see compareManifests
        a: a.visibleTextHash,
        b: b.visibleTextHash,
        needsTextDiff: true,
      })
    }
    if (!isEqualJson(reclassA.internalLinks, reclassB.internalLinks))
      diffs.push({ field: 'internalLinks', category: 'content', a: reclassA.internalLinks, b: reclassB.internalLinks })
    if (!isEqualJson(a.images || [], b.images || []))
      diffs.push({ field: 'images', category: 'content', a: a.images, b: b.images })
    // assetRefs include build-hashed /_next/static/<hash>/... names, which legitimately
    // differ between A and B builds by design (see SPEC-02). Compare the NORMALIZED
    // (placeholder-substituted) refs as a multiset rather than raw names: a set/JSON-equality
    // check would either always fail (raw names) or hide a missing/extra chunk (a plain Set,
    // where two distinct hashed filenames collapsing to the same placeholder could silently
    // absorb a real count difference).
    const refsA = normalizeAssetRefList(a.assetRefs)
    const refsB = normalizeAssetRefList(b.assetRefs)
    if (!multisetsEqual(multisetOf(refsA), multisetOf(refsB)))
      diffs.push({ field: 'assetRefs', category: 'content', a: refsA, b: refsB })

    // SPEC-04 addendum: /blog and /blog?page=N's embedded post list (capture.mjs's
    // extractEmbeddedBlogPosts) — the PAGE'S OWN client-rendered content, compared directly
    // rather than delegated to /api/blog (a stale cached page could disagree with a fresh
    // /api/blog with nothing else on the page showing it). A capture-time extraction failure
    // on either side is itself a comparable, unallowlistable-by-omission signal.
    //
    // Blocking fix (round 3 review): this used to only diff when the two errors DIFFERED,
    // so A and B failing with the SAME embeddedPostsError produced no diff at all and the
    // listing silently dropped out of parity (confirmed: failedUnallowed stayed 0). Diff
    // whenever EITHER side has an error, regardless of equality — 'embeddedPostsError' is
    // in FORBIDDEN_ALLOWLIST_FIELDS below, so this can never be allowlisted away either.
    if (a.embeddedPostsError !== undefined || b.embeddedPostsError !== undefined) {
      diffs.push({ field: 'embeddedPostsError', category: 'other', a: a.embeddedPostsError ?? null, b: b.embeddedPostsError ?? null })
    }
    if (a.embeddedPostsBySlug || b.embeddedPostsBySlug || a.embeddedPostsBySlugHash || b.embeddedPostsBySlugHash) {
      // Mode-agnostic per-slug hash, same on-the-fly-hash-a-full-side pattern as /api/blog's
      // jsonBySlug/jsonBySlugHash above.
      const perSlugHash = (side, slug) => {
        if (side?.embeddedPostsBySlugHash && slug in side.embeddedPostsBySlugHash) return side.embeddedPostsBySlugHash[slug]
        if (side?.embeddedPostsBySlug && slug in side.embeddedPostsBySlug) return sha256Text(side.embeddedPostsBySlug[slug])
        return undefined
      }
      const orderA = a.embeddedPostsSlugOrder || []
      const orderB = b.embeddedPostsSlugOrder || []
      for (const slug of new Set([...orderA, ...orderB])) {
        const va = perSlugHash(a, slug)
        const vb = perSlugHash(b, slug)
        if (va === undefined || vb === undefined) {
          diffs.push({ field: `embeddedPosts.${slug}`, category: 'content', a: va ?? 'missing', b: vb ?? 'missing' })
        } else if (va !== vb) {
          diffs.push({ field: `embeddedPosts.${slug}`, category: 'content', a: va, b: vb })
        }
      }
      // Order is a FAILING field by default here — UNLIKE /api/blog's slug-set-only compare
      // (which is deliberately order-insensitive per SPEC-04 §3). A legitimate tie-order
      // permutation can only be reconciled by an allowlist entry backed by a
      // tie-permutation.mjs proof (A1 C8), never silently accepted in this comparison.
      if (!isEqualJson(orderA, orderB)) {
        diffs.push({ field: 'embeddedPosts.<order>', category: 'content', a: orderA, b: orderB })
      }
    }
  }

  if (a.sitemapEntries || b.sitemapEntries) {
    if (!isEqualJson(a.sitemapEntries || [], b.sitemapEntries || []))
      diffs.push({ field: 'sitemapEntries', category: 'seo', a: a.sitemapEntries, b: b.sitemapEntries })
  }

  // `<diff>` used to be pinned literally as both a and b here, which meant an allowlist
  // entry approved for one text change (e.g. robots.txt's Allow line) matched EVERY future
  // diff on that url+field (see validateAllowlistEntry's rejection of that placeholder
  // below, and P1.2 review round 3). Use the sha256 of the actual normalized text instead,
  // so a different later diff produces different a/b values and is never silently covered.
  // needsTextDiff (handled in compareManifests) also writes a unified diff + preview to
  // .scratch, same as visibleTextHash, so an approver can see what they're approving.
  //
  // A1 C9 (compact manifest mode): a side may carry `textHash`/`textPreview` instead of the
  // full `text` (see capture.mjs). textHashOf() hashes a full-mode side ON THE FLY with the
  // exact same sha256Text() a compact-mode side already applied, so full-vs-full,
  // compact-vs-full and full-vs-compact all compare correctly without a mode flag here.
  if (a.text !== undefined || b.text !== undefined || a.textHash !== undefined || b.textHash !== undefined) {
    const textHashOf = (side) => {
      if (side?.textHash !== undefined) return side.textHash
      if (side?.text !== undefined) return sha256Text(side.text)
      return null
    }
    const ha = textHashOf(a)
    const hb = textHashOf(b)
    if (ha !== hb) {
      diffs.push({
        field: 'text',
        category: null, // resolved after the diff/preview is built, see compareManifests
        a: ha,
        b: hb,
        needsTextDiff: true,
        // Carried only so compareManifests can build the diff without re-reading a rawDir
        // when full text is already in memory (full mode). Left UNSET (not even `null`) when
        // this side is compact (no `.text`), so compareManifests's `'_inlineTextA' in d`
        // check falls through to its raw-body-from-rawDir fallback instead of treating a
        // missing text as a confirmed "no text available".
        ...(a.text !== undefined ? { _inlineTextA: a.text } : {}),
        ...(b.text !== undefined ? { _inlineTextB: b.text } : {}),
        // Compact-mode diagnostics (see capture.mjs's buildCompactTextFields): a short
        // preview to fall back on when no raw body is available either.
        _previewA: a.textPreview,
        _previewB: b.textPreview,
      })
    }
  }

  // JSON: /api/blog is compared per-slug (order-insensitive), everything else whole-document.
  //
  // A1 C9: a side may carry `jsonBySlugHash` (compact mode: slug -> sha256 of the canonical
  // per-slug JSON) instead of `jsonBySlug` (full mode: slug -> the canonical JSON itself).
  // perSlugHash() hashes a full-mode side's canonical string ON THE FLY with the exact same
  // canonicalStringify()+sha256Text() a compact-mode side already applied, so every
  // full/compact combination compares correctly. `slugMultiset` (compact only) is a true
  // multiset (it can represent a duplicated slug, unlike Object.keys of either map, which
  // can't); used when at least one side has it, otherwise falls back to the prior
  // Object.keys-based comparison unchanged.
  const hasBlogFields = a.jsonBySlug || b.jsonBySlug || a.jsonBySlugHash || b.jsonBySlugHash
  if (hasBlogFields) {
    const perSlugHash = (side, slug) => {
      if (side?.jsonBySlugHash && slug in side.jsonBySlugHash) return side.jsonBySlugHash[slug]
      if (side?.jsonBySlug && slug in side.jsonBySlug) return sha256Text(side.jsonBySlug[slug])
      return undefined
    }
    const keysOf = (side) => Object.keys(side?.jsonBySlugHash || side?.jsonBySlug || {})
    const slugsA = keysOf(a)
    const slugsB = keysOf(b)
    const allSlugs = new Set([...slugsA, ...slugsB])
    for (const slug of allSlugs) {
      const va = perSlugHash(a, slug)
      const vb = perSlugHash(b, slug)
      if (va === undefined || vb === undefined) {
        diffs.push({ field: `jsonBySlug.${slug}`, category: 'content', a: va ?? 'missing', b: vb ?? 'missing' })
      } else if (va !== vb) {
        // Same fix as `text` above: pin the sha256 of the canonical per-slug JSON, never the
        // constant '<diff>' placeholder, so an approval can't silently cover a later, different
        // diff on the same slug+field.
        diffs.push({ field: `jsonBySlug.${slug}`, category: 'content', a: va, b: vb })
      }
    }
    if (slugsA.length > 0 || slugsB.length > 0) {
      // Per review (non-blocking): jsonBySlug drops slug-less items and collapses duplicate
      // slugs, so a duplicated or slug-less item on one side would otherwise never surface.
      // Compare the raw item count and the multiset of slugs alongside the per-slug diffs.
      if (a.jsonArrayLength !== undefined && b.jsonArrayLength !== undefined && a.jsonArrayLength !== b.jsonArrayLength)
        diffs.push({ field: 'jsonBySlug.<count>', category: 'content', a: a.jsonArrayLength, b: b.jsonArrayLength })
      const hasExplicitMultiset = !!(a.slugMultiset || b.slugMultiset)
      if (hasExplicitMultiset) {
        const msA = a.slugMultiset ? new Map(Object.entries(a.slugMultiset)) : multisetOf(slugsA)
        const msB = b.slugMultiset ? new Map(Object.entries(b.slugMultiset)) : multisetOf(slugsB)
        if (!multisetsEqual(msA, msB))
          diffs.push({
            field: 'jsonBySlug.<slugs>',
            category: 'content',
            a: [...msA.entries()].sort((x, y) => x[0].localeCompare(y[0])),
            b: [...msB.entries()].sort((x, y) => x[0].localeCompare(y[0])),
          })
      } else if (!multisetsEqual(multisetOf(slugsA), multisetOf(slugsB))) {
        diffs.push({ field: 'jsonBySlug.<slugs>', category: 'content', a: slugsA.sort(), b: slugsB.sort() })
      }
    }
  } else if (a.jsonHash || b.jsonHash) {
    if (a.jsonHash !== b.jsonHash) diffs.push({ field: 'json', category: 'content', a: a.jsonHash, b: b.jsonHash })
  }

  if (a.sha256 !== b.sha256 && a.contentType && /^image\/|^application\/octet-stream/.test(a.contentType)) {
    diffs.push({ field: 'binary', category: 'other', a: a.sha256, b: b.sha256 })
  }

  return diffs
}

function classifyTextDiff(url, textA, textB, opts) {
  if (opts?.dataFreshnessUrls?.has(url)) return 'data-freshness'
  if (textA != null && textB != null) {
    const stripDates = (s) => s.replace(DATE_RE, '<date>')
    if (stripDates(textA) === stripDates(textB) && textA !== textB) return 'date-render'
  }
  return 'content'
}

const APPROVERS = new Set(['A1', 'A2', 'A3'])
const ISO_UTC_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/

/**
 * Validate one allowlist entry. SPEC-04 §4: compare rejects entries without an advisor
 * approvedBy (A1|A2|A3). Also required (not part of the spec's literal text, but needed so
 * the allowlist can't be silently abused, per review): an ISO approvedAt, a non-empty
 * reason, exactly one of `url` or an ANCHORED `pattern` (so it can't be trivially widened to
 * match everything), and either `expected` (the observed a/b values that were reviewed —
 * pinning them so a *different*, later diff on the same field isn't automatically covered)
 * or `maxMatches` (a cap on how many URLs this one entry may suppress).
 *
 * Two further restrictions (per review, after the asset-comparison rework above): `field`
 * may never be `presence` or `status` — a page or asset appearing, disappearing, or
 * changing HTTP status is never a cosmetic difference an allowlist entry should be able to
 * hide, on either a page compare or an asset-map compare. And a `pattern` entry (which can
 * match an unbounded, growing set of URLs as the site changes) must always pin `expected`;
 * `maxMatches` alone is not enough for a pattern; it caps *how many* URLs are suppressed but
 * not *which* values are being suppressed, so it can silently cover a real, different diff
 * that happens to land within budget.
 */
// SPEC-04 addendum (round 3 review, blocking): 'embeddedPostsError' (a capture-time failure
// to extract /blog's embedded post list) and 'embeddedPostsMissing' (a 2xx /blog-like entry
// with neither the embeddedPosts* fields nor an error — see checkEmbeddedPostsCoverage) are
// both harness-integrity signals, never a cosmetic content difference an allowlist entry
// should be able to hide.
const FORBIDDEN_ALLOWLIST_FIELDS = new Set(['presence', 'status', 'embeddedPostsError', 'embeddedPostsMissing'])

// The `text` and `jsonBySlug.<slug>` fields used to pin the constant string '<diff>' as
// their observed a/b values (see compareEntry), which made `expected: {a:'<diff>', b:'<diff>'}`
// match every future diff on that url+field, not just the one reviewed. Both fields now pin
// a real sha256, but reject the old placeholder outright so a stale/copied allowlist entry
// (or a hand-written one) can never resurrect the bypass.
const FORBIDDEN_EXPECTED_VALUES = new Set(['<diff>'])

function validateAllowlistEntry(entry, idx) {
  const errors = []
  if (!entry || typeof entry !== 'object') {
    throw new Error(`allowlist entry #${idx} is invalid: not an object`)
  }
  if (!APPROVERS.has(entry.approvedBy)) errors.push(`approvedBy must be one of A1/A2/A3, got ${JSON.stringify(entry.approvedBy)}`)
  if (typeof entry.approvedAt !== 'string' || !ISO_UTC_RE.test(entry.approvedAt))
    errors.push(`approvedAt must be an ISO-8601 UTC timestamp (e.g. 2026-09-26T11:30:00Z), got ${JSON.stringify(entry.approvedAt)}`)
  if (typeof entry.reason !== 'string' || entry.reason.trim().length === 0) errors.push('reason must be a non-empty string')
  if (typeof entry.field !== 'string' || entry.field.length === 0) errors.push('field is required')
  if (FORBIDDEN_ALLOWLIST_FIELDS.has(entry.field))
    errors.push(
      `field ${JSON.stringify(entry.field)} may not be allowlisted: a page/asset appearing, disappearing, or changing ` +
        'HTTP status is never allowed to be silently suppressed',
    )

  const hasUrl = typeof entry.url === 'string' && entry.url.length > 0
  const hasPattern = typeof entry.pattern === 'string' && entry.pattern.length > 0
  if (hasUrl === hasPattern) errors.push('exactly one of url or pattern is required')
  if (hasPattern) {
    if (!(entry.pattern.startsWith('^') && entry.pattern.endsWith('$')))
      errors.push(`pattern must be anchored (^...$) so it can't match more than intended, got ${JSON.stringify(entry.pattern)}`)
    try {
      new RegExp(entry.pattern)
    } catch (err) {
      errors.push(`pattern is not a valid regex: ${err.message}`)
    }
  }

  if (
    entry.expected &&
    typeof entry.expected === 'object' &&
    (FORBIDDEN_EXPECTED_VALUES.has(entry.expected.a) || FORBIDDEN_EXPECTED_VALUES.has(entry.expected.b))
  )
    errors.push(
      `expected must pin the real observed value(s), not the placeholder ${JSON.stringify([...FORBIDDEN_EXPECTED_VALUES][0])} ` +
        '— that placeholder used to match every future diff on this url+field, not just the one reviewed',
    )

  const hasExpected = !!entry.expected && typeof entry.expected === 'object' && ('a' in entry.expected || 'b' in entry.expected)
  const hasMaxMatches = Number.isInteger(entry.maxMatches) && entry.maxMatches > 0
  if (!hasExpected && !hasMaxMatches) errors.push('must pin the observed values (expected: {a, b}) or cap matches (maxMatches: N)')
  if (hasPattern && !hasExpected)
    errors.push('a pattern entry must pin expected: {a, b} — maxMatches alone is not enough to bound what a pattern can suppress')

  if (errors.length > 0) throw new Error(`allowlist entry #${idx} is invalid: ${errors.join('; ')}`)
}

/** Throws (never silently drops an entry) if any entry fails validation. */
export function validateAllowlist(allowlist) {
  if (!Array.isArray(allowlist)) throw new Error('allowlist must be an array')
  allowlist.forEach((e, i) => validateAllowlistEntry(e, i))
  return allowlist
}

/**
 * Find the first allowlist entry that covers this (url, field) diff. An entry only matches
 * if it was pinned to these exact observed values (`expected`) and/or still has budget left
 * (`maxMatches`) — so it never silently suppresses a different, later diff on the same field.
 */
function matchAllowlist(allowlist, url, field, observed, usageCounts) {
  for (let i = 0; i < allowlist.length; i++) {
    const entry = allowlist[i]
    if (entry.field !== field) continue
    if (entry.url) {
      if (entry.url !== url) continue
    } else if (entry.pattern) {
      if (!new RegExp(entry.pattern).test(url)) continue
    } else {
      continue
    }

    if (entry.expected) {
      const aOk = !('a' in entry.expected) || isEqualJson(entry.expected.a, observed.a)
      const bOk = !('b' in entry.expected) || isEqualJson(entry.expected.b, observed.b)
      if (!(aOk && bOk)) continue // values differ from what was actually reviewed; not covered
    }
    if (Number.isInteger(entry.maxMatches)) {
      const used = usageCounts.get(i) || 0
      if (used >= entry.maxMatches) continue // budget exhausted; fail open (unallowed)
      usageCounts.set(i, used + 1)
    }
    return { entry, index: i }
  }
  return null
}

/**
 * Assert a URL inventory entry's fixed `expect` block (SPEC-04 §2.4/§2.6/§2.8) against B.
 * This is in addition to the ordinary A/B compareEntry() for every URL except expect-only
 * ones (source 'post-cutover', or `expectOnly: true`), whose A side predates cutover and
 * has no comparable redirect behavior; see compareManifests. `status`/`presence` can never
 * be allowlisted (see FORBIDDEN_ALLOWLIST_FIELDS), so without this path the post-cutover
 * redirects could never be verified. Only the checks explicitly present in `expect` are
 * asserted here. Returns only the FAILING checks (matching the rest of this file's
 * convention of only ever recording a diff, not a match).
 */
function compareExpectation(b, expect) {
  const diffs = []
  if (!b) {
    diffs.push({ field: 'expect-presence', category: 'other', a: 'expected a response', b: 'missing' })
    return diffs
  }
  if (b.error) {
    diffs.push({ field: 'expect-presence', category: 'other', a: 'expected a response', b: `fetch error: ${b.error}` })
    return diffs
  }
  if (expect.status !== undefined) {
    const wantStatuses = Array.isArray(expect.status) ? expect.status : [expect.status]
    if (!wantStatuses.includes(b.status))
      diffs.push({ field: 'expect-status', category: 'status', a: Array.isArray(expect.status) ? expect.status : expect.status, b: b.status })
  }
  if (expect.location !== undefined) {
    const actual = b.location ?? null
    if (actual !== expect.location) diffs.push({ field: 'expect-location', category: 'redirect', a: expect.location, b: actual })
  }
  if (expect.xRobotsTag !== undefined) {
    const actual = b.headers?.['x-robots-tag'] ?? null
    if (actual !== expect.xRobotsTag) diffs.push({ field: 'expect-x-robots-tag', category: 'seo', a: expect.xRobotsTag, b: actual })
  }
  if (expect.json !== undefined) {
    const actual = b.json ?? null
    const mismatched = Object.entries(expect.json).filter(([k, v]) => !actual || !isEqualJson(actual[k], v))
    if (mismatched.length > 0) diffs.push({ field: 'expect-json', category: 'content', a: expect.json, b: actual })
  }
  return diffs
}

/**
 * Compare the manifest-level asset maps (capture.mjs's asset-fetch pass): every same-site
 * asset referenced by any page (img src/srcset, <source srcset>, script src, link icon/
 * preload/modulepreload/stylesheet), fetched once and recorded by status/contentType/
 * sha256 (or, for `/_next/image`, decoded dimensions instead of sha256 — see capture.mjs).
 *
 * Hashed /_next/static/<hash>/... names are keyed by their RAW (un-placeholdered) name here
 * — unlike the per-page `assetRefs` diff above — because capture.mjs fetched each ref
 * separately per build; A and B legitimately reference DIFFERENT hashed names for what may
 * be the same logical chunk. So a hashed ref present on only one side is never itself a
 * parity signal (comparing by name would fail on every single deploy), and is checked
 * independently per side instead: whichever side references a hashed asset, that asset must
 * be fetchable (2xx) on that side. A broken build or a stale/leftover reference on EITHER
 * side surfaces this way, without pairing by name and without "only present on one side"
 * ever being treated as presence failure (that used to hide a real 404'd chunk behind a
 * flood of expected renamed-file noise).
 *
 * CSS content is the one exception (per review): capture.mjs hashes the actual bytes of any
 * hashed-name CSS asset (unlike JS chunks, which are only checked for 2xx here). Compare
 * those hashes as a NAME-INDEPENDENT multiset across both sides — same rationale as the
 * per-page `assetRefs` diff above — so a real CSS regression can't hide behind "of course the
 * filenames differ, it's a different build".
 */
function compareAssetMaps(assetsA = {}, assetsB = {}) {
  const diffs = []
  const allRefs = new Set([...Object.keys(assetsA || {}), ...Object.keys(assetsB || {})])
  const cssHashesA = []
  const cssHashesB = []
  for (const ref of allRefs) {
    const a = assetsA?.[ref]
    const b = assetsB?.[ref]
    const isHashedNext = HASHED_ASSET_PREFIX_RE.test(ref)

    if (isHashedNext) {
      if (a && !isStatus2xx(a.status))
        diffs.push({ url: ref, field: 'status', category: 'other', side: 'a', a: a.status, b: null })
      if (b && !isStatus2xx(b.status))
        diffs.push({ url: ref, field: 'status', category: 'other', side: 'b', a: null, b: b.status })
      // No A/B name pairing exists for a hashed ref (see above), so a retry here can only be
      // reported per-side, not classified failure-vs-report-only by comparison with the other
      // side's attempt count.
      if (a && typeof a.attempts === 'number' && a.attempts > 1)
        diffs.push({ url: ref, field: 'retried', category: 'other', side: 'a', a: a.attempts, b: null, reportOnly: true })
      if (b && typeof b.attempts === 'number' && b.attempts > 1)
        diffs.push({ url: ref, field: 'retried', category: 'other', side: 'b', a: null, b: b.attempts, reportOnly: true })
      if (a?.contentType === 'text/css' && a.sha256) cssHashesA.push(a.sha256)
      if (b?.contentType === 'text/css' && b.sha256) cssHashesB.push(b.sha256)
      continue
    }

    if (!a || !b) {
      diffs.push({ url: ref, field: 'presence', category: 'other', a: a ? 'present' : 'missing', b: b ? 'present' : 'missing' })
      continue
    }
    if (a.status !== b.status) diffs.push({ url: ref, field: 'status', category: 'other', a: a.status, b: b.status })
    if (a.contentType !== b.contentType)
      diffs.push({ url: ref, field: 'contentType', category: 'other', a: a.contentType, b: b.contentType })
    if (typeof b.attempts === 'number' && b.attempts > 1) {
      const aAttempts = typeof a.attempts === 'number' ? a.attempts : 1
      const diff = { url: ref, field: 'retried', category: 'other', a: aAttempts, b: b.attempts }
      if (aAttempts > 1) diff.reportOnly = true
      diffs.push(diff)
    }

    if (NEXT_IMAGE_RE.test(ref)) {
      // Replit's Next/sharp optimizer and Vercel's own Image Optimization never emit
      // byte-identical output for the same source+params — compare what a user/search
      // engine actually perceives (decoded dimensions) instead of sha256. Missing
      // dimensions on either side (an undecodable format) means "not comparable", not
      // "fail"; status/contentType above already catch a genuinely broken response.
      if (a.width !== undefined && b.width !== undefined && (a.width !== b.width || a.height !== b.height)) {
        diffs.push({ url: ref, field: 'dimensions', category: 'content', a: `${a.width}x${a.height}`, b: `${b.width}x${b.height}` })
      }
    } else if (a.sha256 !== undefined && b.sha256 !== undefined && a.sha256 !== b.sha256) {
      diffs.push({ url: ref, field: 'sha256', category: 'content', a: a.sha256, b: b.sha256 })
    }
  }

  if (!multisetsEqual(multisetOf(cssHashesA), multisetOf(cssHashesB))) {
    diffs.push({
      url: '<hashed-css-assets>',
      field: 'hashedCssSha256',
      category: 'content',
      a: cssHashesA.sort(),
      b: cssHashesB.sort(),
    })
  }

  return diffs
}

/**
 * Read a rawDir artifact for a text-diff fallback and VERIFY it against the manifest's own
 * stored hash before trusting it (per review): a stale `.text.txt`/`.bin` left over from a
 * DIFFERENT capture run (rawDir is caller-supplied and long-lived — nothing here guarantees
 * it's the exact same run as the manifest being compared) would otherwise silently produce a
 * unified diff against the WRONG content. Returns `{ text, verified }`: `text` is null and
 * `verified` is false whenever the file is missing/unreadable OR its hash doesn't match
 * `expectedHash` — the caller then falls back to the short preview and records that the
 * verification failed, rather than trusting an unverified file.
 */
async function readVerifiedRawFile(filePath, decode, expectedHash) {
  let text
  try {
    const buf = await readFile(filePath)
    text = decode(buf)
  } catch {
    return { text: null, verified: false, mismatch: false }
  }
  if (expectedHash === undefined || expectedHash === null) return { text, verified: true, mismatch: false }
  if (sha256Text(text) !== expectedHash) return { text: null, verified: false, mismatch: true }
  return { text, verified: true, mismatch: false }
}

/** `.text.txt` is HTML's visibleTextHash artifact (see capture.mjs), verified against it. */
async function readRawText(rawDir, url, expectedHash) {
  if (!rawDir) return { text: null, verified: false, mismatch: false }
  return readVerifiedRawFile(path.join(rawDir, `${safeFileName(url)}.text.txt`), (buf) => buf.toString('utf8'), expectedHash)
}

/** Per review (A1 C9): capture.mjs writes every URL's raw response body to `--raw-dir`
 *  regardless of --compact (only the derived `.text`/`.textHash` MANIFEST field differs by
 *  mode) — so when a text/plain side is compact (no `.text`), fall back to that raw `.bin`
 *  file, run it through the exact same normalizeText() capture.mjs itself applies, and use
 *  the result for a real unified diff and a real classifyTextDiff instead of just a preview —
 *  but only once verified against `expectedHash` (the manifest's own textHash for that side). */
async function readRawTextPlainBody(rawDir, url, expectedHash) {
  if (!rawDir) return { text: null, verified: false, mismatch: false }
  return readVerifiedRawFile(path.join(rawDir, `${safeFileName(url)}.bin`), (buf) => normalizeText(buf.toString('utf8')), expectedHash)
}

/**
 * Blocking fix (round 3 review): a 2xx /blog(-like) entry with NEITHER embeddedPosts* fields
 * NOR an embeddedPostsError is invisible to the per-slug/order comparison in compareEntry —
 * this can only happen when the capture code itself never attempted the extraction (a bug,
 * or a manifest from before this feature existed). Checked ONLY for a manifest that
 * DECLARES it ran the new capture code (`harness.embeddedPosts === 1`, set by capture.mjs's
 * capture()), so an older manifest without that marker is never wrongly judged by a rule it
 * couldn't have satisfied. Returns diffs in the same {url, field, category, a, b} shape
 * compareAssetMaps uses, for the same top-level (non-compareEntry) treatment.
 */
function checkEmbeddedPostsCoverage(manifestA, manifestB) {
  const diffs = []
  for (const [side, manifest] of [
    ['a', manifestA],
    ['b', manifestB],
  ]) {
    if (manifest?.harness?.embeddedPosts !== 1) continue
    for (const e of manifest.entries || []) {
      if (!EMBEDDED_POST_LIST_URL_RE.test(e.url)) continue
      const isSuccess2xx = !e.error && typeof e.status === 'number' && e.status >= 200 && e.status < 300
      if (!isSuccess2xx) continue
      const hasFields = !!(e.embeddedPostsBySlug || e.embeddedPostsBySlugHash)
      const hasError = e.embeddedPostsError !== undefined
      if (!hasFields && !hasError) {
        diffs.push({
          url: e.url,
          field: 'embeddedPostsMissing',
          category: 'other',
          a: side === 'a' ? 'missing-both-fields-and-error' : null,
          b: side === 'b' ? 'missing-both-fields-and-error' : null,
        })
      }
    }
  }
  return diffs
}

export async function compareManifests(
  manifestA,
  manifestB,
  { allowlist = [], dataFreshnessUrls = new Set(), rawDirA = null, rawDirB = null, textDiffDir = null } = {},
) {
  validateAllowlist(allowlist)

  const byUrlA = new Map(manifestA.entries.map((e) => [e.url, e]))
  const byUrlB = new Map(manifestB.entries.map((e) => [e.url, e]))
  const allUrls = new Set([...byUrlA.keys(), ...byUrlB.keys()])

  const allDiffs = []
  const byCategory = {}
  const usageCounts = new Map()
  const allowlistHits = new Map() // entry index -> { urls: Set }
  let failedUnallowed = 0
  let allowlisted = 0

  for (const url of allUrls) {
    const a = byUrlA.get(url)
    const b = byUrlB.get(url)

    // Fixed-expectation URLs (SPEC-04 §2.4/§2.6/§2.8) are asserted against B — see
    // compareExpectation(). Not allowlist-eligible: these are absolute requirements (a wrong
    // post-cutover redirect, a leaked admin session), not a cosmetic A/B difference an
    // approver should ever be able to wave through.
    //
    // The expect block is ADDITIVE (P1.2 review r4): the URL is still A/B-compared below, so
    // a URL with an expect block never loses its status/title/content/link comparison. Only
    // expect-only entries skip the A/B compare: source 'post-cutover' (SPEC-04 §2.8, where
    // A predates cutover and has no comparable redirect behavior) or an explicit
    // `expectOnly: true` on the entry.
    const expect = b?.expect || a?.expect
    if (expect) {
      for (const d of compareExpectation(b, expect)) {
        const entryDiff = { url, ...d }
        failedUnallowed++
        byCategory[d.category] = (byCategory[d.category] || 0) + 1
        allDiffs.push(entryDiff)
      }
      const source = b?.source ?? a?.source
      const expectOnly = source === 'post-cutover' || b?.expectOnly === true || a?.expectOnly === true
      if (expectOnly) continue
    }

    const diffs = compareEntry(a, b, { dataFreshnessUrls })
    for (const d of diffs) {
      if (d.needsTextDiff) {
        // The `text` field's full text is inline (see compareEntry above) when that side is
        // in full mode. When it's compact instead (no `.text`, `_inlineTextA`/B left UNSET),
        // fall back to the raw `.bin` body capture.mjs always writes to rawDir regardless of
        // mode (A1 C9, per review) — never to the `.text.txt` file, which is HTML's
        // visibleTextHash artifact, not text/plain's. The `visibleTextHash` field (no
        // `_inlineTextA`/B ever set for it) keeps using `.text.txt` via readRawText,
        // unaffected.
        const rawTextReader = d.field === 'text' ? readRawTextPlainBody : readRawText
        let textA, textB
        if ('_inlineTextA' in d) {
          textA = d._inlineTextA
        } else {
          const r = await rawTextReader(rawDirA, url, d.a)
          textA = r.text
          if (r.mismatch) d.rawVerificationFailedA = true
        }
        if ('_inlineTextB' in d) {
          textB = d._inlineTextB
        } else {
          const r = await rawTextReader(rawDirB, url, d.b)
          textB = r.text
          if (r.mismatch) d.rawVerificationFailedB = true
        }
        const previewA = d._previewA
        const previewB = d._previewB
        delete d._inlineTextA
        delete d._inlineTextB
        delete d._previewA
        delete d._previewB
        d.category = classifyTextDiff(url, textA, textB, { dataFreshnessUrls })
        if (textA != null && textB != null) {
          const patch = createTwoFilesPatch(`A/${url}`, `B/${url}`, textA, textB)
          d.preview = firstNLines(patch, 5)
          if (textDiffDir) {
            await mkdir(textDiffDir, { recursive: true })
            const diffFile = path.join(textDiffDir, `${safeFileName(url)}.diff`)
            await writeFile(diffFile, patch)
            d.diffFile = diffFile
          }
        } else if (previewA !== undefined || previewB !== undefined || textA != null || textB != null) {
          // A1 C9 (compact manifest mode): no raw body was available on at least one side
          // (or no rawDir was given at all), so no unified diff is possible — fall back to
          // the short preview kept for diagnostics (capture.mjs's buildCompactTextFields),
          // or, for whichever side DOES have full/raw-recovered text, its own leading 300
          // chars, never a full diff.
          d.preview = {
            a: previewA ?? (textA != null ? textA.slice(0, 300) : null),
            b: previewB ?? (textB != null ? textB.slice(0, 300) : null),
          }
        }
      }

      const entryDiff = { url, ...d }
      if (d.reportOnly) {
        allDiffs.push(entryDiff)
        continue
      }
      const allowed = matchAllowlist(allowlist, url, d.field, { a: d.a, b: d.b }, usageCounts)
      if (allowed) {
        entryDiff.allowlisted = true
        entryDiff.approvedBy = allowed.entry.approvedBy
        if (!allowlistHits.has(allowed.index)) allowlistHits.set(allowed.index, new Set())
        allowlistHits.get(allowed.index).add(url)
        allowlisted++
      } else {
        failedUnallowed++
      }
      byCategory[d.category] = (byCategory[d.category] || 0) + 1
      allDiffs.push(entryDiff)
    }
  }

  for (const d of compareAssetMaps(manifestA.assets, manifestB.assets)) {
    // Mirror the page-level loop above: a report-only diff (e.g. a retry that both sides
    // needed) is recorded for visibility but never counted toward failedUnallowed or
    // eligible for allowlisting.
    if (d.reportOnly) {
      allDiffs.push(d)
      continue
    }
    const allowed = matchAllowlist(allowlist, d.url, d.field, { a: d.a, b: d.b }, usageCounts)
    const entryDiff = { ...d }
    if (allowed) {
      entryDiff.allowlisted = true
      entryDiff.approvedBy = allowed.entry.approvedBy
      if (!allowlistHits.has(allowed.index)) allowlistHits.set(allowed.index, new Set())
      allowlistHits.get(allowed.index).add(d.url)
      allowlisted++
    } else {
      failedUnallowed++
    }
    byCategory[d.category] = (byCategory[d.category] || 0) + 1
    allDiffs.push(entryDiff)
  }

  // Blocking fix (round 3): embeddedPostsMissing is in FORBIDDEN_ALLOWLIST_FIELDS, so
  // matchAllowlist below can never find a covering entry for it — it always fails.
  for (const d of checkEmbeddedPostsCoverage(manifestA, manifestB)) {
    const allowed = matchAllowlist(allowlist, d.url, d.field, { a: d.a, b: d.b }, usageCounts)
    const entryDiff = { ...d }
    if (allowed) {
      entryDiff.allowlisted = true
      entryDiff.approvedBy = allowed.entry.approvedBy
      if (!allowlistHits.has(allowed.index)) allowlistHits.set(allowed.index, new Set())
      allowlistHits.get(allowed.index).add(d.url)
      allowlisted++
    } else {
      failedUnallowed++
    }
    byCategory[d.category] = (byCategory[d.category] || 0) + 1
    allDiffs.push(entryDiff)
  }

  // Retry visibility (per review): fetcher.mjs's silent 502/503/504 retries can otherwise
  // hide intermittent target-side trouble behind a clean-looking failedUnallowed==0. Counted
  // across both page fetches and asset fetches.
  let retriedA = 0
  let retriedB = 0
  for (const url of allUrls) {
    const a = byUrlA.get(url)
    const b = byUrlB.get(url)
    if (a && typeof a.attempts === 'number' && a.attempts > 1) retriedA++
    if (b && typeof b.attempts === 'number' && b.attempts > 1) retriedB++
  }
  const countRetriedAssets = (assets) =>
    Object.values(assets || {}).filter((e) => typeof e.attempts === 'number' && e.attempts > 1).length
  retriedA += countRetriedAssets(manifestA.assets)
  retriedB += countRetriedAssets(manifestB.assets)

  const passed = failedUnallowed === 0
  const blogApiSize = checkBlogApiSize(manifestA, manifestB)

  const allowlistReport = allowlist.map((entry, i) => ({
    index: i,
    field: entry.field,
    url: entry.url ?? null,
    pattern: entry.pattern ?? null,
    approvedBy: entry.approvedBy,
    approvedAt: entry.approvedAt,
    reason: entry.reason,
    matchedUrls: [...(allowlistHits.get(i) || [])].sort(),
  }))

  return {
    urlsA: byUrlA.size,
    urlsB: byUrlB.size,
    compared: allUrls.size,
    passed,
    failedUnallowed,
    allowlisted,
    retriedA,
    retriedB,
    byCategory,
    diffs: allDiffs,
    allowlistReport,
    blogApiSize,
  }
}

function sameDirectory(a, b) {
  if (a === b) return true
  try {
    return realpathSync(a) === realpathSync(b) // e.g. one of them reached through a symlink
  } catch {
    return false // a directory that doesn't exist yet can't be the other one
  }
}

/**
 * SPEC-04 §3 "compare.mjs outputs" (2026-09-27): where the full diff.json copy and the trimmed
 * committed copy go. They never share a path: the full copy is `<scratch>/<basename of --out>`,
 * except when the scratch directory resolves to the directory of --out, where it becomes
 * `<basename without .json>.full.json` next to it (previously the trimmed copy silently
 * overwrote the full one there). "Resolves to" also covers a symlink to the same directory.
 * Exported for the self-test.
 */
export function diffOutputPaths(out, scratchArg) {
  const committed = path.resolve(out)
  const scratchDir = path.resolve(scratchArg || path.join(path.dirname(out), '..', '.scratch'))
  let full = path.join(scratchDir, path.basename(committed))
  if (sameDirectory(scratchDir, path.dirname(committed))) {
    const ext = path.extname(committed)
    const stem = ext.toLowerCase() === '.json' ? path.basename(committed, ext) : path.basename(committed)
    full = path.join(scratchDir, `${stem}.full.json`)
  }
  return { scratchDir, full, committed }
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const key = a.slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) out[key] = true
    else {
      out[key] = next
      i++
    }
  }
  return out
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!args.a || !args.b || !args.out) {
    console.error(
      'Usage: node compare.mjs --a <manifestA.json> --b <manifestB.json> --out <diff.json> ' +
        '[--allowlist <file>] [--scratch <dir>] [--raw-dir-a <dir>] [--raw-dir-b <dir>]',
    )
    process.exit(2)
  }
  const manifestA = JSON.parse(await readFile(args.a, 'utf8'))
  const manifestB = JSON.parse(await readFile(args.b, 'utf8'))
  let allowlist = []
  if (args.allowlist) {
    let raw
    try {
      raw = JSON.parse(await readFile(args.allowlist, 'utf8'))
    } catch (err) {
      console.error(`FAIL: --allowlist ${args.allowlist} is not readable/valid JSON: ${err.message}`)
      process.exit(2)
    }
    try {
      allowlist = validateAllowlist(raw)
    } catch (err) {
      console.error(`FAIL: ${err.message}`)
      process.exit(2)
    }
  }

  // Both directories exist before the paths are decided, so a symlinked --scratch that is
  // really the --out directory is recognised too.
  await mkdir(diffOutputPaths(args.out, args.scratch).scratchDir, { recursive: true })
  await mkdir(path.dirname(path.resolve(args.out)), { recursive: true })
  const outputs = diffOutputPaths(args.out, args.scratch)
  const scratchDir = outputs.scratchDir
  const result = await compareManifests(manifestA, manifestB, {
    allowlist,
    rawDirA: args['raw-dir-a'],
    rawDirB: args['raw-dir-b'],
    textDiffDir: path.join(scratchDir, 'text-diffs'),
  })

  // Full copy to .scratch/, committed copy capped at ~200KB by trimming diffs.
  await mkdir(scratchDir, { recursive: true })
  await writeFile(outputs.full, JSON.stringify(result, null, 2))

  const committed = { ...result, diffs: result.diffs.slice(0, 200) }
  await mkdir(path.dirname(outputs.committed), { recursive: true })
  await writeFile(outputs.committed, JSON.stringify(committed, null, 2))

  console.log(
    `Compared ${result.compared} URLs: ${result.passed ? 'PASS' : 'FAIL'} ` +
      `(failedUnallowed=${result.failedUnallowed}, allowlisted=${result.allowlisted})`,
  )
  // A1 C10: sizes are always logged (report-only, never affects the exit code) for both
  // sides, not only when a side is over the threshold.
  console.log(
    `/api/blog size: A=${result.blogApiSize.sizes.a.bytes ?? 'n/a'} bytes ` +
      `(${result.blogApiSize.sizes.a.jsonArrayLength ?? 'n/a'} items), ` +
      `B=${result.blogApiSize.sizes.b.bytes ?? 'n/a'} bytes (${result.blogApiSize.sizes.b.jsonArrayLength ?? 'n/a'} items), ` +
      `threshold=${result.blogApiSize.thresholdBytes} bytes`,
  )
  for (const w of result.blogApiSize.warnings) {
    console.log(
      `WARNING: /api/blog side ${w.side} is ${(w.bytes / (1024 * 1024)).toFixed(2)}MB ` +
        `(array length ${w.arrayLength}), over the ${(w.thresholdBytes / (1024 * 1024)).toFixed(1)}MB advisory threshold (A1 C10)`,
    )
  }
  process.exit(result.passed ? 0 : 1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
