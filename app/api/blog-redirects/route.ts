import { NextRequest, NextResponse } from 'next/server'
import { storage } from '@/lib/storage'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ newSlug: null })
  try {
    const redirect = await storage.getRedirect(slug)
    const newSlug = redirect?.newPath
    return NextResponse.json({ newSlug: newSlug || null })
  } catch {
    return NextResponse.json({ newSlug: null })
  }
}
