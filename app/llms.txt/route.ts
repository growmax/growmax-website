import { storage } from '@/lib/storage'
import { buildLlmsTxt } from '@/lib/seo/llms'
import type { BlogPost } from '@/lib/schema'
import { getDocsIndex } from '@/lib/seo/docs'

export const revalidate = 3600

export async function GET() {
  const docsPromise = getDocsIndex()
  let posts: BlogPost[] = []
  try {
    posts = await storage.getPublishedBlogPosts()
  } catch {}
  const docs = await docsPromise

  return new Response(buildLlmsTxt(posts, docs), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
