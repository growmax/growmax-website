import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

// Product documentation is published as a subfolder of this site — www.growmax.io/docs — so its
// pages and the links to them build growmax.io's search standing. The pages themselves are built
// and hosted by the ARC repo (docs-site → Railway); DOCS_ORIGIN is that origin, e.g.
// https://arc-docs-production.up.railway.app. The marker header tells the origin the request came
// through growmax.io, which is the only copy it lets search engines index (deploy/docker/nginx-docs.conf
// in growmax/ARC). Unset DOCS_ORIGIN and /docs falls through to the normal 404.
const DOCS_ORIGIN = process.env.DOCS_ORIGIN

function proxyDocs(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const target = new URL(`${pathname}${search}`, DOCS_ORIGIN)
  const headers = new Headers(request.headers)
  headers.set('x-docs-proxy', 'growmax.io')
  return NextResponse.rewrite(target, { request: { headers } })
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isDocs = pathname === '/docs' || pathname.startsWith('/docs/')
  if (DOCS_ORIGIN && isDocs) {
    return proxyDocs(request)
  }

  // next.config.ts sets skipTrailingSlashRedirect (the docs keep their slashes), so this site's
  // own no-trailing-slash URLs are enforced here: /blog/ → 308 /blog, as Next did before.
  if (!isDocs && pathname !== '/' && pathname.endsWith('/')) {
    // A plain URL: NextURL would keep the trailing slash it was parsed with.
    const url = new URL(request.url)
    url.pathname = pathname.replace(/\/+$/, '')
    return NextResponse.redirect(url, 308)
  }

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
  // Every page path (the trailing-slash rule above applies site-wide); not Next's static assets
  // or files with an extension (robots.txt, sitemap.xml, images) — except under /docs, whose
  // assets, sitemap and downloads all come from the docs origin.
  matcher: ['/docs', '/docs/:path*', '/((?!_next/static|_next/image|.*\\.[a-zA-Z0-9]+$).*)'],
}
