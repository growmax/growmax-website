#!/usr/bin/env node
// A1 condition C8 tie-order proof helper.
//
// WHAT THIS TOOL PROVES: lib/storage.ts:getPublishedBlogPosts() orders posts by created_at
// DESC with no secondary sort key, and 89 of 171 published posts share a created_at with
// another post (created_at ties are compared at MILLISECOND resolution — Postgres's
// `timestamp` column, not calendar-day granularity). That makes the physical row order (and
// so the visible order on every page that lists posts) non-deterministic across a restore.
// Given A's and B's CAPTURED RAW BODIES of the SAME rendered URL (never two independently
// fetched copies re-derived from something else), this tool:
//   1. extracts each side's own /blog/<slug> occurrence order DIRECTLY FROM THAT PAGE'S OWN
//      raw body — a link href for `/`, a <url><loc> for /sitemap.xml, a markdown list line
//      for /llms.txt, a `### `-headed section for /llms-full.txt (see checkPageTiePermutation)
//      — never from an externally supplied list a caller could have gotten wrong;
//   2. checks that order against ONE created_at-by-slug map taken from A's /api/blog only
//      (never B's — this proves the PAGE's order against a single ground truth), reporting
//      whether B's order differs from A's ONLY by permutations within groups of equal
//      created_at (checkTiePermutation), plus, for a top-N page like the home page's 4, that
//      B's shown SET differs from A's only by members of the tie group straddling the
//      cutoff (never an absolute value comparison);
//   3. if and only if that passes, runs a RESIDUAL check: rebuilds B's own text with its
//      per-post blocks put back into A's exact slug order (every non-post byte of B is kept
//      exactly where B had it) and requires the result to be BYTE-IDENTICAL to A's own text.
//      This fails on any difference beyond pure reordering — a changed post block, a changed
//      unrelated part of the page, a block miscount — never just the order signal.
// /blog (and /blog?page=N) is a fully client-rendered page: the server embeds the full post
// list as a Next.js RSC prop and the browser renders/paginates it in JS, so it has no
// byte-reconstructable block structure. Its order AND residual checks both use
// capture.mjs's extractEmbeddedBlogPosts() to read the PAGE'S OWN embedded post objects
// directly — never /api/blog's — so a stale cached /blog that disagrees with a fresh
// /api/blog is still caught even though nothing else on the page would show it.
// lib/storage.ts also unconditionally PREPENDS a fixed fallback post (lib/arcAiArticle.ts's
// ARC_AI_ARTICLE_SLUG) whenever the real table has no row for it, which can put it ahead of
// strictly newer posts — checkPageTiePermutation detects that signature and requires it sit
// at the identical position on both sides, excluding it from the rest of the analysis.
//
// This is a standalone proof helper for a human (the advisor) reviewing a flagged tie-order
// diff, and a programmatic self-test target — not part of the always-run parity gate.
//
// CLI usage (JSON output only, on stdout):
//   node tie-permutation.mjs --url /sitemap.xml --kind sitemap \
//     --body-a <A's raw captured body file> --body-b <B's raw captured body file> \
//     --api-blog-a <A's raw /api/blog JSON file> [--top-n 4] [--out <file>]
//
// Also usable programmatically: checkTiePermutation() (the generic ordered-sequence
// algorithm), checkPageTiePermutation() (the real per-URL entry point above) and
// checkBlogPageResidual() (for kind 'blog-embedded-json', i.e. /blog).

import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { extractEmbeddedBlogPosts, sha256Text, canonicalStringify } from './lib/extract.mjs'

// lib/arcAiArticle.ts's ARC_AI_ARTICLE_SLUG. Never imported from the .ts source — this
// toolkit statically references known app constants rather than importing TypeScript,
// matching how urls.mjs treats next.config.ts/gsc-indexing-redirects.ts.
export const PINNED_FALLBACK_SLUG = 'claude-commerce-agents-b2b'

function multisetOf(arr) {
  const m = new Map()
  for (const x of arr) m.set(x, (m.get(x) || 0) + 1)
  return m
}
function multisetsEqual(a, b) {
  if (a.size !== b.size) return false
  for (const [k, v] of a) if (b.get(k) !== v) return false
  return true
}

/** Extract { slug, createdAt (epoch ms), published } from a raw /api/blog body, preserving
 *  the response's own array order. */
