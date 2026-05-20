import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Package, DollarSign, Users, Truck, Building2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Janitorial & Sanitation Distributors | Growmax',
  description: 'Revenue operations platform for jan-san distributors. Facility-based ordering, contract management, and ERP integration for janitorial supply and sanitation distribution.',
  alternates: { canonical: 'https://www.growmax.io/industries/janitorial-sanitation' },
  openGraph: { title: 'B2B eCommerce for Janitorial & Sanitation Distributors | Growmax', description: 'Revenue operations platform for jan-san distributors.', url: 'https://www.growmax.io/industries/janitorial-sanitation', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

const painPoints = [
  { icon: Building2, title: 'Multi-Location Account Management', problem: 'Hospital systems and facility managers order for 50+ locations with different products and budgets per site.', solution: 'Multi-location account management with site-specific catalogs, budgets, and approval workflows per location.' },
  { icon: Package, title: 'Auto-Replenishment Programs', problem: 'Recurring supply programs require tracking consumption rates and triggering orders at the right time.', solution: 'Consumption-based auto-replenishment with par level management and proactive restocking alerts.' },
  { icon: DollarSign, title: 'Bid & Contract Management', problem: 'Government, healthcare, and commercial contracts require precise compliance pricing and documentation.', solution: 'Contract pricing engine with compliance tracking, bid response management, and contract renewal alerts.' },
  { icon: Users, title: 'Facility Manager Portals', problem: 'Facility managers need self-service ordering, budget tracking, and usage reporting without calling account reps.', solution: 'Self-service portal with budget dashboards, order history, usage analytics, and approval workflows.' },
  { icon: Truck, title: 'Consolidated Delivery Schedules', problem: 'Multi-location customers want consolidated deliveries to minimize disruption to facility operations.', solution: 'Delivery scheduling with route consolidation, delivery window management, and proof-of-delivery capture.' },
  { icon: ShieldCheck, title: 'Product Safety & Compliance', problem: 'SDS sheets, chemical regulations, and product substitution requirements require systematic management.', solution: 'Integrated SDS management, regulatory compliance tracking, and automated product substitution recommendations.' },
]

export default function JanitorialSanitation() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Janitorial & Sanitation Distributors', description: 'Revenue operations platform for jan-san distributors.', path: '/industries/janitorial-sanitation', keywords: ['janitorial supply distributor software', 'jan-san B2B platform', 'facility supply ecommerce'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Janitorial & Sanitation' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Janitorial & Sanitation Distribution</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Jan-San Distributors.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">Multi-location account management, auto-replenishment programs, and contract pricing for janitorial and sanitation supply distributors.</p>
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
      <WhichGrowmax industry="Janitorial & Sanitation Distribution" />
    </div>
  )
}
