#!/usr/bin/env node
// SPEC-04 §5: mutation self-test, required before the harness is used for any gate.
//
// Usage:
//   node selftest.mjs --base https://www.growmax.io --out ../../../docs/migration/evidence/P1.2-harness-selftest.json
//
// Exit code 0 only if every check passes.
//
// The mutation matrix mutates the RAW captured body on disk (the .bin file capture.mjs
// writes for every URL) and re-runs it through the real extractHtml/extractSitemap/JSON
// path — the same code capture.mjs itself calls — rather than editing an already-extracted
// manifest field directly. Editing e.g. `entry.visibleTextHash` to a different string only
// proves compare() notices two different strings; it proves nothing about whether the
// extractor (blockJoinedText, the <title> strip, the regexes) can actually surface a real
// content change. If extractHtml returned empty text, found no JSON-LD, or dropped images,
// every hash would still match on both sides and this self-test would still pass.

import { readFile, readdir, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as sleep } from 'node:timers/promises'
import { execSync } from 'node:child_process'
import { buildInventory, POST_CUTOVER_ENTRIES } from './urls.mjs'
import {
  capture,
  buildCompactBlogArrayFields,
  buildCompactTextFields,
  buildFullEmbeddedPostsFields,
  buildCompactEmbeddedPostsFields,
} from './capture.mjs'
import { compareManifests } from './compare.mjs'
import {
  extractHtml,
  extractSitemap,
  extractEmbeddedBlogPosts,
  canonicalStringify,
  safeFileName,
  sha256,
  sha256Text,
  normalizeText,
  normalizeHtmlNoise,
  mergeLinkHeaderAssetRefs,
} from './lib/extract.mjs'
import { normalizeLocation, buildResolveDispatcher } from './lib/fetcher.mjs'
import {
  checkTiePermutation,
  checkPageTiePermutation,
  checkBlogPageResidual,
  postsFromApiBlogBody,
  extractOrderedSlugs,
  buildReorderedText,
  URL_KINDS,
} from './tie-permutation.mjs'

// SPEC-04 §2: the sitemap is the largest single URL source (203 of 288 URLs in the last
// known-good inventory) and the harness assumes it's broadly reachable. Per review: with no
// reachability floor, if A and B both returned the same non-2xx/3xx response (e.g. a proxy
// denial page, a misconfigured base) every URL would compare equal and the run would pass.
const REACHABILITY_FLOOR = 0.95

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..')

// Matches capture.mjs's own KNOWN_HOSTS, so location mutations exercise the exact same
// normalizeLocation() call capture.mjs makes.
const KNOWN_HOSTS = ['www.growmax.io', 'growmax.io', '*.vercel.app']

// The fixed set of mutation cases described in SPEC-04 §5.2 (+ the image and Location
// scheme/host cases added by review). Every one of these MUST be built for a run to be
// trusted — a missing fixture (no redirect found, no JSON-LD, etc.) is a hard failure, not
// a silently-dropped case.
const REQUIRED_CASE_NAMES = [
  'change-a-title',
  'drop-a-canonical',
  'edit-one-json-ld-field',
  'change-one-word-of-body-text',
  'change-image-url',
  'flip-redirect-status',
  'change-a-location',
  'location-https-to-http',
  'location-www-to-apex',
  'remove-a-url',
  'change-sitemap-lastmod-for-blog-url',
  'reorder-api-blog-array',
  'change-one-field-of-one-api-blog-element',
  // P1.2 review r4: the fixed-expectation (`expect`) path, additive A/B compare on expect
  // URLs, post-cutover expect-only entries, and text allowlist pinning.
  'admin-session-isAdmin-true',
  'admin-session-isAdmin-true-both-sides',
  'admin-posts-status-200',
  'blog-page2-drop-x-robots-tag',
  'blog-page2-change-title-still-ab-compared',
  'admin-page-status-500',
  'post-cutover-conforming',
  'post-cutover-301-http-self',
  'post-cutover-missing-on-b',
  'text-allowlist-pinned-covers-reviewed-diff',
  'text-allowlist-pinned-rejects-other-diff',
  // SPEC-04 addendum: /blog's embedded post list (capture.mjs's extractEmbeddedBlogPosts).
  'embedded-posts-excerpt-edited',
  'embedded-posts-date-changed',
  'embedded-posts-missing-post',
  'embedded-posts-extra-post',
]

/**
 * SPEC-04 addendum: the 4 required embedded-post-list mutations, as pure transforms over the
 * REAL parsed posts array (from extractEmbeddedBlogPosts on /blog's raw body) — shared by
 * buildMutationCases (full/compact mode, via REQUIRED_CASE_NAMES above) and main()'s
 * mixed-mode-mutation-cases check (full-vs-compact, both directions), so all three modes
 * exercise the exact same 4 mutations rather than duplicating them per mode.
 */
const EMBEDDED_POSTS_MUTATIONS = [
  {
    name: 'excerpt-edited',
    transform: (posts) => {
      if (posts.length === 0) throw new Error('embedded-posts-excerpt-edited: /blog has zero embedded posts')
      return posts.map((p, i) => (i === 0 ? { ...p, excerpt: `${p.excerpt ?? ''} MIGRATION-SELFTEST-MUTATED` } : p))
    },
  },
  {
    name: 'date-changed',
    transform: (posts) => {
      if (posts.length === 0) throw new Error('embedded-posts-date-changed: /blog has zero embedded posts')
      return posts.map((p, i) => (i === 0 ? { ...p, date: 'Jan 1, 1999' } : p))
    },
  },
  {
    name: 'missing-post',
    transform: (posts) => {
      if (posts.length < 2) throw new Error('embedded-posts-missing-post: /blog has fewer than 2 embedded posts')
      return posts.slice(1)
    },
  },
  {
    name: 'extra-post',
    transform: (posts) => {
      if (posts.length === 0) throw new Error('embedded-posts-extra-post: /blog has zero embedded posts')
      return [...posts, { ...posts[0], slug: `${posts[0].slug}-migration-selftest-extra`, id: -999999 }]
    },
  },
]

// SPEC-04 §2.4/§2.6/§2.8: the only URLs that carry a fixed `expect` block. Checked against
// the built inventory (check 'inventory-expect-blocks-match-spec') so an expectation put on
// the wrong URL (r4: X-Robots-Tag on /admin instead of /blog?page=2) fails the self-test.
// `/blog` and `/blog?page=2` also carry status:200 (review r4 follow-up, P5.3): without it, a
// non-2xx B response that happens to equal A's status silently skips the whole embedded-post-
// list comparison instead of surfacing that B's listing page is down.
const SPEC_EXPECT_URLS = {
  '/api/admin/session': { status: 200, json: { isAdmin: false } },
  '/api/admin/posts': { status: 401 },
  '/blog': { status: 200 },
  '/blog?page=2': { xRobotsTag: 'noindex, follow', status: 200 },
}
const SPEC_POST_CUTOVER_URLS = ['http://www.growmax.io/', 'http://growmax.io/', 'https://growmax.io/', 'https://growmax.io/demo']

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

function findEntry(manifest, predicate) {
  return manifest.entries.find(predicate)
}

async function readRawBin(rawDir, url) {
  return readFile(path.join(rawDir, `${safeFileName(url)}.bin`))
}

/** Re-run the real extractor and splice its output back into a cloned manifest entry. */
function rebuildHtmlEntryFromRaw(entry, rawHtml, pageUrl) {
  const extracted = extractHtml(rawHtml, pageUrl)
  entry.html = extracted.fields
  entry.jsonLdHash = extracted.jsonLdHash
  entry.visibleTextHash = extracted.visibleTextHash
  entry.internalLinks = extracted.internalLinks
  entry.images = extracted.images
  // The raw .bin holds only the body, not the response's `Link` header: re-merge the
  // header-derived refs capture.mjs recorded (linkHeaderRefs) through the same merge, so a
  // mutated body of a dynamically rendered page isn't "detected" merely by losing them.
  const replayedHeader = (entry.linkHeaderRefs || []).map((r) => `<${r}>; rel=preload`).join(', ')
  entry.assetRefs = mergeLinkHeaderAssetRefs(extracted.assetRefs, replayedHeader, pageUrl).assetRefs
  // Same as capture.mjs: HTML stylesheet elements only, never the replayed header.
  entry.stylesheetRefs = extracted.stylesheetRefs
}

/**
 * Reconstruct an approximate raw Location header value from a normalizeLocation() token
 * (e.g. "https://<self>/foo"), so a mutation case can flip its scheme/host and re-run the
 * REAL normalizeLocation() — rather than hand-editing the already-normalized string.
 */
function untokenizeLocation(normalized, requestedHost) {
  if (!normalized) return null
  const m = normalized.match(/^(https?):\/\/(<[^>]+>)(\/.*)?$/)
  if (!m) return normalized // already an absolute URL (unrecognized host); use as-is
  const [, scheme, token, rest = ''] = m
  let host
  if (token === '<self>') host = requestedHost
  else if (token === '<www>') host = 'www.growmax.io'
  else if (token === '<apex>') host = 'growmax.io'
  else if (token.startsWith('<deploy:')) host = token.slice('<deploy:'.length, -1)
  else host = token
  return `${scheme}://${host}${rest}`
}

/** Build the fixed set of mutation cases described in SPEC-04 §5.2, operating on raw bodies.
 *  `compact` (A1 C9): when true, the /api/blog and robots.txt-text mutation cases mutate the
 *  COMPACT fields (jsonBySlugHash/slugMultiset, textHash/textPreview) via the exact same
 *  buildCompactBlogArrayFields/buildCompactTextFields capture.mjs itself calls, instead of
 *  the full-mode fields — so the same 22 cases prove detection in compact mode too. */
