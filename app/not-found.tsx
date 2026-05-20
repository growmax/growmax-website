import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-growmax-white pt-16 flex items-center justify-center">
      <div className="text-center max-w-xl px-4">
        <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4">404 — Not Found</div>
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-growmax-black mb-6 uppercase">404</h1>
        <p className="text-xl text-gray-600 mb-8 font-light">This page doesn&apos;t exist or has been moved.</p>
        <Link href="/">
          <Button className="bg-growmax-black hover:bg-growmax-red text-white rounded-none font-bold uppercase tracking-widest text-xs h-12 px-8">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
