import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Breadcrumbs from '@/components/Breadcrumbs'
import WhichGrowmax from '@/components/ui/WhichGrowmax'
import { webPageSchema } from '@/lib/structuredData'

export const metadata: Metadata = {
  title: 'Best BigCommerce B2B Alternatives for Industrial Distributors (2026)',
  description: 'Looking for BigCommerce B2B alternatives? Compare the top B2B commerce platforms for industrial manufacturers and distributors needing deep ERP integration and partner management.',
  alternates: { canonical: 'https://www.growmax.io/comparisons/bigcommerce-b2b-alternatives' },
  openGraph: { title: 'Best BigCommerce B2B Alternatives (2026)', description: 'Compare top BigCommerce B2B alternatives for industrial distributors.', url: 'https://www.growmax.io/comparisons/bigcommerce-b2b-alternatives', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

const competitors = [
  { name: 'Growmax Enterprise', highlight: true, tagline: 'Multi-Party Revenue Ecosystem', description: 'Built specifically for industrial B2B — not a retail platform with B2B features bolted on. Native SAP integration, partner portals, and complex pricing from day one.', pros: ['Industrial B2B native — not retail adapted', 'Native SAP/Epicor ERP integration', 'Multi-party ecosystem (brand → partners → customers)', 'Complex multi-tier pricing built-in', '8-12 week deployment'], cons: ['100+ employee target market', 'Custom pricing model'], pricing: 'Custom pricing', rating: '4.8' },
  { name: 'BigCommerce B2B Edition', highlight: false, tagline: 'SaaS B2B eCommerce', description: 'B2B features built on BigCommerce\'s retail SaaS platform. Decent for hybrid B2B/DTC but limited for complex industrial distribution.', pros: ['Flexible B2B/DTC hybrid', 'Good developer ecosystem', 'Multi-storefront capabilities'], cons: ['Retail DNA — not built for industrial complexity', 'No native SAP/ERP integration', 'Limited complex pricing capabilities', 'No partner ecosystem management'], pricing: '$500-$1,500+/mo', rating: '3.8' },
  { name: 'Shopify Plus B2B', highlight: false, tagline: 'Wholesale on Shopify', description: 'B2B wholesale features on the Shopify Plus platform. Good for DTC brands with a wholesale channel but lacks industrial depth.', pros: ['Easy to use', 'Large app ecosystem', 'Good for DTC + wholesale combo'], cons: ['Not built for pure B2B complexity', 'No ERP integration', 'Limited for industrial distribution'], pricing: '$2,000+/mo', rating: '3.7' },
]

export default function BigCommerceB2BAlternatives() {
  const schema = webPageSchema({ title: 'Best BigCommerce B2B Alternatives (2026)', description: 'Compare top BigCommerce B2B alternatives for industrial distributors.', path: '/comparisons/bigcommerce-b2b-alternatives', keywords: ['BigCommerce B2B alternatives', 'BigCommerce enterprise alternatives', 'industrial B2B ecommerce platform'] })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="pt-24 pb-16 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-4xl">
          <Breadcrumbs items={[{ label: 'Comparisons' }, { label: 'BigCommerce B2B Alternatives' }]} />
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3 mt-6">Competitive Analysis // 2026</div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">Best BigCommerce B2B<br /><span className="text-gray-400">Alternatives (2026)</span></h1>
          <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl">BigCommerce B2B is built on retail DNA — if you need true industrial B2B capabilities, here are the best alternatives for manufacturers and distributors.</p>
          <Link href="/demo"><Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-8 rounded-none font-bold tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all">See Growmax in Action <ArrowRight className="ml-2 w-5 h-5" /></Button></Link>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid gap-8 max-w-4xl mx-auto">
            {competitors.map((c, i) => (
              <div key={i} className={`border-2 p-8 ${c.highlight ? 'border-growmax-red shadow-[8px_8px_0px_0px_rgba(204,30,30,0.3)]' : 'border-gray-200'}`}>
                {c.highlight && <div className="font-mono text-xs text-white bg-growmax-red px-3 py-1 inline-block mb-4 uppercase tracking-widest font-bold">Top Recommendation</div>}
                <div className="flex justify-between items-start mb-4">
                  <div><h2 className="text-2xl font-bold tracking-tighter uppercase">{c.name}</h2><p className="font-mono text-xs text-gray-400 uppercase tracking-widest mt-1">{c.tagline}</p></div>
                  <div className="text-right font-mono"><div className="text-2xl font-bold text-growmax-red">{c.rating}</div><div className="text-xs text-gray-400">/5.0</div></div>
                </div>
                <p className="text-gray-600 font-light leading-relaxed mb-6">{c.description}</p>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div><div className="font-mono text-xs font-bold uppercase mb-3 text-green-600">Pros</div>{c.pros.map((p, j) => <div key={j} className="flex items-start gap-2 text-sm mb-2"><Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />{p}</div>)}</div>
                  <div><div className="font-mono text-xs font-bold uppercase mb-3 text-red-500">Cons</div>{c.cons.map((p, j) => <div key={j} className="flex items-start gap-2 text-sm mb-2"><X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />{p}</div>)}</div>
                </div>
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="font-mono text-sm"><span className="text-gray-400 text-xs uppercase">Pricing: </span>{c.pricing}</div>
                  {c.highlight && <Link href="/demo"><Button className="bg-growmax-red hover:bg-growmax-black text-white rounded-none font-mono text-xs uppercase h-10 px-6">Book a Demo</Button></Link>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WhichGrowmax />
    </div>
  )
}
