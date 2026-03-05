import { CheckCircle2, ShieldCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-32 pb-24 bg-enterprise-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Built for the realities of B2B commerce.</h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            Growmax was founded in 2017 with a singular mission: to make digital commerce work for manufacturers and distributors, no matter how complex their operations.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-growmax-black mb-6">Deep Roots in Enterprise Technology</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We didn't start by building a generic shopping cart. Our founders spent years at industry giants like Siemens, SAP, and Mindtree, implementing complex ERP systems and seeing firsthand where standard B2C e-commerce platforms failed B2B companies.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Growmax (Apptino Software Private Limited) was built from the ground up to handle custom pricing, complex catalogs, and direct ERP integrations without the massive timeline of traditional enterprise software.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="flex flex-col gap-6">
                 <div className="flex items-start gap-4">
                   <ShieldCheck className="w-8 h-8 text-growmax-red shrink-0" />
                   <div>
                     <h3 className="font-bold text-gray-900 text-lg">Trusted by Shell</h3>
                     <p className="text-gray-600 mt-1">We've transformed operations for over 300 distributors across 50+ countries.</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-4">
                   <MapPin className="w-8 h-8 text-growmax-red shrink-0" />
                   <div>
                     <h3 className="font-bold text-gray-900 text-lg">Global Presence</h3>
                     <p className="text-gray-600 mt-1">Founded in Chennai, India, serving leading manufacturers worldwide.</p>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values/Pillars */}
      <section className="py-24 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-growmax-black">Why leading brands choose Growmax</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-growmax-red/10 text-growmax-red rounded-lg flex items-center justify-center font-bold text-xl mb-6">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Time to Value</h3>
              <p className="text-gray-600">Enterprise commerce shouldn't take 12 months. We get manufacturers live in weeks, not years.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-growmax-red/10 text-growmax-red rounded-lg flex items-center justify-center font-bold text-xl mb-6">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">True B2B DNA</h3>
              <p className="text-gray-600">Quote-to-order, complex approvals, and custom pricing aren't add-ons for us; they're the core of our platform.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-growmax-red/10 text-growmax-red rounded-lg flex items-center justify-center font-bold text-xl mb-6">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Scalable Architecture</h3>
              <p className="text-gray-600">From growing distributors on ARC to global manufacturers on Revenue Platform, we scale with you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-growmax-black mb-6">Ready to see it for yourself?</h2>
          <Button className="bg-growmax-red hover:bg-growmax-red-dark text-white border-0 h-14 px-8 text-lg">
            Talk to our team
          </Button>
        </div>
      </section>
    </div>
  );
}