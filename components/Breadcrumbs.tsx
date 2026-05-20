import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

const BASE_URL = 'https://www.growmax.io'

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  // Build BreadcrumbList JSON-LD: Home + only items that have an href, plus the final (current) item.
  // Per Google: intermediate ListItems should include `item` URLs; the final/current entry may omit it.
  const lastIdx = items.length - 1
  const entries = items
    .map((it, i) => ({ it, i }))
    .filter(({ it, i }) => i === lastIdx || !!it.href)
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      ...entries.map(({ it }, idx) => ({
        '@type': 'ListItem',
        position: idx + 2,
        name: it.label,
        ...(it.href ? { item: `${BASE_URL}${it.href}` } : {}),
      })),
    ],
  }
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[10px] uppercase tracking-widest text-gray-500" data-testid="nav-breadcrumbs">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link href="/" className="hover:text-growmax-red transition-colors" data-testid="breadcrumb-home">HOME</Link>
        </li>
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            <span className="text-gray-300 mx-1">/</span>
            {item.href ? (
              <Link href={item.href} className="hover:text-growmax-red transition-colors" data-testid={`breadcrumb-${i}`}>{item.label}</Link>
            ) : (
              <span className="text-gray-400" data-testid={`breadcrumb-${i}`}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
