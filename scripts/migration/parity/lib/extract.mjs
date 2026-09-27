// Content extraction + normalization for the parity harness (SPEC-04 §3).

import { createHash } from 'node:crypto'
import { parse as parseHtml } from 'node-html-parser'

export function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex')
}

export function sha256Text(text) {
  return sha256(Buffer.from(text, 'utf8'))
}

/** Strip build-specific noise before hashing/comparing HTML text. */
export function normalizeHtmlNoise(html) {
  return html
    // /_next/static/<buildId>/... -> /_next/static/<build>/...
    .replace(/\/_next\/static\/[^/"'\s]+\//g, '/_next/static/<build>/')
    // ?dpl=... query params (Vercel deployment id)
    .replace(/[?&]dpl=[^&"'\s]+/g, '')
    // nonce="..." attributes
    .replace(/\snonce=["'][^"']*["']/g, '')
}

/** Collapse whitespace the way visible-text comparison wants. */
function collapseWhitespace(s) {
  return s.replace(/\s+/g, ' ').trim()
}

/**
 * Join a node's descendant text with an explicit separating space at every
 * element boundary, instead of node-html-parser's own `.text` (plain
 * concatenation). React/Next.js streaming inserts and removes zero-width
 * comment markers between sibling elements depending on request timing —
 * with plain concatenation that non-determinism can merge or split adjacent
 * words (e.g. "...Demo" + "Intelligent..." -> "DemoIntelligent") even though
 * nothing a user or search engine sees has changed. Joining with a guaranteed
 * space at every boundary (then collapsing whitespace) makes the result
 * depend only on the actual text, not on incidental adjacency.
 */
function blockJoinedText(node) {
  if (node.nodeType === 3) return node.rawText ?? node.text ?? ''
  const children = node.childNodes || []
  if (children.length === 0) return node.text || ''
  return children.map(blockJoinedText).join(' ')
}

function textOf(el) {
  return el ? el.text : ''
}

function attrOrNull(el, attr) {
  if (!el) return null
  const v = el.getAttribute(attr)
  return v === undefined ? null : v
}

/** Canonicalize a JS value: sorted object keys, arrays left in place. */
export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize)
  if (value && typeof value === 'object') {
    const out = {}
    for (const key of Object.keys(value).sort()) {
      out[key] = canonicalize(value[key])
    }
    return out
  }
  return value
}

export function canonicalStringify(value) {
  return JSON.stringify(canonicalize(value))
}

/**
 * Extract the parity-relevant fields from an HTML document.
 * Returns { fields, jsonLdHash, visibleTextHash, visibleText, internalLinks, images }
 */
export function extractHtml(rawHtml, pageUrl) {
  const html = normalizeHtmlNoise(rawHtml)
  const root = parseHtml(html, { comment: false })

  const title = textOf(root.querySelector('title')) || null
  const description = attrOrNull(root.querySelector('meta[name="description"]'), 'content')
  const robots = attrOrNull(root.querySelector('meta[name="robots"]'), 'content')
  const canonical = attrOrNull(root.querySelector('link[rel="canonical"]'), 'href')
  const lang = attrOrNull(root.querySelector('html'), 'lang')

  const h1s = root.querySelectorAll('h1').map((el) => collapseWhitespace(el.text))

  // Per review: `robots` above only ever reads the FIRST meta[name=robots], so a second,
  // injected noindex tag (browsers/crawlers apply the union of all robots metas) would be
  // invisible to parity. Also cover meta[name=googlebot] (crawler-specific override), and
  // link rel=alternate/prev/next (hreflang variants and paginated-content signals), none of
  // which were compared before.
  const robotsAll = root.querySelectorAll('meta[name="robots"]').map((el) => el.getAttribute('content') ?? null)
  const googlebotAll = root.querySelectorAll('meta[name="googlebot"]').map((el) => el.getAttribute('content') ?? null)
  const alternateLinks = root
    .querySelectorAll('link[rel="alternate"]')
    .map((el) => ({ href: el.getAttribute('href') ?? null, hreflang: el.getAttribute('hreflang') ?? null }))
    .sort((a, b) => (a.href || '').localeCompare(b.href || '') || (a.hreflang || '').localeCompare(b.hreflang || ''))
  const prevLink = attrOrNull(root.querySelector('link[rel="prev"]'), 'href')
  const nextLink = attrOrNull(root.querySelector('link[rel="next"]'), 'href')

  // img alt text (accessibility/SEO-relevant, previously never compared) and external
  // (cross-host) link hrefs, exactly as rendered — internalLinks above only ever kept
  // same-site hrefs.
  const imgAlts = root.querySelectorAll('img').map((el) => el.getAttribute('alt') ?? null).sort()
  const externalLinks = new Set()
  for (const a of root.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href')
    if (!href) continue
    try {
      const u = new URL(href, pageUrl)
      if (!isSameSite(u, pageUrl)) externalLinks.add(u.toString())
    } catch {
      // relative/invalid href we couldn't resolve; ignore
    }
  }

  const ogTwitter = {}
  for (const meta of root.querySelectorAll('meta')) {
    const prop = meta.getAttribute('property') || meta.getAttribute('name')
    if (prop && (prop.startsWith('og:') || prop.startsWith('twitter:'))) {
      ogTwitter[prop] = meta.getAttribute('content') ?? null
    }
  }

  // JSON-LD: parse each script block, canonicalize, hash the resulting array.
  const jsonLdBlocks = []
  for (const script of root.querySelectorAll('script[type="application/ld+json"]')) {
    const raw = script.textContent || script.innerHTML
    try {
      jsonLdBlocks.push(canonicalize(JSON.parse(raw)))
    } catch {
      jsonLdBlocks.push({ __unparsed__: sha256Text(raw) })
    }
  }
  const jsonLdHash = sha256Text(canonicalStringify(jsonLdBlocks))
  const jsonLdCount = jsonLdBlocks.length

  // Visible text: exclude script/style/noscript/template, collapse whitespace.
  // (Stripped from the raw markup before a second, throwaway parse — node-html-parser's
  // `.clone()` is unreliable on a document root that has a leading DOCTYPE text node,
  // so we avoid depending on it here.)
  //
  // `<title>` is also stripped here even though it's not in that spec list: it's head
  // metadata (already compared separately, exactly, as `fields.title`), never user-visible
  // page content — and with Next.js's streaming metadata, a page whose <title> depends on
  // an async data fetch can legitimately place the *same, unchanged* <title> element at a
  // different byte offset (even after the closing </footer>) between two otherwise-identical
  // requests, purely as a function of streaming/timing. Leaving it in the visible-text hash
  // would flag that as a content diff when nothing a user or search engine sees has changed.
  const textOnlyHtml = html.replace(/<(script|style|noscript|template|title)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  const textRoot = parseHtml(textOnlyHtml, { comment: false })
  const visibleText = collapseWhitespace(blockJoinedText(textRoot))
  const visibleTextHash = sha256Text(visibleText)

  // Internal links, normalized to paths.
  const internalLinks = new Set()
  for (const a of root.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href')
    if (!href) continue
    try {
      const u = new URL(href, pageUrl)
      if (isSameSite(u, pageUrl)) {
        internalLinks.add(u.pathname + (u.search || ''))
      }
    } catch {
      // relative/invalid href we couldn't resolve; ignore
    }
  }

  // Image sources via the Next.js image optimizer: /_next/image?url=X&w=W&q=Q
  const images = new Set()
  for (const img of root.querySelectorAll('img[src]')) {
    const src = img.getAttribute('src')
    if (!src) continue
    const parsed = parseNextImageSrc(src, pageUrl)
    if (parsed) images.add(parsed)
  }

  // Every same-site asset the page references (plain <img src>, <img>/<source> srcset
  // candidates, every <script src>, <link rel=icon|preload|modulepreload|stylesheet> href,
  // and <link rel=preload as=image imagesrcset> candidates), normalized to path+query.
  // Distinct from `images` (the Next.js optimizer variants above): this is what capture.mjs
  // fetches once per unique ref to catch a missing public/ file, a broken image optimizer,
  // or a 404'd JS/CSS chunk that parity would otherwise never notice (nothing else here
  // fetches a referenced asset). `<script src>` matters most here: Next.js hydrates the page
  // from separate chunk files (main-app, app/layout, app/page, ...) that a plain SSR-HTML
  // comparison never touches — a 404'd chunk breaks forms/navigation client-side while the
  // server-rendered markup this harness otherwise diffs looks unchanged.
  //
  // Parsed from the UNMODIFIED raw HTML, not `root` (parsed from the noise-normalized
  // `html`): normalizeHtmlNoise rewrites /_next/static/<hash>/... to a literal
  // '/_next/static/<build>/...' placeholder for hashing/comparison, which is not a URL
  // capture.mjs can actually fetch.
  const rawRoot = parseHtml(rawHtml, { comment: false })
  const assetRefs = new Set()
  const addAssetRef = (raw) => {
    const ref = sameSiteAssetRef(raw, pageUrl)
    if (ref !== null) assetRefs.add(ref)
  }
  const addSrcset = (srcset) => {
    if (!srcset) return
    for (const candidate of srcset.split(',')) {
      const url = candidate.trim().split(/\s+/)[0]
      addAssetRef(url)
    }
  }
  for (const img of rawRoot.querySelectorAll('img[src]')) {
    addAssetRef(img.getAttribute('src'))
    addSrcset(img.getAttribute('srcset'))
  }
  for (const source of rawRoot.querySelectorAll('source[srcset]')) {
    addSrcset(source.getAttribute('srcset'))
  }
  for (const script of rawRoot.querySelectorAll('script[src]')) {
    addAssetRef(script.getAttribute('src'))
  }
  for (const link of rawRoot.querySelectorAll('link[rel]')) {
    const rel = (link.getAttribute('rel') || '').toLowerCase()
    if (rel === 'icon' || rel === 'preload' || rel === 'stylesheet' || rel === 'modulepreload') {
      addAssetRef(link.getAttribute('href'))
    }
    if (rel === 'preload' && (link.getAttribute('as') || '').toLowerCase() === 'image') {
      addSrcset(link.getAttribute('imagesrcset'))
    }
  }

  return {
    fields: {
      title,
      description,
      robots,
      canonical,
      lang,
      h1s,
      ogTwitter,
      robotsAll,
      googlebotAll,
      alternateLinks,
      prevLink,
      nextLink,
      imgAlts,
      externalLinks: [...externalLinks].sort(),
    },
    jsonLdHash,
    jsonLdCount,
    visibleTextHash,
    visibleText,
    internalLinks: [...internalLinks].sort(),
    images: [...images].sort(),
    assetRefs: [...assetRefs].sort(),
  }
}

/**
 * The same-site filter + path+search normalization every assetRef goes through: resolve `raw`
 * against the page URL, keep it only when isSameSite() says so, and return it as
 * pathname + search (what captureAssets later fetches from the capture base). Returns null for
 * an empty, unresolvable or cross-site ref. Shared by the HTML elements above and the `Link`
 * response header below (SPEC-04 §3 "Link header preloads"), so both forms of the same hint
 * are filtered and normalized identically.
 */
export function sameSiteAssetRef(raw, pageUrl) {
  if (!raw) return null
  try {
    const u = new URL(raw, pageUrl)
    if (!isSameSite(u, pageUrl)) return null
    return u.pathname + (u.search || '')
  } catch {
    // relative/invalid ref we couldn't resolve; ignore
    return null
  }
}

// --- SPEC-04 §3 addendum 2026-09-27 (P6.2): `Link` response-header preloads. ---
//
// Next.js sends a DYNAMIC render's preload hints (root-layout fonts, route CSS) as an HTTP
// `Link` header, but inlines the same hints as <link rel="preload"> elements in PRERENDERED
// (static/ISR) HTML. The browser acts on both forms the same way, so an assetRefs set built
// from HTML elements alone reports a difference no visitor can see whenever one side renders
// a route dynamically and the other prerenders it (Replit's dynamic blog posts vs the ISR
// posts on Vercel after SPEC-02 H1).

const LINK_TOKEN_CHAR_RE = /[!#$%&'*+\-.^_`|~0-9A-Za-z]/
const LINK_PRELOAD_RELS = new Set(['preload', 'modulepreload'])

function isLinkOws(ch) {
  return ch === ' ' || ch === '\t'
}

/** From index `i` (inside a malformed link-value), skip to just past the next top-level comma,
 *  i.e. one not inside <...> or a quoted-string, so parsing can resume at the next value. */
function skipToNextLinkValue(value, i) {
  let inAngle = false
  let inQuote = false
  while (i < value.length) {
    const ch = value[i]
    if (inQuote) {
      if (ch === '\\') i++
      else if (ch === '"') inQuote = false
    } else if (inAngle) {
      if (ch === '>') inAngle = false
    } else if (ch === '"') inQuote = true
    else if (ch === '<') inAngle = true
    else if (ch === ',') return i + 1
    i++
  }
  return value.length
}

/**
 * Parse an HTTP `Link` header field value (RFC 8288 §3) into `[{ target, params }]`, where
 * `target` is the raw URI-Reference between `<` and `>` and `params` maps each lower-cased
 * parameter name to its (unquoted, unescaped) value; only a parameter's FIRST occurrence
 * counts (RFC 8288 §3.3 for `rel`). Several header lines arrive joined with ", " (undici's
 * Headers#get), so link-values are split only on commas outside <...> and outside
 * quoted-strings. A malformed link-value (no leading `<`, no closing `>`, an unterminated
 * quoted-string, junk between parameters) is dropped on its own; parsing resumes at the next
 * top-level comma where one can be found. Never throws: a non-string or unparseable input
 * yields [].
 */
export function parseLinkHeader(value) {
  const out = []
  if (typeof value !== 'string') return out
  try {
    const n = value.length
    let i = 0
    while (i < n) {
      while (i < n && (isLinkOws(value[i]) || value[i] === ',')) i++
      if (i >= n) break
      if (value[i] !== '<') {
        i = skipToNextLinkValue(value, i)
        continue
      }
      const close = value.indexOf('>', i + 1)
      if (close === -1) break // unterminated URI-Reference swallows the rest of the field
      const target = value.slice(i + 1, close).trim()
      i = close + 1
      const params = {}
      let valid = true
      while (true) {
        while (i < n && isLinkOws(value[i])) i++
        if (i >= n) break
        if (value[i] === ',') {
          i++
          break
        }
        if (value[i] !== ';') {
          valid = false
          i = skipToNextLinkValue(value, i)
          break
        }
        i++
        while (i < n && isLinkOws(value[i])) i++
        let name = ''
        while (i < n && LINK_TOKEN_CHAR_RE.test(value[i])) name += value[i++]
        if (!name) {
          if (i >= n || value[i] === ';' || value[i] === ',') continue // empty ";;" parameter
          valid = false
          i = skipToNextLinkValue(value, i)
          break
        }
        while (i < n && isLinkOws(value[i])) i++
        let paramValue = ''
        if (value[i] === '=') {
          i++
          while (i < n && isLinkOws(value[i])) i++
          if (value[i] === '"') {
            i++
            let closed = false
            while (i < n) {
              const ch = value[i]
              if (ch === '\\' && i + 1 < n) {
                paramValue += value[i + 1]
                i += 2
                continue
              }
              if (ch === '"') {
                closed = true
                i++
                break
              }
              paramValue += ch
              i++
            }
            if (!closed) {
              valid = false
              break
            }
          } else {
            // Unquoted: RFC 8288 wants a token, but real servers also send e.g. type=font/woff2
            // unquoted; accept anything up to the next ';', ',' or whitespace (as browsers do).
            while (i < n && value[i] !== ';' && value[i] !== ',' && !isLinkOws(value[i])) paramValue += value[i++]
          }
        }
        const key = name.toLowerCase()
        if (!Object.prototype.hasOwnProperty.call(params, key)) params[key] = paramValue
      }
      if (valid) out.push({ target, params })
    }
  } catch {
    return []
  }
  return out
}

/** The `dpl` query parameter stripped, for de-duplicating a header target against the page's
 *  HTML-derived refs only (same rule as compare.mjs's stripDplQueryParam; the ref itself is
 *  still recorded and fetched raw). */
function stripDplForDedup(ref) {
  const qIndex = ref.indexOf('?')
  if (qIndex === -1) return ref
  const params = new URLSearchParams(ref.slice(qIndex + 1))
  if (!params.has('dpl')) return ref
  params.delete('dpl')
  const rest = params.toString()
  return rest ? `${ref.slice(0, qIndex)}?${rest}` : ref.slice(0, qIndex)
}

/**
 * Every same-site asset a `Link` header tells the browser to preload: each link-value whose
 * `rel` (case-insensitive, possibly quoted, space-separated tokens) includes `preload` or
 * `modulepreload`, resolved against the page URL through sameSiteAssetRef() (the HTML refs'
 * filter and path+search form). Other rels (preconnect, dns-prefetch, stylesheet, ...), an
 * empty `<>` target, third-party targets and malformed input add nothing. Distinct refs,
 * de-duplicated with `dpl` stripped, in header order. Never throws.
 */
export function linkHeaderPreloadRefs(linkHeaderValue, pageUrl) {
  const refs = []
  const seen = new Set()
  for (const { target, params } of parseLinkHeader(linkHeaderValue)) {
    const rel = typeof params.rel === 'string' ? params.rel : ''
    const tokens = rel.toLowerCase().split(/[ \t]+/).filter(Boolean)
    if (!tokens.some((t) => LINK_PRELOAD_RELS.has(t))) continue
    if (!target) continue
    const ref = sameSiteAssetRef(target, pageUrl)
    if (ref === null) continue
    const key = stripDplForDedup(ref)
    if (seen.has(key)) continue
    seen.add(key)
    refs.push(ref)
  }
  return refs
}

/**
 * Merge a response's `Link` header preloads into a page's HTML-derived `assetRefs` (what
 * capture.mjs records): a header ref is added only when no existing ref equals it with `dpl`
 * stripped on both, so one asset never counts twice. Returns the merged, sorted `assetRefs`
 * plus `linkHeaderRefs` (every same-site preload ref the header carried, sorted, whether or
 * not it was already in the HTML — diagnostics only, compare.mjs never reads it). Never
 * throws: on any unexpected error the HTML refs are returned unchanged.
 */
export function mergeLinkHeaderAssetRefs(assetRefs, linkHeaderValue, pageUrl) {
  const base = Array.isArray(assetRefs) ? assetRefs : []
  try {
    const headerRefs = linkHeaderPreloadRefs(linkHeaderValue, pageUrl)
    const existing = new Set(base.map(stripDplForDedup))
    const merged = [...base]
    for (const ref of headerRefs) {
      const key = stripDplForDedup(ref)
      if (existing.has(key)) continue
      existing.add(key)
      merged.push(ref)
    }
    return { assetRefs: merged.sort(), linkHeaderRefs: [...headerRefs].sort() }
  } catch {
    return { assetRefs: [...base].sort(), linkHeaderRefs: [] }
  }
}

/**
 * Best-effort width/height sniffing for PNG/JPEG/GIF/WebP, with no image-decoding
 * dependency. Used to compare `/_next/image` responses by decoded dimensions instead of raw
 * bytes: Replit's Next/sharp image optimizer and Vercel's own Image Optimization never
 * produce byte-identical output for the same source+params (different encoder/library
 * versions), even when the rendered image is pixel-identical — see compare.mjs. Returns
 * null for anything it can't parse (e.g. AVIF) rather than throwing; the caller treats that
 * as "not comparable", not "fail".
 */
export function decodeImageDimensions(buf) {
  try {
    if (buf.length >= 24 && buf.readUInt32BE(0) === 0x89504e47 && buf.readUInt32BE(4) === 0x0d0a1a0a) {
      // PNG: the IHDR chunk is always first, at a fixed offset.
      return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
    }
    if (buf.length >= 4 && buf[0] === 0xff && buf[1] === 0xd8) {
      return decodeJpegDimensions(buf)
    }
    if (buf.length >= 10 && buf.toString('ascii', 0, 3) === 'GIF') {
      return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) }
    }
    if (buf.length >= 30 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
      return decodeWebpDimensions(buf)
    }
  } catch {
    // malformed/truncated image; fall through to null
  }
  return null
}

function decodeJpegDimensions(buf) {
  let pos = 2
  while (pos + 9 < buf.length) {
    if (buf[pos] !== 0xff) {
      pos++
      continue
    }
    const marker = buf[pos + 1]
    // SOF0-SOF15 (except DHT=C4/JPG=C8/DAC=CC, which reuse the SOF marker range but aren't
    // frame headers) carry the frame's height/width right after the marker + length + precision.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(pos + 5), width: buf.readUInt16BE(pos + 7) }
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      pos += 2 // standalone marker (SOI/TEM/RSTn), no length field follows
      continue
    }
    const length = buf.readUInt16BE(pos + 2)
    pos += 2 + length
  }
  return null
}

function decodeWebpDimensions(buf) {
  const fourCc = buf.toString('ascii', 12, 16)
  if (fourCc === 'VP8 ') {
    // Lossy: 3-byte frame tag + 3-byte start code, then 14-bit width/height (little-endian).
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff }
  }
  if (fourCc === 'VP8L') {
    // Lossless: signature byte (0x2f) then a packed 32-bit little-endian width/height.
    const bits = buf.readUInt32LE(21)
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
  }
  if (fourCc === 'VP8X') {
    // Extended: 4-byte flags, then 24-bit width-1 and height-1 (little-endian).
    const width = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16))
    const height = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16))
    return { width, height }
  }
  return null
}

