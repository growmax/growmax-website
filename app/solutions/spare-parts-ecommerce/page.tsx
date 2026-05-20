import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Wrench, DollarSign, Package, TrendingUp, Search, ShieldCheck, CheckSquare, BarChart3, Layers, Cog, Truck, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'Spare Parts eCommerce Platform for Manufacturers & Distributors | Growmax',
  description: 'Spare parts eCommerce platform built for manufacturers and aftermarket distributors. Equipment-linked catalogs, serial number lookup, dealer portals, and ERP integration for aftermarket revenue growth.',
  alternates: { canonical: 'https://www.growmax.io/solutions/spare-parts-ecommerce' },
  openGraph: {
    title: 'Spare Parts eCommerce Platform | Growmax',
    description: 'Spare parts eCommerce platform for manufacturers and aftermarket distributors.',
    url: 'https://www.growmax.io/solutions/spare-parts-ecommerce',
  },
}

const sparePartsTypes = [
  { icon: Cog, title: 'OEM Manufacturers', description: 'Equipment manufacturers selling genuine replacement parts through dealer networks and direct-to-customer portals.', examples: 'Pumps, compressors, turbines, CNC machines, construction equipment' },
  { icon: Truck, title: 'Aftermarket Distributors', description: 'Independent distributors stocking compatible parts from multiple brands for equipment maintenance and repair.', examples: 'Automotive parts, hydraulic components, bearings, seals, filters' },
  { icon: Wrench, title: 'MRO Suppliers', description: 'Maintenance, repair, and operations suppliers providing consumable and replacement parts for industrial facilities.', examples: 'Electrical components, fasteners, lubricants, safety equipment' },
  { icon: Users, title: 'Multi-Brand Dealers', description: 'Authorized dealers representing multiple equipment brands, managing complex part catalogs across product lines.', examples: 'Agricultural equipment, material handling, HVAC systems' },
]

const challenges = [
  { icon: Search, title: 'Part Identification Complexity', problem: 'Customers don\'t know part numbers. They describe parts by appearance, equipment model, or old superseded numbers from 15-year-old manuals.', solution: 'Equipment-linked catalogs with serial number lookup, exploded-view navigation, AI visual identification, and supersession chain mapping. Customers find the right part in seconds.' },
  { icon: DollarSign, title: 'Pricing Strategy Chaos', problem: 'OEM vs aftermarket pricing, customer-specific contracts, volume tiers, and emergency markup rules scattered across spreadsheets and ERP systems.', solution: 'Centralized pricing engine with contract management, customer-tier pricing, emergency markup rules, and competitive price monitoring. Every channel gets the right price automatically.' },
  { icon: Package, title: 'Inventory Fragmentation', problem: '100K+ SKUs across multiple warehouses with intermittent demand patterns — 80% of parts account for just 5% of revenue. Stockouts on critical parts cost thousands.', solution: 'Multi-warehouse inventory orchestration with demand forecasting, safety stock optimization, and intelligent allocation. Real-time ATP checks prevent overselling.' },
  { icon: TrendingUp, title: 'Missed Revenue Opportunities', problem: '30-50% of potential aftermarket revenue leaks because customers can\'t find parts, don\'t know they need maintenance, or buy from aftermarket competitors.', solution: 'AI-powered recommendations, automated reorder reminders based on maintenance schedules, and cross-sell suggestions that capture revenue at every touchpoint.' },
  { icon: Layers, title: 'Dealer Network Complexity', problem: 'Managing pricing, catalogs, and inventory visibility across 200+ dealer locations requires a system, not a spreadsheet.', solution: 'Multi-tenant dealer portal with territory-specific pricing, catalog access controls, and real-time inventory visibility across the distribution network.' },
  { icon: ShieldCheck, title: 'Warranty & Return Management', problem: 'Warranty claims, defective part returns, and core charges create operational complexity that generic eCommerce platforms can\'t handle.', solution: 'Built-in warranty management with RMA workflows, defective part tracking, core charge management, and dealer credit processing.' },
]

const platformFeatures = [
  { icon: Search, title: 'Equipment-Linked Catalog', desc: 'Serial number and model-based catalog navigation. Customers arrive at the right part every time.' },
  { icon: Cog, title: 'Exploded View Navigation', desc: 'Interactive parts diagrams with clickable components linked directly to SKUs and pricing.' },
  { icon: Package, title: 'Real-Time Inventory', desc: 'Live ATP across all warehouses with intelligent allocation and cross-warehouse fulfillment routing.' },
  { icon: DollarSign, title: 'Multi-Tier Pricing', desc: 'OEM vs aftermarket pricing, dealer tiers, customer contracts, and emergency markup rules all managed centrally.' },
  { icon: BarChart3, title: 'Demand Forecasting', desc: 'Machine learning models predict part demand based on equipment age, usage patterns, and historical sales.' },
  { icon: CheckSquare, title: 'Warranty & RMA', desc: 'End-to-end warranty management with defective part returns, core charge tracking, and dealer credit processing.' },
]

