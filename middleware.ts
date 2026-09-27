import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/blog/') && !pathname.startsWith('/blog/[')) {
    const slug = pathname.replace('/blog/', '')
    if (slug && !slug.includes('/')) {
      let timer: ReturnType<typeof setTimeout> | undefined
      try {
        // Race against a 5000ms timeout to cover a Neon cold start; fail open on timeout
        // exactly like the catch below (H1's page-level redirect check keeps SEO correct).
        const rows = (await Promise.race([
          sql`
            SELECT new_path FROM blog_redirects
            WHERE old_path = ${slug}
            LIMIT 1
          `,
          new Promise<never>((_, reject) => {
            timer = setTimeout(() => reject(new Error('blog_redirects lookup timed out')), 5000)
          }),
        ])) as Array<{ new_path: string }>
        if (rows.length > 0 && rows[0].new_path) {
          return NextResponse.redirect(
            new URL(`/blog/${rows[0].new_path}`, request.url),
            { status: 301 },
          )
        }
      } catch {
        // fail open — let the page handler render
      } finally {
        clearTimeout(timer)
      }
    }
  }

  // Blog pagination: /blog?page=N (N>1) -> noindex,follow (canonical already points to /blog)
  if (pathname === '/blog') {
    const pageParam = request.nextUrl.searchParams.get('page')
    const pageNum = pageParam ? parseInt(pageParam, 10) : 1
    if (Number.isFinite(pageNum) && pageNum > 1) {
      const paged = NextResponse.next()
      paged.headers.set('X-Robots-Tag', 'noindex, follow')
      return paged
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/blog', '/blog/:path*'],
}
