import type { Metadata } from 'next'
import DemoClient from './DemoClient'
import { contactPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'Book a Demo | Growmax B2B Revenue Operations Platform',
  description: 'Schedule a technical consultation with the Growmax architecture team. Deploy pilot programs in 8-12 weeks. ERP integration, partner portals, and B2B commerce.',
  alternates: { canonical: 'https://www.growmax.io/demo' },
  openGraph: { title: 'Book a Demo | Growmax', description: 'Schedule a technical consultation with the Growmax architecture team.', url: 'https://www.growmax.io/demo' },
}

export default function DemoPage() {
  return <DemoClient schema={JSON.stringify(contactPageSchema())} />
}