/**
 * Canonical production hosts (post-cutover growmax.io + www), shared with capture.mjs's
 * KNOWN_HOSTS rather than duplicated there. capture.mjs's KNOWN_HOSTS additionally treats
 * `*.vercel.app` as known, for normalizing a redirect Location header during migration — a
 * different concern from same-site classification of a link IN A PAGE BODY (below), where an
 * arbitrary Vercel deployment host is never "the site itself".
 */
export const CANONICAL_PRODUCTION_HOSTS = ['www.growmax.io', 'growmax.io']

/**
 * Same-site = the page's own host, or one of the canonical production hosts. Without the
 * latter, a byte-identical absolute href to https://www.growmax.io/... is "internal" when the
 * page itself was captured from www.growmax.io (A) but "external" when captured from
 * growmax-website.vercel.app (B) — a pure artifact of which origin captured the page, not a
 * real content difference (see compare.mjs's internalLinks/externalLinks fields, and
 * capture.mjs's KNOWN_HOSTS). Deliberately does NOT include `*.vercel.app`: an arbitrary
 * Vercel preview/deployment host referenced in a page body stays external.
 */
function isSameSite(u, pageUrl) {
  try {
    const page = new URL(pageUrl)
    const host = u.host.toLowerCase()
    return host === page.host.toLowerCase() || CANONICAL_PRODUCTION_HOSTS.includes(host)
  } catch {
    return true
  }
}

