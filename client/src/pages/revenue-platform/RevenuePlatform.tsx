import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Factory, Database, Users, Settings, Phone, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RevenuePlatform() {
  return (
    <div className="min-h-screen bg-enterprise-bg text-enterprise-text">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden border-b border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-growmax-red/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/5 text-gray-300 text-sm font-medium mb-8 border border-white/10">
              GROWMAX REVENUE PLATFORM
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Digitize Your Dealer & Distribution Network in Weeks, Not Months
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              The Revenue Platform that manufacturers trust for dealer portals, partner commerce, spares management, and sales rep enablement.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/demo">
                <Button className="bg-growmax-red hover:bg-growmax-red-dark text-white border-0 h-14 px-8 text-lg w-full sm:w-auto">
                  See it in action <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button variant="outline" className="h-14 px-8 text-lg border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white w-full sm:w-auto">
                Explore Features
              </Button>
            </div>
          </div>
        </div>
        
        {/* Dashboard Mockup Image Placeholder */}
        <div className="mt-20 container mx-auto px-4">
          <div className="relative rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl overflow-hidden aspect-[16/9] max-w-5xl mx-auto">
             <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
             <div className="absolute top-0 w-full h-12 bg-gray-950 border-b border-gray-800 flex items-center px-4 gap-2">
               <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
             </div>
             {/* Mockup content area */}
             <div className="pt-16 p-8 grid grid-cols-4 gap-6 h-full opacity-60">
               <div className="col-span-1 space-y-4">
                 <div className="h-8 bg-gray-800 rounded w-full"></div>
                 <div className="h-8 bg-gray-800 rounded w-3/4"></div>
                 <div className="h-8 bg-gray-800 rounded w-5/6"></div>
                 <div className="h-8 bg-gray-800 rounded w-full mt-12"></div>
                 <div className="h-8 bg-gray-800 rounded w-2/3"></div>
               </div>
               <div className="col-span-3 space-y-6">
                 <div className="flex gap-4">
                   <div className="h-24 bg-gray-800 rounded-xl w-1/3"></div>
                   <div className="h-24 bg-gray-800 rounded-xl w-1/3"></div>
                   <div className="h-24 bg-gray-800 rounded-xl w-1/3"></div>
                 </div>
                 <div className="h-64 bg-gray-800 rounded-xl w-full"></div>
                 <div className="h-32 bg-gray-800 rounded-xl w-full"></div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">One Connected Architecture</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Modules designed to work together, powered by a single backend integrated directly with your ERP.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Link href="/revenue-platform/dealer-portal" className="group bg-gray-900/50 border border-gray-800 hover:border-gray-600 rounded-2xl p-8 transition-colors block">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors">Dealer Portal</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Branded portals for your dealer network to check stock, place orders, and manage their accounts independently.
              </p>
              <div className="text-sm font-medium text-blue-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                Explore Module <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link href="/revenue-platform/partner-commerce" className="group bg-gray-900/50 border border-gray-800 hover:border-gray-600 rounded-2xl p-8 transition-colors block">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center mb-6">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">Partner Commerce</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Self-service ordering for channel partners with custom catalogs, tier-based pricing, and automated approval workflows.
              </p>
              <div className="text-sm font-medium text-purple-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                Explore Module <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link href="/revenue-platform/spares-portal" className="group bg-gray-900/50 border border-gray-800 hover:border-gray-600 rounded-2xl p-8 transition-colors block">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-orange-400 transition-colors">Spares Portal</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Spare parts catalog with interactive diagram search, exploded views, and instant reordering capabilities.
              </p>
              <div className="text-sm font-medium text-orange-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                Explore Module <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link href="/revenue-platform/sales-rep-app" className="group bg-gray-900/50 border border-gray-800 hover:border-gray-600 rounded-2xl p-8 transition-colors block">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors">Sales Rep App</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Mobile-first quoting, offline order creation, and customer visit logging for your field sales team.
              </p>
              <div className="text-sm font-medium text-emerald-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                Explore Module <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            <Link href="/revenue-platform/customer-self-service" className="group bg-gray-900/50 border border-gray-800 hover:border-gray-600 rounded-2xl p-8 transition-colors block lg:col-span-2">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <div className="w-12 h-12 bg-growmax-red/10 text-growmax-red rounded-xl flex items-center justify-center mb-6">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-growmax-red transition-colors">Customer Self-Service</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Allow end-customers to independently check order statuses, track shipments, view invoices, and make payments without calling support.
                  </p>
                  <div className="text-sm font-medium text-growmax-red flex items-center opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                    Explore Module <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
                <div className="md:w-1/2 bg-gray-800 rounded-xl p-4 flex items-center justify-center border border-gray-700">
                   <div className="text-gray-500 text-sm font-medium">Dashboard Preview</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Integration Logos */}
      <section className="py-20 border-y border-gray-800 bg-gray-900/30">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="text-sm font-medium text-gray-400 mb-8 uppercase tracking-widest">
            Deep integrations with your existing systems
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-70">
            <div className="text-2xl font-bold font-sans text-blue-400">SAP</div>
            <div className="text-2xl font-bold text-gray-300">Microsoft Dynamics</div>
            <div className="text-xl font-bold text-green-500">Zoho</div>
            <div className="text-xl font-bold text-blue-600">Salesforce</div>
            <div className="text-xl font-bold text-gray-300">Custom ERPs</div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-growmax-red opacity-10"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to transform your distribution?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Join Siemens, Schwing Stetter, and OBO Bettermann in digitizing your B2B commerce operations.
          </p>
          <Link href="/demo">
            <Button className="bg-growmax-red hover:bg-growmax-red-dark text-white border-0 h-16 px-10 text-lg rounded-xl">
              Book a Strategy Call <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}