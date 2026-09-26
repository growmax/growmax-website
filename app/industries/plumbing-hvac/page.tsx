import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Wrench, DollarSign, Users, Truck, Package, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Plumbing & HVAC Distributors',
  description: 'Revenue operations platform for plumbing and HVAC distributors. Contractor pricing, emergency orders, will-call management, and ERP integration for mechanical wholesale.',
  alternates: { canonical: 'https://www.growmax.io/industries/plumbing-hvac' },
  openGraph: { title: 'B2B eCommerce for Plumbing & HVAC Distributors | Growmax', description: 'Revenue operations platform for plumbing and HVAC distributors.', url: 'https://www.growmax.io/industries/plumbing-hvac', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

const painPoints = [
  { icon: Wrench, title: 'Emergency Order Fulfillment', problem: 'Plumbers and HVAC techs need parts immediately — emergency orders require instant availability confirmation.', solution: 'Real-time ATP with emergency order prioritization, will-call pickup confirmation, and same-day delivery routing.' },
  { icon: DollarSign, title: 'Contractor Pricing Tiers', problem: 'Residential contractors, commercial contractors, and service companies each negotiate different pricing.', solution: 'Account-based pricing with trade tier management, volume rebates, and margin-protected contract pricing.' },
  { icon: Users, title: 'Trade Account Management', problem: 'Keeping track of credit limits, trade references, and licensed contractor status requires constant manual oversight.', solution: 'Automated trade account verification, credit limit management, and contractor license tracking.' },
  { icon: Truck, title: 'Will-Call & Counter Sales', problem: 'Counter sales staff need fast lookup and checkout for contractors picking up at the branch.', solution: 'Point-of-sale integration with fast SKU lookup, barcode scanning, and instant order processing for walk-ins.' },
  { icon: Package, title: 'Seasonal Demand Spikes', problem: 'HVAC demand spikes in summer and winter create inventory and fulfillment challenges across branches.', solution: 'Seasonal demand forecasting with automatic safety stock adjustments and inter-branch transfer recommendations.' },
  { icon: ShieldCheck, title: 'Warranty & Compliance', problem: 'HVAC equipment warranty registration, SEER compliance, and refrigerant handling regulations require documentation.', solution: 'Integrated warranty registration, compliance documentation, and regulatory tracking for HVAC equipment sales.' },
]

export default function PlumbingHvac() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Plumbing & HVAC Distributors', description: 'Revenue operations platform for plumbing and HVAC distributors.', path: '/industries/plumbing-hvac', keywords: ['plumbing HVAC distributor software', 'mechanical wholesale platform', 'HVAC B2B ecommerce'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Plumbing & HVAC' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Plumbing & HVAC Distribution</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Plumbing & HVAC.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">Contractor pricing, emergency order management, and will-call fulfillment for plumbing and HVAC wholesale distributors across the US.</p>
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
      <WhichGrowmax industry="Plumbing & HVAC Distribution" />
    </div>
  )
}
