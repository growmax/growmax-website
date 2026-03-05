import { Link } from "wouter";
import { ArrowRight, Server, Box, Fingerprint, Activity, Layers, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RevenuePlatform() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      {/* Hero Section - Swiss Style / Editorial */}
      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6">
                Architecture // Enterprise
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8">
                Enterprise-grade. <br/>
                Cloud-native. <br/>
                <span className="text-gray-400">Built for scale.</span>
              </h1>
              <div className="w-16 h-1 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg">
                Decoupled backend giving complete flexibility. AWS hosted with Microservice architecture on K8s infrastructure. Highly scalable and secure.
              </p>
              
              <Link href="/demo">
                <Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-8 text-lg rounded-none transition-colors duration-300">
                  Request Architecture Review <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            {/* Abstract Architecture Diagram */}
            <div className="hidden lg:block bg-gray-50 border border-gray-200 p-8">
              <div className="font-mono text-xs text-gray-400 mb-6 uppercase">System Diagram v1.0</div>
              
              {/* Top Layer */}
              <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm mb-4">
                Omnichannel Experience (Customers & Partners)
              </div>
              
              <div className="flex justify-center my-2"><ArrowRight className="w-5 h-5 text-gray-400 rotate-90" /></div>
              
              {/* API Layer */}
              <div className="border border-growmax-red border-dashed bg-growmax-red/5 p-3 text-center font-mono text-sm text-growmax-red mb-4">
                Commerce API
              </div>
              
              <div className="flex justify-center my-2"><ArrowRight className="w-5 h-5 text-gray-400 rotate-90" /></div>
              
              {/* Core Layer */}
              <div className="border border-gray-300 bg-gray-100 p-6 flex justify-between items-center mb-4">
                <div className="text-xs font-bold uppercase w-1/4 text-center">Orders</div>
                <div className="text-xs font-bold uppercase w-1/4 text-center">Catalog</div>
                <div className="text-xs font-bold uppercase w-1/4 text-center">Pricing</div>
                <div className="text-xs font-bold uppercase w-1/4 text-center">Quotes</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-gray-400 rotate-90" /></div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-gray-400 rotate-90" /></div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-gray-400 rotate-90" /></div>
              </div>
              
              {/* Systems of Record Layer */}
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="border border-gray-300 bg-white p-3 text-center font-bold text-xs uppercase">ERP / SAP</div>
                <div className="border border-gray-300 bg-white p-3 text-center font-bold text-xs uppercase">CRM</div>
                <div className="border border-gray-300 bg-white p-3 text-center font-bold text-xs uppercase">PIM</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-16">
            <div className="md:w-1/3">
              <h2 className="text-3xl font-bold mb-6">Security & Compliance</h2>
              <p className="text-gray-400 font-light border-l-2 border-growmax-red pl-4 italic">
                "Your data. Your Control. Always."
              </p>
            </div>
            <div className="md:w-2/3 grid sm:grid-cols-2 gap-x-12 gap-y-10">
              <div>
                <h4 className="font-bold font-mono text-growmax-red mb-2 uppercase text-sm">01. Penetration Testing</h4>
                <p className="text-gray-400 text-sm">Aligned with OWASP Top 10 standards. Zero Critical Vulnerabilities post-remediation.</p>
              </div>
              <div>
                <h4 className="font-bold font-mono text-growmax-red mb-2 uppercase text-sm">02. Encryption</h4>
                <p className="text-gray-400 text-sm">Data Encryption at Rest & In Transit ensuring protection of sensitive information.</p>
              </div>
              <div>
                <h4 className="font-bold font-mono text-growmax-red mb-2 uppercase text-sm">03. Access Control</h4>
                <p className="text-gray-400 text-sm">Role-Based Access Control (RBAC) to limit exposure and maintain privacy.</p>
              </div>
              <div>
                <h4 className="font-bold font-mono text-growmax-red mb-2 uppercase text-sm">04. GDPR Ready</h4>
                <p className="text-gray-400 text-sm">Compliant infrastructure, ready for European deployments.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Growmax Advantage - Deep Dive */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-growmax-black mb-6">The Growmax Advantage</h2>
            <p className="text-xl text-gray-600 font-light">Deeply technical features built for the realities of distribution and manufacturing.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
            <div className="bg-white p-12 hover:bg-gray-50 transition-colors">
              <Fingerprint className="w-10 h-10 text-growmax-red mb-6" />
              <h3 className="text-2xl font-bold mb-4">Multi-Tier Pricing Engine</h3>
              <div className="space-y-4 text-gray-600 font-light">
                <p>Not simple: Product → Customer.</p>
                <p className="font-mono text-sm bg-gray-100 p-2 inline-block">Product → Pricing Tier → Volume Bracket → Time Period → Customer</p>
                <p>Rule based logic handling Special Pricing Agreements (SPAs) and margin controls natively.</p>
              </div>
            </div>

            <div className="bg-white p-12 hover:bg-gray-50 transition-colors">
              <Activity className="w-10 h-10 text-growmax-red mb-6" />
              <h3 className="text-2xl font-bold mb-4">Approval Engine</h3>
              <div className="space-y-4 text-gray-600 font-light">
                <p>Rule based approval flows determined by dynamic discount thresholds or specific margins.</p>
                <p>Multi-level structures, auto-approval conditions, and override management built into the quoting workflow.</p>
              </div>
            </div>

            <div className="bg-white p-12 hover:bg-gray-50 transition-colors">
              <Layers className="w-10 h-10 text-growmax-red mb-6" />
              <h3 className="text-2xl font-bold mb-4">Multi-warehouse Orchestration</h3>
              <div className="space-y-4 text-gray-600 font-light">
                <p>Role-based multi-branch, multi-warehouse management mapping complex logistical realities.</p>
                <p>Intelligent inventory allocation layered with geographic zone management.</p>
              </div>
            </div>

            <div className="bg-white p-12 hover:bg-gray-50 transition-colors">
              <Server className="w-10 h-10 text-growmax-red mb-6" />
              <h3 className="text-2xl font-bold mb-4">ERP Grade Integrations</h3>
              <div className="space-y-4 text-gray-600 font-light">
                <p>Native two-way SAP ECC integration utilizing JCo protocol. Bidirectional RFC calls.</p>
                <p>No fragile middleware. Direct API foundation ready for integration with any custom enterprise ERP.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Highlight */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest">Case Study // Siemens</div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Partner Commerce Platform</h2>
              <p className="text-gray-600 mb-6 font-light leading-relaxed">
                Siemens' partner ecosystem prioritized the top 20% of customers driving 80% of revenue, leaving smaller contractors underserved.
              </p>
              <p className="text-gray-600 mb-8 font-light leading-relaxed border-l-2 border-gray-300 pl-4">
                Growmax rolled out a connected platform between internal sales, channel partners, and the underserved base. We created scalable digital sales reps, going live across India, Indonesia, Vietnam & Thailand.
              </p>
              
              <div className="flex gap-8 border-t border-gray-200 pt-6">
                 <div>
                   <div className="text-2xl font-bold font-mono">300+</div>
                   <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Partners</div>
                 </div>
                 <div>
                   <div className="text-2xl font-bold font-mono">100K+</div>
                   <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">Customers</div>
                 </div>
              </div>
            </div>
            
            <div className="lg:col-span-7 bg-white border border-gray-200 p-8 shadow-sm">
               <div className="font-mono text-xs text-gray-400 mb-6 uppercase">Other Deployments</div>
               
               <div className="space-y-6">
                 <div className="flex items-start gap-6 border-b border-gray-100 pb-6">
                   <div className="w-1/3">
                     <div className="font-bold text-lg mb-1">Schwing Stetter</div>
                     <div className="text-xs text-gray-500 uppercase">Spares Portal</div>
                   </div>
                   <div className="w-2/3 flex justify-between gap-4">
                     <div>
                       <div className="text-growmax-red font-bold font-mono">↑ 74%</div>
                       <div className="text-xs text-gray-500">Quote Response Time</div>
                     </div>
                     <div>
                       <div className="text-growmax-red font-bold font-mono">↑ 27%</div>
                       <div className="text-xs text-gray-500">Direct Orders</div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="flex items-start gap-6">
                   <div className="w-1/3">
                     <div className="font-bold text-lg mb-1">OBO Bettermann</div>
                     <div className="text-xs text-gray-500 uppercase">Partner Portal</div>
                   </div>
                   <div className="w-2/3 flex justify-between gap-4">
                     <div>
                       <div className="text-growmax-red font-bold font-mono">↑ 25%</div>
                       <div className="text-xs text-gray-500">Order Processing Time</div>
                     </div>
                     <div>
                       <div className="text-growmax-red font-bold font-mono">~ 30%</div>
                       <div className="text-xs text-gray-500">Reduction in Support</div>
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 bg-growmax-black text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Deploy Enterprise Commerce. Without the legacy timelines.</h2>
          <Link href="/demo">
            <Button className="mt-8 bg-growmax-red hover:bg-white hover:text-growmax-black text-white h-14 px-10 text-lg rounded-none transition-all duration-300 font-bold tracking-tight">
              Schedule Architecture Review
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}