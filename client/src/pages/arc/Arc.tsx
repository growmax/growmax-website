import { Link } from "wouter";
import { ArrowRight, CheckCircle2, Smartphone, PackageSearch, Users, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Arc() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-arc-surface to-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-arc-accent text-sm font-bold mb-6">
                GROWMAX ARC
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-growmax-black mb-6 leading-tight">
                Stop Taking Orders on WhatsApp. <span className="text-growmax-red">Start Growing.</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                ARC gives your distributors a branded ordering portal, your reps a mobile app, and you real-time inventory visibility — all for $199/month.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <Link href="/arc/pricing">
                  <Button className="bg-growmax-red hover:bg-growmax-red-dark text-white border-0 h-14 px-8 text-lg w-full sm:w-auto rounded-xl">
                    Start Your Free Trial
                  </Button>
                </Link>
                <span className="text-sm text-gray-500 font-medium px-4">
                  No credit card required. Cancel anytime.
                </span>
              </div>
              
              <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" /> 5 Min Setup
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-success" /> Zoho Integrated
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full">
              {/* Product Preview Mockup */}
              <div className="relative">
                {/* Mobile App Mockup */}
                <div className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 w-48 md:w-64 aspect-[9/19] bg-gray-900 rounded-[2rem] border-[6px] border-gray-800 shadow-2xl z-20 flex flex-col overflow-hidden">
                  <div className="h-6 w-full bg-gray-900"></div>
                  <div className="flex-1 bg-gray-50 p-4">
                    <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-6"></div>
                    <div className="space-y-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="flex gap-3 bg-white p-2 rounded-lg shadow-sm">
                          <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Web Dashboard Mockup */}
                <div className="w-full aspect-[4/3] bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden ml-8 md:ml-16 z-10 relative">
                  <div className="h-10 bg-gray-50 border-b border-gray-200 flex items-center px-4">
                    <div className="w-full max-w-sm h-6 bg-white border border-gray-200 rounded text-xs flex items-center px-2 text-gray-400">
                      <Search className="w-3 h-3 mr-2" /> Search inventory...
                    </div>
                  </div>
                  <div className="flex h-[calc(100%-2.5rem)]">
                    <div className="w-48 bg-gray-50 border-r border-gray-200 p-4 space-y-2 hidden md:block">
                      <div className="h-6 bg-gray-200 rounded w-full"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-5/6"></div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between mb-6">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-8 bg-growmax-red/20 rounded w-24"></div>
                      </div>
                      <div className="space-y-4">
                        <div className="h-12 bg-gray-50 border border-gray-100 rounded w-full"></div>
                        <div className="h-12 bg-gray-50 border border-gray-100 rounded w-full"></div>
                        <div className="h-12 bg-gray-50 border border-gray-100 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Modules */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-growmax-black mb-4">Everything you need to run distribution</h2>
            <p className="text-xl text-gray-600">Three powerful modules, one affordable price.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-orange-50/50 rounded-2xl p-8 border border-orange-100">
              <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <PackageSearch className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Inventory Management</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Real-time stock tracking across multiple locations. Never promise products you don't have.
              </p>
              <ul className="space-y-3 text-sm font-medium text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Multi-warehouse tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Low stock alerts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-orange-500" /> Bulk import via Excel</li>
              </ul>
            </div>
            
            <div className="bg-red-50/50 rounded-2xl p-8 border border-red-100">
              <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center text-growmax-red mb-6">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sales Rep App</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Empower your field reps to take orders, check pricing, and log visits right from their phones.
              </p>
              <ul className="space-y-3 text-sm font-medium text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-growmax-red" /> iOS & Android apps</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-growmax-red" /> Offline order taking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-growmax-red" /> Customer specific pricing</li>
              </ul>
            </div>
            
            <div className="bg-emerald-50/50 rounded-2xl p-8 border border-emerald-100">
              <div className="w-14 h-14 bg-white shadow-sm rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Portal</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Give your B2B customers a modern, branded portal to place orders 24/7.
              </p>
              <ul className="space-y-3 text-sm font-medium text-gray-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Self-service ordering</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Order history & tracking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Re-order functionality</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Callout */}
      <section className="py-16 bg-arc-surface">
        <div className="container mx-auto px-4 md:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 border border-orange-100">
            <div>
              <h2 className="text-3xl font-bold text-growmax-black mb-2">Transparent Pricing</h2>
              <p className="text-gray-600 mb-6">Everything you need to digitize, nothing you don't.</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-black text-growmax-black">$199</span>
                <span className="text-gray-500 font-medium">/month</span>
              </div>
              <p className="text-sm font-bold text-success flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> 5 User Seats Included
              </p>
            </div>
            
            <div className="w-full md:w-auto">
              <Link href="/arc/pricing">
                <Button className="w-full md:w-auto bg-growmax-red hover:bg-growmax-red-dark text-white border-0 h-14 px-8 text-lg rounded-xl">
                  Start Free Trial
                </Button>
              </Link>
              <p className="text-xs text-center text-gray-500 mt-3">14-day free trial · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Competitors */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8 text-center">
           <h2 className="text-2xl font-bold text-gray-400 mb-8">See how we compare</h2>
           <div className="flex flex-wrap justify-center gap-4">
             <Link href="/arc/compare/b2b-wave" className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-medium hover:border-growmax-red hover:text-growmax-red transition-colors">
               vs B2B Wave
             </Link>
             <Link href="/arc/compare/pepperi" className="px-6 py-3 rounded-full border border-gray-200 text-gray-600 font-medium hover:border-growmax-red hover:text-growmax-red transition-colors">
               vs Pepperi
             </Link>
             <Link href="/arc/compare/whatsapp-excel" className="px-6 py-3 rounded-full border border-orange-200 bg-orange-50 text-orange-700 font-bold hover:bg-orange-100 transition-colors">
               vs WhatsApp & Excel
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
}