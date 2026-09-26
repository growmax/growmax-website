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
    if (!raw) return
    try {
      const u = new URL(raw, pageUrl)
      if (!isSameSite(u, pageUrl)) return
      assetRefs.add(u.pathname + (u.search || ''))
    } catch {
      // relative/invalid ref we couldn't resolve; ignore
    }
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

function isSameSite(u, pageUrl) {
  try {
    const page = new URL(pageUrl)
    return u.host === page.host
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