function parseNextImageSrc(src, pageUrl) {
  try {
    const u = new URL(src, pageUrl)
    if (!u.pathname.endsWith('/_next/image')) return null
    const url = u.searchParams.get('url')
    const w = u.searchParams.get('w')
    const q = u.searchParams.get('q')
    if (!url) return null
    return `img:${url}:${w}:${q}`
  } catch {
    return null
  }
}

/**
 * XML sitemap extraction: {loc, changefreq, priority} + lastmod for blog URLs only.
 *
 * `loc` is kept as the FULL <loc> string (scheme + host + path + query), not just the
 * pathname: SPEC-04 §3 asks for the set of {loc, changefreq, priority} and the wrong host
 * or scheme in a sitemap loc (search engines act on it directly) must be a comparable
 * parity signal. Callers that need a fetchable path for the URL inventory (urls.mjs) do
 * that path-only conversion themselves.
 */
export function extractSitemap(rawXml) {
  const root = parseHtml(rawXml, { xmlMode: true, comment: false })
  const entries = []
  for (const urlEl of root.querySelectorAll('url')) {
    const loc = textOf(urlEl.querySelector('loc')) || null
    const changefreq = textOf(urlEl.querySelector('changefreq')) || null
    const priority = textOf(urlEl.querySelector('priority')) || null
    const lastmod = textOf(urlEl.querySelector('lastmod')) || null
    let pathname = null
    try {
      pathname = loc ? new URL(loc).pathname : null
    } catch {
      pathname = loc
    }
    const isBlog = !!pathname && pathname.startsWith('/blog/')
    entries.push({
      loc,
      changefreq,
      priority,
      ...(isBlog ? { lastmod } : {}),
    })
  }
  entries.sort((a, b) => (a.loc || '').localeCompare(b.loc || ''))
  return entries
}

