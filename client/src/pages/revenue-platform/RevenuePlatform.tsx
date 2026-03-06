import { Link } from "wouter";
import { ArrowRight, Server, Box, Fingerprint, Activity, Layers, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { softwareApplicationSchema } from "@/lib/structuredData";

export default function RevenuePlatform() {
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Enterprise B2B Commerce Platform | SAP & ERP Integration | Growmax"
        description="Enterprise-grade B2B commerce platform with native SAP JCo integration, multi-tier pricing engine, approval workflows, and multi-warehouse orchestration. Deploy in 8-12 weeks."
        path="/revenue-platform"
        structuredData={softwareApplicationSchema({
          name: "Growmax Revenue Platform",
          description: "Enterprise-grade B2B commerce platform with native SAP JCo integration, multi-tier pricing engine, approval workflows, and multi-warehouse orchestration.",
          path: "/revenue-platform",
          category: "BusinessApplication",
        })}
      />
      {/* Hero Section - Swiss Style / Editorial */}
      <section className="pt-24 pb-24 border-b border-gray-200 bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3">
                Architecture // Enterprise
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase">
                Enterprise-grade. <br/>
                Cloud-native. <br/>
                <span className="text-gray-400">Built for scale.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg">
                Decoupled backend giving complete flexibility. AWS hosted with Microservice architecture on K8s infrastructure. Highly scalable and secure.
              </p>
              
              <Link href="/demo">
                <Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-8 text-lg rounded-none transition-colors duration-300 font-bold tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5">
                  Request Architecture Review <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            {/* Abstract Architecture Diagram */}
            <div className="hidden lg:block bg-growmax-gray border-2 border-growmax-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-growmax-red animate-pulse"></div>
              </div>
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">System Diagram v1.0</div>
              
              {/* Top Layer */}
              <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm mb-4 uppercase tracking-tight">
                Omnichannel Experience (Customers & Partners)
              </div>
              
              <div className="flex justify-center my-2"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
              
              {/* API Layer */}
              <div className="border-2 border-growmax-red border-dashed bg-growmax-red/5 p-3 text-center font-mono text-sm text-growmax-red mb-4 uppercase tracking-widest font-bold">
                Commerce API
              </div>
              
              <div className="flex justify-center my-2"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
              
              {/* Core Layer */}
              <div className="border border-growmax-black bg-growmax-black text-white p-6 flex justify-between items-center mb-4 font-mono">
                <div className="text-xs uppercase w-1/4 text-center">Orders</div>
                <div className="text-xs uppercase w-1/4 text-center">Catalog</div>
                <div className="text-xs uppercase w-1/4 text-center">Pricing</div>
                <div className="text-xs uppercase w-1/4 text-center">Quotes</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
              </div>
              
              {/* Systems of Record Layer */}
              <div className="grid grid-cols-3 gap-4 mt-4 font-mono text-growmax-black">
                <div className="border-2 border-growmax-black bg-white p-3 text-center font-bold text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">ERP / SAP</div>
                <div className="border border-gray-400 bg-white p-3 text-center text-xs uppercase tracking-widest text-gray-400">CRM</div>
                <div className="border border-gray-400 bg-white p-3 text-center text-xs uppercase tracking-widest text-gray-400">PIM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-24 bg-growmax-black text-white bg-dots-dark border-b border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-4xl font-bold mb-6 tracking-tighter uppercase">Security & Compliance</h2>
              <p className="font-mono text-sm text-growmax-red uppercase tracking-widest border-l-2 border-growmax-red pl-4">
                "Your data. Your Control. Always."
              </p>
            </div>
            <div className="md:w-2/3 grid sm:grid-cols-2 gap-x-12 gap-y-10 border-l border-white/20 pl-8">
              <div>
                <h4 className="font-bold font-mono text-growmax-red mb-2 uppercase text-sm">01. Penetration Testing</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Aligned with OWASP Top 10 standards. Zero Critical Vulnerabilities post-remediation.</p>
              </div>
              <div>
                <h4 className="font-bold font-mono text-growmax-red mb-2 uppercase text-sm">02. Encryption</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Data Encryption at Rest & In Transit ensuring protection of sensitive information.</p>
              </div>
              <div>
                <h4 className="font-bold font-mono text-growmax-red mb-2 uppercase text-sm">03. Access Control</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Role-Based Access Control (RBAC) to limit exposure and maintain privacy.</p>
              </div>
              <div>
                <h4 className="font-bold font-mono text-growmax-red mb-2 uppercase text-sm">04. GDPR Ready</h4>
                <p className="text-gray-400 text-sm leading-relaxed">Compliant infrastructure, ready for European and global enterprise deployments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Growmax Advantage - Deep Dive */}
      <section className="py-32 bg-growmax-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-6 uppercase">The Growmax Advantage</h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">Deeply technical features built for the realities of distribution and manufacturing.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white border-2 border-growmax-black p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <Fingerprint className="w-12 h-12 text-growmax-red mb-6" />
              <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase">Multi-Tier Pricing Engine</h3>
              <div className="space-y-4 text-gray-600 font-light">
                <p className="line-through decoration-gray-400 font-mono text-sm text-gray-400">Not simple: Product → Customer.</p>
                <p className="font-mono text-sm bg-growmax-black text-white p-3 border-l-4 border-growmax-red">Product → Pricing Tier → Volume Bracket → Time Period → Customer</p>
                <p>Rule based logic handling Special Pricing Agreements (SPAs) and margin controls natively.</p>
              </div>
            </div>

            <div className="bg-white border-2 border-growmax-black p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <Activity className="w-12 h-12 text-growmax-red mb-6" />
              <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase">Approval Engine</h3>
              <div className="space-y-4 text-gray-600 font-light">
                <p>Rule based approval flows determined by dynamic discount thresholds or specific margins.</p>
                <p>Multi-level structures, auto-approval conditions, and override management built directly into the quoting workflow.</p>
              </div>
            </div>

            <div className="bg-white border-2 border-growmax-black p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
              <Layers className="w-12 h-12 text-growmax-red mb-6" />
              <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase">Multi-warehouse Orchestration</h3>
              <div className="space-y-4 text-gray-600 font-light">
                <p>Role-based multi-branch, multi-warehouse management mapping complex logistical realities.</p>
                <p>Intelligent inventory allocation layered with geographic zone management across 50+ locations.</p>
              </div>
            </div>

            <div className="bg-white border-2 border-growmax-black p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-grid-blueprint relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-growmax-red text-white font-mono text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Critical</div>
              <Server className="w-12 h-12 text-growmax-red mb-6 relative z-10" />
              <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase relative z-10 bg-white inline-block pr-2">ERP Grade Integrations</h3>
              <div className="space-y-4 text-gray-800 font-medium relative z-10 bg-white/90 p-4 border border-growmax-black backdrop-blur-sm">
                <p className="flex items-start gap-2"><CheckSquare className="w-4 h-4 text-growmax-red shrink-0 mt-0.5" /> Native two-way SAP ECC integration utilizing JCo protocol. Bidirectional RFC calls.</p>
                <p className="flex items-start gap-2"><CheckSquare className="w-4 h-4 text-growmax-red shrink-0 mt-0.5" /> No fragile middleware. Direct API foundation ready for integration with any custom enterprise ERP.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Market Context Note */}
      <section className="py-16 bg-growmax-black text-white border-t border-gray-800 border-b-4 border-growmax-red">
         <div className="container mx-auto px-4 text-center">
            <p className="font-mono text-sm uppercase tracking-widest text-gray-400">
               Optimized for Industrial & Electrical Distributors <br/> 
               <span className="text-growmax-red font-bold">Target Focus: US East Coast & Texas Region</span>
            </p>
         </div>
      </section>

      {/* Case Study Highlight */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Case Study // Siemens</div>
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]">Partner Commerce Platform</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                Siemens' partner ecosystem prioritized the top 20% of customers driving 80% of revenue, leaving smaller contractors underserved.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                 <p className="text-sm font-mono text-gray-600 leading-relaxed">
                   Growmax rolled out a connected platform between internal sales, channel partners, and the underserved base. We created scalable digital sales reps, going live across India, Indonesia, Vietnam & Thailand.
                 </p>
              </div>
              
              <div className="flex gap-8 border-t-2 border-growmax-black pt-6">
                 <div>
                   <div className="text-4xl font-bold font-mono text-growmax-black">300+</div>
                   <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Partners</div>
                 </div>
                 <div>
                   <div className="text-4xl font-bold font-mono text-growmax-black">100K+</div>
                   <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Customers</div>
                 </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
               <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Other Verified Deployments</div>
               
               <div className="space-y-12">
                 <div className="flex flex-col md:flex-row items-start md:items-center gap-6 border-b border-gray-300 pb-8">
                   <div className="w-full md:w-1/3">
                     <div className="font-bold text-2xl tracking-tighter uppercase mb-1">Schwing Stetter</div>
                     <div className="text-xs text-gray-500 font-mono uppercase tracking-widest">Spares Portal</div>
                   </div>
                   <div className="w-full md:w-2/3 flex justify-between gap-4">
                     <div className="bg-white border border-gray-200 p-4 w-1/2">
                       <div className="text-growmax-red font-bold font-mono text-2xl mb-1">↑ 74%</div>
                       <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Quote Response Time</div>
                     </div>
                     <div className="bg-white border border-gray-200 p-4 w-1/2">
                       <div className="text-growmax-red font-bold font-mono text-2xl mb-1">↑ 27%</div>
                       <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Direct Orders</div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                   <div className="w-full md:w-1/3">
                     <div className="font-bold text-2xl tracking-tighter uppercase mb-1">OBO Bettermann</div>
                     <div className="text-xs text-gray-500 font-mono uppercase tracking-widest">Partner Portal</div>
                   </div>
                   <div className="w-full md:w-2/3 flex justify-between gap-4">
                     <div className="bg-white border border-gray-200 p-4 w-1/2">
                       <div className="text-growmax-black font-bold font-mono text-2xl mb-1">↑ 25%</div>
                       <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Order Processing Speed</div>
                     </div>
                     <div className="bg-white border border-gray-200 p-4 w-1/2">
                       <div className="text-growmax-black font-bold font-mono text-2xl mb-1">~ 30%</div>
                       <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Reduction in Support</div>
                     </div>
                   </div>
                 </div>
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
              <h3 className="text-2xl font-bold tracking-tight">See how Growmax stacks up against Corevist & SAP Commerce Cloud</h3>
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
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Related Architecture</div>
            <h2 className="text-4xl font-bold tracking-tighter text-growmax-black uppercase mb-4">Explore More</h2>
            <div className="w-16 h-2 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-related-links">
            <Link href="/industries/electrical-distributors">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-electrical-industry">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Industry</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Electrical Distributors</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Complex pricing, multi-warehouse inventory, and contractor portals for electrical wholesale.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">View Industry Page <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/arc">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-arc-platform">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">For Distributors</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Growmax ARC</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">The connected distributor platform with ordering portal, field sales app, and Zoho integration.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Explore ARC <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/blog/partner-engagement-strategy-industrial-brands">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-blog-partner-engagement">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Intelligence</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Partner Engagement Strategy</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Why industrial brands need a connected partner ecosystem to drive channel revenue growth.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Article <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 bg-growmax-black text-white text-center bg-dots-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter uppercase leading-[1.1]">Deploy Enterprise Commerce.<br/>Without the legacy timelines.</h2>
          <Link href="/demo">
            <Button className="mt-12 bg-growmax-red hover:bg-white hover:text-growmax-black text-white h-16 px-12 text-lg rounded-none transition-all duration-300 font-bold tracking-widest uppercase border-2 border-transparent hover:border-growmax-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-2 hover:translate-y-2">
              Schedule Architecture Review
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}