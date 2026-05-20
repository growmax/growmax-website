import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/arc', destination: '/', permanent: true },
      { source: '/arc/pricing', destination: '/', permanent: true },
      { source: '/arc/compare/b2b-wave', destination: '/', permanent: true },
      { source: '/arc/compare/pepperi', destination: '/', permanent: true },
      { source: '/arc/compare/nowcommerce', destination: '/', permanent: true },
      { source: '/arc/compare/cin7', destination: '/', permanent: true },
      { source: '/arc/compare/unleashed', destination: '/', permanent: true },
    ]
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ['*.replit.dev', '*.repl.co', '*.kirk.replit.dev'],
}

export default nextConfig
