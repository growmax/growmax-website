import type { NextConfig } from 'next'
import { gscIndexingRedirects } from './gsc-indexing-redirects'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // GSC indexing fixes 2026-09-21: 50 permanent redirects for Soft 404 / dead URLs
      ...gscIndexingRedirects,
      // ARC product pages (removed from site)
      { source: '/arc', destination: '/', permanent: true },
      { source: '/arc/pricing', destination: '/', permanent: true },
      { source: '/arc/compare/b2b-wave', destination: '/', permanent: true },
      { source: '/arc/compare/pepperi', destination: '/', permanent: true },
      { source: '/arc/compare/nowcommerce', destination: '/', permanent: true },
      { source: '/arc/compare/cin7', destination: '/', permanent: true },
      { source: '/arc/compare/unleashed', destination: '/', permanent: true },
      // Legacy AI pages → Minori AI
      { source: '/arc/ai', destination: '/minori-ai', permanent: true },
      { source: '/arc/ai/claude-commerce-agents', destination: '/minori-ai/commerce-agents', permanent: true },
      { source: '/arc/ai/connect', destination: '/minori-ai/connect', permanent: true },
      { source: '/arc/ai/minori', destination: '/minori-ai/how-it-works', permanent: true },
      // Revenue platform sub-feature pages → main product page
      { source: '/revenue-platform/dealer-portals', destination: '/revenue-platform', permanent: false },
      { source: '/revenue-platform/partner-commerce', destination: '/revenue-platform', permanent: false },
      { source: '/revenue-platform/spares-portals', destination: '/revenue-platform', permanent: false },
      { source: '/revenue-platform/sap-integration', destination: '/revenue-platform', permanent: false },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  allowedDevOrigins: ['*.replit.dev', '*.repl.co', '*.kirk.replit.dev'],
}

export default nextConfig
