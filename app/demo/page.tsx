import type { Metadata } from 'next'
import QueryProvider from '@/components/providers/QueryProvider'
import DemoClient from './DemoClient'
import { contactPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'Book a Demo | Growmax B2B Revenue Operations Platform',
  description: 'Schedule a technical consultation with the Growmax architecture team. Deploy pilot programs in 8-12 weeks. ERP integration, partner portals, and B2B commerce.',
  alternates: { canonical: 'https://www.growmax.io/demo' },
  openGraph: { title: 'Book a Demo | Growmax', description: 'Schedule a technical consultation with the Growmax architecture team.', url: 'https://www.growmax.io/demo', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

export default async function DemoPage({ searchParams }: { searchParams: Promise<{ module?: string; source?: string }> }) {
  const { module, source } = await searchParams
  const initialModules = module === 'minori-beta' ? ['minori-beta'] : []
  const conversionSource = source === 'minori-ai-v1' || source === 'minori-ai-v2' ? source : undefined

  return (
    <QueryProvider>
      <DemoClient schema={JSON.stringify(contactPageSchema())} initialModules={initialModules} conversionSource={conversionSource} />
    </QueryProvider>
  )
}
