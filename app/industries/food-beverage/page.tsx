import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Package, Truck, DollarSign, Users, Building2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'B2B eCommerce for Food & Beverage Distributors | Growmax',
  description: 'Revenue operations platform for food & beverage distributors. Route management, recurring orders, customer-specific pricing, and ERP integration for food service distribution.',
  alternates: { canonical: 'https://www.growmax.io/industries/food-beverage' },
  openGraph: { title: 'B2B eCommerce for Food & Beverage Distributors | Growmax', description: 'Revenue operations platform for food & beverage distributors.', url: 'https://www.growmax.io/industries/food-beverage', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

const painPoints = [
  { icon: Package, title: 'Recurring Order Management', problem: 'Restaurants and retailers place the same orders weekly — manual reorders waste time and create errors.', solution: 'Standing order templates with one-click reorder, auto-replenishment schedules, and order modification up to cutoff time.' },
  { icon: Truck, title: 'Route Sales Optimization', problem: 'Route sales reps need mobile ordering, van inventory management, and real-time customer account access.', solution: 'Mobile-first sales app with offline capability, van inventory tracking, and order capture on the road.' },
  { icon: DollarSign, title: 'Promotional Pricing Complexity', problem: 'Seasonal promotions, volume rebates, and customer-specific deals create pricing chaos across spreadsheets.', solution: 'Promotion engine with time-based pricing rules, volume rebate tracking, and automatic deal application at checkout.' },
  { icon: Users, title: 'Restaurant vs. Retail Segmentation', problem: 'Different customer types need different catalogs, pack sizes, and ordering minimums.', solution: 'Segment-specific portals with tailored catalogs, pack size variants, and order minimum enforcement.' },
  { icon: Building2, title: 'Multi-Depot Management', problem: 'Regional depots with different inventory and delivery zones require complex routing and stock management.', solution: 'Multi-depot inventory management with zone-based routing and automatic depot assignment based on customer location.' },
  { icon: ShieldCheck, title: 'Compliance & Traceability', problem: 'Lot tracking, expiry date management, and recall capabilities are critical but operationally complex.', solution: 'Full lot traceability with expiry date management, automated recall alerts, and compliance reporting.' },
]

export default function FoodBeverage() {
  const schema = webPageSchema({ title: 'B2B eCommerce for Food & Beverage Distributors', description: 'Revenue operations platform for food & beverage distributors.', path: '/industries/food-beverage', keywords: ['food beverage distributor software', 'food service distribution platform', 'route sales management'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Industries' }, { label: 'Food & Beverage' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Industry // Food & Beverage Distribution</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">B2B eCommerce for<br /><span className="text-gray-400">Food & Beverage.</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">Recurring order management, route sales optimization, and promotional pricing for food service distributors serving restaurants, retail, and institutional buyers.</p>
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
      <WhichGrowmax industry="Food & Beverage Distribution" />
    </div>
  )
}
