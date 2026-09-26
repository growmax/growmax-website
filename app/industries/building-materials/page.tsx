import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Building2, Truck, DollarSign, Users, Package, Factory } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Building Materials Distributors',
  description: 'Revenue operations platform for building materials distributors. Complex contractor pricing, project-based quoting, and multi-warehouse management for roofing, lumber, and construction supply.',
  alternates: { canonical: 'https://www.growmax.io/industries/building-materials' },
  openGraph: { title: 'B2B eCommerce for Building Materials Distributors | Growmax', description: 'Revenue operations platform for building materials distributors.', url: 'https://www.growmax.io/industries/building-materials', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

const painPoints = [
  { icon: DollarSign, title: 'Project-Based Pricing', problem: 'Contractor bids require job-site-specific pricing that changes daily with commodity fluctuations.', solution: 'Dynamic pricing engine with project-linked quotes, commodity price feeds, and margin protection rules.' },
  { icon: Truck, title: 'Complex Delivery Logistics', problem: 'Lumber, roofing, and concrete require scheduled delivery coordination across multiple job sites.', solution: 'Integrated delivery scheduling with job-site address management and route optimization.' },
  { icon: Users, title: 'Contractor Relationship Management', problem: 'Top contractors deserve dedicated pricing, credit lines, and priority service — managed manually is a nightmare.', solution: 'Contractor-specific portals with negotiated pricing, credit management, and order history tracking.' },
  { icon: Package, title: 'SKU Complexity', problem: '50,000+ SKUs with dimensional lumber, roofing variants, and custom-cut materials require complex catalog management.', solution: 'Attribute-based catalog management with configuration rules for cut-to-size and custom orders.' },
  { icon: Building2, title: 'Branch Network Complexity', problem: 'Managing inventory across 20+ branches with varying stock levels creates constant fulfillment challenges.', solution: 'Real-time inventory visibility across all branches with intelligent stock routing and transfer recommendations.' },
  { icon: Factory, title: 'ERP Integration', problem: 'Pricing and inventory live in your ERP — your sales team works blind without real-time access.', solution: 'Native SAP and Epicor integration with real-time pricing, ATP, and order status sync.' },
]

export default function BuildingMaterials() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Building Materials Distributors', description: 'Revenue operations platform for building materials distributors.', path: '/industries/building-materials', keywords: ['building materials B2B ecommerce', 'construction supply distributor software', 'lumber distributor portal'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Building Materials' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Building Materials Distribution</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Building Materials.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">Project-based pricing, contractor portals, and multi-branch inventory management for roofing, lumber, and construction supply distributors.</p>
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
      <WhichGrowmax industry="Building Materials Distribution" />
    </div>
  )
}