export function postsFromApiBlogBody(raw) {
  if (!Array.isArray(raw)) throw new Error('expected an array of posts (a raw /api/blog body)')
  return raw.map((p) => {
    const slug = p?.slug
    const createdAtRaw = p?.created_at ?? p?.createdAt
    if (!slug) throw new Error('a /api/blog item has no slug')
    if (createdAtRaw === undefined || createdAtRaw === null) throw new Error(`post ${slug} has no created_at`)
    const createdAt = new Date(createdAtRaw).getTime()
    if (Number.isNaN(createdAt)) throw new Error(`post ${slug} has an unparseable created_at: ${JSON.stringify(createdAtRaw)}`)
    return { slug, createdAt, published: p?.published !== false }
  })
}

/**
 * Core, page-agnostic permutation check over two ORDERED, PUBLISHED-ONLY slug sequences
 * (each post as { slug, createdAt (epoch ms), published }) sharing ONE created_at-by-slug
 * source. Exported for the checker's own self-test (synthetic sequences) and reused
 * internally by checkPageTiePermutation for each real URL. created_at ties are compared at
 * MILLISECOND resolution (Date.getTime()) — the same resolution as Postgres's `timestamp`
 * column; two posts a millisecond apart are never treated as tied.
 */
export function checkTiePermutation({ postsA, postsB, topN } = {}) {
  if (!Array.isArray(postsA) || !Array.isArray(postsB)) {
    return { pass: false, reason: 'invalid-input', detail: { message: 'postsA and postsB must both be arrays' } }
  }

  // Per review: a published:false item here is a caller bug (/api/blog itself never returns
  // drafts), not something to silently filter out — it must fail loudly.
  const unpublishedA = postsA.filter((p) => p.published === false)
  const unpublishedB = postsB.filter((p) => p.published === false)
  if (unpublishedA.length > 0 || unpublishedB.length > 0) {
    return {
      pass: false,
      reason: 'unpublished-item-present',
      detail: {
        message: 'postsA/postsB must contain only published posts; an unpublished item means the caller built the sequence wrong.',
        unpublishedSlugsA: unpublishedA.map((p) => p.slug),
        unpublishedSlugsB: unpublishedB.map((p) => p.slug),
      },
    }
  }

  const slugsA = postsA.map((p) => p.slug)
  const slugsB = postsB.map((p) => p.slug)

  // A true multiset comparison (not a Set + length check, which can hide e.g. A=[x,x,y] vs
  // B=[x,y,y] — same length, same Set membership, different counts).
  const msA = multisetOf(slugsA)
  const msB = multisetOf(slugsB)
  if (!multisetsEqual(msA, msB)) {
    return {
      pass: false,
      reason: 'slug-set-mismatch',
      detail: {
        onlyInAOrExtraInA: [...msA.entries()].filter(([s, c]) => (msB.get(s) || 0) < c),
        onlyInBOrExtraInB: [...msB.entries()].filter(([s, c]) => (msA.get(s) || 0) < c),
        countA: slugsA.length,
        countB: slugsB.length,
      },
    }
  }

  const seqA = postsA.map((p) => p.createdAt)
  const seqB = postsB.map((p) => p.createdAt)
  const mismatchIndex = seqA.findIndex((v, i) => v !== seqB[i])
  if (mismatchIndex !== -1) {
    return {
      pass: false,
      reason: 'cross-group-reorder',
      detail: {
        index: mismatchIndex,
        aSlug: slugsA[mismatchIndex],
        bSlug: slugsB[mismatchIndex],
        aCreatedAt: new Date(seqA[mismatchIndex]).toISOString(),
        bCreatedAt: new Date(seqB[mismatchIndex]).toISOString(),
        tieGranularity: 'millisecond',
      },
    }
  }

  // Contiguous equal-createdAt groups in A's own sequence.
  const groups = []
  let start = 0
  for (let i = 1; i <= seqA.length; i++) {
    if (i === seqA.length || seqA[i] !== seqA[start]) {
      groups.push({ start, end: i, createdAt: seqA[start] })
      start = i
    }
  }
  for (const g of groups) {
    const gMsA = multisetOf(slugsA.slice(g.start, g.end))
    const gMsB = multisetOf(slugsB.slice(g.start, g.end))
    if (!multisetsEqual(gMsA, gMsB)) {
      return {
        pass: false,
        reason: 'group-membership-mismatch',
        detail: { groupStart: g.start, groupEnd: g.end, createdAt: new Date(g.createdAt).toISOString() },
      }
    }
  }

  const result = {
    pass: true,
    reason: null,
    detail: { comparedPublished: slugsA.length, groups: groups.length, tieGranularity: 'millisecond' },
  }

  if (topN !== undefined) {
    if (!Number.isInteger(topN) || topN <= 0) {
      return { pass: false, reason: 'invalid-top-n', detail: { message: `topN must be a positive integer, got ${JSON.stringify(topN)}` } }
    }
    if (topN < seqA.length) {
      // Relative test (per review — never an absolute value comparison): B's shown SET may
      // differ from A's shown set only by members of the ONE tie group that straddles the
      // cutoff (topN falls strictly inside that group's index range, not on a group edge).
      const shownA = new Set(slugsA.slice(0, topN))
      const shownB = new Set(slugsB.slice(0, topN))
      const symDiff = [...new Set([...shownA].filter((s) => !shownB.has(s)).concat([...shownB].filter((s) => !shownA.has(s))))]
      const boundaryGroup = groups.find((g) => g.start < topN && topN < g.end)
      const boundaryMembers = boundaryGroup ? new Set(slugsA.slice(boundaryGroup.start, boundaryGroup.end)) : new Set()
      const relativeOk = symDiff.every((s) => boundaryMembers.has(s))
      result.detail.topN = topN
      result.detail.shownSetSymmetricDifference = symDiff
      result.detail.boundaryGroup = boundaryGroup
        ? { start: boundaryGroup.start, end: boundaryGroup.end, createdAt: new Date(boundaryGroup.createdAt).toISOString() }
        : null
      result.detail.shownSetDiffersOnlyWithinBoundaryTieGroup = relativeOk
      if (!relativeOk) {
        result.pass = false
        result.reason = 'top-n-boundary-violated'
      }
    }
  }

  return result
}

