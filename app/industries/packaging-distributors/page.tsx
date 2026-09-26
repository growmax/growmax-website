import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Package, DollarSign, Users, Building2, Truck, Factory } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Packaging Distributors',
  description: 'Revenue operations platform for packaging distributors. Custom packaging quoting, print procurement, inventory management, and ERP integration for packaging supply distribution.',
  alternates: { canonical: 'https://www.growmax.io/industries/packaging-distributors' },
  openGraph: { title: 'B2B eCommerce for Packaging Distributors | Growmax', description: 'Revenue operations platform for packaging distributors.', url: 'https://www.growmax.io/industries/packaging-distributors', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

const painPoints = [
  { icon: Package, title: 'Custom Packaging Quoting', problem: 'Custom-printed boxes, labels, and packaging require detailed specifications and proofing cycles before pricing.', solution: 'CPQ with artwork upload, specification capture, proof approval workflows, and setup cost calculation.' },
  { icon: DollarSign, title: 'Print & Production Pricing', problem: 'Run quantity, substrate, print method, and finishing options create complex pricing matrices.', solution: 'Production pricing engine with quantity breaks, substrate pricing, and add-on finishing cost calculation.' },
  { icon: Users, title: 'Brand Management Portals', problem: 'Large CPG accounts need brand managers to control approved packaging designs across locations.', solution: 'Brand asset portals with approved template libraries, reorder management, and brand compliance controls.' },
  { icon: Building2, title: 'Multi-Plant Procurement', problem: 'Manufacturing companies buying packaging for multiple plants need consolidated ordering and cost allocation.', solution: 'Multi-plant procurement with plant-specific inventory, consolidated billing, and cost center allocation.' },
  { icon: Factory, title: 'Just-In-Time Inventory', problem: 'Packaging must arrive exactly when production needs it — early delivery wastes space, late delivery stops lines.', solution: 'JIT delivery scheduling with production schedule integration, delivery confirmation, and lead time management.' },
  { icon: Truck, title: 'Managed Inventory Programs', problem: 'Stocking programs where you manage customer inventory levels require sophisticated tracking and billing.', solution: 'Customer-managed inventory with bin stocking programs, consumption billing, and automatic replenishment.' },
]

export default function PackagingDistributors() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Packaging Distributors', description: 'Revenue operations platform for packaging distributors.', path: '/industries/packaging-distributors', keywords: ['packaging distributor software', 'custom packaging B2B ecommerce', 'packaging supply platform'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Packaging Distributors' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Packaging Distribution</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Packaging Distributors.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">Custom packaging quoting, brand management portals, and JIT inventory programs for packaging supply distributors.</p>
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
      <WhichGrowmax industry="Packaging Distribution" />
    </div>
  )
}
