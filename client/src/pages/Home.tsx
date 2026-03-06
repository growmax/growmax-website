import { Link } from "wouter";
import { ArrowRight, Server, Box, GitMerge, Activity, CheckSquare, Maximize, AlertCircle, Fingerprint, Layers, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { organizationSchema } from "@/lib/structuredData";
import { SiemensLogo, SchwingSttetterLogo, OBOBettermannLogo } from "@/components/ui/ClientLogos";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Growmax | Intelligent B2B Revenue Operations Platform"
        description="The connected platform for B2B revenue operations. Customer self-ordering portals, sales quote & pricing, partner portals, and ERP integration for industrial distributors and manufacturers."
        path="/"
        structuredData={organizationSchema()}
      />
      
      {/* SECTION 1: ARCHITECTURAL HERO */}
      <section className="relative min-h-[90vh] flex flex-col justify-center border-b-2 border-growmax-black overflow-hidden bg-growmax-white bg-grid-blueprint">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-growmax-white pointer-events-none opacity-80"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-end gap-12 pt-20 pb-20">
          
          <div className="w-full md:w-3/4">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-growmax-black text-white text-xs font-mono font-medium mb-10 uppercase tracking-widest">
              <span className="w-2 h-2 bg-growmax-red"></span>
              Platform Version 2026.1
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-bold tracking-tighter text-growmax-black leading-[0.9] mb-8 uppercase">
              Intelligent <br/>
              Revenue <br/>
              Operations<span className="text-growmax-red">.</span>
            </h1>
            
            <div className="grid md:grid-cols-2 gap-8 border-t-2 border-growmax-black pt-8">
              <p className="text-xl text-growmax-black font-medium leading-relaxed">
                Your Sales. Your Dealers. Your ERP. <br/> Finally Connected.
              </p>
              <div className="flex flex-col items-start gap-4">
                <p className="text-sm font-mono text-gray-500 uppercase leading-relaxed">
                  We deliver the connected platform that handles customer self ordering portal to sales quote & pricing to partner portal & fulfillment. We replace disconnected spreadsheets, manual quote workflows, and siloed ERPs.
                </p>
                <Link href="/demo">
                  <Button className="bg-growmax-black hover:bg-growmax-red text-white rounded-none h-12 px-8 font-mono text-xs uppercase tracking-widest border border-growmax-black transition-colors duration-0">
                    Deploy Architecture <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/4 flex flex-col justify-end gap-4 font-mono text-xs uppercase tracking-widest text-gray-400">
            <div className="border border-gray-300 p-4 bg-white/50 backdrop-blur-sm">
              <div className="text-growmax-black font-bold mb-2 border-b border-gray-200 pb-2">Target Verticals</div>
              <ul className="space-y-2">
                <li>Industrial</li>
                <li>Electrical</li>
                <li>Construction Eq.</li>
                <li>Building Materials</li>
              </ul>
            </div>
          </div>
          
        </div>
      </section>

      {/* TRUSTED BY / DEPLOYMENT PARTNERS */}
      <section className="py-16 bg-growmax-white border-b-2 border-growmax-black" data-testid="section-trusted-by">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-6 mb-12">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Trusted By</div>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-12">
            {[
              { logo: <SiemensLogo size="lg" />, logoLight: <SiemensLogo size="lg" variant="light" />, label: "Partner Commerce" },
              { logo: <SchwingSttetterLogo size="lg" />, logoLight: <SchwingSttetterLogo size="lg" variant="light" />, label: "Spares Portal" },
              { logo: <OBOBettermannLogo size="lg" />, logoLight: <OBOBettermannLogo size="lg" variant="light" />, label: "Dealer Portal" },
            ].map((partner, i) => (
              <div
                key={i}
                className="border-2 border-growmax-black p-6 md:p-8 flex flex-col items-center justify-center text-center hover:bg-growmax-black group transition-colors"
                data-testid={`partner-logo-${i}`}
              >
                <div className="group-hover:hidden">
                  {partner.logo}
                </div>
                <div className="hidden group-hover:block">
                  {partner.logoLight}
                </div>
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-gray-500 group-hover:text-gray-400 mt-3">
                  {partner.label}
                </span>
              </div>
            ))}
          </div>

          <div className="overflow-hidden relative">
            <div className="flex animate-marquee whitespace-nowrap gap-8 font-mono text-sm uppercase tracking-widest text-gray-400">
              {[
                "Electrical Distribution",
                "Industrial Manufacturing",
                "Building Materials",
                "MRO Supplies",
                "Construction Equipment",
                "Spare Parts",
                "Electrical Distribution",
                "Industrial Manufacturing",
                "Building Materials",
                "MRO Supplies",
                "Construction Equipment",
                "Spare Parts",
              ].map((vertical, i) => (
                <span key={i} className="flex items-center gap-8">
                  <span className="text-growmax-red">■</span>
                  <span>{vertical}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: THE PROBLEM WITH B2C PLATFORMS */}
      <section className="py-24 bg-growmax-black text-white border-b-2 border-growmax-red bg-dots-dark">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
                Why generic platforms breakdown.
              </h2>
              <p className="font-mono text-sm text-gray-400 uppercase leading-relaxed border-l-2 border-growmax-red pl-4">
                "We tried X platform. Spent 8 months customizing. Still couldn't handle customer-specific pricing."
                <br/><br/>
                <span className="text-growmax-red">— Common industry post-mortem</span>
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="border-2 border-white/20">
                <div className="grid grid-cols-2 bg-white/5 border-b-2 border-white/20 font-mono text-xs font-bold uppercase tracking-widest">
                  <div className="p-4 text-gray-400">What B2C platforms assume</div>
                  <div className="p-4 border-l-2 border-white/20 text-white bg-growmax-red/20">What your business needs</div>
                </div>
                
                {[
                  { b2c: "One price for everyone", b2b: "Customer-specific pricing" },
                  { b2c: "Instant checkout", b2b: "Quote → Approval → PO → Invoice" },
                  { b2c: "One warehouse", b2b: "Multi-branch, multi-warehouse" },
                  { b2c: "Anonymous buyers", b2b: "Long-term partnership relationships" },
                  { b2c: "Simple cart", b2b: "100-line quotes with version control" },
                  { b2c: "Credit card / UPI", b2b: "Net 30/45/60 payment terms" }
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-2 border-b border-white/10 hover:bg-white/5 transition-colors">
                    <div className="p-4 font-mono text-sm text-gray-500 line-through decoration-gray-700">{row.b2c}</div>
                    <div className="p-4 font-mono text-sm text-white border-l-2 border-white/20 flex items-center gap-3">
                      <CheckSquare className="w-4 h-4 text-growmax-red shrink-0" /> {row.b2b}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: THE REVENUE LEAKS WE FIX */}
      <section className="py-32 bg-growmax-white border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between border-b-4 border-growmax-black pb-8 gap-8">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9]">
              The Revenue <br/>Leaks We Fix
            </h2>
            <div className="font-mono text-sm font-bold text-growmax-red uppercase max-w-sm">
              "These aren't nice to have features. They're daily business flows."
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 font-mono">
            {[
              { num: "01", title: "Pricing Complexity", desc: "Customer A gets 15%, Customer B gets 18.5%. Special Price overrides for large orders. Built-in logic." },
              { num: "02", title: "Approval Bottlenecks", desc: "Quote request → Manager approval → Director approval → Converted to order with zero edits." },
              { num: "03", title: "Multi-branch / Warehouse", desc: "Sales reps from different branches send quotes or orders to discrete warehouses automatically." },
              { num: "04", title: "Quote Management", desc: "100s of line item quotes, strict version control, validity periods, and quote-to-order tracking." },
              { num: "05", title: "Payment Terms Logic", desc: "Net 30/45/60, payment against delivery, cash discounts, packing & forwarding cost matrices." },
              { num: "06", title: "ERP Integration sync", desc: "Two-way real-time sync for inventory, customers, orders & invoices. Native SAP JCo." }
            ].map((leak, i) => (
              <div key={i} className="group relative pt-6 border-t border-growmax-black hover:border-growmax-red transition-colors">
                <div className="absolute top-0 right-0 -mt-10 text-6xl font-bold text-gray-100 group-hover:text-growmax-red/10 transition-colors z-0">
                  {leak.num}
                </div>
                <h3 className="text-lg font-bold mb-4 uppercase text-growmax-black relative z-10">{leak.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed relative z-10">{leak.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: THE GROWMAX ADVANTAGE */}
      <section className="py-32 bg-growmax-gray bg-grid-blueprint border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase">The Growmax Advantage</h2>
            <p className="font-mono text-sm mt-6 text-gray-600">Complexity is NOT bad. This accurately represents B2B reality.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-2 bg-growmax-black p-2">
            {[
              {
                title: "Multi-Tier Pricing Engine",
                icon: <Fingerprint className="w-8 h-8"/>,
                points: ["Not: Product → Customer", "But: Product → Tier → Volume → Time → Customer", "SPAs & Margin controls built in"]
              },
              {
                title: "Approval Engine",
                icon: <Activity className="w-8 h-8"/>,
                points: ["Rule based approval flow by discounts or margins", "Multi-levels, Auto approval", "Override discount protocols"]
              },
              {
                title: "Warehouse Orchestration",
                icon: <Layers className="w-8 h-8"/>,
                points: ["Role based multi-branch management", "Intelligent allocation with zone logic", "50+ location capability"]
              },
              {
                title: "ERP Grade Integrations",
                icon: <Server className="w-8 h-8"/>,
                points: ["Native two-way SAP ECC integration with JCo", "API & foundation ready for any ERP", "Zero middleware latency"]
              }
            ].map((adv, i) => (
              <div key={i} className="bg-growmax-white p-10 md:p-14 hover:bg-white transition-colors flex flex-col">
                <div className="text-growmax-red mb-6">{adv.icon}</div>
                <h3 className="text-2xl font-bold tracking-tighter mb-6 uppercase">{adv.title}</h3>
                <ul className="space-y-4 font-mono text-sm text-gray-600 mt-auto">
                  {adv.points.map((pt, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="text-growmax-red mt-0.5">■</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CASE STUDIES */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Deployment Validation</h2>
            <div className="h-0.5 flex-1 bg-growmax-black"></div>
          </div>

          <div className="space-y-4">
            {/* Case Study 1 */}
            <div className="border-2 border-growmax-black p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-start hover:bg-gray-50 transition-colors">
              <div className="lg:w-1/3">
                <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Case Study 01</div>
                <SiemensLogo size="lg" className="mb-2" />
                <p className="font-mono text-sm text-gray-500 uppercase">Partner Commerce Platform</p>
              </div>
              <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-mono text-gray-600 leading-relaxed">
                    <strong>Challenge:</strong> Sales teams prioritized top 20% customers (80% revenue), leaving smaller contractors underserved despite significant collective volume.
                  </p>
                  <p className="text-sm font-mono text-gray-600 leading-relaxed mt-4">
                    <strong>Solution:</strong> Rolled out connected platform between internal sales, partners, and the 80% base. Scalable digital sales reps serving high-volume, lower-touch profitably.
                  </p>
                </div>
                <div className="bg-growmax-black text-white p-6 flex flex-col justify-center gap-4 font-mono">
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-xs uppercase text-gray-400">Scale</span>
                    <span className="font-bold text-xl">300+ Partners</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase text-gray-400">Reach</span>
                    <span className="font-bold text-xl">100K+ Customers</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="border-2 border-growmax-black p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-start hover:bg-gray-50 transition-colors">
              <div className="lg:w-1/3">
                <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Case Study 02</div>
                <SchwingSttetterLogo size="lg" className="mb-2" />
                <p className="font-mono text-sm text-gray-500 uppercase">Spares Portal</p>
              </div>
              <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-mono text-gray-600 leading-relaxed">
                    <strong>Challenge:</strong> 800+ service engineers across 50 branches manually giving quotes/orders. Customers unhappy with delayed processes.
                  </p>
                  <p className="text-sm font-mono text-gray-600 leading-relaxed mt-4">
                    <strong>Solution:</strong> Unified portal for contracted pricing, engineers creating quotes on the move, tightly integrated with backend SAP ECC.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="bg-growmax-red text-white p-4 flex flex-col justify-center">
                    <div className="text-3xl font-bold">↑74%</div>
                    <div className="text-[10px] uppercase mt-2">Quote Response Time</div>
                  </div>
                  <div className="bg-growmax-black text-white p-4 flex flex-col justify-center">
                    <div className="text-3xl font-bold">↑36%</div>
                    <div className="text-[10px] uppercase mt-2">Quote-to-Close Rate</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 6: ARCHITECTURE SPLIT / ROUTING */}
      <section className="py-0 bg-growmax-black text-white border-t-2 border-growmax-red">
        <div className="flex flex-col md:flex-row">
          
          <Link href="/revenue-platform" className="w-full md:w-1/2 p-16 md:p-24 border-b border-gray-800 md:border-b-0 md:border-r border-gray-800 hover:bg-growmax-red group transition-colors duration-300 flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-widest mb-6 border border-white/20 inline-block px-3 py-1 group-hover:border-white">Architecture 01</div>
              <h2 className="text-5xl font-bold tracking-tighter mb-6 uppercase">Enterprise<br/>Platform</h2>
              <p className="font-mono text-sm text-gray-400 group-hover:text-white/90 leading-relaxed max-w-md">
                For Mid-market to Enterprise manufacturers ($100M - $1B). Deep SAP integration, Quote-to-Cash, and complex pricing matrices.
              </p>
            </div>
            <div className="flex items-center gap-4 font-mono font-bold uppercase tracking-widest mt-12">
              Explore Specs <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-4" />
            </div>
          </Link>

          <Link href="/arc" className="w-full md:w-1/2 p-16 md:p-24 hover:bg-white hover:text-growmax-black group transition-colors duration-300 flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-widest mb-6 border border-gray-800 inline-block px-3 py-1 group-hover:border-growmax-black">Architecture 02</div>
              <h2 className="text-5xl font-bold tracking-tighter mb-6 uppercase">Growmax<br/>ARC</h2>
              <p className="font-mono text-sm text-gray-400 group-hover:text-growmax-black leading-relaxed max-w-md">
                For Wholesale Distributors & SMBs. Replace WhatsApp with a Field Sales App, Customer Portal, and Native Zoho sync.
              </p>
            </div>
            <div className="flex items-center gap-4 font-mono font-bold uppercase tracking-widest mt-12 text-growmax-red">
              Explore Specs <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-4" />
            </div>
          </Link>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-growmax-white text-center border-t-2 border-growmax-black bg-grid-blueprint">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-6 text-growmax-black">
            Let's fix your <br/>disconnected commerce.
          </h2>
          <p className="font-mono text-lg mb-12 text-gray-600 max-w-2xl mx-auto uppercase">
            Pilot live in 8-12 weeks. Scale based on results.
          </p>
          <Link href="/demo">
            <Button className="bg-growmax-red hover:bg-growmax-black text-white rounded-none h-16 px-12 font-bold font-mono text-sm uppercase tracking-widest transition-colors duration-0 border-2 border-growmax-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2">
              Book Deployment Call
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}