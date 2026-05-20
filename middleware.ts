import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/blog/') && !pathname.startsWith('/blog/[')) {
    const slug = pathname.replace('/blog/', '')
    if (slug && !slug.includes('/')) {
      try {
        const rows = (await sql`
          SELECT new_path FROM blog_redirects
          WHERE old_path = ${slug}
          LIMIT 1
        `) as Array<{ new_path: string }>
        if (rows.length > 0 && rows[0].new_path) {
          return NextResponse.redirect(
            new URL(`/blog/${rows[0].new_path}`, request.url),
            { status: 301 },
          )
        }
      } catch {
        // fail open — let the page handler render
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/blog/:path*'],
}
