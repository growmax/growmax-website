import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Package, DollarSign, Users, Building2, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Safety & PPE Distributors | Growmax',
  description: 'Revenue operations platform for safety & PPE distributors. Compliance-driven catalogs, OSHA-required documentation, contractor safety portals, and ERP integration.',
  alternates: { canonical: 'https://www.growmax.io/industries/safety-ppe' },
  openGraph: { title: 'B2B eCommerce for Safety & PPE Distributors | Growmax', description: 'Revenue operations platform for safety & PPE distributors.', url: 'https://www.growmax.io/industries/safety-ppe', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

const painPoints = [
  { icon: ShieldCheck, title: 'Compliance Documentation', problem: 'OSHA compliance requires tracking certifications, SDS sheets, and product approvals for every item sold.', solution: 'Compliance management with automatic SDS attachment, certification tracking, and OSHA documentation generation.' },
  { icon: Package, title: 'Product Certification Tracking', problem: 'ANSI, NIOSH, and EN standards must be verified and tracked for every PPE item in the catalog.', solution: 'Certification database with automatic compliance verification, expiry alerts, and standard-based catalog filtering.' },
  { icon: DollarSign, title: 'Safety Program Contracts', problem: 'Safety program contracts with annual spend commitments, rebates, and product standardization agreements.', solution: 'Contract management with spend tracking, rebate accrual calculation, and compliance reporting.' },
  { icon: Users, title: 'Job Site & Crew Management', problem: 'Construction sites need PPE by crew, task type, and safety standard — not a general catalog.', solution: 'Job site portals with crew-based ordering, task-specific product recommendations, and inventory tracking per site.' },
  { icon: Building2, title: 'Industrial Safety Accounts', problem: 'Large industrial accounts have safety officers approving purchases before orders are placed.', solution: 'Multi-level approval workflows with safety officer review, budget tracking, and audit trail for all purchases.' },
  { icon: Truck, title: 'Emergency & Critical Stocking', problem: 'Critical PPE shortages require immediate fulfillment — your customers can\'t wait for standard delivery.', solution: 'Emergency stocking programs with priority fulfillment, real-time availability across all warehouses, and same-day shipping.' },
]

export default function SafetyPpe() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Safety & PPE Distributors', description: 'Revenue operations platform for safety & PPE distributors.', path: '/industries/safety-ppe', keywords: ['safety PPE distributor software', 'industrial safety ecommerce', 'PPE supply platform'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Safety & PPE' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Safety & PPE Distribution</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Safety & PPE.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">Compliance-driven catalogs, OSHA documentation, safety program contracts, and job site management for industrial safety and PPE distributors.</p>
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
      <WhichGrowmax industry="Safety & PPE Distribution" />
    </div>
  )
}
