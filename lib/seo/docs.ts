import { BASE_URL } from '@/lib/seo/indexableRoutes'

// The product docs at /docs are a separate Docusaurus site (growmax/ARC docs-site) proxied by
// middleware.ts. Its sitemap is the source of truth for which docs pages exist, so llms.txt lists
// them from there and picks up new guides without a deploy here. Each guide and developer page is
// then read for its real <title> and meta description (cached for an hour); the slug-based title is
// the fallback when a page cannot be fetched.

export type DocsPage = { path: string; title: string; description?: string }
export type DocsSection = { key: string; label: string; description: string; pages: DocsPage[] }
export type DocsIndex = { guides: DocsSection[]; developers: DocsPage[]; restEndpoints: DocsPage[] }

const guideSections: Record<string, { label: string; description: string }> = {
  'getting-started': { label: 'Getting started', description: 'Set up a Growmax ARC workspace, roles, the ARC copilot and AI agents.' },
  sales: { label: 'Sales', description: 'Quotes, sales orders, invoicing, payments, returns, commissions and field routes.' },
  catalog: { label: 'Catalog and pricing', description: 'Products, variants, attributes, price tiers, discount schemes and AI product enrichment.' },
  'customer-portal': { label: 'Customer portal', description: 'B2B self-service ordering portal for buyers, with accounts, teams and approvals.' },
  'customers-and-suppliers': { label: 'Customers and suppliers', description: 'Manage customer and supplier records and approve new customer signups.' },
  purchasing: { label: 'Purchasing', description: 'Purchase orders, goods receipt (GRN), purchase invoices, supplier payments and payables.' },
  inventory: { label: 'Inventory', description: 'Stock levels, adjustments, movements and warehouse transfers.' },
  'mobile-apps': { label: 'Mobile apps', description: 'Buyer mobile app and field sales app.' },
  analytics: { label: 'Analytics', description: 'Dashboards, reports and app activity.' },
  'storefront-cms': { label: 'Storefront CMS', description: 'Buyer home content and guided flows.' },
  administration: { label: 'Administration', description: 'Organization, users, permissions, tax, finance, integrations, API and AI settings.' },
  'faq-and-glossary': { label: 'FAQ and glossary', description: 'Common questions and B2B commerce terms used in Growmax ARC.' },
}

const ACRONYMS: Record<string, string> = {
  api: 'API', ai: 'AI', mcp: 'MCP', cms: 'CMS', rest: 'REST', graphql: 'GraphQL', faq: 'FAQ',
  cli: 'CLI', arc: 'ARC', grn: 'GRN', sku: 'SKU', erp: 'ERP', id: 'ID', uom: 'UOM',
}
const MINOR_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'between', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with'])

export function titleFromSlug(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word, i) => {
      const lower = word.toLowerCase()
      if (ACRONYMS[lower]) return ACRONYMS[lower]
      if (i > 0 && MINOR_WORDS.has(lower)) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

function pageFromPath(path: string): DocsPage {
  const segments = path.split('/').filter(Boolean)
  return { path, title: titleFromSlug(segments.at(-1) ?? 'docs') }
}

export function parseDocsSitemap(xml: string): DocsIndex {
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(match => {
      try {
        return new URL(match[1].trim()).pathname
      } catch {
        return ''
      }
    })
    .filter(path => path.startsWith('/docs/'))

  const unique = [...new Set(paths)].sort()
  const guides = new Map<string, DocsPage[]>()
  const developers: DocsPage[] = []
  const restEndpoints: DocsPage[] = []

  for (const path of unique) {
    const segments = path.split('/').filter(Boolean) // ['docs', section, ...]
    const section = segments[1]
    if (!section) continue
    if (section === 'api') {
      // The GraphQL reference is thousands of generated type pages; only REST endpoints are listed.
      if (segments[2] === 'rest' && segments.length === 4) restEndpoints.push(pageFromPath(path))
      continue
    }
    if (section === 'developers') {
      if (segments.length > 2) developers.push(pageFromPath(path))
      continue
    }
    if (segments.length === 2) continue // section index pages are linked from the section heading
    if (!guides.has(section)) guides.set(section, [])
    guides.get(section)!.push(pageFromPath(path))
  }

  const order = Object.keys(guideSections)
  const sections = [...guides.entries()]
    .sort(([a], [b]) => (order.indexOf(a) === -1 ? 99 : order.indexOf(a)) - (order.indexOf(b) === -1 ? 99 : order.indexOf(b)))
    .map(([key, pages]) => ({
      key,
      label: guideSections[key]?.label ?? titleFromSlug(key),
      description: guideSections[key]?.description ?? '',
      pages,
    }))

  return { guides: sections, developers, restEndpoints }
}

function decodeEntities(value: string) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

// One line for llms.txt: the first sentence, capped so a long description stays a summary.
function summarize(text: string, max = 220) {
  const clean = decodeEntities(text).replace(/\s+/g, ' ').trim()
  const sentence = clean.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? clean
  return sentence.length <= max ? sentence : `${sentence.slice(0, max - 1).trimEnd()}…`
}

// Docusaurus falls back to a page's first paragraph when it has no description, which can be a
// placeholder, a lead-in to a list, a draft notice or a source path. Those are left out of llms.txt.
function isUsefulSummary(summary: string) {
  if (summary.length < 15) return false
  if (summary.endsWith(':')) return false
  if (/^(draft|todo|tbd|skeleton)\b/i.test(summary)) return false
  if (/(^|\s)[\w.-]+\/[\w./-]+\.(ts|tsx|js|mjs|json)\b/.test(summary)) return false
  return true
}

export function parseDocsPageMeta(html: string): { title?: string; description?: string } {
  const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]
  const description =
    html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i)?.[1] ??
    html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i)?.[1]
  const summary = description ? summarize(description) : undefined
  return {
    title: title ? decodeEntities(title).replace(/\s*\|\s*Growmax ARC Docs\s*$/i, '').trim() || undefined : undefined,
    description: summary && isUsefulSummary(summary) ? summary : undefined,
  }
}

const docsOrigin = () => process.env.DOCS_ORIGIN || BASE_URL

async function fetchDocs(path: string) {
  // Ask the docs origin directly when it is configured, so this does not loop through our own proxy.
  const res = await fetch(new URL(path, docsOrigin()), {
    headers: { 'x-docs-proxy': 'growmax.io' },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(5000),
  })
  return res.ok ? res.text() : null
}

async function enrich(pages: DocsPage[], concurrency = 8) {
  let next = 0
  const worker = async () => {
    while (next < pages.length) {
      const page = pages[next++]
      try {
        const html = await fetchDocs(page.path)
        if (!html) continue
        const meta = parseDocsPageMeta(html)
        if (meta.title) page.title = meta.title
        if (meta.description) page.description = meta.description
      } catch {
        // keep the slug title
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, pages.length) }, worker))
}

export async function getDocsIndex(): Promise<DocsIndex | null> {
  try {
    const xml = await fetchDocs('/docs/sitemap.xml')
    if (!xml) return null
    const index = parseDocsSitemap(xml)
    if (!index.guides.length && !index.developers.length) return null
    // REST endpoint pages keep slug titles: they are listed only in llms-full.txt and are many.
    await enrich([...index.guides.flatMap(section => section.pages), ...index.developers])
    return index
  } catch {
    return null
  }
}
