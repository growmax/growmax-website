import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Package, DollarSign, Users, Factory, Search, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Industrial Fastener Distributors | Growmax',
  description: 'Revenue operations platform for industrial fastener distributors. High-SKU catalogs, vendor-managed inventory, consignment programs, and ERP integration for fastener distribution.',
  alternates: { canonical: 'https://www.growmax.io/industries/industrial-fasteners' },
  openGraph: { title: 'B2B eCommerce for Industrial Fastener Distributors | Growmax', description: 'Revenue operations platform for industrial fastener distributors.', url: 'https://www.growmax.io/industries/industrial-fasteners' },
}

const painPoints = [
  { icon: Search, title: 'High-SKU Catalog Navigation', problem: '500,000+ fastener SKUs with dimensional attributes, material grades, and coating options — customers can\'t find what they need.', solution: 'Attribute-based faceted search with dimensional filtering, material grade selection, and DIN/ISO standard lookup.' },
  { icon: Package, title: 'Vendor-Managed Inventory (VMI)', problem: 'VMI programs require real-time inventory visibility at customer locations and automated replenishment triggers.', solution: 'VMI portal with customer bin-level inventory tracking, consumption reporting, and automatic PO generation.' },
  { icon: DollarSign, title: 'Consignment Programs', problem: 'Consignment agreements require complex billing based on consumption rather than shipment.', solution: 'Consignment management with consumption-based billing, periodic count reconciliation, and audit trail.' },
  { icon: Factory, title: 'Kit & Assembly Pricing', problem: 'Kitted fastener assemblies need dynamic pricing based on component mix and quantity breaks.', solution: 'Assembly configurator with BOM-linked pricing, volume break calculation, and custom kit quoting.' },
  { icon: Users, title: 'Plant Maintenance Accounts', problem: 'Manufacturing plants need per-department cost allocation and approval workflows for maintenance purchases.', solution: 'Cost center ordering with department budget management, approval workflows, and monthly spend reporting.' },
  { icon: Truck, title: 'Critical Stock Management', problem: 'Line-down situations require immediate fastener availability — stockouts cost customers thousands per hour.', solution: 'Real-time ATP with critical stock alerts, emergency order prioritization, and same-day fulfillment tracking.' },
]

export default function IndustrialFasteners() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Industrial Fastener Distributors', description: 'Revenue operations platform for industrial fastener distributors.', path: '/industries/industrial-fasteners', keywords: ['fastener distributor software', 'industrial fastener ecommerce', 'VMI fastener platform'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Industrial Fasteners' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Industrial Fastener Distribution</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Industrial Fasteners.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">High-SKU fastener catalogs, vendor-managed inventory programs, and consignment management for industrial fastener distributors.</p>
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
      <WhichGrowmax industry="Industrial Fastener Distribution" />
    </div>
  )
}
