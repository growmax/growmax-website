import { CheckCircle2, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-arc-surface">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-growmax-black mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Everything you need to run your distribution business digitally. No hidden fees.</p>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="pb-24 px-4 -mt-8 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col md:flex-row">
            
            {/* Left/Top Section */}
            <div className="md:w-2/5 bg-gray-50 p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-200">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-arc-accent text-sm font-bold mb-6 w-max">
                GROWMAX ARC
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-growmax-black">$199</span>
                <span className="text-gray-500 font-medium text-lg">/month</span>
              </div>
              <p className="text-gray-600 mb-8 font-medium">Billed monthly or annually.</p>
              
              <Button className="w-full bg-growmax-red hover:bg-growmax-red-dark text-white border-0 h-14 text-lg rounded-xl shadow-lg shadow-growmax-red/20 mb-4">
                Start Free Trial
              </Button>
              <p className="text-sm text-center text-gray-500 font-medium">14-day free trial · No credit card required</p>
            </div>
            
            {/* Right/Bottom Section */}
            <div className="md:w-3/5 p-8 md:p-12">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Everything you need to digitize:</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "5 user seats included",
                  "Inventory management",
                  "Sales rep mobile app (iOS/Android)",
                  "Customer self-ordering portal",
                  "Product catalog management",
                  "Order tracking & history",
                  "Zoho integration",
                  "Basic reporting & analytics",
                  "Email support"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center text-gray-600">
             <p className="mb-2">Need more users? <span className="font-bold text-gray-900">$29/user/month</span> for additional seats.</p>
             <p>Need enterprise features? <a href="/revenue-platform" className="text-growmax-red font-medium hover:underline">Check out Revenue Platform.</a></p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-growmax-black mb-4">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-6">
            {[
              {
                q: "What happens after my 14-day trial?",
                a: "If you love it, you can enter your credit card details to continue. If not, your account will be paused. You will not be charged automatically."
              },
              {
                q: "Do I need technical skills to set it up?",
                a: "Not at all. We designed ARC specifically for business owners. If you can use WhatsApp and Excel, you can use ARC."
              },
              {
                q: "How does the Zoho integration work?",
                a: "We have a native, two-way sync with Zoho Inventory. Orders placed in ARC automatically push to Zoho, and inventory changes in Zoho reflect in ARC instantly."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-gray-400" /> {faq.q}
                </h4>
                <p className="text-gray-600 ml-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}