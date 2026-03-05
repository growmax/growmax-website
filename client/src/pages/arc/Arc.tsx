import { Link } from "wouter";
import { ArrowRight, Smartphone, Database, Zap, Cpu, Server, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Arc() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6">
                Architecture // Distributors
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8">
                Stop taking orders<br/>
                on WhatsApp.<br/>
                <span className="text-gray-400">Deploy ARC.</span>
              </h1>
              <div className="w-16 h-1 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg">
                The connected distributor platform. A branded ordering portal for customers, a mobile app for reps, and real-time inventory visibility.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Link href="/arc/pricing">
                  <Button className="w-full sm:w-auto bg-growmax-black hover:bg-growmax-red text-white h-14 px-8 text-lg rounded-none transition-colors duration-300 font-bold">
                    View Pricing Model
                  </Button>
                </Link>
                <div className="font-mono text-xs text-gray-500 uppercase tracking-widest px-4 border-l border-gray-300">
                  Starts at $199/mo <br/> 5 Min Setup
                </div>
              </div>
            </div>
            
            {/* Abstract UI Diagram */}
            <div className="hidden lg:block">
              <div className="border border-gray-200 bg-white p-2 shadow-xl flex items-end gap-4 h-full relative">
                <div className="absolute -top-4 -right-4 font-mono text-[10px] bg-growmax-red text-white px-2 py-1 uppercase">Live Data</div>
                
                {/* Mobile Mock */}
                <div className="w-1/3 h-64 border border-gray-800 bg-gray-900 flex flex-col p-2">
                  <div className="text-[8px] text-gray-400 font-mono mb-2 uppercase">Sales Rep App</div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 border border-gray-700 bg-gray-800"></div>
                    <div className="h-10 border border-gray-700 bg-gray-800"></div>
                    <div className="h-10 border border-growmax-red bg-growmax-red/20"></div>
                  </div>
                </div>
                
                {/* Desktop Mock */}
                <div className="w-2/3 h-80 border border-gray-200 bg-gray-50 flex flex-col">
                  <div className="h-6 border-b border-gray-200 bg-white flex items-center px-2">
                     <div className="text-[8px] text-gray-400 font-mono uppercase">Inventory Command Center</div>
                  </div>
                  <div className="flex-1 p-4 flex gap-4">
                     <div className="w-1/4 space-y-2">
                       <div className="h-2 bg-gray-200"></div>
                       <div className="h-2 bg-gray-200"></div>
                       <div className="h-2 bg-gray-200"></div>
                     </div>
                     <div className="w-3/4 border border-gray-200 bg-white p-2">
                        <div className="w-full h-20 bg-gray-100 mb-2"></div>
                        <div className="w-full h-8 border border-gray-100 mb-1"></div>
                        <div className="w-full h-8 border border-gray-100 mb-1"></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Logic Modules */}
      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Core Modules</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="border border-gray-800 p-8 hover:border-growmax-red transition-colors group">
              <div className="font-mono text-xs text-growmax-red mb-4 uppercase">Mod.01</div>
              <Activity className="w-8 h-8 text-white mb-6 group-hover:text-growmax-red transition-colors" />
              <h3 className="text-xl font-bold mb-4 tracking-tight">Inventory Intelligence</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed mb-6">
                Real-time stock tracking across multiple warehouses. Intelligent allocation so you never promise inventory you don't have.
              </p>
              <ul className="space-y-2 font-mono text-xs text-gray-500">
                <li>+ Multi-warehouse syncing</li>
                <li>+ Low stock threshold alerts</li>
                <li>+ Excel bulk operations</li>
              </ul>
            </div>
            
            <div className="border border-gray-800 p-8 hover:border-growmax-red transition-colors group">
              <div className="font-mono text-xs text-growmax-red mb-4 uppercase">Mod.02</div>
              <Smartphone className="w-8 h-8 text-white mb-6 group-hover:text-growmax-red transition-colors" />
              <h3 className="text-xl font-bold mb-4 tracking-tight">Field Sales App</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed mb-6">
                Arm your reps with iOS/Android apps capable of offline order creation, customer-specific pricing display, and visit logging.
              </p>
              <ul className="space-y-2 font-mono text-xs text-gray-500">
                <li>+ Offline sync capabilities</li>
                <li>+ Account-level price matrices</li>
                <li>+ Field data capture</li>
              </ul>
            </div>
            
            <div className="border border-gray-800 p-8 hover:border-growmax-red transition-colors group">
              <div className="font-mono text-xs text-growmax-red mb-4 uppercase">Mod.03</div>
              <Database className="w-8 h-8 text-white mb-6 group-hover:text-growmax-red transition-colors" />
              <h3 className="text-xl font-bold mb-4 tracking-tight">Customer Portal</h3>
              <p className="text-gray-400 font-light text-sm leading-relaxed mb-6">
                Deploy a self-service ordering interface for your B2B customers. Automated re-ordering, invoice tracking, and history.
              </p>
              <ul className="space-y-2 font-mono text-xs text-gray-500">
                <li>+ 24/7 autonomous ordering</li>
                <li>+ Order tracking logic</li>
                <li>+ Re-order automation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Highlight */}
      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
           <div className="bg-gray-50 border border-gray-200 p-12 md:p-16 flex flex-col md:flex-row items-center gap-12">
             <div className="md:w-1/2">
                <div className="font-mono text-xs text-growmax-red uppercase mb-4 tracking-widest font-bold">Native Integration</div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-growmax-black">Zoho Inventory Connected.</h2>
                <p className="text-gray-600 font-light leading-relaxed mb-6">
                  We engineered a native, two-way sync with Zoho. Orders placed in ARC push to Zoho immediately, and inventory mutations in Zoho reflect in ARC in real-time.
                </p>
                <div className="inline-flex items-center gap-2 border border-gray-300 px-4 py-2 text-sm font-mono font-bold text-gray-800">
                   <Server className="w-4 h-4"/> Sync Active
                </div>
             </div>
             
             <div className="md:w-1/2 w-full flex justify-center items-center gap-4">
                <div className="w-24 h-24 bg-white border border-gray-200 flex items-center justify-center font-bold text-xl tracking-tighter shadow-sm">ARC</div>
                <ArrowRight className="w-6 h-6 text-growmax-red animate-pulse"/>
                <div className="w-24 h-24 bg-white border border-gray-200 flex items-center justify-center font-bold text-xl tracking-tighter text-blue-600 shadow-sm">ZOHO</div>
             </div>
           </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 text-center bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 tracking-tight text-growmax-black">Digitize your distribution. $199/mo.</h2>
          <Link href="/arc/pricing">
            <Button className="mt-8 bg-growmax-red hover:bg-growmax-black text-white h-14 px-10 text-lg rounded-none transition-all duration-300 font-bold tracking-tight">
              View Deployment Tiers
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}