const faqSchema = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What is spare parts eCommerce?', acceptedAnswer: { '@type': 'Answer', text: 'Spare parts eCommerce is a specialized B2B commerce platform that enables manufacturers and distributors to sell replacement parts online through equipment-linked catalogs, dealer portals, and service engineer interfaces. Unlike general eCommerce, spare parts platforms handle serial number lookup, supersession chains, exploded-view navigation, and complex multi-tier pricing.' } },
    { '@type': 'Question', name: 'How does Growmax handle part number supersession?', acceptedAnswer: { '@type': 'Answer', text: 'Growmax maintains a full supersession chain database that maps old part numbers to current replacements. When a customer searches by an obsolete number, the system automatically identifies the correct current part number and presents it with full availability and pricing information.' } },
    { '@type': 'Question', name: 'Can Growmax integrate with SAP for spare parts management?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Growmax integrates natively with SAP ECC and S/4HANA via JCo protocol, providing real-time ATP checks, pricing from SAP conditions, and bidirectional order management. No middleware required.' } },
    { '@type': 'Question', name: 'How long does it take to launch a spare parts portal?', acceptedAnswer: { '@type': 'Answer', text: 'A standard spare parts portal with equipment-linked catalog, dealer access, and SAP integration deploys in 8-12 weeks. Complex implementations with custom catalog structures or multiple ERP integrations may take 12-16 weeks.' } },
  ],
})

export default function SparePartsHub() {
  const schema = webPageSchema({
    title: 'Spare Parts eCommerce Platform for Manufacturers & Distributors',
    description: 'Spare parts eCommerce platform for manufacturers and aftermarket distributors.',
    path: '/solutions/spare-parts-ecommerce',
    keywords: ['spare parts ecommerce', 'aftermarket parts portal', 'OEM spare parts platform', 'dealer parts portal software'],
  })

  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />

      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Solutions' }, { label: 'Spare Parts eCommerce' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Solution // Aftermarket Commerce</div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-page-title">
            Spare Parts<br /><span className="text-gray-400">eCommerce Platform.</span>
          </h1>
          <div className="w-16 h-2 bg-growmax-red mb-8" />
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl" data-testid="text-page-description">
            Equipment-linked catalogs, serial number lookup, dealer portals, and ERP integration for OEM manufacturers and aftermarket distributors ready to capture their full aftermarket revenue potential.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/demo">
              <Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-8 rounded-none font-bold tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all" data-testid="button-book-demo">
                Book a Demo <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/industries/automotive-aftermarket">
              <Button variant="outline" className="h-14 px-8 rounded-none border-2 border-growmax-black font-bold hover:bg-growmax-black hover:text-white transition-colors" data-testid="button-view-industries">
                View Industries
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[
              { value: '30-50%', label: 'Aftermarket Revenue Leakage Recovered' },
              { value: '8-12 Wks', label: 'Time to Launch Portal' },
              { value: '100K+', label: 'SKUs Managed Per Portal' },
              { value: '200+', label: 'Dealer Locations Supported' },
            ].map((stat, i) => (
              <div key={i} className="border border-white/20 p-6 md:p-8 text-center">
                <div className="text-2xl md:text-3xl font-bold font-mono text-growmax-red mb-2">{stat.value}</div>
                <div className="text-xs text-gray-400 uppercase tracking-widest font-mono">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Who We Serve</div>
            <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">Built for Your Aftermarket Model</h2>
            <div className="w-16 h-2 bg-growmax-red" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sparePartsTypes.map((type, i) => (
              <div key={i} className="border-2 border-growmax-black p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                <type.icon className="w-8 h-8 text-growmax-red mb-4" />
                <h3 className="text-base font-bold uppercase tracking-tight mb-2">{type.title}</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed mb-3">{type.description}</p>
                <p className="font-mono text-xs text-gray-400">{type.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 border-t-4 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Challenges We Solve</div>
            <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">The Hard Problems in Aftermarket Commerce</h2>
            <div className="w-16 h-2 bg-growmax-red" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {challenges.map((item, i) => (
              <div key={i} className="bg-white border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                <item.icon className="w-10 h-10 text-growmax-red mb-4" />
                <h3 className="text-lg font-bold uppercase mb-3">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-3 font-mono italic">&ldquo;{item.problem}&rdquo;</p>
                <p className="text-sm text-gray-700 leading-relaxed">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t-4 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Platform Capabilities</div>
            <h2 className="text-4xl font-bold tracking-tighter uppercase mb-4">What&apos;s Included</h2>
            <div className="w-16 h-2 bg-growmax-red" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-growmax-red/10 flex items-center justify-center shrink-0">
                  <feature.icon className="w-5 h-5 text-growmax-red" />
                </div>
                <div>
                  <h3 className="font-bold uppercase text-sm tracking-tight mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-growmax-black text-white text-center bg-dots-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter uppercase leading-[1.1]" data-testid="text-cta-heading">
            Capture Your Full<br />Aftermarket Revenue.
          </h2>
          <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto mb-12">
            Deploy a spare parts portal that makes it easier to buy from you than from the competition. See Growmax in action.
          </p>
          <Link href="/demo">
            <Button className="bg-growmax-red hover:bg-white hover:text-growmax-black text-white h-16 px-12 text-lg rounded-none transition-all duration-300 font-bold tracking-widest uppercase border-2 border-transparent hover:border-growmax-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-2 hover:translate-y-2" data-testid="button-cta-demo">
              Book a Demo <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
