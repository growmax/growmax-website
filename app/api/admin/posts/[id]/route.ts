import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { getSession } from '@/lib/session'
import { insertBlogPostSchema } from '@/lib/schema'

export const dynamic = 'force-dynamic'

async function requireAdmin() {
  const session = await getSession()
  return !!session.isAdmin
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const post = await storage.getBlogPostById(parseInt(id))
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json(post)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const body = await req.json()
    const parsed = insertBlogPostSchema.partial().safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    const result = await storage.updateBlogPost(parseInt(id), parsed.data)
    if (!result) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json(result)
  } catch (err: any) {
    if (err.message?.includes('unique')) return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id } = await params
    const deleted = await storage.deleteBlogPost(parseInt(id))
    if (!deleted) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 })
  }
}
