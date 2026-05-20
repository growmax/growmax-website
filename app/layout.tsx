import type { Metadata } from 'next'
import { IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { ClientToaster } from '@/components/providers/ClientToaster'

const plexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-sans',
  preload: true,
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-plex-mono',
  preload: true,
})

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
    <html lang="en" suppressHydrationWarning className={`${plexSans.variable} ${plexMono.variable}`}>
      <head>
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
