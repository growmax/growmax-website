import { storage } from '@/lib/storage'
import { buildLlmsTxt } from '@/lib/seo/llms'
import type { BlogPost } from '@/lib/schema'

export const revalidate = 3600

export async function GET() {
  let posts: BlogPost[] = []
  try {
    posts = await storage.getPublishedBlogPosts()
  } catch {}

  return new Response(buildLlmsTxt(posts), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
