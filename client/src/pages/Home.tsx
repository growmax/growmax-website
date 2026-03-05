import { Link } from "wouter";
import { ArrowRight, CheckCircle2, ChevronRight, BarChart3, Users, Settings, Smartphone, ShoppingCart, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section - CRITICAL SPLIT PATTERN */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-growmax-black mb-6">
              Drive Revenue and Customer Loyalty with Digital Experience Solutions
            </h1>
            <p className="text-xl text-gray-600">
              From enterprise manufacturers to growing distributors — Growmax powers your B2B commerce.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Enterprise Product Card */}
            <div className="group relative bg-enterprise-bg rounded-2xl p-8 md:p-12 shadow-xl border border-gray-800 flex flex-col items-start transition-transform hover:-translate-y-1 duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-growmax-red/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
              
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium mb-6">
                Enterprise
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                REVENUE PLATFORM
              </h2>
              
              <p className="text-gray-300 text-lg mb-8 min-h-[80px]">
                For manufacturers & enterprises that need dealer portals, partner commerce & sales automation.
              </p>
              
              <div className="space-y-3 mb-10 text-gray-300">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-growmax-red" /> SAP & ERP Integration</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-growmax-red" /> Dealer & Partner Portals</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-growmax-red" /> Quote-to-Order Automation</div>
              </div>
              
              <div className="mt-auto w-full">
                <p className="text-sm text-gray-400 mb-4">Trusted by Siemens, Schwing Stetter & more</p>
                <Link href="/demo">
                  <Button className="w-full bg-growmax-red hover:bg-growmax-red-dark text-white border-0 h-14 text-lg">
                    Book a Demo <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* ARC Product Card */}
            <div className="group relative bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200 flex flex-col items-start transition-transform hover:-translate-y-1 duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-arc-surface to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
              
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-arc-surface text-arc-accent text-xs font-medium mb-6">
                SMB / Mid-Market
              </div>
              
              <h2 className="text-3xl font-bold text-growmax-black mb-4">
                GROWMAX ARC
              </h2>
              
              <p className="text-gray-600 text-lg mb-8 min-h-[80px]">
                For distributors & wholesalers ready to ditch WhatsApp & Excel.
              </p>
              
              <div className="space-y-3 mb-10 text-gray-600">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-arc-accent" /> Inventory Management</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-arc-accent" /> Sales Rep Mobile App</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-arc-accent" /> Customer Ordering Portal</div>
              </div>
              
              <div className="mt-auto w-full">
                <p className="text-sm font-medium text-growmax-black mb-4">Starting at $199/month</p>
                <Link href="/arc">
                  <Button className="w-full bg-growmax-red hover:bg-growmax-red-dark text-white border-0 h-14 text-lg">
                    Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Social Proof Bar */}
      <section className="py-10 border-y border-gray-100 bg-white">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <p className="text-sm font-medium text-gray-500 mb-8 uppercase tracking-widest">
            Trusted by leading manufacturers across 5+ countries
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-2xl font-bold font-serif">SIEMENS</div>
            <div className="text-2xl font-bold italic">Schwing Stetter</div>
            <div className="text-2xl font-black text-orange-600">OBO</div>
            <div className="text-2xl font-bold text-red-600">Shell</div>
          </div>
        </div>
      </section>

      {/* 3. One Platform, Two Solutions */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-growmax-black">One Platform, Two Solutions</h2>
            <p className="mt-4 text-xl text-gray-600">Purpose-built for your specific business model.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Revenue Platform Features */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-enterprise-bg mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-enterprise-bg flex items-center justify-center text-white text-sm">1</div>
                Revenue Platform Features
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex flex-shrink-0 items-center justify-center font-bold">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Dealer Portal</h4>
                    <p className="text-sm text-gray-500">Branded portals for your entire dealer network</p>
                  </div>
                </li>
                <li className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex flex-shrink-0 items-center justify-center font-bold">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Spares Portal</h4>
                    <p className="text-sm text-gray-500">Smart catalog with diagram search and bulk ordering</p>
                  </div>
                </li>
                <li className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex flex-shrink-0 items-center justify-center font-bold">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Quote-to-Order</h4>
                    <p className="text-sm text-gray-500">Complex pricing, approvals, and contract management</p>
                  </div>
                </li>
              </ul>
              <Link href="/revenue-platform" className="mt-6 inline-flex items-center text-growmax-red font-medium hover:underline">
                Explore Enterprise Features <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* ARC Features */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-growmax-black mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-arc-accent flex items-center justify-center text-white text-sm">2</div>
                Growmax ARC Features
              </h3>
              <ul className="space-y-4">
                <li className="flex gap-4 p-4 rounded-xl hover:bg-orange-50/50 transition-colors border border-transparent hover:border-orange-100 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-600 flex flex-shrink-0 items-center justify-center font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Inventory Management</h4>
                    <p className="text-sm text-gray-500">Real-time stock tracking across multiple warehouses</p>
                  </div>
                </li>
                <li className="flex gap-4 p-4 rounded-xl hover:bg-orange-50/50 transition-colors border border-transparent hover:border-orange-100 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-600 flex flex-shrink-0 items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sales Rep App</h4>
                    <p className="text-sm text-gray-500">Mobile app for reps to take orders on the go</p>
                  </div>
                </li>
                <li className="flex gap-4 p-4 rounded-xl hover:bg-orange-50/50 transition-colors border border-transparent hover:border-orange-100 cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex flex-shrink-0 items-center justify-center font-bold">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Customer Ordering</h4>
                    <p className="text-sm text-gray-500">Self-service portal for your B2B customers</p>
                  </div>
                </li>
              </ul>
              <Link href="/arc" className="mt-6 inline-flex items-center text-growmax-red font-medium hover:underline">
                Explore ARC Features <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Key Metrics */}
      <section className="py-20 bg-enterprise-bg text-white relative overflow-hidden">
        {/* Abstract background element */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-growmax-red rounded-full opacity-5 blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-blue-500 rounded-full opacity-5 blur-3xl" />
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-800">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-growmax-red mb-2">7+</div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Years in Production</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-growmax-red mb-2">50k+</div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">SKUs Managed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-growmax-red mb-2">90%</div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Digital Adoption</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-growmax-red mb-2">50%</div>
              <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">Faster Cycles</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customer Testimonial Cards */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-growmax-black">Trusted by Industry Leaders</h2>
          </div>
          
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-3xl p-8 md:p-12 relative">
            <svg className="absolute top-8 left-8 text-gray-200 w-16 h-16 transform -translate-x-4 -translate-y-4" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-8">
                "Over 90% of transactions are done through this platform. By automating the customer quotation & approval process, the quote-to-order process helped us achieve 50% more organizational speed & higher visibility."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-orange-600 text-xl">
                  OBO
                </div>
                <div>
                  <div className="font-bold text-growmax-black">OBO Bettermann</div>
                  <div className="text-sm text-gray-500">Enterprise Manufacturer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. How It Works */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-growmax-black">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">Get up and running faster than you think.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto">
            {/* Revenue Platform Workflow */}
            <div>
              <h3 className="text-xl font-bold text-enterprise-bg mb-8">Revenue Platform</h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-enterprise-bg text-white font-bold text-sm shadow shrink-0 z-10">
                    1
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:mr-10 md:group-odd:ml-10 md:group-odd:mr-0 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900">Connect ERP</h4>
                    <p className="text-sm text-gray-500 mt-1">Integrate SAP, Dynamics, or custom ERPs securely.</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-enterprise-bg text-white font-bold text-sm shadow shrink-0 z-10">
                    2
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:mr-10 md:group-odd:ml-10 md:group-odd:mr-0 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900">Configure Portals</h4>
                    <p className="text-sm text-gray-500 mt-1">Set up pricing, catalogs, and user roles.</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-growmax-red text-white font-bold text-sm shadow shrink-0 z-10">
                    3
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:mr-10 md:group-odd:ml-10 md:group-odd:mr-0 p-4 rounded-xl bg-white shadow-sm border border-growmax-red-light bg-growmax-red-light/30">
                    <h4 className="font-bold text-growmax-red-dark">Go Live in Weeks</h4>
                    <p className="text-sm text-gray-600 mt-1">Not months or years.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ARC Workflow */}
            <div>
              <h3 className="text-xl font-bold text-growmax-black mb-8">Growmax ARC</h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-800 text-white font-bold text-sm shadow shrink-0 z-10">
                    1
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:mr-10 md:group-odd:ml-10 md:group-odd:mr-0 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900">Sign Up</h4>
                    <p className="text-sm text-gray-500 mt-1">Create account & optionally sync with Zoho.</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-gray-800 text-white font-bold text-sm shadow shrink-0 z-10">
                    2
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:mr-10 md:group-odd:ml-10 md:group-odd:mr-0 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                    <h4 className="font-bold text-gray-900">Import Catalog</h4>
                    <p className="text-sm text-gray-500 mt-1">Upload via Excel or sync directly.</p>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-arc-accent text-white font-bold text-sm shadow shrink-0 z-10">
                    3
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] ml-4 md:ml-0 md:mr-10 md:group-odd:ml-10 md:group-odd:mr-0 p-4 rounded-xl bg-white shadow-sm border border-orange-200 bg-orange-50">
                    <h4 className="font-bold text-orange-800">Start Selling</h4>
                    <p className="text-sm text-orange-600 mt-1">Invite reps and customers.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Blog Preview Placeholder */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-growmax-black">Latest from the Blog</h2>
              <p className="mt-2 text-gray-600">Insights for B2B commerce success.</p>
            </div>
            <Link href="/blog" className="hidden md:inline-flex items-center text-growmax-red font-medium hover:underline">
              View all posts <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Bridging the Digital Gap: Why Industrial Brands Need a Partner Engagement Strategy", date: "Jan 2025" },
              { title: "Opportunity Pipeline Management for Industrial Businesses", date: "April 2025" },
              { title: "Why an Offline Order-Taking App is Essential for FMCG", date: "May 2025" }
            ].map((post, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-[16/9] bg-gray-100 rounded-xl mb-4 overflow-hidden">
                  <div className="w-full h-full bg-gray-200 transition-transform duration-300 group-hover:scale-105" />
                </div>
                <div className="text-sm text-growmax-red font-medium mb-2">{post.date}</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-growmax-red transition-colors line-clamp-2">
                  {post.title}
                </h3>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
             <Link href="/blog" className="inline-flex items-center text-growmax-red font-medium hover:underline">
              View all posts <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Final Split CTA Section */}
      <section className="py-24 bg-gradient-to-br from-enterprise-bg to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to digitize your operations?</h2>
            <p className="text-xl text-gray-300">Choose the path that fits your business model.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-4xl mx-auto">
             <div className="w-full md:w-1/2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
               <h3 className="text-2xl font-bold mb-2">Manufacturers</h3>
               <p className="text-gray-400 mb-6 h-12">Complex pricing, ERP integration, multiple portals.</p>
               <Link href="/demo">
                  <Button className="w-full bg-growmax-red hover:bg-growmax-red-dark text-white border-0 h-12 text-base">
                    Book an Enterprise Demo
                  </Button>
                </Link>
             </div>
             
             <div className="w-full md:w-1/2 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
               <h3 className="text-2xl font-bold mb-2">Distributors</h3>
               <p className="text-gray-400 mb-6 h-12">Fast setup, mobile apps, clear pricing.</p>
               <Link href="/arc">
                  <Button className="w-full bg-white text-growmax-black hover:bg-gray-100 border-0 h-12 text-base font-semibold">
                    Start ARC Free Trial
                  </Button>
                </Link>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}