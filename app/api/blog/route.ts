import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export const revalidate = 300

export async function GET() {
  // Don't swallow DB errors: let regeneration fail and serve the stale cached response.
  const posts = await storage.getPublishedBlogPosts()
  return NextResponse.json(posts)
}