/** Text normalization for robots.txt / llms*.txt: exact after line-ending normalization. */
export function normalizeText(raw) {
  return raw.replace(/\r\n/g, '\n')
}

/** Deterministic, filesystem-safe file name for a URL's raw-dir artifacts. */
export function safeFileName(url) {
  return url.replace(/[^a-zA-Z0-9_-]+/g, '_').slice(0, 150)
}

// --- SPEC-04 addendum: /blog and /blog?page=N's embedded post-list extraction. ---
//
// /blog and /blog?page=N render their post list entirely CLIENT-SIDE: BlogPostClient fetches
// nothing itself at request time — the server embeds the full post list as a Next.js RSC
// ("flight") prop, and the browser paginates/renders it in JS. Neither page's server-rendered
// HTML contains a single post title, excerpt or /blog/<slug> link (confirmed empirically: 0
// of 172 titles land in /blog's extracted visible text, 0 /blog/<slug> links are found), so
// without extracting this embedded data, the entire listing's content, order and count are
// invisible to parity — a stale cached /blog or a date-rendering difference on Vercel would
// pass unnoticed.

/**
 * Extract a `self.__next_f.push([<n>,"<data>"])` call's <data> argument as the RAW quoted JS
 * string literal (including its surrounding quotes), starting at `openQuoteIndex` (the
 * position of the opening `"`). Returns null (never throws) on an unterminated string, so
 * the caller can report a clear parse failure instead of an unrelated exception.
 */
