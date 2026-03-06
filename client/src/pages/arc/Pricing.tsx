import { Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { productOfferSchema } from "@/lib/structuredData";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-50 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Growmax ARC Pricing | $199/month B2B Commerce Platform"
        description="Growmax ARC starts at $199/month with 5 user seats, inventory engine, sales rep app, customer portal, and native Zoho integration. No hidden fees, 14-day free trial."
        path="/arc/pricing"
        structuredData={productOfferSchema({
          name: "Growmax ARC - B2B Commerce Platform",
          description: "Connected distributor platform with inventory engine, sales rep app, customer portal, catalog management, and native Zoho integration. 5 user seats included.",
          path: "/arc/pricing",
          price: "199",
          features: [
            "5 User Seats Included",
            "Inventory Engine",
            "Sales Rep App (iOS/Android)",
            "Customer Ordering Portal",
            "Catalog Management",
            "Order Tracking Logic",
            "Native Zoho Integration",
            "Reporting Dashboards",
            "Standard Support SLA",
          ],
        })}
      />
      {/* Hero */}
      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-gray-50 pointer-events-none"></div>
        <div className="container mx-auto text-center max-w-3xl relative z-10 px-4">
          <div className="mb-6 flex justify-center">
            <Breadcrumbs items={[
              { label: "ARC", href: "/arc" },
              { label: "Pricing" },
            ]} />
          </div>
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6">
             Commercials // ARC
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-growmax-black mb-6 tracking-tighter leading-[1.1]">
            Transparent logic. <br/>No hidden fees.
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Everything you need to run your distribution digitally.
          </p>
        </div>
      </section>

      {/* Pricing Card - Brutalist */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="border border-growmax-black bg-white flex flex-col md:flex-row shadow-2xl relative">
            <div className="absolute -top-3 -right-3 bg-growmax-red text-white font-mono text-[10px] uppercase px-3 py-1 font-bold tracking-widest">
              Standard License
            </div>
            
            {/* Left/Pricing Section */}
            <div className="md:w-2/5 p-6 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50">
              <h2 className="text-2xl font-bold tracking-tighter text-growmax-black mb-2">Growmax ARC</h2>
              <p className="text-sm font-mono text-gray-500 uppercase mb-8 border-b border-gray-200 pb-4">Base Platform</p>
              
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl sm:text-6xl font-bold tracking-tighter text-growmax-black">$199</span>
                <span className="text-gray-500 font-mono text-sm uppercase">/mo</span>
              </div>
              <p className="text-xs text-gray-500 font-mono mb-10 uppercase tracking-wide">Billed monthly or annually</p>
              
              <Button className="w-full bg-growmax-red hover:bg-growmax-black text-white rounded-none h-14 font-bold text-lg transition-colors">
                Initialize Trial
              </Button>
              <p className="text-[10px] text-center text-gray-400 font-mono uppercase mt-4">14-day validation · No CC required</p>
            </div>
            
            {/* Right/Features Section */}
            <div className="md:w-3/5 p-6 md:p-16">
              <div className="font-mono text-xs text-growmax-red uppercase mb-6 tracking-widest font-bold">System Capabilities</div>
              
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 font-mono text-sm text-gray-700">
                {[
                  "5 User Seats Included",
                  "Inventory Engine",
                  "Sales Rep App (iOS/Android)",
                  "Customer Ordering Portal",
                  "Catalog Management",
                  "Order Tracking Logic",
                  "Native Zoho Integration",
                  "Reporting Dashboards",
                  "Standard Support SLA"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-gray-100 pb-2">
                    <Check className="w-4 h-4 text-growmax-red shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 bg-gray-50 border border-gray-200 p-4 flex items-start gap-4">
                 <Info className="w-5 h-5 text-gray-400 shrink-0"/>
                 <div>
                   <p className="text-sm font-bold text-growmax-black">Scale Variables</p>
                   <p className="text-xs text-gray-600 mt-1">Additional user seats require $29/user/month.<br/>Require ERP/SAP integration? <a href="/revenue-platform" className="text-growmax-red font-bold hover:underline">Deploy Enterprise.</a></p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical FAQ */}
      <section className="py-24 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-12 border-l-2 border-growmax-red pl-4">
             System FAQ
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                q: "Trial Termination Logic?",
                a: "If validated, input payment details to continue. If rejected, the instance is paused. No auto-charges occur."
              },
              {
                q: "Deployment Prerequisites?",
                a: "Zero technical overhead. The interface is engineered for business operators. If you map logic in Excel, you can operate ARC."
              },
              {
                q: "Zoho Architecture?",
                a: "Direct API sync with Zoho Inventory. Orders inject to Zoho, and inventory states propagate to ARC continuously."
              },
              {
                q: "Data Portability?",
                a: "Full export capabilities. Your catalog, order history, and customer matrices remain under your ownership."
              }
            ].map((faq, i) => (
              <div key={i} className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-bold text-growmax-black mb-3 tracking-tight">{faq.q}</h4>
                <p className="text-gray-600 font-light text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}