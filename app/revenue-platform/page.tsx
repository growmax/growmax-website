import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Server, Fingerprint, Activity, Layers, CheckSquare, Users, GitMerge, ShoppingCart, Building2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { softwareApplicationSchema } from '@/lib/structuredData'
import { SiemensLogo, SchwingSttetterLogo, OBOBettermannLogo } from '@/components/ui/ClientLogos'

export const metadata: Metadata = {
  title: 'Growmax Enterprise | Intelligent Revenue Operations Platform | Growmax',
  description: 'Connect your sales reps, partners, and customers on one intelligent platform. Multi-party revenue ecosystem with native SAP integration, multi-version quotes, partner commerce, and dealer portals.',
  alternates: { canonical: 'https://www.growmax.io/revenue-platform' },
  openGraph: { title: 'Growmax Enterprise | Intelligent Revenue Operations Platform', description: 'Connect your sales reps, partners, and customers on one intelligent platform.', url: 'https://www.growmax.io/revenue-platform', images: [{ url: '/opengraph.jpg', width: 1200, height: 630, alt: 'Growmax — B2B Revenue Operations Platform' }]},
}

export default function RevenuePlatform() {
  const schema = softwareApplicationSchema({ name: 'Growmax Enterprise', description: 'Intelligent Revenue Operations Platform connecting sales reps, partners, and customers with native SAP integration, multi-version quotes, partner commerce, and full visibility across the revenue chain.', path: '/revenue-platform', category: 'BusinessApplication' })
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className="pt-24 pb-24 border-b border-gray-200 bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3">Growmax Enterprise</div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-enterprise-headline">
                Intelligent Revenue<br/>Operations<br/><span className="text-gray-400">Platform.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-enterprise-description">
                Not just eCommerce. Growmax Enterprise connects your entire revenue ecosystem — sales reps creating multi-version quotes, partners managing orders and fulfillment, and customers self-serving — all with 100% visibility back to you.
              </p>
              <Link href="/demo">
                <Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-8 text-lg rounded-none transition-colors duration-300 font-bold tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5" data-testid="button-enterprise-demo">
                  Book a Demo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="hidden lg:block bg-growmax-gray border-2 border-growmax-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative" data-testid="diagram-enterprise-flow">
              <div className="absolute top-4 right-4 flex gap-2"><div className="w-3 h-3 rounded-full bg-growmax-red animate-pulse"></div></div>
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Revenue Ecosystem Flow</div>
              <div className="border-2 border-growmax-red bg-growmax-red/5 p-4 text-center font-bold text-sm mb-3 uppercase tracking-tight flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4 text-growmax-red" />Your Brand — Full Visibility
              </div>
              <div className="flex justify-center my-2"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {[{ icon: <Users className="w-5 h-5 text-growmax-red mx-auto mb-1" />, label: 'Sales Reps', sub: 'Multi-version quotes' },{ icon: <GitMerge className="w-5 h-5 text-growmax-red mx-auto mb-1" />, label: 'Partners', sub: 'Order & fulfill' },{ icon: <ShoppingCart className="w-5 h-5 text-growmax-red mx-auto mb-1" />, label: 'Customers', sub: 'Self-service portal' }].map((item,i) => (
                  <div key={i} className="border border-growmax-black bg-white p-3 text-center">
                    {item.icon}
                    <div className="font-mono text-[10px] uppercase font-bold">{item.label}</div>
                    <div className="font-mono text-[9px] text-gray-500 mt-1">{item.sub}</div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center my-2"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
              <div className="border border-growmax-black bg-growmax-black text-white p-4 flex justify-between items-center mb-3 font-mono">
                {['Quotes','Orders','Pricing','Catalog'].map(l => <div key={l} className="text-xs uppercase w-1/4 text-center">{l}</div>)}
              </div>
              <div className="flex justify-center my-2"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
              <div className="grid grid-cols-3 gap-3 font-mono text-growmax-black">
                <div className="border-2 border-growmax-black bg-white p-3 text-center font-bold text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">SAP</div>
                <div className="border border-gray-400 bg-white p-3 text-center text-xs uppercase tracking-widest text-gray-500">Epicor</div>
                <div className="border border-gray-400 bg-white p-3 text-center text-xs uppercase tracking-widest text-gray-500">Your ERP</div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-300 flex items-center justify-center gap-2 font-mono text-[10px] text-gray-500 uppercase">
                <Eye className="w-3 h-3 text-growmax-red" />100% visibility from quote to fulfillment
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {[{ label: 'Industries', value: 'Industrial, Electrical, Construction, Building Materials' },{ label: 'Company Size', value: '100+ Employees', big: true },{ label: 'Integrations', value: 'SAP ECC/S4HANA, Epicor, Industry-specific ERPs' },{ label: 'Deployment', value: '8-12 Weeks', big: true }].map((item,i) => (
              <div key={i} className="border border-white/20 p-6 text-center">
                <div className="font-mono text-growmax-red text-xs uppercase tracking-widest font-bold mb-3">{item.label}</div>
                <div className={item.big ? 'text-2xl font-bold font-mono' : 'font-mono text-sm'}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white bg-dots-dark border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-2xl sm:text-4xl font-bold mb-6 tracking-tighter uppercase">Security &amp; Compliance</h2>
              <p className="font-mono text-sm text-growmax-red uppercase tracking-widest border-l-2 border-growmax-red pl-4">&quot;Your data. Your Control. Always.&quot;</p>
            </div>
            <div className="md:w-2/3 grid sm:grid-cols-2 gap-x-12 gap-y-10 border-t md:border-t-0 md:border-l border-white/20 pt-8 md:pt-0 md:pl-8">
              {[{ num: '01', title: 'Penetration Testing', desc: 'Aligned with OWASP Top 10 standards. Zero Critical Vulnerabilities post-remediation.' },{ num: '02', title: 'Encryption', desc: 'Data Encryption at Rest & In Transit ensuring protection of sensitive information.' },{ num: '03', title: 'Access Control', desc: 'Role-Based Access Control (RBAC) to limit exposure and maintain privacy.' },{ num: '04', title: 'GDPR Ready', desc: 'Compliant infrastructure, ready for European and global enterprise deployments.' }].map((item,i) => (
                <div key={i}><h4 className="font-bold font-mono text-growmax-red mb-2 uppercase text-sm">{item.num}. {item.title}</h4><p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32 bg-growmax-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-6 uppercase">The Enterprise Advantage</h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">Built for the realities of multi-party revenue operations in manufacturing and distribution.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border-2 border-growmax-black p-6 md:p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <Fingerprint className="w-12 h-12 text-growmax-red mb-6" />
              <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase">Multi-Tier Pricing Engine</h3>
              <div className="space-y-4 text-gray-600 font-light">
                <p className="line-through decoration-gray-400 font-mono text-sm text-gray-400">Not simple: Product → Customer.</p>
                <p className="font-mono text-sm bg-growmax-black text-white p-3 border-l-4 border-growmax-red">Product → Pricing Tier → Volume Bracket → Time Period → Customer</p>
                <p>Rule based logic handling Special Pricing Agreements (SPAs) and margin controls natively.</p>
              </div>
            </div>
            <div className="bg-white border-2 border-growmax-black p-6 md:p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <Activity className="w-12 h-12 text-growmax-red mb-6" />
              <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase">Approval Engine</h3>
              <div className="space-y-4 text-gray-600 font-light">
                <p>Rule based approval flows determined by dynamic discount thresholds or specific margins.</p>
                <p>Multi-level structures, auto-approval conditions, and override management built directly into the quoting workflow.</p>
              </div>
            </div>
            <div className="bg-white border-2 border-growmax-black p-6 md:p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <Layers className="w-12 h-12 text-growmax-red mb-6" />
              <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase">Multi-warehouse Orchestration</h3>
              <div className="space-y-4 text-gray-600 font-light">
                <p>Role-based multi-branch, multi-warehouse management mapping complex logistical realities.</p>
                <p>Intelligent inventory allocation layered with geographic zone management across 50+ locations.</p>
              </div>
            </div>
            <div className="bg-white border-2 border-growmax-black p-6 md:p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-grid-blueprint relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-growmax-red text-white font-mono text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Critical</div>
              <Server className="w-12 h-12 text-growmax-red mb-6 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase relative z-10 bg-white inline-block pr-2">ERP Grade Integrations</h3>
              <div className="space-y-4 text-gray-800 font-medium relative z-10 bg-white/90 p-4 border border-growmax-black backdrop-blur-sm">
                <p className="flex items-start gap-2"><CheckSquare className="w-4 h-4 text-growmax-red shrink-0 mt-0.5" /> Native two-way SAP ECC/S4HANA integration utilizing JCo protocol. Bidirectional RFC calls.</p>
                <p className="flex items-start gap-2"><CheckSquare className="w-4 h-4 text-growmax-red shrink-0 mt-0.5" /> Open to Epicor, industry-specific US market ERPs, and any custom enterprise ERP integration.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-growmax-red text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8" data-testid="banner-compare-alternatives">
            <div>
              <div className="font-mono text-xs uppercase tracking-widest font-bold mb-2 text-white/80">Compare Alternatives</div>
              <h3 className="text-2xl font-bold tracking-tight">See how Growmax Enterprise stacks up against Corevist &amp; SAP Commerce Cloud</h3>
            </div>
            <Link href="/revenue-platform/compare">
              <Button className="bg-white text-growmax-black hover:bg-growmax-black hover:text-white h-14 px-8 text-lg rounded-none transition-all duration-300 font-bold tracking-tight whitespace-nowrap" data-testid="button-compare-alternatives">
                View Full Comparison <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Case Study</div>
            <SiemensLogo size="lg" className="mb-4" />
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]">Partner Commerce Platform</h2>
          </div>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">Siemens&apos; partner ecosystem prioritized the top 20% of customers driving 80% of revenue, leaving smaller contractors underserved.</p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8"><p className="text-sm font-mono text-gray-600 leading-relaxed">Growmax Enterprise connected internal sales reps, channel partners, and the underserved customer base on one platform — creating scalable digital revenue operations across India, Indonesia, Vietnam &amp; Thailand.</p></div>
              <div className="flex gap-8 border-t-2 border-growmax-black pt-6">
                <div><div className="text-4xl font-bold font-mono text-growmax-black">300+</div><div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Partners</div></div>
                <div><div className="text-4xl font-bold font-mono text-growmax-black">100K+</div><div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Customers</div></div>
              </div>
            </div>
            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Other Verified Deployments</div>
              <div className="space-y-12">
                {[
                  { logo: <SchwingSttetterLogo size="md" className="mb-1" />, label: 'Spares Portal', metrics: [{ val: '↑ 74%', label: 'Quote Response Time' },{ val: '↑ 27%', label: 'Direct Orders' }] },
                  { logo: <OBOBettermannLogo size="md" className="mb-1" />, label: 'Partner Portal', metrics: [{ val: '↑ 25%', label: 'Order Processing Speed' },{ val: '~ 30%', label: 'Reduction in Support' }] },
                ].map((item,i) => (
                  <div key={i} className={`flex flex-col md:flex-row items-start md:items-center gap-6 ${i === 0 ? 'border-b border-gray-300 pb-8' : ''}`}>
                    <div className="w-full md:w-1/3">{item.logo}<div className="text-xs text-gray-500 font-mono uppercase tracking-widest">{item.label}</div></div>
                    <div className="w-full md:w-2/3 flex justify-between gap-4">
                      {item.metrics.map((m,j) => (
                        <div key={j} className="bg-white border border-gray-200 p-4 w-1/2">
                          <div className={`font-bold font-mono text-2xl mb-1 ${i === 0 ? 'text-growmax-red' : 'text-growmax-black'}`}>{m.val}</div>
                          <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">{m.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-32 bg-growmax-black text-white text-center bg-dots-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tighter uppercase leading-[1.1]">Connect your revenue ecosystem.<br/>Without the legacy timelines.</h2>
          <p className="font-mono text-sm text-gray-400 uppercase tracking-widest mb-12 max-w-2xl mx-auto">Deploy your first Growmax module in 8-12 weeks. See ROI before you scale.</p>
          <Link href="/demo"><Button className="bg-growmax-red hover:bg-white hover:text-growmax-black text-white h-16 px-12 text-lg rounded-none font-bold tracking-tight transition-colors duration-300">Book a Demo <ArrowRight className="ml-3 w-5 h-5" /></Button></Link>
        </div>
      </section>
    </div>
  )
}
