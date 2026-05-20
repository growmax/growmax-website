import type { Metadata } from 'next'
import QueryProvider from '@/components/providers/QueryProvider'
import BlogListClient from './BlogListClient'
import { collectionPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'Growmax Intelligence | B2B Commerce & Distribution Insights',
  description: 'Expert insights on B2B eCommerce, industrial distribution, spare parts management, AI in commerce, and sales automation for manufacturers and distributors.',
  alternates: { canonical: 'https://www.growmax.io/blog' },
  openGraph: {
    title: 'Growmax Intelligence | B2B Commerce & Distribution Insights',
    description: 'Expert insights on B2B eCommerce, industrial distribution, spare parts management, and sales automation.',
    url: 'https://www.growmax.io/blog',
  },
}

export default function BlogPage() {
  const schema = JSON.stringify(collectionPageSchema({
    title: 'Growmax Intelligence — B2B Commerce & Distribution Insights',
    description: 'Expert insights on B2B eCommerce, industrial distribution, spare parts management, AI in commerce, and sales automation for manufacturers and distributors.',
    path: '/blog',
  }))
  return (
    <QueryProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <BlogListClient />
    </QueryProvider>
  )
}