// --- Per-URL-kind slug/chunk extraction, straight from a captured raw body. ---

/** Per review: each home-page card is exactly ONE `<a ...>...</a>` (verified live — no
 *  nested anchors), so bound its block to that closing tag — never open-ended to the next
 *  match or end-of-text, which used to let the page's tail (everything after the last card:
 *  a "View all articles" CTA, the footer, closing scripts) travel along with whichever post
 *  ended up last after a reorder, corrupting the residual check for content that was never
 *  actually part of any post. */
function findHrefMatches(text) {
  const re = /<a\b[^>]*\bhref="\/blog\/([a-zA-Z0-9_-]+)"/g
  const out = []
  let m
  while ((m = re.exec(text))) {
    const closeIdx = text.indexOf('</a>', m.index)
    out.push({ slug: m[1], start: m.index, end: closeIdx === -1 ? undefined : closeIdx + '</a>'.length })
  }
  return out
}

function findSitemapMatches(text) {
  const re = /<url>[\s\S]*?<\/url>/g
  const out = []
  let m
  while ((m = re.exec(text))) {
    const block = m[0]
    const locMatch = block.match(/<loc>([^<]*)<\/loc>/)
    if (!locMatch) continue
    let pathname
    try {
      pathname = new URL(locMatch[1]).pathname
    } catch {
      pathname = locMatch[1]
    }
    const slugMatch = pathname.match(/^\/blog\/([a-zA-Z0-9_-]+)$/)
    if (!slugMatch) continue
    out.push({ slug: slugMatch[1], start: m.index, end: m.index + block.length })
  }
  return out
}

/** Per review: bound each post to its own LINE (through the trailing newline, or end-of-text
 *  for a final line with none) — never open-ended to the next match/end-of-text, which used
 *  to let anything after the last bullet (the file's tail) travel with the last post. */
function findLlmsLineMatches(text) {
  const re = /^- \[[^\]]*\]\(https?:\/\/[^)]*\/blog\/([a-zA-Z0-9_-]+)\)/gm
  const out = []
  let m
  while ((m = re.exec(text))) {
    const nlIdx = text.indexOf('\n', m.index)
    out.push({ slug: m[1], start: m.index, end: nlIdx === -1 ? text.length : nlIdx + 1 })
  }
  return out
}

