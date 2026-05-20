import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // ARC product pages (removed from site)
      { source: '/arc', destination: '/', permanent: true },
      { source: '/arc/pricing', destination: '/', permanent: true },
      { source: '/arc/compare/b2b-wave', destination: '/', permanent: true },
      { source: '/arc/compare/pepperi', destination: '/', permanent: true },
      { source: '/arc/compare/nowcommerce', destination: '/', permanent: true },
      { source: '/arc/compare/cin7', destination: '/', permanent: true },
      { source: '/arc/compare/unleashed', destination: '/', permanent: true },
      // Revenue platform sub-feature pages → main product page
      { source: '/revenue-platform/dealer-portals', destination: '/revenue-platform', permanent: false },
      { source: '/revenue-platform/partner-commerce', destination: '/revenue-platform', permanent: false },
      { source: '/revenue-platform/spares-portals', destination: '/revenue-platform', permanent: false },
      { source: '/revenue-platform/sap-integration', destination: '/revenue-platform', permanent: false },
    ]
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['*.replit.dev', '*.repl.co', '*.kirk.replit.dev'],
}

export default nextConfig
