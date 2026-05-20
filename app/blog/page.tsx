import type { Metadata } from 'next'
import QueryProvider from '@/components/providers/QueryProvider'
import BlogListClient from './BlogListClient'
import { collectionPageSchema } from '@/lib/structuredData'
import { storage } from '@/lib/storage'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Growmax Intelligence | B2B Commerce & Distribution Insights',
  description: 'Expert insights on B2B eCommerce, industrial distribution, spare parts management, AI in commerce, and sales automation for manufacturers and distributors.',
  alternates: { canonical: 'https://www.growmax.io/blog' },
  openGraph: {
    title: 'Growmax Intelligence | B2B Commerce & Distribution Insights',
    description: 'Expert insights on B2B eCommerce, industrial distribution, spare parts management, and sales automation.',
    url: 'https://www.growmax.io/blog',
    images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }],
  },
}

export default async function BlogPage() {
  const schema = JSON.stringify(collectionPageSchema({
    title: 'Growmax Intelligence — B2B Commerce & Distribution Insights',
    description: 'Expert insights on B2B eCommerce, industrial distribution, spare parts management, AI in commerce, and sales automation for manufacturers and distributors.',
    path: '/blog',
  }))

  const dbPosts = await storage.getPublishedBlogPosts()
  const initialPosts = dbPosts.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    date: p.createdAt
      ? new Date(p.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      : '',
    slug: p.slug,
    author: p.author,
    excerpt: p.excerpt ?? '',
    published: p.published,
  }))

  return (
    <QueryProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <BlogListClient initialPosts={initialPosts} />
    </QueryProvider>
  )
}