function findLlmsSectionMatches(text) {
  const headerRe = /^### .*$/gm
  const out = []
  let m
  while ((m = headerRe.exec(text))) {
    const lookahead = text.slice(m.index, m.index + 400)
    const srcMatch = lookahead.match(/Source:\s*https?:\/\/[^\s)]*\/blog\/([a-zA-Z0-9_-]+)/)
    if (srcMatch) out.push({ slug: srcMatch[1], start: m.index })
  }
  // Per review: bound the LAST section at the next level-2 '## ' header (a new major
  // section), if one follows it, instead of leaving it open to end-of-text — so any trailing
  // content after the blog section can't silently travel with the last post on a reorder.
  // Today the file's last blog section already runs to true end-of-file (confirmed live, no
  // '## ' follows it), so this is a no-op in practice; it's here in case that ever changes.
  if (out.length > 0) {
    const last = out[out.length - 1]
    const searchFrom = last.start + 1 // skip the section's own leading '### ' line
    const nextH2Rel = text.slice(searchFrom).search(/\n## /)
    if (nextH2Rel !== -1) last.end = searchFrom + nextH2Rel
  }
  return out
}

const KIND_MATCHERS = {
  href: findHrefMatches,
  sitemap: findSitemapMatches,
  'llms-line': findLlmsLineMatches,
  'llms-section': findLlmsSectionMatches,
}

/** URL -> extraction kind, for the URLs SPEC-04/A1 C8 names (home page, sitemap, llms*.txt).
 *  '/blog' (and /blog?page=N) are intentionally absent — they're handled entirely separately
 *  (see checkPageTiePermutation's 'blog-embedded-json' branch and checkBlogPageResidual),
 *  using capture.mjs's own extractEmbeddedBlogPosts() rather than a text-block matcher: /blog
 *  has no independently-diffable block structure to reconstruct (it's a client render of an
 *  RSC prop), so its residual check is content-hash-based on the PAGE'S OWN embedded post
 *  objects, never /api/blog's. */
export const URL_KINDS = Object.freeze({
  '/': 'href',
  '/sitemap.xml': 'sitemap',
  '/llms.txt': 'llms-line',
  '/llms-full.txt': 'llms-section',
})

function dedupeByFirstOccurrence(matches) {
  const sorted = [...matches].sort((a, b) => a.start - b.start)
  const seen = new Set()
  const out = []
  for (const m of sorted) {
    if (seen.has(m.slug)) continue
    seen.add(m.slug)
    out.push(m)
  }
  return out
}

function withEnds(matches, textLength) {
  return matches.map((m, i) => ({
    slug: m.slug,
    start: m.start,
    end: m.end !== undefined ? m.end : i + 1 < matches.length ? matches[i + 1].start : textLength,
  }))
}

/** Split `text` into an ordered chunk list — {type:'fixed', text} for untouched stretches
 *  and {type:'slug', slug, text} for each detected post occurrence — that concatenates back
 *  to `text` verbatim. */
function splitIntoChunks(text, matches) {
  const chunks = []
  let pos = 0
  for (const m of matches) {
    if (m.start > pos) chunks.push({ type: 'fixed', text: text.slice(pos, m.start) })
    chunks.push({ type: 'slug', slug: m.slug, text: text.slice(m.start, m.end) })
    pos = m.end
  }
  if (pos < text.length) chunks.push({ type: 'fixed', text: text.slice(pos) })
  return chunks
}

/** Rebuild B's chunk sequence with each SLOT that held a post block re-filled with B's OWN
 *  content for whichever slug sits at that position in `slugOrderA` — every non-post byte of
 *  B stays exactly where B had it; only the which-post-goes-here assignment is permuted to
 *  match A's order. If B differs from A by nothing but a pure tie permutation, this is
 *  byte-identical to A's own text. */
function reconstructWithOrder(chunksB, slugOrderA) {
  const bySlug = new Map()
  for (const c of chunksB) if (c.type === 'slug') bySlug.set(c.slug, c.text)
  let slot = 0
  let out = ''
  for (const c of chunksB) {
    if (c.type === 'fixed') {
      out += c.text
      continue
    }
    const slug = slugOrderA[slot]
    slot++
    if (slug === undefined || !bySlug.has(slug)) {
      throw new Error(`no B block for slot ${slot - 1} (A's slug ${JSON.stringify(slug)})`)
    }
    out += bySlug.get(slug)
  }
  return out
}