function extractQuotedJsStringAt(text, openQuoteIndex) {
  let i = openQuoteIndex + 1
  while (i < text.length) {
    const ch = text[i]
    if (ch === '\\') {
      i += 2
      continue
    }
    if (ch === '"') return text.slice(openQuoteIndex, i + 1)
    i++
  }
  return null
}

/**
 * Every `self.__next_f.push([<n>,"<data>"])` call's <data> is EXACTLY a JSON string literal
 * (JSON.parse('"<data>"') recovers it byte-for-byte, including doubly-escaped nested JSON
 * like a ld+json script's innerHTML — verified against the live site). The browser APPENDS
 * each pushed chunk to one growing buffer in document order and parses THAT as a sequence of
 * `<hexId>:<row>` "rows" — a chunk is NOT one row per push() call: Next.js freely batches
 * several rows into one push() call and splits a single row across two calls (confirmed
 * live: 6 of 13 push() calls each held multiple rows). Treating each push() call as exactly
 * one row — as an earlier version of this function did — silently skipped every batched
 * call whose leading row wasn't valid JSON on its own, which is fragile: a harmless batching
 * change on Vercel's build could make the extraction throw on both sides for the wrong
 * reason. So: join every push() call's recovered string in order first, then split THAT
 * into rows.
 */
