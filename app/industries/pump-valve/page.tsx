import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Wrench, DollarSign, Users, Factory, Package, Server } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Pump & Valve Distributors',
  description: 'Revenue operations platform for pump and valve distributors. Engineered-to-order quoting, spare parts portals, OEM dealer management, and SAP integration.',
  alternates: { canonical: 'https://www.growmax.io/industries/pump-valve' },
  openGraph: { title: 'B2B eCommerce for Pump & Valve Distributors | Growmax', description: 'Revenue operations platform for pump and valve distributors.', url: 'https://www.growmax.io/industries/pump-valve', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

const painPoints = [
  { icon: Factory, title: 'Engineered-to-Order Complexity', problem: 'Pumps and valves require detailed engineering specifications before quoting — a standard shopping cart doesn\'t cut it.', solution: 'CPQ configurator with technical specification capture, engineering review workflows, and BOM-linked quote generation.' },
  { icon: Package, title: 'Spare Parts After-Sales', problem: 'Pump owners need genuine spare parts years after purchase — but finding the right part requires equipment history.', solution: 'Equipment-linked spare parts portal with serial number lookup, installation records, and service history.' },
  { icon: DollarSign, title: 'Project & Service Contract Pricing', problem: 'Multi-year service contracts, spare parts agreements, and capex project pricing require specialized management.', solution: 'Contract management with multi-year pricing, spare parts agreements, and automatic renewal workflows.' },
  { icon: Users, title: 'OEM Dealer Network', problem: 'Authorized dealers need product configuration tools, pricing access, and order tracking through the manufacturer.', solution: 'Dealer portal with configuration tools, dealer pricing tier management, and co-branded ordering interface.' },
  { icon: Wrench, title: 'Service Engineer Access', problem: 'Field service engineers need mobile access to parts catalogs, pricing, and ordering during service calls.', solution: 'Mobile service app with equipment history, parts lookup, and quote/order creation from the field.' },
  { icon: Server, title: 'SAP ERP Integration', problem: 'Complex product configurations and project pricing must flow back into SAP for manufacturing and finance.', solution: 'Native SAP JCo integration with BOM sync, project cost tracking, and real-time availability confirmation.' },
]

export default function PumpValve() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Pump & Valve Distributors', description: 'Revenue operations platform for pump and valve distributors.', path: '/industries/pump-valve', keywords: ['pump valve distributor software', 'industrial pump ecommerce', 'valve distributor platform'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Pump & Valve' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Pump & Valve Distribution</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Pump & Valve.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">Engineered-to-order quoting, spare parts portals, and OEM dealer management for pump and valve manufacturers and distributors.</p>
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
      <WhichGrowmax industry="Pump & Valve Distribution" />
    </div>
  )
}
