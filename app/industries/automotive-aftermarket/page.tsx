import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Package, DollarSign, Users, Factory, Server, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Automotive Aftermarket Distributors | Growmax',
  description: 'Revenue operations platform for automotive aftermarket distributors. Part number lookup, fitment guides, garage portals, and ERP integration for auto parts distribution.',
  alternates: { canonical: 'https://www.growmax.io/industries/automotive-aftermarket' },
  openGraph: { title: 'B2B eCommerce for Automotive Aftermarket Distributors | Growmax', description: 'Revenue operations platform for automotive aftermarket distributors.', url: 'https://www.growmax.io/industries/automotive-aftermarket', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

const painPoints = [
  { icon: Search, title: 'Part Identification Complexity', problem: 'Mechanics search by VIN, OEM number, or application — not catalog number. Standard search fails them.', solution: 'Fitment-based catalog search with VIN decoder, OEM cross-reference, and supersession chain mapping.' },
  { icon: Package, title: 'Fitment Data Management', problem: 'Year/Make/Model fitment data for 100K+ SKUs is constantly changing and hard to maintain accurately.', solution: 'Integrated fitment database with automatic updates, conflict detection, and application-verified catalog search.' },
  { icon: DollarSign, title: 'Tiered Garage Pricing', problem: 'Fleet accounts, independent garages, and dealerships each need different pricing structures and credit terms.', solution: 'Customer-tier pricing with account-specific contracts, volume rebates, and core charge management.' },
  { icon: Users, title: 'Garage & Dealer Portals', problem: 'Independent workshops need quick reordering, account statements, and warranty claim management.', solution: 'Branded garage portals with reorder history, core return management, and warranty claim workflows.' },
  { icon: Factory, title: 'Core & Warranty Management', problem: 'Core charge tracking, warranty returns, and defective part claims require specialized workflows.', solution: 'Built-in core charge management with return merchandise authorization (RMA) and warranty claim tracking.' },
  { icon: Server, title: 'Multi-Brand Catalog Complexity', problem: 'Stocking OEM, aftermarket, and private label parts across thousands of vehicles requires intelligent catalog management.', solution: 'Multi-brand catalog with OEM vs aftermarket comparison, brand preference rules, and margin-optimized recommendations.' },
]

export default function AutomotiveAftermarket() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Automotive Aftermarket Distributors', description: 'Revenue operations platform for automotive aftermarket distributors.', path: '/industries/automotive-aftermarket', keywords: ['automotive aftermarket B2B ecommerce', 'auto parts distributor portal', 'fitment catalog software'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Automotive Aftermarket' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Automotive Aftermarket</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Automotive Aftermarket.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">VIN-based part search, fitment catalogs, garage portals, and core charge management for automotive parts distributors and OEM aftermarket suppliers.</p>
          <Link href="/demo"><Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-8 rounded-none font-bold tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all">Book a Demo <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16"><h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Pain Points We Solve</h2><div className="w-16 h-2 bg-growmax-red" /></div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {painPoints.map((item, i) => (
              <div key={i} className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                <item.icon className="w-10 h-10 text-growmax-red mb-4" />
                <h3 className="text-lg font-bold uppercase mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-3 font-mono italic">&ldquo;{item.problem}&rdquo;</p>
                <p className="text-sm text-gray-700 leading-relaxed">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WhichGrowmax industry="Automotive Aftermarket Distribution" />
    </div>
  )
}