function joinFlightPushStrings(rawHtml) {
  const re = /self\.__next_f\.push\(\[\d+,"/g
  let joined = ''
  let m
  while ((m = re.exec(rawHtml))) {
    const openQuoteIndex = m.index + m[0].length - 1
    const literal = extractQuotedJsStringAt(rawHtml, openQuoteIndex)
    if (literal === null) continue
    let text
    try {
      text = JSON.parse(literal)
    } catch {
      continue
    }
    if (typeof text === 'string') joined += text
  }
  return joined
}

/**
 * Split the joined flight buffer into `{id, type, data}` rows. Most rows are simply
 * `<hexId>:<data>` terminated by the next newline (a JSON value row, an "I[...]" import
 * instruction, an "HL[...]" hint, etc. — untyped here, just whatever's between the colon and
 * the newline). A "T" row is different: React's flight protocol gives it an explicit BYTE
 * length so its own payload can itself contain literal newlines without being mistaken for a
 * row boundary — `<hexId>:T<hexByteLength>,<payload of exactly hexByteLength UTF-8 bytes>`,
 * with no newline required to terminate it (one may still follow; skipped if present).
 * Malformed input (a row that doesn't start `<hex>:`, or a truncated "T" row) stops parsing
 * at that point rather than throwing — the caller decides what to do with however many rows
 * were recovered before that.
 */
function splitFlightRows(joined) {
  const rows = []
  let pos = 0
  const len = joined.length
  while (pos < len) {
    // The id may be EMPTY (a bare `:HL[...]` hint row, not tied to any chunk id) — confirmed
    // live; requiring at least one hex digit here used to stop parsing dead at the first one.
    const idMatch = /^([0-9a-fA-F]*):/.exec(joined.slice(pos, pos + 32))
    if (!idMatch) break
    const id = idMatch[1]
    const afterId = pos + idMatch[0].length
    if (joined[afterId] === 'T') {
      const lenMatch = /^T([0-9a-fA-F]+),/.exec(joined.slice(afterId, afterId + 32))
      if (!lenMatch) break
      const byteLen = parseInt(lenMatch[1], 16)
      const payloadStart = afterId + lenMatch[0].length
      const payloadBuf = Buffer.from(joined.slice(payloadStart), 'utf8').subarray(0, byteLen)
      if (payloadBuf.length < byteLen) break // truncated input; stop rather than misparse
      const data = payloadBuf.toString('utf8')
      rows.push({ id, type: 'T', data })
      let next = payloadStart + data.length
      if (joined[next] === '\n') next++
      pos = next
    } else {
      const nlIdx = joined.indexOf('\n', afterId)
      const end = nlIdx === -1 ? len : nlIdx
      rows.push({ id, type: null, data: joined.slice(afterId, end) })
      pos = nlIdx === -1 ? len : nlIdx + 1
    }
  }
  return rows
}

/**
 * The parsed JSON value of every row that has one (skips "T" text rows — react's flight
 * protocol uses them for literal text content, never a JSON value — and any row whose data
 * isn't valid JSON, e.g. an "I[...]" import instruction: not page data, silently not a
 * candidate, never an error by itself — only SOME rows carry page data, and finding zero
 * qualifying arrays across ALL of them is reported by the caller, not here).
 */
function extractFlightSegments(rawHtml) {
  const rows = splitFlightRows(joinFlightPushStrings(rawHtml))
  const segments = []
  for (const row of rows) {
    if (row.type === 'T') continue
    try {
      segments.push(JSON.parse(row.data))
    } catch {
      // not a JSON-valued row — skip
    }
  }
  return segments
}

/** Recursively search a parsed flight segment for an array of plain objects that ALL carry a
 *  string `slug` field — the shape of an embedded blog-post list, wherever it sits in the
 *  segment's React-tree-shaped JSON (a prop name like "initialPosts" is an implementation
 *  detail this deliberately does not hardcode). */
function collectSlugArrays(node, out) {
  if (Array.isArray(node)) {
    if (node.length > 0 && node.every((x) => x && typeof x === 'object' && !Array.isArray(x) && typeof x.slug === 'string')) {
      out.push(node)
    }
    for (const child of node) collectSlugArrays(child, out)
  } else if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) collectSlugArrays(node[key], out)
  }
}