async function buildMutationCases(manifest, { rawDir, base, compact = false }) {
  const cases = []

  const home = findEntry(manifest, (e) => e.url === '/')
  const redirect = findEntry(manifest, (e) => e.status >= 300 && e.status < 400 && e.location)
  const sitemap = findEntry(manifest, (e) => e.url === '/sitemap.xml')
  const apiBlog = findEntry(manifest, (e) => e.url === '/api/blog' && (e.jsonBySlug || e.jsonBySlugHash))

  if (home) {
    const homeUrl = new URL('/', base).toString()

    cases.push({
      name: 'change-a-title',
      expectDetected: true,
      mutate: async (m) => {
        const raw = (await readRawBin(rawDir, '/')).toString('utf8')
        const mutatedRaw = raw.replace(/(<title[^>]*>)([\s\S]*?)(<\/title>)/i, (_, open, inner, close) => `${open}${inner} (mutated)${close}`)
        if (mutatedRaw === raw) throw new Error('change-a-title: no <title> tag found in home page raw HTML')
        rebuildHtmlEntryFromRaw(findEntry(m, (x) => x.url === '/'), mutatedRaw, homeUrl)
      },
    })

    cases.push({
      name: 'drop-a-canonical',
      expectDetected: true,
      mutate: async (m) => {
        const raw = (await readRawBin(rawDir, '/')).toString('utf8')
        const mutatedRaw = raw.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>\s*/i, '')
        if (mutatedRaw === raw) throw new Error('drop-a-canonical: no <link rel=canonical> found in home page raw HTML')
        rebuildHtmlEntryFromRaw(findEntry(m, (x) => x.url === '/'), mutatedRaw, homeUrl)
      },
    })

    cases.push({
      name: 'edit-one-json-ld-field',
      expectDetected: true,
      mutate: async (m) => {
        const raw = (await readRawBin(rawDir, '/')).toString('utf8')
        let touched = false
        const mutatedRaw = raw.replace(
          /(<script[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/i,
          (full, open, inner, close) => {
            let obj
            try {
              obj = JSON.parse(inner)
            } catch {
              return full
            }
            obj.__migrationSelftestMutated__ = `mutated-${Date.now()}`
            touched = true
            return `${open}${JSON.stringify(obj)}${close}`
          },
        )
        if (!touched) throw new Error('edit-one-json-ld-field: no parseable JSON-LD script block found on home page')
        rebuildHtmlEntryFromRaw(findEntry(m, (x) => x.url === '/'), mutatedRaw, homeUrl)
      },
    })

    cases.push({
      name: 'change-one-word-of-body-text',
      expectDetected: true,
      mutate: async (m) => {
        const raw = (await readRawBin(rawDir, '/')).toString('utf8')
        let touched = false
        const mutatedRaw = raw.replace(/(<main\b[^>]*>)([\s\S]*?)(<\/main>)/i, (full, open, inner, close) => {
          const replaced = inner.replace(/>([A-Za-z]{4,})(<)/, (m2, word, gt) => {
            touched = true
            return `>${word}MUTATED${gt}`
          })
          return `${open}${replaced}${close}`
        })
        if (!touched) throw new Error('change-one-word-of-body-text: no replaceable word found inside <main> on home page')
        rebuildHtmlEntryFromRaw(findEntry(m, (x) => x.url === '/'), mutatedRaw, homeUrl)
      },
    })

    cases.push({
      name: 'change-image-url',
      expectDetected: true,
      mutate: async (m) => {
        const raw = (await readRawBin(rawDir, '/')).toString('utf8')
        let touched = 0
        let mutatedRaw = raw.replace(/(<img\b[^>]*\bsrc=["'])(\/_next\/image[^"']*)(["'])/i, (_, a, b, c) => {
          touched++
          return `${a}${b}${b.includes('?') ? '&' : '?'}selftestmut=1${c}`
        })
        mutatedRaw = mutatedRaw.replace(
          /(<img\b(?![^>]*\/_next\/image)[^>]*\bsrc=["'])(\/[^"']+\.(?:svg|png|jpe?g|webp)[^"']*)(["'])/i,
          (_, a, b, c) => {
            touched++
            return `${a}${b}${b.includes('?') ? '&' : '?'}selftestmut=1${c}`
          },
        )
        if (touched === 0) throw new Error('change-image-url: no matching <img src> found on home page')
        rebuildHtmlEntryFromRaw(findEntry(m, (x) => x.url === '/'), mutatedRaw, homeUrl)
      },
    })
  }

  if (redirect) {
    cases.push({
      name: 'flip-redirect-status',
      expectDetected: true,
      mutate: async (m) => {
        const e = findEntry(m, (x) => x.url === redirect.url)
        const alt = { 308: 301, 301: 308, 307: 302, 302: 307 }
        if (e) e.status = alt[e.status] ?? (e.status === 301 ? 308 : 301)
      },
    })
    cases.push({
      name: 'change-a-location',
      expectDetected: true,
      mutate: async (m) => {
        const e = findEntry(m, (x) => x.url === redirect.url)
        if (e) e.location = `${e.location || ''}?mutated=1`
      },
    })

    const redirectTarget = new URL(redirect.url, base).toString()
    const requestedHost = new URL(redirectTarget).host

    cases.push({
      name: 'location-https-to-http',
      expectDetected: true,
      mutate: async (m) => {
        const e = findEntry(m, (x) => x.url === redirect.url)
        if (!e?.location) throw new Error('location-https-to-http: redirect entry has no location')
        const rawLoc = untokenizeLocation(e.location, requestedHost)
        if (!/^https:\/\//i.test(rawLoc)) throw new Error('location-https-to-http: redirect location is not https')
        const httpRaw = rawLoc.replace(/^https:\/\//i, 'http://')
        e.location = normalizeLocation(httpRaw, redirectTarget, KNOWN_HOSTS)
      },
    })

    cases.push({
      name: 'location-www-to-apex',
      expectDetected: true,
      mutate: async (m) => {
        const e = findEntry(m, (x) => x.url === redirect.url)
        if (!e?.location) throw new Error('location-www-to-apex: redirect entry has no location')
        const rawLoc = untokenizeLocation(e.location, requestedHost)
        if (!/www\.growmax\.io/i.test(rawLoc)) throw new Error('location-www-to-apex: redirect location has no www.growmax.io host to flip')
        const apexRaw = rawLoc.replace(/www\.growmax\.io/gi, 'growmax.io')
        e.location = normalizeLocation(apexRaw, redirectTarget, KNOWN_HOSTS)
      },
    })
  }

  cases.push({
    name: 'remove-a-url',
    expectDetected: true,
    mutate: async (m) => {
      // Remove a low-risk, non-special entry so the removal itself is the only signal.
      const idx = m.entries.findIndex((e) => e.url === '/company/about')
      if (idx >= 0) m.entries.splice(idx, 1)
      else m.entries.pop()
    },
  })

  if (sitemap) {
    cases.push({
      name: 'change-sitemap-lastmod-for-blog-url',
      expectDetected: true,
      mutate: async (m) => {
        const raw = (await readRawBin(rawDir, '/sitemap.xml')).toString('utf8')
        const mutatedRaw = raw.replace(
          /(<url>(?:(?!<\/url>)[\s\S])*?<loc>[^<]*\/blog\/[^<]*<\/loc>(?:(?!<\/url>)[\s\S])*?<lastmod>)([^<]*)(<\/lastmod>)/i,
          (_, a, b, c) => `${a}1999-01-01T00:00:00.000Z${c}`,
        )
        if (mutatedRaw === raw) throw new Error('change-sitemap-lastmod-for-blog-url: no <lastmod> found inside a blog <url> block')
        const e = findEntry(m, (x) => x.url === '/sitemap.xml')
        e.sitemapEntries = extractSitemap(mutatedRaw)
      },
    })
  }

  if (apiBlog) {
    const slugs = Object.keys(apiBlog.jsonBySlug || apiBlog.jsonBySlugHash)
    const rebuildJsonBySlug = (items) => {
      const jsonBySlug = {}
      for (const item of items) if (item?.slug) jsonBySlug[item.slug] = canonicalStringify(item)
      return jsonBySlug
    }
    // Splice the recomputed fields into `e` for whichever mode this run is in, clearing the
    // other mode's fields so a stale full-mode field can't mask a compact-mode mutation (see
    // compare.mjs's perSlugHash, which checks jsonBySlugHash before jsonBySlug).
    const applyApiBlogFields = (e, items) => {
      delete e.jsonBySlug
      delete e.jsonBySlugHash
      delete e.slugMultiset
      if (compact) Object.assign(e, buildCompactBlogArrayFields(items))
      else e.jsonBySlug = rebuildJsonBySlug(items)
    }

    cases.push({
      name: 'reorder-api-blog-array',
      expectDetected: false,
      mutate: async (m) => {
        const raw = (await readRawBin(rawDir, '/api/blog')).toString('utf8')
        const parsed = JSON.parse(raw)
        const e = findEntry(m, (x) => x.url === '/api/blog')
        applyApiBlogFields(e, [...parsed].reverse())
      },
    })

    if (slugs.length > 0) {
      cases.push({
        name: 'change-one-field-of-one-api-blog-element',
        expectDetected: true,
        mutate: async (m) => {
          const raw = (await readRawBin(rawDir, '/api/blog')).toString('utf8')
          const parsed = JSON.parse(raw)
          if (!Array.isArray(parsed) || parsed.length === 0)
            throw new Error('change-one-field-of-one-api-blog-element: /api/blog raw body has zero items')
          const mutated = parsed.map((item, i) => (i === 0 ? { ...item, title: `${item.title ?? ''} MUTATED` } : item))
          const e = findEntry(m, (x) => x.url === '/api/blog')
          applyApiBlogFields(e, mutated)
        },
      })
    }
  }

  const blogEmbedded = findEntry(manifest, (e) => e.url === '/blog' && (e.embeddedPostsBySlug || e.embeddedPostsBySlugHash))
  if (blogEmbedded) {
    const applyEmbeddedPostsFields = (e, posts) => {
      delete e.embeddedPostsBySlug
      delete e.embeddedPostsBySlugHash
      delete e.embeddedPostsSlugOrder
      Object.assign(e, compact ? buildCompactEmbeddedPostsFields(posts) : buildFullEmbeddedPostsFields(posts))
    }
    for (const { name, transform } of EMBEDDED_POSTS_MUTATIONS) {
      cases.push({
        name: `embedded-posts-${name}`,
        expectDetected: true,
        mutate: async (m) => {
          const raw = (await readRawBin(rawDir, '/blog')).toString('utf8')
          const posts = extractEmbeddedBlogPosts(raw)
          applyEmbeddedPostsFields(findEntry(m, (x) => x.url === '/blog'), transform(posts))
        },
      })
    }
  }

  cases.push(...buildExpectPathCases(manifest, { rawDir, base, compact }))

  return cases
}

/** Re-parse a captured JSON body and splice it back the way capture.mjs does. */
function rebuildJsonEntry(entry, parsed) {
  entry.json = parsed
  entry.jsonCanonical = canonicalStringify(parsed)
  entry.jsonHash = sha256(Buffer.from(entry.jsonCanonical, 'utf8'))
}

function requireEntry(m, url, caseName) {
  const e = findEntry(m, (x) => x.url === url)
  if (!e) throw new Error(`${caseName}: no ${url} entry in the captured manifest`)
  return e
}

/**
 * Synthetic post-cutover entries (SPEC-04 §2.8) built from RAW Location values through the
 * real normalizeLocation(), exactly as capture.mjs would record them. The live self-test
 * runs pre-cutover, so these URLs can't be captured for real; this proves (a) the tokens in
 * urls.mjs's POST_CUTOVER_ENTRIES are the ones normalizeLocation produces, (b) expect-only
 * entries present on one side only don't raise a presence diff, and (c) a wrong redirect
 * is caught by the expect path.
 */
function buildPostCutoverEntries(overrides = {}) {
  const rawLocations = {
    'http://www.growmax.io/': 'https://www.growmax.io/',
    'http://growmax.io/': 'https://www.growmax.io/',
    'https://growmax.io/': 'https://www.growmax.io/',
    'https://growmax.io/demo': 'https://www.growmax.io/demo',
  }
  return POST_CUTOVER_ENTRIES.map(({ url, expect }) => {
    const o = overrides[url] || {}
    const status = o.status ?? (Array.isArray(expect.status) ? expect.status[0] : expect.status)
    const rawLocation = o.rawLocation ?? rawLocations[url]
    if (!rawLocation) throw new Error(`post-cutover fixture: no raw Location for ${url}`)
    return {
      url,
      source: 'post-cutover',
      status,
      location: normalizeLocation(rawLocation, url, KNOWN_HOSTS),
      contentType: 'text/plain',
      headers: { 'x-robots-tag': null },
      bytes: 0,
      attempts: 1,
      expect: structuredClone(expect),
    }
  })
}

const SYNTHETIC_APPROVAL = {
  approvedBy: 'A1',
  approvedAt: '2026-01-01T00:00:00Z',
  reason: 'selftest synthetic allowlist entry (in-memory only, never written to allowlist.json)',
}

/**
 * P1.2 review r4 cases. Each one names the diff field(s) that MUST appear (`requireFields`),
 * so a case can't pass because some other, unrelated diff happened to show up.
 */
function buildExpectPathCases(manifest, { rawDir, base, compact = false }) {
  const cases = []

  // --- Fixed expectation on /api/admin/session (SPEC-04 §2.4). ---
  const flipIsAdmin = async (m, name) => {
    const raw = (await readRawBin(rawDir, '/api/admin/session')).toString('utf8')
    const parsed = JSON.parse(raw)
    if (parsed?.isAdmin !== false) throw new Error(`${name}: captured /api/admin/session is not {isAdmin:false}`)
    rebuildJsonEntry(requireEntry(m, '/api/admin/session', name), { ...parsed, isAdmin: true })
  }
  cases.push({
    name: 'admin-session-isAdmin-true',
    expectDetected: true,
    requireFields: ['expect-json', 'json'],
    mutate: (m) => flipIsAdmin(m, 'admin-session-isAdmin-true'),
  })
  // Same mutation on BOTH sides: the A/B compare sees nothing, so only the fixed expectation
  // can catch it. Proves the expect path doesn't depend on A being correct.
  cases.push({
    name: 'admin-session-isAdmin-true-both-sides',
    expectDetected: true,
    mutateBothSides: true,
    requireFields: ['expect-json'],
    mutate: (m) => flipIsAdmin(m, 'admin-session-isAdmin-true-both-sides'),
  })

  // --- Fixed expectation on /api/admin/posts (401). ---
  cases.push({
    name: 'admin-posts-status-200',
    expectDetected: true,
    requireFields: ['expect-status', 'status'],
    mutate: async (m) => {
      const e = requireEntry(m, '/api/admin/posts', 'admin-posts-status-200')
      if (e.status !== 401) throw new Error(`admin-posts-status-200: captured /api/admin/posts is ${e.status}, not 401`)
      e.status = 200
    },
  })

  // --- Fixed expectation on /blog?page=2 (SPEC-04 §2.6) + additive A/B compare. ---
  cases.push({
    name: 'blog-page2-drop-x-robots-tag',
    expectDetected: true,
    requireFields: ['expect-x-robots-tag', 'x-robots-tag'],
    mutate: async (m) => {
      const e = requireEntry(m, '/blog?page=2', 'blog-page2-drop-x-robots-tag')
      if (e.headers?.['x-robots-tag'] !== 'noindex, follow')
        throw new Error('blog-page2-drop-x-robots-tag: captured /blog?page=2 has no X-Robots-Tag: noindex, follow')
      e.headers = { ...e.headers, 'x-robots-tag': null }
    },
  })
  // r4 regression: compare.mjs used to `continue` after the expect check, so a URL with an
  // expect block was never A/B compared. A title change on /blog?page=2 must still surface.
  cases.push({
    name: 'blog-page2-change-title-still-ab-compared',
    expectDetected: true,
    requireFields: ['title'],
    mutate: async (m) => {
      const e = requireEntry(m, '/blog?page=2', 'blog-page2-change-title-still-ab-compared')
      if (!e.expect) throw new Error('blog-page2-change-title-still-ab-compared: /blog?page=2 carries no expect block')
      const raw = (await readRawBin(rawDir, '/blog?page=2')).toString('utf8')
      const mutatedRaw = raw.replace(/(<title[^>]*>)([\s\S]*?)(<\/title>)/i, (_, open, inner, close) => `${open}${inner} (mutated)${close}`)
      if (mutatedRaw === raw) throw new Error('blog-page2-change-title-still-ab-compared: no <title> in /blog?page=2')
      rebuildHtmlEntryFromRaw(e, mutatedRaw, new URL('/blog?page=2', base).toString())
    },
  })
  // r4: a broken /admin on B (e.g. a 500) must fail parity through the ordinary A/B compare.
  cases.push({
    name: 'admin-page-status-500',
    expectDetected: true,
    requireFields: ['status'],
    mutate: async (m) => {
      const e = requireEntry(m, '/admin', 'admin-page-status-500')
      e.status = 500
    },
  })

  // --- Post-cutover expect-only entries (SPEC-04 §2.8). A is the pre-cutover baseline
  // without them; B has them. ---
  cases.push({
    name: 'post-cutover-conforming',
    expectDetected: false,
    mutate: async (m) => {
      m.entries.push(...buildPostCutoverEntries())
    },
  })
  cases.push({
    name: 'post-cutover-301-http-self',
    expectDetected: true,
    requireFields: ['expect-status', 'expect-location'],
    mutate: async (m) => {
      const entries = buildPostCutoverEntries({
        'http://www.growmax.io/': { status: 301, rawLocation: 'http://www.growmax.io/' },
      })
      const e = entries.find((x) => x.url === 'http://www.growmax.io/')
      if (e.location !== 'http://<self>/') throw new Error(`post-cutover-301-http-self: normalizeLocation gave ${e.location}`)
      m.entries.push(...entries)
    },
  })
  // A carries the post-cutover set (e.g. P8.2 vs a post-cutover baseline) and B is missing
  // one: the expect path must report it, even though the A/B compare is skipped.
  cases.push({
    name: 'post-cutover-missing-on-b',
    expectDetected: true,
    requireFields: ['expect-presence'],
    mutateA: async (m) => {
      m.entries.push(...buildPostCutoverEntries())
    },
    mutate: async (m) => {
      m.entries.push(...buildPostCutoverEntries().filter((x) => x.url !== 'https://growmax.io/demo'))
    },
  })

  // --- Text allowlist pinning (compare.mjs pins sha256 of the normalized text). Works in
  // both modes (A1 C9): full mode pins sha256Text(robots.text); compact mode pins the
  // already-computed robots.textHash / the mutated body's buildCompactTextFields() hash —
  // same sha256, never recomputed differently between modes. ---
  const robots = findEntry(manifest, (e) => e.url === '/robots.txt')
  const robotsTextFromRaw = async (edit) => {
    const raw = (await readRawBin(rawDir, '/robots.txt')).toString('utf8')
    const edited = edit(raw)
    if (edited === raw) throw new Error('robots.txt text mutation changed nothing')
    return normalizeText(edited)
  }
  const reviewedEdit = (raw) => `${raw.replace(/\s*$/, '')}\n# selftest reviewed change\n`
  const otherEdit = (raw) =>
    /^Allow:\s*\/\s*$/im.test(raw) ? raw.replace(/^Allow:\s*\/\s*$/im, 'Disallow: /') : `${raw.replace(/\s*$/, '')}\nDisallow: /\n`
  const robotsHash = () => {
    if (compact) {
      if (typeof robots?.textHash !== 'string') throw new Error('text-allowlist: /robots.txt has no captured textHash (compact mode)')
      return robots.textHash
    }
    if (!robots || typeof robots.text !== 'string') throw new Error('text-allowlist: /robots.txt has no captured text')
    return sha256Text(robots.text)
  }
  const applyRobotsText = (e, normalized) => {
    delete e.text
    delete e.textHash
    delete e.textPreview
    if (compact) Object.assign(e, buildCompactTextFields(normalized))
    else e.text = normalized
  }
  const pinnedAllowlist = async () => {
    const reviewed = await robotsTextFromRaw(reviewedEdit)
    const reviewedHash = compact ? buildCompactTextFields(reviewed).textHash : sha256Text(reviewed)
    return [
      {
        url: '/robots.txt',
        field: 'text',
        expected: { a: robotsHash(), b: reviewedHash },
        ...SYNTHETIC_APPROVAL,
      },
    ]
  }
  cases.push({
    name: 'text-allowlist-pinned-covers-reviewed-diff',
    expectDetected: false,
    requireAllowlisted: 1,
    allowlist: pinnedAllowlist,
    mutate: async (m) => {
      const normalized = await robotsTextFromRaw(reviewedEdit)
      applyRobotsText(requireEntry(m, '/robots.txt', 'text-allowlist-pinned-covers-reviewed-diff'), normalized)
    },
  })
  cases.push({
    name: 'text-allowlist-pinned-rejects-other-diff',
    expectDetected: true,
    requireFields: ['text'],
    allowlist: pinnedAllowlist,
    mutate: async (m) => {
      const normalized = await robotsTextFromRaw(otherEdit)
      applyRobotsText(requireEntry(m, '/robots.txt', 'text-allowlist-pinned-rejects-other-diff'), normalized)
    },
  })

  return cases
}

/**
 * A1 C9: compact-mode-only signal cases, proving the compact fields' own detectors work —
 * a changed array length and a changed slug multiset — beyond what the mode-agnostic 22
 * cases above already prove (a changed per-slug hash is already covered by
 * 'change-one-field-of-one-api-blog-element' run in compact mode). Not part of
 * REQUIRED_CASE_NAMES: these only ever run against a compact manifest.
 */
function buildCompactOnlySignalCases(manifest, { rawDir }) {
  const apiBlog = findEntry(manifest, (e) => e.url === '/api/blog' && e.jsonBySlugHash)
  if (!apiBlog) return []
  const applyCompactFields = (e, items) => {
    delete e.jsonBySlugHash
    delete e.slugMultiset
    Object.assign(e, buildCompactBlogArrayFields(items))
  }
  return [
    {
      name: 'compact-array-length-changed',
      expectDetected: true,
      requireFields: ['jsonBySlug.<count>'],
      mutate: async (m) => {
        const raw = (await readRawBin(rawDir, '/api/blog')).toString('utf8')
        const parsed = JSON.parse(raw)
        if (parsed.length < 2) throw new Error('compact-array-length-changed: /api/blog has fewer than 2 items')
        applyCompactFields(findEntry(m, (x) => x.url === '/api/blog'), parsed.slice(0, -1))
      },
    },
    {
      name: 'compact-slug-multiset-changed',
      expectDetected: true,
      requireFields: ['jsonBySlug.<slugs>'],
      mutate: async (m) => {
        const raw = (await readRawBin(rawDir, '/api/blog')).toString('utf8')
        const parsed = JSON.parse(raw)
        if (parsed.length < 2) throw new Error('compact-slug-multiset-changed: /api/blog has fewer than 2 items')
        // Same array length, same hashes for untouched items: only the LAST item's slug is
        // overwritten with the FIRST item's slug, so the first slug's count goes 1 -> 2 and
        // the original last slug disappears — jsonArrayLength is unchanged, isolating this
        // from the array-length case above.
        const mutated = parsed.map((item, i) => (i === parsed.length - 1 ? { ...item, slug: parsed[0].slug } : item))
        applyCompactFields(findEntry(m, (x) => x.url === '/api/blog'), mutated)
      },
    },
  ]
}

async function runMutationSelfTest(manifest, { rawDir, base, compact = false, extraCases = [] }) {
  const cases = await buildMutationCases(manifest, { rawDir, base, compact })

  const builtNames = new Set(cases.map((c) => c.name))
  const missing = REQUIRED_CASE_NAMES.filter((n) => !builtNames.has(n))
  if (missing.length > 0) {
    throw new Error(
      `mutation self-test is missing required case(s) — a fixture was unavailable in this capture: ${missing.join(', ')}`,
    )
  }
  // extraCases (A1 C9's compact-only signal cases) are appended AFTER the required-case
  // check above, so they're never allowed to hide a missing required (mode-agnostic) case.
  const allCases = [...cases, ...extraCases]

  // Detection is measured against the unmutated self-compare: a case "detects" its mutation
  // only if it produces a failing (non-report-only, non-allowlisted) diff that the self-compare
  // did not already have. Any diff in the self-compare itself (an ambient `expect` violation
  // included) already fails check 'self-compare-zero-diffs', so it is never filtered away;
  // it just can't make a must-not-detect case like 'reorder-api-blog-array' look detected.
  const diffKey = (d) => `${d.url}\u0000${d.field}\u0000${JSON.stringify(d.a)}\u0000${JSON.stringify(d.b)}`
  const baseline = await compareManifests(manifest, manifest, {})
  const baselineKeys = new Set(baseline.diffs.filter((d) => !d.reportOnly && !d.allowlisted).map(diffKey))

  const results = []
  for (const c of allCases) {
    const mutated = structuredClone(manifest)
    const mutatedA = c.mutateBothSides || c.mutateA ? structuredClone(manifest) : manifest
    let allowlist = []
    try {
      await c.mutate(mutated)
      if (c.mutateBothSides) await c.mutate(mutatedA)
      if (c.mutateA) await c.mutateA(mutatedA)
      if (c.allowlist) allowlist = await c.allowlist()
    } catch (err) {
      results.push({ name: c.name, expectDetected: c.expectDetected, error: String(err.message || err), pass: false })
      continue
    }
    const diff = await compareManifests(mutatedA, mutated, { allowlist })
    const newFailing = diff.diffs.filter((d) => !d.reportOnly && !d.allowlisted && !baselineKeys.has(diffKey(d)))
    const detected = newFailing.length >= 1 && diff.failedUnallowed >= 1
    const fields = [...new Set(newFailing.map((d) => d.field))].sort()
    const missingFields = (c.requireFields || []).filter((f) => !fields.includes(f))
    const allowlistedOk = c.requireAllowlisted === undefined || diff.allowlisted >= c.requireAllowlisted
    results.push({
      name: c.name,
      expectDetected: c.expectDetected,
      detected,
      failedUnallowed: diff.failedUnallowed,
      detectedFields: fields,
      ...(c.requireFields ? { requireFields: c.requireFields, missingFields } : {}),
      ...(c.requireAllowlisted !== undefined ? { allowlisted: diff.allowlisted, requireAllowlisted: c.requireAllowlisted } : {}),
      pass: detected === c.expectDetected && missingFields.length === 0 && allowlistedOk,
    })
  }
  return results
}

/** SPEC-04 §2.4/§2.6/§2.8: exactly these URLs carry an `expect` block, with exactly these
 *  expectations; the post-cutover set matches §2.8. Catches an expectation on the wrong URL
 *  (r4) even when the live site would happen to satisfy it. */
function checkInventoryExpectBlocks(urls) {
  const actual = {}
  for (const u of urls) if (u.expect) actual[u.url] = u.expect
  const problems = []
  for (const [url, want] of Object.entries(SPEC_EXPECT_URLS)) {
    if (!(url in actual)) problems.push(`${url}: missing expect block`)
    else if (canonicalStringify(actual[url]) !== canonicalStringify(want))
      problems.push(`${url}: expect ${canonicalStringify(actual[url])} != spec ${canonicalStringify(want)}`)
  }
  for (const url of Object.keys(actual)) if (!(url in SPEC_EXPECT_URLS)) problems.push(`${url}: unexpected expect block`)
  const postCutoverUrls = POST_CUTOVER_ENTRIES.map((e) => e.url)
  if (canonicalStringify(postCutoverUrls) !== canonicalStringify(SPEC_POST_CUTOVER_URLS))
    problems.push(`POST_CUTOVER_ENTRIES ${JSON.stringify(postCutoverUrls)} != spec ${JSON.stringify(SPEC_POST_CUTOVER_URLS)}`)
  if (urls.some((u) => u.source === 'post-cutover')) problems.push('live self-test inventory unexpectedly includes post-cutover URLs')
  return { pass: problems.length === 0, detail: { expectUrls: Object.keys(actual).sort(), postCutoverUrls, problems } }
}

/** Sanity-check the REAL extractor against the live baseline, so an extractor that quietly
 *  returns nothing (empty text, no JSON-LD, no links, no assets) can't hide behind an
 *  all-hashes-match self-compare. */
async function extractorSanityCheck(rawDir, base) {
  const raw = (await readRawBin(rawDir, '/')).toString('utf8')
  const homeUrl = new URL('/', base).toString()
  const extracted = extractHtml(raw, homeUrl)
  const problems = []
  if (!extracted.visibleText || extracted.visibleText.trim().length === 0) problems.push('visibleText is empty')
  if (!extracted.jsonLdCount || extracted.jsonLdCount < 1) problems.push('no JSON-LD blocks found')
  if (!extracted.internalLinks || extracted.internalLinks.length < 1) problems.push('no internal links found')
  if (!extracted.assetRefs || extracted.assetRefs.length < 1) problems.push('no asset references (img/link) found')
  return {
    pass: problems.length === 0,
    detail: {
      visibleTextLength: extracted.visibleText?.length ?? 0,
      jsonLdCount: extracted.jsonLdCount ?? 0,
      internalLinksCount: extracted.internalLinks?.length ?? 0,
      assetRefsCount: extracted.assetRefs?.length ?? 0,
      problems,
    },
  }
}

/** SPEC-04 §5.4 (per review): a reachability floor on the sitemap source, so a run where A
 *  and B are both silently answered by e.g. a proxy denial page (every non-404 URL then
 *  compares equal) fails loudly instead of passing. */
function reachabilityFloor(manifest) {
  const sitemapEntries = manifest.entries.filter((e) => e.source === 'sitemap')
  const ok = sitemapEntries.filter((e) => !e.error && typeof e.status === 'number' && e.status >= 200 && e.status < 400)
  const ratio = sitemapEntries.length > 0 ? ok.length / sitemapEntries.length : 0
  return {
    pass: ratio >= REACHABILITY_FLOOR,
    detail: { total: sitemapEntries.length, okCount: ok.length, ratio, floor: REACHABILITY_FLOOR },
  }
}

/** Per review (blocking fix, fetcher.mjs): prove the --resolve pinned-DNS dispatcher (SPEC-04
 *  §3's Sandbox capture path) actually works, by fetching a local server through it. Node
 *  22's autoSelectFamily calls the custom lookup with `{all:true}` and expects an array back
 *  — the un-fixed lookup always called back with a bare (ip, family), which made every
 *  pinned request fail with "Invalid IP address: undefined". */
/** Every HTML entry carries a linkHeaderRefs array; each header preload ref is in that page's
 *  assetRefs (compared with `dpl` stripped) and was fetched by captureAssets with a 2xx.
 *
 *  P6.2 harness hardening (reviewer finding):
 *  - The asset is looked up under the key capture.mjs actually STORED. When a header ref was
 *    de-duplicated against an HTML ref of a different dpl form (header /x.css vs HTML
 *    /x.css?dpl=...), only the HTML form is in assetRefs, so only that form was fetched and
 *    keyed in manifest.assets; looking up the raw header form would report a false
 *    notFetched2xx.
 *  - A page (or a whole base) with no `Link` header preloads does not fail the check: a
 *    prerendered deployment legitimately sends none. pagesWithHeaderPreloads is reported so a
 *    reader can see how much the check actually exercised. */
function liveLinkHeaderCheck(manifest) {
  const stripDpl = (r) => {
    const q = r.indexOf('?')
    if (q === -1) return r
    const params = new URLSearchParams(r.slice(q + 1))
    params.delete('dpl')
    const rest = params.toString()
    return rest ? `${r.slice(0, q)}?${rest}` : r.slice(0, q)
  }
  const html = manifest.entries.filter((e) => Array.isArray(e.assetRefs))
  const missingField = html.filter((e) => !Array.isArray(e.linkHeaderRefs)).map((e) => e.url)
  const withHeader = html.filter((e) => (e.linkHeaderRefs || []).length > 0)
  const problems = []
  let dedupedToOtherForm = 0
  for (const e of withHeader) {
    // dpl-stripped form -> the assetRef capture.mjs stored (and captureAssets fetched).
    const storedByKey = new Map()
    for (const ref of e.assetRefs) if (!storedByKey.has(stripDpl(ref))) storedByKey.set(stripDpl(ref), ref)
    for (const r of e.linkHeaderRefs) {
      const stored = storedByKey.get(stripDpl(r))
      if (stored === undefined) {
        problems.push({ url: e.url, notInAssetRefs: r })
        continue
      }
      if (stored !== r) dedupedToOtherForm++
      const a = manifest.assets?.[stored]
      if (!a || !(a.status >= 200 && a.status < 300)) problems.push({ url: e.url, notFetched2xx: stored, headerRef: r, asset: a || null })
    }
  }
  const pass = missingField.length === 0 && problems.length === 0
  return {
    pass,
    detail: {
      htmlEntries: html.length,
      missingLinkHeaderRefsField: missingField.slice(0, 10),
      pagesWithHeaderPreloads: withHeader.length,
      headerRefsDedupedToAnotherForm: dedupedToOtherForm,
      sample: withHeader[0] ? { url: withHeader[0].url, linkHeaderRefs: withHeader[0].linkHeaderRefs } : null,
      problems: problems.slice(0, 20),
    },
  }
}

/** Offline guard for liveLinkHeaderCheck itself (P6.2 harness hardening): (a) a header ref
 *  de-duplicated onto an HTML ref of another dpl form is looked up under the stored HTML form
 *  and passes; (b) a manifest with no header preloads at all passes; (c) a header ref whose
 *  stored asset is not 2xx, and one missing from assetRefs, still fail. */
function testLinkHeaderCheckStoredKeyAndNoHeader() {
  const page = (url, assetRefs, linkHeaderRefs) => ({ url, status: 200, contentType: 'text/html', assetRefs, linkHeaderRefs })
  const ok = { status: 200, contentType: 'text/css' }
  const dedupe = liveLinkHeaderCheck({
    entries: [page('/blog/p', ['/x.css?dpl=dpl_SelftestOnly', '/f.woff2'], ['/f.woff2', '/x.css'])],
    assets: { '/x.css?dpl=dpl_SelftestOnly': ok, '/f.woff2': ok },
  })
  const noHeader = liveLinkHeaderCheck({ entries: [page('/', ['/a.css'], []), page('/about', [], [])], assets: { '/a.css': ok } })
  const bad404 = liveLinkHeaderCheck({ entries: [page('/p', ['/y.css?dpl=d1'], ['/y.css'])], assets: { '/y.css?dpl=d1': { status: 404 } } })
  const notIn = liveLinkHeaderCheck({ entries: [page('/p', ['/a.css'], ['/z.css'])], assets: { '/a.css': ok, '/z.css': ok } })
  const pass = dedupe.pass && dedupe.detail.headerRefsDedupedToAnotherForm === 1 && noHeader.pass && !bad404.pass && !notIn.pass
  return { pass, detail: { dedupe: dedupe.detail, noHeader: noHeader.detail, bad404: bad404.detail.problems, notIn: notIn.detail.problems } }
}

async function testResolveDispatcher() {
  const http = await import('node:http')
  const server = http.createServer((_req, res) => {
    res.writeHead(200, { 'content-type': 'text/plain' })
    res.end('pinned-ok')
  })
  await new Promise((resolve, reject) => {
    server.on('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  try {
    const port = server.address().port
    const dispatcher = await buildResolveDispatcher([`migration-selftest.invalid:${port}:127.0.0.1`])
    const res = await fetch(`http://migration-selftest.invalid:${port}/`, { dispatcher })
    const text = await res.text()
    return { pass: res.status === 200 && text === 'pinned-ok', detail: { status: res.status, text } }
  } catch (err) {
    return { pass: false, detail: { error: String(err.message || err) } }
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
}

/**
 * A1 C9: derive a compact-mode-equivalent manifest from an already-captured FULL manifest,
 * offline (no second live capture) — by re-running the raw /api/blog body and every
 * text/plain raw body already saved to `rawDir` through the SAME compaction functions
 * (buildCompactBlogArrayFields / buildCompactTextFields) real compact-mode capture.mjs
 * calls. This is "the same capture code path" C9 requires, just applied to bytes already on
 * disk instead of a fresh network round-trip.
 */
async function toCompactManifest(fullManifest, rawDir) {
  const clone = structuredClone(fullManifest)
  clone.compact = true
  for (const e of clone.entries) {
    if (e.url === '/api/blog' && e.jsonBySlug) {
      const raw = (await readRawBin(rawDir, '/api/blog')).toString('utf8')
      const parsed = JSON.parse(raw)
      delete e.jsonCanonical
      delete e.jsonHash
      delete e.jsonBySlug
      Object.assign(e, buildCompactBlogArrayFields(parsed))
    } else if (typeof e.text === 'string') {
      const fields = buildCompactTextFields(e.text)
      delete e.text
      Object.assign(e, fields)
    }
    if (e.embeddedPostsBySlug) {
      const raw = (await readRawBin(rawDir, e.url)).toString('utf8')
      const posts = extractEmbeddedBlogPosts(raw)
      delete e.embeddedPostsBySlug
      Object.assign(e, buildCompactEmbeddedPostsFields(posts))
    }
  }
  return clone
}

/**
 * SPEC-04 addendum coverage checks, against a fake in-memory site (no network):
 *  (a) a /api/blog slug absent from the sitemap still lands in the inventory, tagged
 *      'blog-api-slug';
 *  (b) a failed (network-error) /api/blog fetch fails inventory building loudly;
 *  (c) a failed B-sitemap fetch (source 'sitemap-b') also fails loudly, when a B base is
 *      given; and, positively, a B-only sitemap URL lands tagged 'sitemap-b'.
 */
async function testCoverageSources() {
  const fakeBase = 'https://coverage-selftest-a.invalid'
  const fakeBaseB = 'https://coverage-selftest-b.invalid'
  const sitemapXmlA = `<?xml version="1.0"?><urlset><url><loc>${fakeBase}/blog/in-sitemap</loc></url></urlset>`
  const sitemapXmlB = `<?xml version="1.0"?><urlset><url><loc>${fakeBaseB}/blog/only-in-b-sitemap</loc></url></urlset>`
  const apiBlogBody = JSON.stringify([
    { slug: 'in-sitemap', created_at: '2026-01-01T00:00:00Z' },
    { slug: 'missing-from-sitemap', created_at: '2026-01-02T00:00:00Z' },
  ])
  const okText = (text) => ({ ok: true, res: { status: 200 }, buf: Buffer.from(text, 'utf8') })
  const notFound = { ok: true, res: { status: 404 }, buf: Buffer.from('') }

  let missingLandedOk = false
  let missingLandedErr = null
  let sitemapBLandedOk = false
  try {
    const fetchOk = async (url) => {
      if (url === `${fakeBase}/sitemap.xml`) return okText(sitemapXmlA)
      if (url === `${fakeBaseB}/sitemap.xml`) return okText(sitemapXmlB)
      if (url === `${fakeBase}/api/blog`) return okText(apiBlogBody)
      return notFound
    }
    const { list } = await buildInventory({ base: fakeBase, baseB: fakeBaseB, fetchImpl: fetchOk })
    const entry = list.find((u) => u.url === '/blog/missing-from-sitemap')
    missingLandedOk = !!entry && entry.source === 'blog-api-slug'
    const bEntry = list.find((u) => u.url === '/blog/only-in-b-sitemap')
    sitemapBLandedOk = !!bEntry && bEntry.source === 'sitemap-b'
  } catch (err) {
    missingLandedErr = String(err.message || err)
  }

  let apiBlogFailureThrew = false
  try {
    const fetchApiBlogFails = async (url) => {
      if (url === `${fakeBase}/sitemap.xml`) return okText(sitemapXmlA)
      if (url === `${fakeBase}/api/blog`) return { ok: false, error: new Error('simulated /api/blog fetch failure') }
      return notFound
    }
    await buildInventory({ base: fakeBase, fetchImpl: fetchApiBlogFails })
  } catch {
    apiBlogFailureThrew = true
  }

  let bSitemapFailureThrew = false
  try {
    const fetchBSitemapFails = async (url) => {
      if (url === `${fakeBase}/sitemap.xml`) return okText(sitemapXmlA)
      if (url === `${fakeBase}/api/blog`) return okText(apiBlogBody)
      if (url === `${fakeBaseB}/sitemap.xml`) return { ok: false, error: new Error('simulated B sitemap.xml fetch failure') }
      return notFound
    }
    await buildInventory({ base: fakeBase, baseB: fakeBaseB, fetchImpl: fetchBSitemapFails })
  } catch {
    bSitemapFailureThrew = true
  }

  return {
    pass: missingLandedOk && sitemapBLandedOk && apiBlogFailureThrew && bSitemapFailureThrew,
    detail: { missingLandedOk, missingLandedErr, sitemapBLandedOk, apiBlogFailureThrew, bSitemapFailureThrew },
  }
}

/** A1 C8: the tie-permutation checker itself passes a pure tie permutation (swap within an
 *  equal-created_at group) and fails a cross-group reorder, using synthetic posts (no
 *  network — this is a unit check on tie-permutation.mjs, not a live capture). */
function testTiePermutationChecker() {
  const now = Date.parse('2026-01-01T00:00:00Z')
  const postsA = [
    { slug: 'a', createdAt: now, published: true },
    { slug: 'b', createdAt: now, published: true },
    { slug: 'c', createdAt: now - 1000, published: true },
    { slug: 'd', createdAt: now - 2000, published: true },
  ]
  const purePermutation = [postsA[1], postsA[0], postsA[2], postsA[3]] // swap a/b (equal created_at)
  const crossGroupReorder = [postsA[0], postsA[2], postsA[1], postsA[3]] // swap b/c (different created_at)

  const pureResult = checkTiePermutation({ postsA, postsB: purePermutation, topN: 2 })
  const crossResult = checkTiePermutation({ postsA, postsB: crossGroupReorder })

  return {
    pass: pureResult.pass === true && crossResult.pass === false && crossResult.reason === 'cross-group-reorder',
    detail: { pureResult, crossResult },
  }
}

/**
 * A1 C8, per review: tie-permutation.mjs is not a valid proof unless it works ON THE PAGE
 * itself. This builds its cases from the SAME live capture's REAL raw bodies (never
 * synthetic strings): for each of URL_KINDS ('/', '/sitemap.xml', '/llms.txt',
 * '/llms-full.txt') plus '/blog' (order + content-hash residual, see checkBlogPageResidual),
 * A-vs-A (self) must pass, and A-vs-(A + one extra text edit) must fail.
 */
async function testTiePermutationRealData(rawDir) {
  const problems = []
  const details = {}

  const apiBlogRaw = JSON.parse((await readRawBin(rawDir, '/api/blog')).toString('utf8'))
  const posts = postsFromApiBlogBody(apiBlogRaw)
  const createdAtBySlug = Object.fromEntries(posts.map((p) => [p.slug, p.createdAt]))
  const normalizedFor = (kind, raw) => (kind === 'href' ? normalizeHtmlNoise(raw) : normalizeText(raw))

  for (const [url, kind] of Object.entries(URL_KINDS)) {
    let rawText
    try {
      rawText = (await readRawBin(rawDir, url)).toString('utf8')
    } catch (err) {
      problems.push(`${url}: no raw body captured (${err.message})`)
      continue
    }
    const normalized = normalizedFor(kind, rawText)
    const topN = url === '/' ? 4 : undefined

    const self = checkPageTiePermutation({ url, kind, rawTextA: normalized, rawTextB: normalized, createdAtBySlug, topN })
    if (!self.pass) problems.push(`${url}: A-vs-A self-compare did not pass (${self.reason})`)

    // A-vs-(A + one extra text edit) must fail. The appended text lands either in the
    // trailing fixed region (sitemap's explicit <url> block ends) or extends the last
    // detected post's own block (open-ended kinds) — either way it's a genuine byte
    // difference the residual check must catch.
    const edited = `${normalized}\n<!-- migration-selftest tie-permutation real-data edit -->`
    const mutated = checkPageTiePermutation({ url, kind, rawTextA: normalized, rawTextB: edited, createdAtBySlug, topN })
    if (mutated.pass) problems.push(`${url}: A-vs-(A+edit) unexpectedly passed`)

    details[url] = { selfPass: self.pass, selfReason: self.reason, mutatedPass: mutated.pass, mutatedReason: mutated.reason }
  }

  try {
    const blogRaw = (await readRawBin(rawDir, '/blog')).toString('utf8')
    const blogNormalized = normalizeHtmlNoise(blogRaw)
    const blogSelf = checkPageTiePermutation({
      url: '/blog',
      kind: 'blog-embedded-json',
      rawTextA: blogNormalized,
      rawTextB: blogNormalized,
      createdAtBySlug,
    })
    if (!blogSelf.pass) problems.push(`/blog: order+residual self-compare did not pass (${blogSelf.reason})`)

    // checkBlogPageResidual on its own (per review: uses the PAGE'S OWN embedded objects,
    // never /api/blog's), with a real edit on one field.
    const blogPosts = extractEmbeddedBlogPosts(blogNormalized)
    const slugOrderA = blogPosts.map((p) => p.slug)
    const residualSelf = checkBlogPageResidual({ postsA: blogPosts, postsB: blogPosts, slugOrder: slugOrderA })
    if (!residualSelf.pass) problems.push('/blog: residual self-compare did not pass')

    const editedPosts = blogPosts.map((p, i) => (i === 0 ? { ...p, excerpt: `${p.excerpt ?? ''} MUTATED` } : p))
    const residualMutated = checkBlogPageResidual({ postsA: blogPosts, postsB: editedPosts, slugOrder: slugOrderA })
    if (residualMutated.pass) problems.push('/blog: residual A-vs-(A+edit) unexpectedly passed')

    details['/blog'] = {
      selfPass: blogSelf.pass,
      selfReason: blogSelf.reason,
      residualSelfPass: residualSelf.pass,
      residualMutatedPass: residualMutated.pass,
    }
  } catch (err) {
    problems.push(`/blog: ${String(err.message || err)}`)
  }

  return { pass: problems.length === 0, detail: { problems, cases: details } }
}

/**
 * A1 C8, per review: a REAL tie-swap fixture — two posts sharing the exact SAME created_at
 * in A's own /llms.txt order, physically swapped (a genuine within-tie-group permutation,
 * the kind a nondeterministic restore could produce) — must PASS; the same swap plus one
 * extra edit must FAIL. Built via tie-permutation.mjs's own extractOrderedSlugs/
 * buildReorderedText (the exact machinery the real check itself uses), never a synthetic
 * string built by hand.
 */
async function testTieSwapRealData(rawDir) {
  const apiBlogRaw = JSON.parse((await readRawBin(rawDir, '/api/blog')).toString('utf8'))
  const posts = postsFromApiBlogBody(apiBlogRaw)
  const createdAtBySlug = Object.fromEntries(posts.map((p) => [p.slug, p.createdAt]))
  const rawText = normalizeText((await readRawBin(rawDir, '/llms.txt')).toString('utf8'))
  const order = extractOrderedSlugs('llms-line', rawText)

  const byCreatedAt = new Map()
  order.forEach((slug, i) => {
    if (i === 0) return // skip the pinned-fallback slot (see tie-permutation.mjs's header)
    const ca = createdAtBySlug[slug]
    if (ca === undefined) return
    if (!byCreatedAt.has(ca)) byCreatedAt.set(ca, [])
    byCreatedAt.get(ca).push(i)
  })
  let pair = null
  for (const idxs of byCreatedAt.values()) {
    if (idxs.length >= 2) {
      pair = [idxs[0], idxs[1]]
      break
    }
  }
  if (!pair) {
    return { pass: false, detail: { error: 'no tie group with >=2 members found in /llms.txt to build a real swap fixture' } }
  }

  const swappedOrder = [...order]
  ;[swappedOrder[pair[0]], swappedOrder[pair[1]]] = [swappedOrder[pair[1]], swappedOrder[pair[0]]]
  const swappedText = buildReorderedText('llms-line', rawText, swappedOrder)

  const legit = checkPageTiePermutation({ url: '/llms.txt', kind: 'llms-line', rawTextA: rawText, rawTextB: swappedText, createdAtBySlug })
  const swappedPlusEditedText = `${swappedText}\n<!-- migration-selftest tie-swap-plus-edit -->`
  const swapPlusEdit = checkPageTiePermutation({
    url: '/llms.txt',
    kind: 'llms-line',
    rawTextA: rawText,
    rawTextB: swappedPlusEditedText,
    createdAtBySlug,
  })

  return {
    pass: legit.pass === true && swapPlusEdit.pass === false,
    detail: {
      swappedSlugs: [order[pair[0]], order[pair[1]]],
      legitSwap: { pass: legit.pass, reason: legit.reason },
      swapPlusEdit: { pass: swapPlusEdit.pass, reason: swapPlusEdit.reason },
    },
  }
}

/** Build one `self.__next_f.push([1,"<data>"])` <script> tag whose recovered string is
 *  exactly `text` — matching how a real Next.js page embeds each flight chunk. */
function buildFlightPushScript(text) {
  return `<script>self.__next_f.push([1,${JSON.stringify(text)}])</script>`
}

/**
 * A1 C9/addendum, per review (non-blocking): extractEmbeddedBlogPosts must parse correctly
 * regardless of how Next.js batches rows into push() calls — a real live capture had 6 of 13
 * push() calls each holding SEVERAL rows, and this proves the extractor handles that AND the
 * reverse (one row split across two calls), using the REAL 172-post row recovered from a live
 * /blog capture, not a synthetic array.
 */
async function testFlightRowBatchingRobustness(rawDir) {
  const raw = (await readRawBin(rawDir, '/blog')).toString('utf8')
  const realPosts = extractEmbeddedBlogPosts(raw)
  const postsRowData = `6:${JSON.stringify(realPosts)}`

  // Case 1: the posts row MERGED into one push() call alongside other (non-JSON) rows
  // before and after it — exactly the batching shape found live.
  const mergedJoined = `5:I[123,[],""]\n${postsRowData}\n7:I[456,[],""]\n`
  const mergedHtml = `<!doctype html><html><body>${buildFlightPushScript(mergedJoined)}</body></html>`
  let mergedPosts = null
  let mergedError = null
  try {
    mergedPosts = extractEmbeddedBlogPosts(mergedHtml)
  } catch (err) {
    mergedError = String(err.message || err)
  }

  // Case 2: the SAME posts row's payload split across TWO push() calls, mid-JSON.
  const splitPoint = Math.floor(postsRowData.length / 2)
  const splitJoined1 = `5:I[123,[],""]\n${postsRowData.slice(0, splitPoint)}`
  const splitJoined2 = `${postsRowData.slice(splitPoint)}\n7:I[456,[],""]\n`
  const splitHtml = `<!doctype html><html><body>${buildFlightPushScript(splitJoined1)}${buildFlightPushScript(splitJoined2)}</body></html>`
  let splitPosts = null
  let splitError = null
  try {
    splitPosts = extractEmbeddedBlogPosts(splitHtml)
  } catch (err) {
    splitError = String(err.message || err)
  }

  const realSlugs = realPosts.map((p) => p.slug)
  const mergedOk = mergedPosts !== null && mergedPosts.length === realPosts.length && JSON.stringify(mergedPosts.map((p) => p.slug)) === JSON.stringify(realSlugs)
  const splitOk = splitPosts !== null && splitPosts.length === realPosts.length && JSON.stringify(splitPosts.map((p) => p.slug)) === JSON.stringify(realSlugs)

  return {
    pass: mergedOk && splitOk,
    detail: {
      realPostCount: realPosts.length,
      merged: { pass: mergedOk, extractedCount: mergedPosts?.length ?? null, error: mergedError },
      splitAcrossChunks: { pass: splitOk, extractedCount: splitPosts?.length ?? null, error: splitError },
    },
  }
}

/**
 * Blocking fix (round 3 review): compareEntry() used to only diff embeddedPostsError when
 * the two sides' errors DIFFERED, so A and B failing identically produced NO diff at all
 * (failedUnallowed stayed 0) and the listing silently dropped out of parity. Also proves
 * checkEmbeddedPostsCoverage()'s manifest-level `harness.embeddedPosts` marker: a 2xx /blog
 * entry with neither the embeddedPosts* fields nor an error must fail ONLY when the manifest
 * declares it ran the new capture code, never for an older manifest without that marker.
 */
async function testEmbeddedPostsCoverageGuard() {
  const problems = []

  const mkManifest = (entry, harness) => ({ entries: [entry], assets: {}, harness })
  const errorEntry = (message) => ({
    url: '/blog',
    status: 200,
    contentType: 'text/html',
    headers: {},
    html: {},
    embeddedPostsError: message,
  })
  const bareEntry = { url: '/blog', status: 200, contentType: 'text/html', headers: {}, html: {} }

  const sameError = await compareManifests(
    mkManifest(errorEntry('same parse failure'), { embeddedPosts: 1 }),
    mkManifest(errorEntry('same parse failure'), { embeddedPosts: 1 }),
    {},
  )
  const sameErrorDetected = sameError.failedUnallowed >= 1 && sameError.diffs.some((d) => d.field === 'embeddedPostsError')
  if (!sameErrorDetected) problems.push('same embeddedPostsError on both sides was not detected as a failing diff')

  const missingBothNewCode = await compareManifests(mkManifest(bareEntry, { embeddedPosts: 1 }), mkManifest(bareEntry, { embeddedPosts: 1 }), {})
  const missingBothDetected = missingBothNewCode.failedUnallowed >= 1 && missingBothNewCode.diffs.some((d) => d.field === 'embeddedPostsMissing')
  if (!missingBothDetected) problems.push('a new-code 2xx /blog entry with neither fields nor error was not detected')

  const missingBothOldManifest = await compareManifests(mkManifest(bareEntry, undefined), mkManifest(bareEntry, undefined), {})
  const oldManifestNotFlagged = !missingBothOldManifest.diffs.some((d) => d.field === 'embeddedPostsMissing')
  if (!oldManifestNotFlagged) problems.push('an OLD manifest (no harness.embeddedPosts marker) was wrongly flagged by embeddedPostsMissing')

  return {
    pass: problems.length === 0,
    detail: {
      problems,
      sameErrorDetected,
      missingBothDetected,
      oldManifestNotFlagged,
    },
  }
}

function nowUtc() {
  try {
    return execSync('date -u +%FT%TZ').toString().trim()
  } catch {
    return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
  }
}

function gitSha() {
  try {
    return execSync('git rev-parse HEAD', { cwd: REPO_ROOT }).toString().trim()
  } catch {
    return null
  }
}

/** Names of tracked-or-untracked files under the harness dirs that differ from HEAD (dirty
 *  working tree), so evidence can't be mistaken for having been checked against a clean,
 *  committed version of the code. */
function gitDirtyHarnessFiles(relDirs) {
  try {
    const args = relDirs.map((d) => `"${d}"`).join(' ')
    const out = execSync(`git status --porcelain -- ${args}`, { cwd: REPO_ROOT }).toString().trim()
    return out.length > 0 ? out.split('\n') : []
  } catch {
    return null
  }
}

async function walkFiles(dir) {
  const out = []
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.scratch') continue
      out.push(...(await walkFiles(full)))
    } else if (ent.isFile()) {
      out.push(full)
    }
  }
  return out
}

/** sha256 of every file under the harness dirs this run exercised, so evidence can be tied
 *  to the exact code that produced it — not just a "checkedAt" timestamp that may predate
 *  a same-second edit to capture.mjs/compare.mjs/extract.mjs. */
async function hashHarnessFiles() {
  const relDirs = ['parity', 'functional', 'visual', 'perf']
  const hashes = {}
  for (const relDir of relDirs) {
    const dir = path.join(REPO_ROOT, 'scripts', 'migration', relDir)
    const files = await walkFiles(dir)
    files.sort()
    for (const f of files) {
      const rel = path.relative(REPO_ROOT, f)
      hashes[rel] = sha256(await readFile(f))
    }
  }
  return hashes
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const base = args.base
  const out =
    args.out || path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', 'evidence', 'P1.2-harness-selftest.json')
  if (!base) {
    console.error('Usage: node selftest.mjs --base <origin> [--out <evidence.json>]')
    process.exit(2)
  }

  const scratchRoot = path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', '.scratch', 'selftest')
  await mkdir(scratchRoot, { recursive: true })

  const checks = []

  console.log(`[selftest] building URL inventory for ${base} ...`)
  const { list: urls, counts } = await buildInventory({ base })
  console.log(`[selftest] inventory: ${urls.length} URLs`)

  // --- Check 1: capture once, compare manifest with itself -> 0 diffs. ---
  console.log('[selftest] capturing manifest A ...')
  const rawDirA = path.join(scratchRoot, 'raw-a')
  const manifestA = await capture({ base, urls, rawDir: rawDirA, concurrency: 4 })
  const errorsA = manifestA.entries.filter((e) => e.error)
  console.log(`[selftest] manifest A: ${manifestA.count} entries, ${errorsA.length} fetch errors`)

  const selfDiff = await compareManifests(manifestA, manifestA, {})
  // SPEC-04 §5.1: '→ 0 diffs'. Nothing is filtered out (P1.2 review r4): an `expect`
  // violation here is a real gap between the live site and a fixed requirement, and compare
  // could never exit 0 on it at G5/G6a/G8a, so the self-test must fail too.
  const selfExpectationViolations = selfDiff.diffs.filter((d) => String(d.field).startsWith('expect-'))
  const selfCheckPass = selfDiff.diffs.length === 0 && selfDiff.failedUnallowed === 0
  checks.push({
    name: 'self-compare-zero-diffs',
    pass: selfCheckPass,
    detail: {
      compared: selfDiff.compared,
      failedUnallowed: selfDiff.failedUnallowed,
      diffs: selfDiff.diffs.length,
      expectationViolations: selfExpectationViolations,
      sample: selfDiff.diffs.slice(0, 10),
    },
  })

  // --- Check 1b: the inventory's fixed expectations are exactly SPEC-04 §2.4/§2.6/§2.8's. ---
  const expectBlocks = checkInventoryExpectBlocks(urls)
  checks.push({ name: 'inventory-expect-blocks-match-spec', pass: expectBlocks.pass, detail: expectBlocks.detail })

  // --- Check 2: extractor sanity on the live baseline. ---
  console.log('[selftest] extractor sanity check on home page ...')
  const sanity = await extractorSanityCheck(rawDirA, base)
  checks.push({ name: 'extractor-sanity-home', pass: sanity.pass, detail: sanity.detail })

  // --- Check 2b: reachability floor on the sitemap source (per review). ---
  console.log('[selftest] checking sitemap reachability floor ...')
  const reachability = reachabilityFloor(manifestA)
  checks.push({ name: 'reachability-floor-sitemap', pass: reachability.pass, detail: reachability.detail })

  // --- Check 2b2: Link-header preloads on the live capture (SPEC-04 §3, 2026-09-27). ---
  // The offline cases are in selftest-link-header.mjs; this confirms the real capture path
  // merged a live dynamic page's `Link` header into assetRefs and fetched those refs.
  const linkHeader = liveLinkHeaderCheck(manifestA)
  checks.push({ name: 'live-link-header-preloads', pass: linkHeader.pass, detail: linkHeader.detail })
  const linkHeaderSynthetic = testLinkHeaderCheckStoredKeyAndNoHeader()
  checks.push({ name: 'link-header-check-stored-key-and-no-header', pass: linkHeaderSynthetic.pass, detail: linkHeaderSynthetic.detail })

  // --- Check 2c: --resolve pinned-DNS dispatcher against a local server (per review). ---
  console.log('[selftest] testing --resolve pinned dispatcher against a local server ...')
  const resolveCheck = await testResolveDispatcher()
  checks.push({ name: 'resolve-dispatcher-pinned-fetch', pass: resolveCheck.pass, detail: resolveCheck.detail })

  // --- Check 3: mutation matrix, mutating RAW bodies and re-running the real extractor. ---
  console.log('[selftest] running mutation matrix ...')
  let mutationResults = null
  let mutationPass = false
  try {
    mutationResults = await runMutationSelfTest(manifestA, { rawDir: rawDirA, base })
    mutationPass = mutationResults.every((r) => r.pass)
  } catch (err) {
    mutationResults = { error: String(err.message || err) }
    mutationPass = false
  }
  checks.push({ name: 'mutation-matrix', pass: mutationPass, detail: mutationResults })

  // --- Check 4: determinism, two live captures ~60s apart. ---
  console.log('[selftest] waiting ~60s for the second capture (determinism check) ...')
  await sleep(60_000)
  console.log('[selftest] capturing manifest B ...')
  const rawDirB = path.join(scratchRoot, 'raw-b')
  const manifestB = await capture({ base, urls, rawDir: rawDirB, concurrency: 4 })
  const detDiff = await compareManifests(manifestA, manifestB, {
    rawDirA,
    rawDirB,
  })
  // Nothing filtered by field (P1.2 review r4): an `expect` violation is never report-only,
  // data-freshness or allowlisted, so it counts as unexplained and fails determinism.
  const unexplained = detDiff.diffs.filter((d) => !d.reportOnly && d.category !== 'data-freshness' && !d.allowlisted)
  const detExpectationViolations = detDiff.diffs.filter((d) => String(d.field).startsWith('expect-'))
  const determinismPass = unexplained.length === 0 && detExpectationViolations.length === 0
  checks.push({
    name: 'determinism-two-captures-60s-apart',
    pass: determinismPass,
    detail: {
      compared: detDiff.compared,
      failedUnallowed: detDiff.failedUnallowed,
      byCategory: detDiff.byCategory,
      unexplainedCount: unexplained.length,
      unexplainedSample: unexplained.slice(0, 10),
      expectationViolations: detExpectationViolations,
    },
  })

  // --- Check 6: SPEC-04 addendum coverage sources (blog-api-slug / sitemap-b), no network. ---
  console.log('[selftest] checking coverage sources (blog-api-slug, sitemap-b) ...')
  const coverage = await testCoverageSources()
  checks.push({ name: 'coverage-sources', pass: coverage.pass, detail: coverage.detail })

  // --- Check 7: the tie-permutation checker's CORE algorithm, synthetic sequences (A1 C8). ---
  console.log('[selftest] testing the tie-permutation checker (core algorithm) ...')
  const tiePermutation = testTiePermutationChecker()
  checks.push({ name: 'tie-permutation-checker', pass: tiePermutation.pass, detail: tiePermutation.detail })

  // --- Check 7b (per review, BLOCKING): the tie-permutation checker against REAL captured
  // page bodies (/, /sitemap.xml, /llms.txt, /llms-full.txt, /blog) — A-vs-A must pass, A-vs-
  // (A+edit) must fail. This is the actual A1 C8 proof; the synthetic check above only proves
  // the core algorithm in isolation. ---
  console.log('[selftest] testing the tie-permutation checker against real captured page bodies ...')
  const tiePermutationReal = await testTiePermutationRealData(rawDirA)
  checks.push({ name: 'tie-permutation-real-data', pass: tiePermutationReal.pass, detail: tiePermutationReal.detail })

  // --- Check 7c (per review): a REAL legitimate tie swap (must pass) and that same swap
  // plus an edit (must fail), built from live /llms.txt + /api/blog data. ---
  console.log('[selftest] testing a real legitimate tie swap (and swap+edit) ...')
  const tieSwap = await testTieSwapRealData(rawDirA)
  checks.push({ name: 'tie-swap-real-data', pass: tieSwap.pass, detail: tieSwap.detail })

  // --- Check 7d (BLOCKING, round 3 review): compareEntry must diff embeddedPostsError even
  // when both sides have the SAME error, and checkEmbeddedPostsCoverage's harness marker
  // guard must fire only for a new-code manifest. ---
  console.log('[selftest] testing the embeddedPosts coverage guard (same-error + missing-marker) ...')
  const embeddedPostsGuard = await testEmbeddedPostsCoverageGuard()
  checks.push({ name: 'embedded-posts-coverage-guard', pass: embeddedPostsGuard.pass, detail: embeddedPostsGuard.detail })

  // --- Check 7e (per review, non-blocking): extractEmbeddedBlogPosts's row parser must
  // survive Next.js batching several rows into one push() call, and a single row split
  // across two push() calls — using the REAL 172-post row from a live /blog capture. ---
  console.log('[selftest] testing flight-row batching robustness (merged + split chunks) ...')
  const flightRowRobustness = await testFlightRowBatchingRobustness(rawDirA)
  checks.push({ name: 'flight-row-batching-robustness', pass: flightRowRobustness.pass, detail: flightRowRobustness.detail })

  // --- Check 8: compact manifest mode (A1 C9). All derived offline from manifestA/B's
  // already-saved raw bodies (toCompactManifest), through the exact same compaction
  // functions real --compact capture calls — never a third/fourth live capture. ---
  console.log('[selftest] deriving compact-mode manifests and re-running the mutation matrix ...')
  const compactManifestA = await toCompactManifest(manifestA, rawDirA)
  const compactManifestB = await toCompactManifest(manifestB, rawDirB)

  let compactMutationResults = null
  let compactMutationPass = false
  try {
    const compactOnlyCases = buildCompactOnlySignalCases(compactManifestA, { rawDir: rawDirA })
    compactMutationResults = await runMutationSelfTest(compactManifestA, {
      rawDir: rawDirA,
      base,
      compact: true,
      extraCases: compactOnlyCases,
    })
    compactMutationPass = compactMutationResults.every((r) => r.pass)
  } catch (err) {
    compactMutationResults = { error: String(err.message || err) }
    compactMutationPass = false
  }
  checks.push({ name: 'mutation-matrix-compact', pass: compactMutationPass, detail: compactMutationResults })

  console.log('[selftest] checking compact-mode determinism ...')
  const compactDetDiff = await compareManifests(compactManifestA, compactManifestB, { rawDirA, rawDirB })
  const compactUnexplained = compactDetDiff.diffs.filter((d) => !d.reportOnly && d.category !== 'data-freshness' && !d.allowlisted)
  const compactDeterminismPass = compactUnexplained.length === 0
  checks.push({
    name: 'determinism-compact-mode',
    pass: compactDeterminismPass,
    detail: {
      compared: compactDetDiff.compared,
      failedUnallowed: compactDetDiff.failedUnallowed,
      unexplainedCount: compactUnexplained.length,
      unexplainedSample: compactUnexplained.slice(0, 10),
    },
  })

  console.log('[selftest] checking mixed-mode compare (full vs compact, both directions) ...')
  const mixedFullACompactB = await compareManifests(manifestA, compactManifestB, { rawDirA, rawDirB })
  const mixedCompactAFullB = await compareManifests(compactManifestA, manifestB, { rawDirA, rawDirB })
  const mixedUnexplained = (d) => d.diffs.filter((x) => !x.reportOnly && x.category !== 'data-freshness' && !x.allowlisted)
  const mixedFullACompactBUnexplained = mixedUnexplained(mixedFullACompactB)
  const mixedCompactAFullBUnexplained = mixedUnexplained(mixedCompactAFullB)
  checks.push({
    name: 'mixed-mode-compare-both-directions',
    pass: mixedFullACompactBUnexplained.length === 0 && mixedCompactAFullBUnexplained.length === 0,
    detail: {
      fullACompactB: {
        compared: mixedFullACompactB.compared,
        failedUnallowed: mixedFullACompactB.failedUnallowed,
        unexplainedCount: mixedFullACompactBUnexplained.length,
        unexplainedSample: mixedFullACompactBUnexplained.slice(0, 10),
      },
      compactAFullB: {
        compared: mixedCompactAFullB.compared,
        failedUnallowed: mixedCompactAFullB.failedUnallowed,
        unexplainedCount: mixedCompactAFullBUnexplained.length,
        unexplainedSample: mixedCompactAFullBUnexplained.slice(0, 10),
      },
    },
  })

  // --- Check 9 (per review): mixed-mode MUTATION cases — a field change and a text edit,
  // each in BOTH directions (full-A/compact-B and compact-A/full-B), proving compare.mjs
  // actually DETECTS a real mutation across modes, not just that two unmutated sides agree
  // (which mixed-mode-compare-both-directions above already covers). ---
  console.log('[selftest] running mixed-mode mutation cases ...')
  const rebuildFullJsonBySlug = (items) => {
    const jsonBySlug = {}
    for (const item of items) if (item?.slug) jsonBySlug[item.slug] = canonicalStringify(item)
    return jsonBySlug
  }
  async function mutateApiBlogTitle(manifest, { rawDir, compact }) {
    const clone = structuredClone(manifest)
    const raw = (await readRawBin(rawDir, '/api/blog')).toString('utf8')
    const parsed = JSON.parse(raw)
    const mutated = parsed.map((item, i) => (i === 0 ? { ...item, title: `${item.title ?? ''} MIXED-MODE-MUTATED` } : item))
    const e = findEntry(clone, (x) => x.url === '/api/blog')
    delete e.jsonBySlug
    delete e.jsonBySlugHash
    delete e.slugMultiset
    if (compact) Object.assign(e, buildCompactBlogArrayFields(mutated))
    else e.jsonBySlug = rebuildFullJsonBySlug(mutated)
    return clone
  }
  async function mutateRobotsText(manifest, { rawDir, compact }) {
    const clone = structuredClone(manifest)
    const raw = (await readRawBin(rawDir, '/robots.txt')).toString('utf8')
    const normalized = normalizeText(`${raw.replace(/\s*$/, '')}\n# mixed-mode selftest edit\n`)
    const e = findEntry(clone, (x) => x.url === '/robots.txt')
    delete e.text
    delete e.textHash
    delete e.textPreview
    if (compact) Object.assign(e, buildCompactTextFields(normalized))
    else e.text = normalized
    return clone
  }
  /** SPEC-04 addendum: apply one of EMBEDDED_POSTS_MUTATIONS to a cloned manifest's /blog
   *  entry, rebuilding whichever mode's fields `compact` asks for from the REAL parsed
   *  posts array (extractEmbeddedBlogPosts on the raw body), same as buildMutationCases. */
  async function mutateEmbeddedPosts(manifest, { rawDir, compact, transform }) {
    const clone = structuredClone(manifest)
    const raw = (await readRawBin(rawDir, '/blog')).toString('utf8')
    const posts = extractEmbeddedBlogPosts(raw)
    const e = findEntry(clone, (x) => x.url === '/blog')
    delete e.embeddedPostsBySlug
    delete e.embeddedPostsBySlugHash
    delete e.embeddedPostsSlugOrder
    Object.assign(e, compact ? buildCompactEmbeddedPostsFields(transform(posts)) : buildFullEmbeddedPostsFields(transform(posts)))
    return clone
  }
  const isDetected = (diff) => {
    const unallowed = diff.diffs.filter((d) => !d.reportOnly && !d.allowlisted)
    return unallowed.length >= 1 && diff.failedUnallowed >= 1
  }

  const mixedFcField = await mutateApiBlogTitle(compactManifestA, { rawDir: rawDirA, compact: true })
  const mixedFcFieldDiff = await compareManifests(manifestA, mixedFcField, { rawDirA, rawDirB: rawDirA })
  const mixedCfField = await mutateApiBlogTitle(manifestA, { rawDir: rawDirA, compact: false })
  const mixedCfFieldDiff = await compareManifests(compactManifestA, mixedCfField, { rawDirA, rawDirB: rawDirA })

  const mixedFcText = await mutateRobotsText(compactManifestA, { rawDir: rawDirA, compact: true })
  const mixedFcTextDiff = await compareManifests(manifestA, mixedFcText, { rawDirA, rawDirB: rawDirA })
  const mixedCfText = await mutateRobotsText(manifestA, { rawDir: rawDirA, compact: false })
  const mixedCfTextDiff = await compareManifests(compactManifestA, mixedCfText, { rawDirA, rawDirB: rawDirA })

  // SPEC-04 addendum: the same 4 required embedded-post-list mutations, mixed mode, both
  // directions (8 sub-cases in total) — proving all 4 are detected regardless of which side
  // is compact.
  const embeddedPostsMixedResults = {}
  for (const { name, transform } of EMBEDDED_POSTS_MUTATIONS) {
    const fc = await mutateEmbeddedPosts(compactManifestA, { rawDir: rawDirA, compact: true, transform })
    const fcDiff = await compareManifests(manifestA, fc, { rawDirA, rawDirB: rawDirA })
    const cf = await mutateEmbeddedPosts(manifestA, { rawDir: rawDirA, compact: false, transform })
    const cfDiff = await compareManifests(compactManifestA, cf, { rawDirA, rawDirB: rawDirA })
    embeddedPostsMixedResults[name] = {
      fullAToCompactB: { detected: isDetected(fcDiff), failedUnallowed: fcDiff.failedUnallowed },
      compactAToFullB: { detected: isDetected(cfDiff), failedUnallowed: cfDiff.failedUnallowed },
    }
  }
  const embeddedPostsMixedAllDetected = Object.values(embeddedPostsMixedResults).every(
    (r) => r.fullAToCompactB.detected && r.compactAToFullB.detected,
  )

  checks.push({
    name: 'mixed-mode-mutation-cases',
    pass:
      isDetected(mixedFcFieldDiff) &&
      isDetected(mixedCfFieldDiff) &&
      isDetected(mixedFcTextDiff) &&
      isDetected(mixedCfTextDiff) &&
      embeddedPostsMixedAllDetected,
    detail: {
      fullAToCompactBFieldChange: { detected: isDetected(mixedFcFieldDiff), failedUnallowed: mixedFcFieldDiff.failedUnallowed },
      compactAToFullBFieldChange: { detected: isDetected(mixedCfFieldDiff), failedUnallowed: mixedCfFieldDiff.failedUnallowed },
      fullAToCompactBTextEdit: { detected: isDetected(mixedFcTextDiff), failedUnallowed: mixedFcTextDiff.failedUnallowed },
      compactAToFullBTextEdit: { detected: isDetected(mixedCfTextDiff), failedUnallowed: mixedCfTextDiff.failedUnallowed },
      embeddedPosts: embeddedPostsMixedResults,
    },
  })

  // --- Check 10 (per review): the REAL --compact capture path, exercised once (cheap — 3
  // URLs), not just the offline toCompactManifest() derivation used above. ---
  console.log('[selftest] exercising the real capture({compact:true}) path (3 URLs) ...')
  const realCompactRawDir = path.join(scratchRoot, 'raw-real-compact')
  const realCompactManifest = await capture({
    base,
    urls: [
      { url: '/api/blog', source: 'special-api' },
      { url: '/robots.txt', source: 'special' },
      { url: '/blog', source: 'special' },
    ],
    rawDir: realCompactRawDir,
    concurrency: 3,
    compact: true,
  })
  const realApiBlog = findEntry(realCompactManifest, (e) => e.url === '/api/blog')
  const realRobots = findEntry(realCompactManifest, (e) => e.url === '/robots.txt')
  const realBlog = findEntry(realCompactManifest, (e) => e.url === '/blog')
  const realCompactProblems = []
  if (!realCompactManifest.compact) realCompactProblems.push('manifest.compact is not true')
  if (!realApiBlog?.jsonBySlugHash || typeof realApiBlog.jsonArrayLength !== 'number') realCompactProblems.push('/api/blog missing jsonBySlugHash/jsonArrayLength')
  if (realApiBlog?.jsonBySlug || realApiBlog?.jsonCanonical) realCompactProblems.push('/api/blog unexpectedly carries full-mode jsonBySlug/jsonCanonical')
  if (!realRobots?.textHash || typeof realRobots.textPreview !== 'string') realCompactProblems.push('/robots.txt missing textHash/textPreview')
  if (realRobots?.text !== undefined) realCompactProblems.push('/robots.txt unexpectedly carries full-mode text')
  if (!realBlog?.embeddedPostsBySlugHash || !Array.isArray(realBlog.embeddedPostsSlugOrder))
    realCompactProblems.push('/blog missing embeddedPostsBySlugHash/embeddedPostsSlugOrder')
  if (realBlog?.embeddedPostsBySlug) realCompactProblems.push('/blog unexpectedly carries full-mode embeddedPostsBySlug')
  if (realBlog?.embeddedPostsError) realCompactProblems.push(`/blog embeddedPostsError: ${realBlog.embeddedPostsError}`)
  checks.push({
    name: 'real-compact-capture-path',
    pass: realCompactProblems.length === 0,
    detail: {
      urlsCaptured: realCompactManifest.count,
      fetchErrors: realCompactManifest.entries.filter((e) => e.error).length,
      problems: realCompactProblems,
    },
  })

  // --- Check 5: protected-deployment probe (P5.2 only; no Vercel deployment exists yet). ---
  // Recorded as deferred (pass: null), never pass: true — this run never actually exercised
  // it, and a bare `true` here previously made the evidence claim a check that didn't run.
  checks.push({
    name: 'protected-deployment-probe',
    pass: null,
    detail: { status: 'deferred', reason: 'No Vercel deployment exists yet (this is P1.2, pre-P3.1/P5.2); the probe runs at P5.2.' },
  })

  const overallPass = checks.every((c) => c.pass !== false)

  console.log('[selftest] hashing harness files ...')
  const harnessFileHashes = await hashHarnessFiles()
  const harnessDirs = ['scripts/migration/parity', 'scripts/migration/functional', 'scripts/migration/visual', 'scripts/migration/perf']

  const evidence = {
    step: 'P1.2',
    gate: 'G1',
    checkedAt: nowUtc(),
    base,
    git: {
      sha: gitSha(),
      dirtyHarnessFiles: gitDirtyHarnessFiles(harnessDirs),
    },
    harnessFileHashes,
    urlInventory: { count: urls.length, counts },
    manifestSummary: {
      manifestA: { count: manifestA.count, fetchErrors: errorsA.length },
      manifestB: { count: manifestB.count, fetchErrors: manifestB.entries.filter((e) => e.error).length },
      compactManifestA: { bytes: Buffer.byteLength(JSON.stringify(compactManifestA)) },
      compactManifestB: { bytes: Buffer.byteLength(JSON.stringify(compactManifestB)) },
    },
    checks,
    overall: overallPass ? 'pass' : 'fail',
  }

  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, JSON.stringify(evidence, null, 2))
  console.log(`[selftest] wrote ${out}`)
  console.log(`[selftest] overall: ${evidence.overall}`)
  for (const c of checks) {
    console.log(`  ${c.pass === null ? 'DEFERRED' : c.pass ? 'PASS' : 'FAIL'}  ${c.name}`)
  }
  // One final, unambiguous count line (P6.2 harness hardening): pass + fail + deferred = total.
  const nPass = checks.filter((c) => c.pass === true).length
  const nFail = checks.filter((c) => c.pass === false).length
  const nDeferred = checks.filter((c) => c.pass === null).length
  console.log(`SUMMARY selftest.mjs: ${nPass}/${checks.length} PASS, ${nFail} FAIL, ${nDeferred} DEFERRED`)

  process.exit(overallPass ? 0 : 1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
