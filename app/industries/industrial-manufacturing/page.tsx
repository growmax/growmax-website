import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Factory, Users, DollarSign, Server, Package, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Industrial Manufacturers | Growmax',
  description: 'Revenue operations platform for industrial manufacturers. Connect sales reps, dealer networks, and customers with SAP integration, multi-version quotes, and partner commerce portals.',
  alternates: { canonical: 'https://www.growmax.io/industries/industrial-manufacturing' },
  openGraph: { title: 'B2B eCommerce for Industrial Manufacturers | Growmax', description: 'Revenue operations platform for industrial manufacturers.', url: 'https://www.growmax.io/industries/industrial-manufacturing', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

const painPoints = [
  { icon: Users, title: 'Dealer & Distributor Network', problem: '300+ dealers each needing their own catalog, pricing, and ordering portal — impossible to manage manually.', solution: 'Multi-tenant partner commerce platform. Each dealer gets their branded portal with their pricing and catalog.' },
  { icon: DollarSign, title: 'Multi-Level Channel Pricing', problem: 'Manufacturer → Distributor → Dealer → End Customer pricing tiers with volume discounts and seasonal promotions.', solution: 'Multi-tier pricing engine that handles the full channel pricing chain with margin protection at every level.' },
  { icon: Server, title: 'SAP ECC Integration', problem: 'Product masters, pricing conditions, and inventory live in SAP — disconnected from your sales channels.', solution: 'Native SAP JCo integration with bidirectional RFC calls. No middleware. Real-time data sync across all channels.' },
  { icon: Factory, title: 'Complex Product Configuration', problem: 'Made-to-order and configured products require guided selling — not a simple shopping cart.', solution: 'CPQ engine with product rules, BOM-linked configurations, and approval workflows for custom orders.' },
  { icon: Package, title: 'Spare Parts Aftermarket', problem: 'Aftermarket revenue from spare parts is undermonetized — customers buy from third parties because it\'s easier.', solution: 'Dedicated spare parts portal with equipment-linked catalogs, serial number lookup, and service engineer access.' },
  { icon: Truck, title: 'Field Sales Visibility', problem: 'Field reps quote from memory, miss upsell opportunities, and have no visibility into dealer activity.', solution: 'Mobile-first sales app with offline capability, real-time inventory, customer history, and quote creation.' },
]

export default function IndustrialManufacturing() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Industrial Manufacturers', description: 'Revenue operations platform for industrial manufacturers.', path: '/industries/industrial-manufacturing', keywords: ['industrial manufacturing B2B ecommerce', 'manufacturer dealer portal', 'SAP integrated commerce platform'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Industrial Manufacturing' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Industrial Manufacturing</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Industrial Manufacturers.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">Connect your entire revenue chain — internal sales, dealer networks, and end customers — on one SAP-integrated platform with full ecosystem visibility.</p>
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
      <WhichGrowmax industry="Industrial Manufacturing" />
    </div>
  )
}