/**
 * The real per-URL entry point (see the file header for the full algorithm). `rawTextA`/
 * `rawTextB` are the SAME URL's captured raw body on each side, already normalized the way
 * the rest of this harness normalizes it (normalizeHtmlNoise for HTML, normalizeText for
 * text/plain — callers should apply the same normalization capture.mjs/extract.mjs use, so a
 * legitimate build-hash/line-ending difference is never mistaken for a real one).
 * `createdAtBySlug` must come from A's /api/blog only (never a per-side map).
 */
export function checkPageTiePermutation({ url, kind, rawTextA, rawTextB, createdAtBySlug, topN } = {}) {
  if (typeof rawTextA !== 'string' || typeof rawTextB !== 'string') {
    return { pass: false, reason: 'invalid-input', detail: { url, kind, message: 'rawTextA/rawTextB must be strings' } }
  }
  if (!createdAtBySlug || typeof createdAtBySlug !== 'object') {
    return { pass: false, reason: 'invalid-input', detail: { url, kind, message: 'createdAtBySlug (from A\'s /api/blog) is required' } }
  }

  if (kind === 'blog-embedded-json') {
    // /blog + /blog?page=N: no text-block matcher — extract the PAGE'S OWN embedded post
    // objects (capture.mjs's extractEmbeddedBlogPosts, same code path a real capture uses)
    // and run both the order check and the residual check against THEM, never /api/blog's.
    let postsA, postsB
    try {
      postsA = extractEmbeddedBlogPosts(rawTextA)
    } catch (err) {
      return { pass: false, reason: 'embedded-posts-parse-error-a', detail: { url, kind, message: String(err.message || err) } }
    }
    try {
      postsB = extractEmbeddedBlogPosts(rawTextB)
    } catch (err) {
      return { pass: false, reason: 'embedded-posts-parse-error-b', detail: { url, kind, message: String(err.message || err) } }
    }
    let slugOrderA = postsA.map((p) => p.slug)
    let slugOrderB = postsB.map((p) => p.slug)
    if (slugOrderA.length === 0) return { pass: false, reason: 'no-posts-found-in-a', detail: { url, kind } }

    const pin = applyPinnedFallback(slugOrderA, slugOrderB, createdAtBySlug, url, kind)
    if (pin.error) return pin.error
    slugOrderA = pin.slugOrderA
    slugOrderB = pin.slugOrderB
    const { pinnedFallback } = pin

    const missingCreatedAt = [...new Set([...slugOrderA, ...slugOrderB])].filter((s) => createdAtBySlug[s] === undefined)
    if (missingCreatedAt.length > 0) {
      return { pass: false, reason: 'missing-created-at', detail: { url, kind, missingCreatedAt: missingCreatedAt.slice(0, 20) } }
    }
    const toPost = (slug) => ({ slug, createdAt: new Date(createdAtBySlug[slug]).getTime(), published: true })
    const coarse = checkTiePermutation({ postsA: slugOrderA.map(toPost), postsB: slugOrderB.map(toPost), topN })
    if (!coarse.pass) {
      return { pass: false, reason: coarse.reason, detail: { url, kind, pinnedFallback, coarse: coarse.detail } }
    }

    const fullSlugOrderA = pinnedFallback ? [pinnedFallback, ...slugOrderA] : slugOrderA
    const residual = checkBlogPageResidual({ postsA, postsB, slugOrder: fullSlugOrderA })
    return { pass: residual.pass, reason: residual.reason, detail: { url, kind, pinnedFallback, coarse: coarse.detail, residual: residual.detail } }
  }

  const matcher = KIND_MATCHERS[kind]
  if (!matcher) return { pass: false, reason: 'unknown-kind', detail: { url, kind } }

  let slugOrderA = dedupeByFirstOccurrence(matcher(rawTextA)).map((m) => m.slug)
  const matchesBRaw = dedupeByFirstOccurrence(matcher(rawTextB))
  let slugOrderB = matchesBRaw.map((m) => m.slug)

  if (slugOrderA.length === 0) {
    return { pass: false, reason: 'no-posts-found-in-a', detail: { url, kind } }
  }

  const pin = applyPinnedFallback(slugOrderA, slugOrderB, createdAtBySlug, url, kind)
  if (pin.error) return pin.error
  slugOrderA = pin.slugOrderA
  slugOrderB = pin.slugOrderB
  const { pinnedFallback } = pin

  const missingCreatedAt = [...new Set([...slugOrderA, ...slugOrderB])].filter((s) => createdAtBySlug[s] === undefined)
  if (missingCreatedAt.length > 0) {
    return { pass: false, reason: 'missing-created-at', detail: { url, kind, missingCreatedAt: missingCreatedAt.slice(0, 20) } }
  }

  const toPost = (slug) => ({ slug, createdAt: new Date(createdAtBySlug[slug]).getTime(), published: true })
  const coarse = checkTiePermutation({ postsA: slugOrderA.map(toPost), postsB: slugOrderB.map(toPost), topN })
  if (!coarse.pass) {
    return { pass: false, reason: coarse.reason, detail: { url, kind, pinnedFallback, coarse: coarse.detail } }
  }

  const fullSlugOrderA = pinnedFallback ? [pinnedFallback, ...slugOrderA] : slugOrderA
  const matchesB = withEnds(matchesBRaw, rawTextB.length)
  const chunksB = splitIntoChunks(rawTextB, matchesB)
  let reconstructed
  try {
    reconstructed = reconstructWithOrder(chunksB, fullSlugOrderA)
  } catch (err) {
    return { pass: false, reason: 'reconstruction-error', detail: { url, kind, pinnedFallback, message: String(err.message || err) } }
  }
  const residualOk = reconstructed === rawTextA
  return {
    pass: residualOk,
    reason: residualOk ? null : 'residual-content-difference',
    detail: {
      url,
      kind,
      pinnedFallback,
      coarse: coarse.detail,
      residual: { byteIdentical: residualOk, reconstructedLength: reconstructed.length, aLength: rawTextA.length },
    },
  }
}

