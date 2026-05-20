import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ShieldCheck, Package, DollarSign, Users, Truck, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Chemical Distributors | Growmax',
  description: 'Revenue operations platform for chemical distributors. Hazmat compliance, SDS management, contract pricing, and ERP integration for specialty chemical and process chemical distribution.',
  alternates: { canonical: 'https://www.growmax.io/industries/chemical-distributors' },
  openGraph: { title: 'B2B eCommerce for Chemical Distributors | Growmax', description: 'Revenue operations platform for chemical distributors.', url: 'https://www.growmax.io/industries/chemical-distributors', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

const painPoints = [
  { icon: ShieldCheck, title: 'Hazmat Compliance', problem: 'DOT regulations, SARA 313 reporting, and hazardous material restrictions require systematic compliance management.', solution: 'Integrated hazmat classification, shipping restriction enforcement, and automated regulatory reporting.' },
  { icon: Package, title: 'SDS & Safety Documentation', problem: 'Every chemical product requires current SDS sheets accessible to customers at point of sale.', solution: 'SDS management with automatic attachment to orders, customer download portal, and expiry tracking.' },
  { icon: DollarSign, title: 'Contract & Spot Pricing', problem: 'Chemical pricing fluctuates with raw material costs — contract customers need price protection while spot buyers need current rates.', solution: 'Dual pricing engine with contract price lock, spot price feed integration, and automatic price escalation clauses.' },
  { icon: Users, title: 'Industrial Buyer Portals', problem: 'Process manufacturers need consumption tracking, reorder management, and technical specification access.', solution: 'Industrial buyer portals with consumption dashboards, specification sheets, and approval workflows.' },
  { icon: Truck, title: 'Tanker & Bulk Order Management', problem: 'Bulk chemical orders require specialized logistics — tanker scheduling, delivery windows, and unloading confirmation.', solution: 'Bulk order management with tanker scheduling, delivery confirmation workflows, and volume tracking.' },
  { icon: Building2, title: 'Customer Qualification', problem: 'Restricted chemicals require customer qualification, license verification, and end-use certification before sale.', solution: 'Customer qualification workflows with license tracking, end-use certification, and restricted product access controls.' },
]

export default function ChemicalDistributors() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Chemical Distributors', description: 'Revenue operations platform for chemical distributors.', path: '/industries/chemical-distributors', keywords: ['chemical distributor software', 'specialty chemical ecommerce', 'hazmat compliance platform'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Chemical Distributors' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Chemical Distribution</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Chemical Distributors.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">Hazmat compliance, SDS management, contract and spot pricing for specialty chemical and process chemical distributors.</p>
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
      <WhichGrowmax industry="Chemical Distribution" />
    </div>
  )
}
