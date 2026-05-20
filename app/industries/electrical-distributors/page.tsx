import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, DollarSign, Truck, Users, Factory, Building2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Electrical Distributors | Growmax',
  description: 'Revenue operations platform for electrical distributors. Multi-tier pricing, multi-warehouse inventory, contractor portals, and SAP integration for electrical wholesale.',
  alternates: { canonical: 'https://www.growmax.io/industries/electrical-distributors' },
  openGraph: { title: 'B2B eCommerce for Electrical Distributors | Growmax', description: 'Revenue operations platform for electrical distributors.', url: 'https://www.growmax.io/industries/electrical-distributors' },
}

const painPoints = [
  { icon: DollarSign, title: 'Complex Multi-Tier Pricing', problem: 'Contractor pricing vs. wholesaler pricing vs. project-bid pricing — spreadsheets can\'t keep up.', solution: 'Multi-tier pricing engine handles customer-specific pricing, volume brackets, SPAs, and time-based promotions natively.' },
  { icon: Truck, title: 'Multi-Warehouse Inventory', problem: 'Stock across multiple branches with no real-time visibility leads to lost sales and costly transfers.', solution: 'Real-time inventory orchestration across 50+ locations with intelligent allocation and geographic zone management.' },
  { icon: Users, title: 'Contractor vs. Wholesaler Portals', problem: 'Different customer segments need different catalogs, pricing, and ordering experiences.', solution: 'Role-based portals with segment-specific catalogs, pricing tiers, and ordering workflows.' },
  { icon: Factory, title: 'Quote-Heavy Sales Process', problem: 'Switchgear and panel board quotes take days to assemble — by then the contractor has moved on.', solution: 'CPQ engine with pre-configured product rules for electrical assemblies. Accurate quotes in minutes, not days.' },
  { icon: Building2, title: 'ERP Disconnect', problem: 'Your SAP ERP holds the truth on pricing and inventory, but your sales team can\'t access it in the field.', solution: 'Native SAP JCo integration with bidirectional RFC calls. No middleware. Real-time pricing and ATP checks.' },
  { icon: ShieldCheck, title: 'Field Sales Blind Spots', problem: 'Reps visiting job sites have no access to real-time inventory or customer-specific pricing.', solution: 'Offline-capable mobile ordering app. Reps capture orders on-site, even without connectivity.' },
]

export default function ElectricalDistributors() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Electrical Distributors', description: 'Revenue operations platform for electrical distributors.', path: '/industries/electrical-distributors', keywords: ['electrical distributors B2B ecommerce', 'electrical wholesale software', 'contractor portal electrical'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Electrical Distributors' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Electrical Distribution</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Electrical Distributors.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">Multi-tier contractor pricing, multi-warehouse inventory, and SAP-integrated order management — built for the complexity of electrical wholesale distribution.</p>
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
      <WhichGrowmax industry="Electrical Distribution" />
    </div>
  )
}
