import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ClientToaster } from '@/components/providers/ClientToaster'

export const metadata: Metadata = {
  title: 'Growmax | B2B Revenue Operations Platform',
  description: 'Intelligent Revenue Operations Platform for B2B Manufacturers & Distributors.',
  metadataBase: new URL('https://www.growmax.io'),
  openGraph: {
    siteName: 'Growmax',
    type: 'website',
    images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/opengraph.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.png" />
      </head>
      <body suppressHydrationWarning>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <ClientToaster />
      </body>
    </html>
  )
}
