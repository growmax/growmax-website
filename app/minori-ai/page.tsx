import type { Metadata } from 'next'
import MinoriV2 from '@/components/minori/MinoriV2'

export const metadata: Metadata = {
  title: 'Minori AI: quotes, orders, and product data',
  description: 'Turn customer requests into quotes, orders, and product data. Minori AI prepares the work; your team reviews and approves.',
  alternates: { canonical: 'https://www.growmax.io/minori-ai' },
  openGraph: { title: 'Minori AI for manufacturers and distributors', description: 'Turn customer requests into quotes, orders, and product data.', url: 'https://www.growmax.io/minori-ai', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Minori AI by Growmax' }] },
}

// GEO / AI-search: explicit SoftwareApplication schema for Minori AI
const minoriSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Minori AI',
  applicationCategory: 'BusinessApplication',
  applicationSubCategory: 'B2B Commerce AI Assistant',
  operatingSystem: 'Web',
  url: 'https://www.growmax.io/minori-ai',
  description: 'Minori AI turns customer requests into quotes, orders, and product data for B2B manufacturers and distributors. Minori AI prepares the work; your team reviews and approves.',
  featureList: [
    'Convert customer requests into quotes',
    'Create and update orders',
    'Prepare and enrich product data',
    'Human review and approval before anything is sent',
  ],
  provider: {
    '@type': 'Organization',
    name: 'Growmax',
    url: 'https://www.growmax.io',
  },
  isPartOf: {
    '@type': 'WebSite',
    name: 'Growmax',
    url: 'https://www.growmax.io',
  },
}

export default function MinoriAiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(minoriSchema) }}
      />
      <MinoriV2 />
    </>
  )
}
