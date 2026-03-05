import { Link } from "wouter";
import { ArrowLeft, Clock, Calendar, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white pt-16">
      
      {/* Article Header */}
      <article className="pt-20 pb-16 border-b-2 border-growmax-black bg-grid-blueprint relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
          
          <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-500 hover:text-growmax-red transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Return to Index
          </Link>
          
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs uppercase tracking-widest mb-8">
            <span className="bg-growmax-black text-white px-3 py-1 font-bold">Architecture</span>
            <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-3 h-3"/> Jan 15, 2026</span>
            <span className="text-gray-500 flex items-center gap-2"><Clock className="w-3 h-3"/> 5 Min Read</span>
            <span className="text-gray-400 border border-gray-300 px-2 py-0.5">DOC.001</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8">
            Bridging the Digital Gap: Why Industrial Brands Need a Partner Engagement Strategy
          </h1>
          
          <p className="text-xl text-gray-600 font-light leading-relaxed border-l-4 border-growmax-red pl-6 mb-12">
            Manufacturers are losing millions by treating their dealer networks as an afterthought. It's time to engineer a connected partner ecosystem.
          </p>
          
          {/* Author Block */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 border border-gray-300 flex items-center justify-center font-mono text-[10px] text-gray-500">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80" alt="Author" className="w-full h-full object-cover grayscale" />
              </div>
              <div>
                <div className="font-bold text-growmax-black text-sm uppercase tracking-tight">System Architect</div>
                <div className="font-mono text-xs text-gray-500">Growmax Core Team</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-500 hover:text-growmax-black hover:border-growmax-black transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 border border-gray-300 flex items-center justify-center text-gray-500 hover:text-growmax-black hover:border-growmax-black transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </article>

      {/* Article Body */}
      <div className="container mx-auto px-4 md:px-8 max-w-4xl py-16">
        <div className="grid md:grid-cols-12 gap-12">
          
          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9 prose max-w-none prose-headings:font-bold prose-headings:tracking-tighter prose-headings:text-growmax-black prose-p:text-gray-700 prose-p:font-light prose-p:leading-relaxed prose-a:text-growmax-red hover:prose-a:text-growmax-black prose-img:border prose-img:border-gray-200 prose-img:shadow-sm">
            
            <p>
              In the industrial manufacturing sector, the traditional sales model is fundamentally broken. Sales teams disproportionately prioritize the top 20% of customers that drive 80% of revenue. This leaves a massive tail of smaller contractors, panel builders, and regional distributors chronically underserved.
            </p>

            <h2>The Cost of Disconnection</h2>
            
            <p>
              When a manufacturer relies entirely on manual processes—emails, phone calls, and WhatsApp messages—to manage their partner network, they create an artificial ceiling on their growth. 
            </p>

            <div className="bg-gray-50 border-l-4 border-growmax-black p-6 my-8 font-mono text-sm">
              <span className="font-bold uppercase block mb-2 text-growmax-red">Data Log:</span>
              "Our research shows that mid-market manufacturers lose an average of 18% in potential recurring revenue simply because ordering processes are too high-friction for long-tail distributors."
            </div>

            <h2>Architecting the Solution</h2>

            <p>
              The solution isn't to hire more sales reps. Throwing headcount at a structural inefficiency ruins your margins. The solution is to deploy a connected <strong>Partner Commerce Platform</strong>.
            </p>

            <p>
              A properly engineered partner platform acts as a digital sales rep. It provides:
            </p>
            
            <ul>
              <li><strong>Self-Service Autonomy:</strong> Partners can view their specific contracted pricing, check real-time stock levels, and place orders without human intervention.</li>
              <li><strong>Quote Management:</strong> Complex RFQs can be initiated digitally, routed through proper approval matrices, and converted to orders automatically.</li>
              <li><strong>ERP Synchronization:</strong> Every action on the portal reflects instantly in the central ERP (like SAP), ensuring data integrity across the organization.</li>
            </ul>

            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80" alt="Industrial Facility" className="w-full grayscale hover:grayscale-0 transition-all duration-500" />
            <div className="text-xs font-mono text-gray-400 mt-2 uppercase tracking-widest text-center">Fig 1. Modernized supply chain facility</div>

            <h2>The Implementation Vector</h2>

            <p>
              Transitioning to this model requires a platform built for B2B reality, not a repurposed B2C shopping cart. Manufacturers need systems capable of handling multi-tier pricing, complex approval workflows, and multi-warehouse orchestrations right out of the box.
            </p>
            
            <p>
              By bridging the digital gap, brands don't just reduce overhead—they unlock entirely new revenue streams from partners who previously found them too difficult to do business with.
            </p>
            
          </div>

          {/* Sticky Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-24">
              <div className="border border-gray-200 p-6 bg-gray-50">
                <div className="font-mono text-xs font-bold text-growmax-black uppercase tracking-widest border-b border-gray-200 pb-4 mb-4">
                  Index
                </div>
                <ul className="space-y-3 font-mono text-xs text-gray-600">
                  <li><a href="#" className="hover:text-growmax-red">1. The Cost of Disconnection</a></li>
                  <li><a href="#" className="hover:text-growmax-red">2. Architecting the Solution</a></li>
                  <li><a href="#" className="hover:text-growmax-red">3. Implementation Vector</a></li>
                </ul>
              </div>

              <div className="mt-8 border-2 border-growmax-black p-6 bg-growmax-black text-white">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-2">Deploy Now</div>
                <h4 className="font-bold text-lg mb-4 leading-tight">Ready to connect your partner network?</h4>
                <Link href="/demo">
                  <Button className="w-full bg-growmax-red hover:bg-white hover:text-growmax-black text-white rounded-none font-bold uppercase tracking-widest text-xs transition-colors h-10">
                    Initiate Setup
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Related Content */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="flex items-center justify-between mb-12 border-b border-gray-200 pb-4">
            <h3 className="text-2xl font-bold tracking-tighter uppercase">Related Architecture</h3>
            <Link href="/blog" className="font-mono text-xs font-bold uppercase tracking-widest text-growmax-red hover:text-growmax-black flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/blog/2" className="group border border-gray-200 bg-white p-6 hover:border-growmax-red transition-colors block">
              <div className="font-mono text-[10px] text-gray-400 mb-4 uppercase">DOC.002 // Data Logic</div>
              <h4 className="text-xl font-bold tracking-tight mb-2 group-hover:text-growmax-red transition-colors">
                Opportunity Pipeline Management – Your Data-Driven Path to Predictable Revenue
              </h4>
              <p className="font-mono text-xs text-gray-500 mt-4">Read Paper →</p>
            </Link>
            
            <Link href="/blog/3" className="group border border-gray-200 bg-white p-6 hover:border-growmax-red transition-colors block">
              <div className="font-mono text-[10px] text-gray-400 mb-4 uppercase">DOC.003 // System Design</div>
              <h4 className="text-xl font-bold tracking-tight mb-2 group-hover:text-growmax-red transition-colors">
                Why an Offline Order-Taking App is Essential for FMCG Industrial Sales
              </h4>
              <p className="font-mono text-xs text-gray-500 mt-4">Read Paper →</p>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}