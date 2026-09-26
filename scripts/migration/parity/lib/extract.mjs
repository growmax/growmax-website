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

  // Visible text: exclude script/style/noscript/template, collapse whitespace.
  const clone = root.clone()
  for (const tag of ['script', 'style', 'noscript', 'template']) {
    for (const el of clone.querySelectorAll(tag)) el.remove()
  }
  const visibleText = collapseWhitespace(clone.text)
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

  return {
    fields: {
      title,
      description,
      robots,
      canonical,
      lang,
      h1s,
      ogTwitter,
    },
    jsonLdHash,
    visibleTextHash,
    visibleText,
    internalLinks: [...internalLinks].sort(),
    images: [...images].sort(),
  }
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

/** XML sitemap extraction: {loc, changefreq, priority} + lastmod for blog URLs only. */
export function extractSitemap(rawXml) {
  const root = parseHtml(rawXml, { xmlMode: true, comment: false })
  const entries = []
  for (const urlEl of root.querySelectorAll('url')) {
    const loc = textOf(urlEl.querySelector('loc')) || null
    const changefreq = textOf(urlEl.querySelector('changefreq')) || null
    const priority = textOf(urlEl.querySelector('priority')) || null
    const lastmod = textOf(urlEl.querySelector('lastmod')) || null
    let path = null
    try {
      path = loc ? new URL(loc).pathname : null
    } catch {
      path = loc
    }
    const isBlog = !!path && path.startsWith('/blog/')
    entries.push({
      loc: path,
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
