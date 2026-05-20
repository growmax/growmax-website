import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/blog/') && !pathname.startsWith('/blog/[')) {
    const slug = pathname.replace('/blog/', '')
    if (slug && !slug.includes('/')) {
      try {
        const baseUrl = request.nextUrl.origin
        const res = await fetch(`${baseUrl}/api/blog-redirects?slug=${encodeURIComponent(slug)}`, {
          headers: { 'x-internal': '1' },
        })
        if (res.ok) {
          const data = await res.json()
          if (data.newSlug) {
            return NextResponse.redirect(new URL(`/blog/${data.newSlug}`, request.url), { status: 301 })
          }
        }
      } catch {}
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/blog/:path*'],
}