/** Pinned-fallback handling shared by every kind (see the file header): detect the
 *  forced-prepend signature in A — it's first AND older than the post right after it (a real
 *  ORDER BY created_at DESC would never place it there) — then require the identical
 *  position in B and strip it from both before the general algorithm runs. Returns
 *  `{error}` (a ready-to-return result) on a position mismatch, else the adjusted orders. */
function applyPinnedFallback(slugOrderA, slugOrderB, createdAtBySlug, url, kind) {
  if (slugOrderA[0] === PINNED_FALLBACK_SLUG && slugOrderA.length > 1) {
    const pinnedCreatedAt = createdAtBySlug[PINNED_FALLBACK_SLUG]
    const nextCreatedAt = createdAtBySlug[slugOrderA[1]]
    if (pinnedCreatedAt !== undefined && nextCreatedAt !== undefined && pinnedCreatedAt < nextCreatedAt) {
      if (slugOrderB[0] !== PINNED_FALLBACK_SLUG) {
        return {
          error: {
            pass: false,
            reason: 'pinned-fallback-position-mismatch',
            detail: { url, kind, expectedSlug: PINNED_FALLBACK_SLUG, aPosition: 0, bFirstSlug: slugOrderB[0] ?? null },
          },
        }
      }
      return { pinnedFallback: PINNED_FALLBACK_SLUG, slugOrderA: slugOrderA.slice(1), slugOrderB: slugOrderB.slice(1) }
    }
  }
  return { pinnedFallback: null, slugOrderA, slugOrderB }
}

/**
 * /blog's residual check (see the file header): it embeds its OWN post objects as an RSC
 * prop with no independently-diffable byte structure to reconstruct, so instead of a text
 * reconstruction this requires per-slug content-hash equality directly between A's and B's
 * OWN extracted embedded objects (postsA/postsB — from extractEmbeddedBlogPosts, never
 * /api/blog) — for exactly the slugs the order check (above) agreed on ("every field exact").
 */