/**
 * Extract the ORDERED list of embedded post objects from a raw HTML body (unmodified — no
 * build-hash noise appears inside this data, so normalizeHtmlNoise is neither needed nor
 * applied here) for a page that renders its post list client-side from an RSC-embedded prop.
 *
 * ALWAYS THROWS rather than returning [] when it can't find exactly one qualifying embedded
 * array — a silent [] would be indistinguishable from "this page genuinely has zero posts,"
 * hiding the entire listing from parity. Every returned item is the FULL parsed object
 * (whatever fields the page actually embeds — verified live: id, title, category, date,
 * slug, author, excerpt, published; NOT the same field set as /api/blog, which also embeds
 * authorTeam/readTime/sections/relatedSlugs/legacyUrl/createdAt/updatedAt), so a caller
 * comparing "every field exact" compares exactly what this page embeds, nothing assumed.
 */
export function extractEmbeddedBlogPosts(rawHtml) {
  const segments = extractFlightSegments(rawHtml)
  if (segments.length === 0) {
    throw new Error('no parseable Next.js RSC flight rows (self.__next_f.push(...)) found in the raw body')
  }
  const candidates = []
  for (const seg of segments) collectSlugArrays(seg, candidates)
  if (candidates.length === 0) {
    throw new Error('found RSC flight rows but no embedded post array (objects with a string slug field) inside them')
  }
  // Per review: require EXACTLY one candidate — keeping "the longest" used to silently
  // guess when more than one array qualified, which the docstring above never promised.
  if (candidates.length > 1) {
    throw new Error(
      `found ${candidates.length} candidate embedded post arrays (lengths: ${candidates.map((c) => c.length).join(', ')}); refusing to guess which is the real listing`,
    )
  }
  return candidates[0]
}
