import { MetadataRoute } from 'next'
import { storage } from '@/lib/storage'
import { BASE_URL, indexableRoutes } from '@/lib/seo/indexableRoutes'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogPosts: MetadataRoute.Sitemap = []
  try {
    const posts = await storage.getPublishedBlogPosts()
    blogPosts = posts.map(post => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {}

  return [
    ...indexableRoutes.map(route => ({
      url: `${BASE_URL}${route.url}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...blogPosts,
  ]
}