export function checkBlogPageResidual({ postsA, postsB, slugOrder }) {
  if (!Array.isArray(postsA) || !Array.isArray(postsB) || !Array.isArray(slugOrder)) {
    return { pass: false, reason: 'invalid-input', detail: { message: 'postsA, postsB and slugOrder must all be arrays' } }
  }
  const bySlugA = new Map(postsA.filter((p) => p?.slug).map((p) => [p.slug, p]))
  const bySlugB = new Map(postsB.filter((p) => p?.slug).map((p) => [p.slug, p]))
  const mismatches = []
  for (const slug of slugOrder) {
    const pa = bySlugA.get(slug)
    const pb = bySlugB.get(slug)
    if (!pa || !pb) {
      mismatches.push({ slug, reason: 'missing', aPresent: !!pa, bPresent: !!pb })
      continue
    }
    const ha = sha256Text(canonicalStringify(pa))
    const hb = sha256Text(canonicalStringify(pb))
    if (ha !== hb) mismatches.push({ slug, reason: 'hash-mismatch', a: ha, b: hb })
  }
  return {
    pass: mismatches.length === 0,
    reason: mismatches.length === 0 ? null : 'per-slug-content-mismatch',
    detail: { comparedSlugs: slugOrder.length, mismatches: mismatches.slice(0, 20) },
  }
}

/** Testing/tooling utility: the ordered slug list a given kind's matcher extracts from a raw
 *  body (deduplicated to first occurrence), exposed so a caller (e.g. a self-test) can build
 *  a REAL, legitimate tie-permutation fixture from live captured data via buildReorderedText,
 *  without duplicating this module's own extraction regexes. */
export function extractOrderedSlugs(kind, text) {
  const matcher = KIND_MATCHERS[kind]
  if (!matcher) throw new Error(`unknown kind: ${kind}`)
  return dedupeByFirstOccurrence(matcher(text)).map((m) => m.slug)
}

/** Testing/tooling utility: rebuild `text` with its own per-post blocks reassigned to
 *  `slugOrder` (a permutation of extractOrderedSlugs(kind, text)) — the exact same
 *  chunk-split-and-reconstruct machinery checkPageTiePermutation's residual check uses, so a
 *  caller can construct a REAL "pure tie permutation" (or a permutation plus an edit) fixture
 *  from a live capture instead of a synthetic string. */
export function buildReorderedText(kind, text, slugOrder) {
  const matcher = KIND_MATCHERS[kind]
  if (!matcher) throw new Error(`unknown kind: ${kind}`)
  const matches = withEnds(dedupeByFirstOccurrence(matcher(text)), text.length)
  const chunks = splitIntoChunks(text, matches)
  return reconstructWithOrder(chunks, slugOrder)
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
  if (!args.url || !args.kind || !args['body-a'] || !args['body-b'] || !args['api-blog-a']) {
    console.error(
      'Usage: node tie-permutation.mjs --url <e.g. /sitemap.xml> --kind <href|sitemap|llms-line|llms-section|blog-embedded-json> ' +
        '--body-a <A raw captured body file> --body-b <B raw captured body file> --api-blog-a <A raw /api/blog json file> ' +
        '[--top-n N] [--out <file>]',
    )
    process.exit(2)
  }
  let topN
  if (args['top-n'] !== undefined) {
    const n = Number(args['top-n'])
    if (!Number.isInteger(n) || n <= 0 || String(args['top-n']).trim() === '') {
      console.error(`FAIL: --top-n must be a positive integer, got ${JSON.stringify(args['top-n'])}`)
      process.exit(2)
    }
    topN = n
  }

  const [rawTextA, rawTextB, apiBlogA] = await Promise.all([
    readFile(args['body-a'], 'utf8'),
    readFile(args['body-b'], 'utf8'),
    readFile(args['api-blog-a'], 'utf8').then((t) => JSON.parse(t)),
  ])
  const postsA = postsFromApiBlogBody(apiBlogA)
  const createdAtBySlug = Object.fromEntries(postsA.map((p) => [p.slug, p.createdAt]))

  const result = checkPageTiePermutation({ url: args.url, kind: args.kind, rawTextA, rawTextB, createdAtBySlug, topN })

  if (args.out) {
    await mkdir(path.dirname(args.out), { recursive: true })
    await writeFile(args.out, JSON.stringify(result, null, 2))
  }
  // Output JSON only (per SPEC-04 addendum / A1 C8): nothing else on stdout.
  console.log(JSON.stringify(result, null, 2))
  process.exit(result.pass ? 0 : 1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(JSON.stringify({ pass: false, reason: 'error', detail: String(err?.message || err) }))
    process.exit(1)
  })
}
