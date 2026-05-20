import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { storage } from '@/lib/storage'
import QueryProvider from '@/components/providers/QueryProvider'
import BlogPostClient from './BlogPostClient'
import { articleSchema } from '@/lib/structuredData'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await storage.getBlogPostBySlug(slug)
    if (!post) return { title: 'Article Not Found | Growmax Intelligence' }
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
  } catch {
    return { title: 'Growmax Intelligence' }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let post = null
  try {
    post = await storage.getBlogPostBySlug(slug)
  } catch {}
  if (!post) {
    return <QueryProvider><BlogPostClient slug={slug} post={null} /></QueryProvider>
  }
  const schema = JSON.stringify(articleSchema({ title: post.title, description: post.excerpt, slug: post.slug, date: post.date, author: post.author }))
  const postData = { ...post, relatedSlugs: post.relatedSlugs ?? [] }
  return <QueryProvider><BlogPostClient slug={slug} post={postData} schema={schema} /></QueryProvider>
}
