import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { storage } from '@/lib/storage'
import QueryProvider from '@/components/providers/QueryProvider'
import BlogPostClient from './BlogPostClient'
import { articleSchema } from '@/lib/structuredData'

export const revalidate = 3600

// Without generateStaticParams a dynamic segment stays fully dynamic (no-store) and
// `revalidate` has no effect. An empty list prerenders nothing at build time and
// caches each slug on its first request (ISR), which is what H1 needs.
export async function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await storage.getBlogPostBySlug(slug)
  if (!post) {
    // Missing slug: check for a redirect before returning the not-found metadata,
    // so a middleware timeout (H3) can never get cached as a 404 for an hour.
    const redirect = await storage.getRedirect(slug)
    if (redirect) permanentRedirect(`/blog/${redirect.newPath}`)
    return { title: 'Article Not Found | Growmax Intelligence', robots: { index: false, follow: false } }
  }
  return {
    title: `${post.title} | Growmax Intelligence`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Growmax Intelligence`,
      description: post.excerpt,
      url: `https://www.growmax.io/blog/${post.slug}`,
      type: 'article', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
    twitter: { card: 'summary_large_image', title: `${post.title} | Growmax Intelligence`, description: post.excerpt },
    alternates: { canonical: `https://www.growmax.io/blog/${post.slug}` },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await storage.getBlogPostBySlug(slug)
  if (!post) {
    // Missing slug: check for a redirect before the real HTTP 404 (was 200 soft 404),
    // so a middleware timeout (H3) can never get cached as a 404 for an hour.
    const redirect = await storage.getRedirect(slug)
    if (redirect) permanentRedirect(`/blog/${redirect.newPath}`)
    notFound()
  }
  const schema = JSON.stringify(articleSchema({ title: post.title, description: post.excerpt, slug: post.slug, date: post.date, author: post.author }))
  const postData = { ...post, relatedSlugs: post.relatedSlugs ?? [] }
  return <QueryProvider><BlogPostClient slug={slug} post={postData} schema={schema} /></QueryProvider>
}
