import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { getSession } from '@/lib/session'
import { insertBlogPostSchema } from '@/lib/schema'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = await getSession()
  if (!session.isAdmin) return false
  return true
}

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const posts = await storage.getAllBlogPosts()
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    if (!body.date || (typeof body.date === 'string' && body.date.trim() === '')) {
      body.date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
    const parsed = insertBlogPostSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    const result = await storage.createBlogPost(parsed.data)
    return NextResponse.json(result, { status: 201 })
  } catch (err: any) {
    if (err.message?.includes('unique')) return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
