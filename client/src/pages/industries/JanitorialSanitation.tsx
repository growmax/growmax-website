import { Link } from "wouter";
import { ArrowRight, SprayCan, Truck, DollarSign, Users, ShieldCheck, CheckSquare, MapPin, Package, ClipboardList, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";
import WhichGrowmax from "@/components/ui/WhichGrowmax";

const painPoints = [
  {
    icon: DollarSign,
    title: "Contract-Based Pricing Complexity",
    problem: "Facility management companies, school districts, and healthcare systems all have negotiated contract pricing — but your team manages it across disconnected spreadsheets.",
    solution: "Growmax's contract pricing engine handles customer-specific rates, GPO pricing, government contract tiers, and volume-based discounts. Every account sees their exact negotiated price automatically."
  },
  {
    icon: RefreshCw,
    title: "Auto-Replenishment Demand",
    problem: "Janitorial customers need regular replenishment of consumables — paper products, chemicals, liners — but reordering is manual and error-prone.",
    solution: "Automated reorder schedules with customizable frequencies per account. Par-level alerts, subscription ordering, and one-click reorder from previous orders built into the portal."
  },
  {
    icon: Users,
    title: "Multi-Location Account Management",
    problem: "Large accounts like hotel chains, school districts, and hospital systems have dozens of delivery locations with different product needs and budgets.",
    solution: "Hierarchical account management with location-level ordering, consolidated billing, location-specific catalogs, and budget controls per site. One parent account, unlimited ship-to locations."
  },
  {
    icon: Package,
    title: "Case Pack & Pallet Ordering",
    problem: "Customers order in cases, pallets, and each — but your system can't handle mixed UOM ordering or minimum case-pack requirements.",
    solution: "Flexible UOM management with automatic conversions between each, case, and pallet quantities. Minimum order quantities, case-pack enforcement, and mixed-load optimization built in."
  },
  {
    icon: ShieldCheck,
    title: "SDS & Compliance Documentation",
    problem: "Chemical cleaning products require Safety Data Sheets and compliance documentation — but customers can't find them when OSHA auditors arrive.",
    solution: "Integrated SDS library with automatic document attachment to chemical product orders. Customers access compliance docs directly from their order history and product pages."
  },
  {
    icon: Truck,
    title: "Route-Based Delivery",
    problem: "Your delivery routes are planned manually, and customers can't see when their order will arrive or track delivery status.",
    solution: "Route-based delivery scheduling with customer-facing delivery windows, order tracking, and proof-of-delivery confirmation. Optimize routes across multiple stops per day."
  }
];

const regions = [
  { state: "Texas", cities: "Houston, Dallas-Fort Worth, San Antonio, Austin", note: "Massive commercial & institutional cleaning market" },
  { state: "Florida", cities: "Miami, Tampa, Orlando, Jacksonville", note: "Hospitality-driven janitorial demand year-round" },
  { state: "California", cities: "Los Angeles, San Francisco, San Diego", note: "Largest state market with strict green cleaning mandates" },
  { state: "New York", cities: "New York City, Buffalo, Albany", note: "Dense commercial facility management market" },
  { state: "Illinois", cities: "Chicago, Springfield, Naperville", note: "Major Midwest distribution hub" },
  { state: "Georgia", cities: "Atlanta, Savannah, Augusta", note: "Southeast janitorial distribution center" }
];

const products = [
  "Cleaning Chemicals",
  "Paper Products & Dispensers",
  "Trash Liners & Receptacles",
  "Floor Care Equipment",
  "Restroom Supplies",
  "Hand Hygiene Products",
  "Disinfectants & Sanitizers",
  "Mops, Brooms & Brushes",
  "Skin Care & Dispensers",
  "Green Cleaning Products"
];

const faqs = [
  {
    question: "How does Growmax handle contract pricing for janitorial accounts?",
    answer: "Growmax supports unlimited contract pricing tiers including GPO pricing, government contracts, and customer-specific negotiated rates. Each account automatically sees their contracted prices when they log in, with support for tiered volume discounts and time-limited promotional pricing."
  },
  {
    question: "Can customers set up automatic reorders for consumable products?",
    answer: "Yes. Growmax offers automated replenishment with customizable reorder schedules per product and account. Customers can set par levels, subscription frequencies, and one-click reorder from previous orders to ensure they never run out of essential supplies."
  },
  {
    question: "How does multi-location ordering work for large accounts?",
    answer: "Growmax supports hierarchical account structures where a parent account (like a hotel chain or school district) can manage ordering for dozens of individual locations. Each location can have its own catalog, budget, and delivery schedule while billing consolidates at the parent level."
  },
  {
    question: "Does Growmax provide SDS documentation for chemical products?",
    answer: "Absolutely. Growmax includes an integrated SDS library that automatically attaches Safety Data Sheets to chemical product orders. Customers can access compliance documentation directly from product pages and order history for OSHA audit readiness."
  },
  {
    question: "Can Growmax integrate with our route-based delivery system?",
    answer: "Yes. Growmax supports route-based delivery scheduling with customer-facing delivery windows, real-time order tracking, and proof-of-delivery confirmation. The platform can integrate with existing route optimization software via API."
  }
];

export default function JanitorialSanitation() {
  const structuredData = [
    webPageSchema({
      title: "B2B eCommerce for Janitorial & Sanitation Distributors",
      description: "Revenue operations platform for janitorial and sanitation distributors. Contract pricing, auto-replenishment, multi-location accounts, and SDS compliance.",
      path: "/industries/janitorial-sanitation",
      keywords: [
        "B2B ecommerce janitorial distributors",
        "sanitation supply ordering platform",
        "janitorial wholesale portal",
        "cleaning supply distribution software",
        "jan-san distributor ecommerce",
        "facility management ordering system"
      ]
    }),
    faqPageSchema({
      title: "Janitorial & Sanitation Distribution FAQ",
      path: "/industries/janitorial-sanitation",
      faqs
    })
  ];

  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B eCommerce for Janitorial & Sanitation Distributors | Growmax"
        description="Revenue operations platform for janitorial and sanitation distributors. Contract pricing, auto-replenishment, multi-location ordering, and SDS compliance for jan-san wholesale."
        path="/industries/janitorial-sanitation"
        structuredData={structuredData}
      />

      <section className="pt-24 pb-24 border-b border-gray-200 bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="mb-6">
                <Breadcrumbs items={[
                  { label: "Industries" },
                  { label: "Janitorial & Sanitation" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-industry-label">
                Industry // Janitorial & Sanitation Distribution
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                Revenue Operations<br />
                for Jan-San<br />
                <span className="text-growmax-red">Distributors.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                From cleaning chemicals to paper products — the connected platform that handles contract pricing, auto-replenishment, multi-location accounts, and compliance documentation for janitorial and sanitation wholesale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-8 text-lg rounded-none transition-colors duration-300 font-bold tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5" data-testid="button-request-demo">
                    Request Industry Demo <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block bg-growmax-gray border-2 border-growmax-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-growmax-red animate-pulse"></div>
              </div>
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Jan-San Distribution Stack</div>
              <div className="space-y-3">
                <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm uppercase tracking-tight">
                  Facility Managers • BSCs • Healthcare Systems
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Self-Order Portal</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Auto-Replenish</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Multi-Location</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="border border-growmax-black bg-growmax-black text-white p-4 flex justify-between items-center font-mono">
                  <div className="text-[10px] uppercase w-1/4 text-center">Pricing</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Reorder</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Catalog</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Compliance</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-2 gap-3 font-mono text-growmax-black">
                  <div className="border-2 border-growmax-black bg-white p-3 text-center font-bold text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">SAP / ERP</div>
                  <div className="border-2 border-growmax-black bg-white p-3 text-center font-bold text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Zoho CRM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-growmax-black text-white border-b-4 border-growmax-red">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 font-mono text-xs uppercase tracking-widest" data-testid="text-product-categories">
            {products.map((product, i) => (
              <div key={i} className="flex items-center gap-2">
                <SprayCan className="w-3 h-3 text-growmax-red" />
                <span className="text-gray-300">{product}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-growmax-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Pain Points // Solutions</div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-6 uppercase" data-testid="text-painpoints-title">
              We Know Jan-San Distribution
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges every janitorial and sanitation distributor faces — and how Growmax solves each one.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {painPoints.map((point, i) => (
              <div key={i} className="bg-white border-2 border-growmax-black p-6 md:p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid={`card-painpoint-${i}`}>
                <point.icon className="w-12 h-12 text-growmax-red mb-6" />
                <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase">{point.title}</h3>
                <div className="space-y-4 text-gray-600 font-light">
                  <p className="line-through decoration-gray-400 font-mono text-sm text-gray-400">{point.problem}</p>
                  <p className="font-mono text-sm bg-growmax-black text-white p-3 border-l-4 border-growmax-red">{point.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white border-t-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5">
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Case Study // Regional Distributor</div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-casestudy-title">Jan-San Distributor Goes Digital</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                A regional janitorial supply distributor serving 2,000+ commercial accounts needed to digitize their ordering process and automate replenishment for recurring customers across hospitality, healthcare, and education segments.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Growmax deployed a self-service ordering portal with auto-replenishment, multi-location account hierarchies, and integrated SDS documentation. Customers now self-serve 70% of repeat orders, and reorder accuracy improved by 35%.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-orders">↑ 50%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Online Order Volume</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-calls">↓ 60%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Manual Order Entry</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Why Jan-San Distributors Choose Growmax</div>
              <div className="space-y-6">
                {[
                  "Contract-specific pricing with GPO and government contract support",
                  "Automated replenishment with customizable reorder schedules per account",
                  "Multi-location account hierarchies with location-level ordering and budgets",
                  "Integrated SDS library with automatic compliance documentation",
                  "Case-pack and pallet ordering with automatic UOM conversions",
                  "Route-based delivery scheduling with customer-facing tracking",
                  "One-click reorder from previous orders for fast repeat purchasing",
                  "Native ERP integration with real-time pricing and inventory sync"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-gray-300 pb-4">
                    <CheckSquare className="w-5 h-5 text-growmax-red shrink-0 mt-0.5" />
                    <span className="text-sm font-mono text-growmax-black uppercase tracking-wide">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-growmax-black text-white bg-dots-dark">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Where Our Customers Operate</div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 uppercase" data-testid="text-regional-title">
              Jan-San Distribution<br/>Across America
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Purpose-built for the janitorial and sanitation distribution markets serving commercial facilities across America.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {regions.map((region, i) => (
              <div key={i} className="border border-gray-700 bg-white/5 p-6 hover:border-growmax-red transition-colors duration-300" data-testid={`card-region-${i}`}>
                <div className="flex items-center gap-3 mb-3">
                  <MapPin className="w-5 h-5 text-growmax-red" />
                  <h3 className="font-bold text-xl uppercase tracking-tight">{region.state}</h3>
                </div>
                <p className="text-sm text-gray-400 font-mono mb-2">{region.cities}</p>
                <p className="text-xs text-growmax-red uppercase tracking-widest font-bold">{region.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">FAQ</div>
            <h2 className="text-4xl font-bold tracking-tighter text-growmax-black uppercase mb-4" data-testid="text-faq-title">Frequently Asked Questions</h2>
            <div className="w-16 h-2 bg-growmax-red"></div>
          </div>
          <div className="max-w-3xl mx-auto space-y-8" data-testid="section-faq">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-6" data-testid={`faq-item-${i}`}>
                <h3 className="text-lg font-bold tracking-tight mb-3">{faq.question}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t-2 border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Janitorial & Sanitation Distribution Keywords We Serve</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "B2B ecommerce janitorial distributors",
              "sanitation supply ordering platform",
              "janitorial wholesale portal",
              "jan-san distributor ecommerce",
              "cleaning supply distribution software",
              "facility management ordering system",
              "janitorial auto-replenishment platform",
              "commercial cleaning supply wholesale",
              "jan-san distributor ERP integration",
              "BSC ordering portal"
            ].map((keyword, i) => (
              <span key={i} className="border border-growmax-black px-3 py-1 font-mono text-xs uppercase tracking-widest text-gray-600 hover:bg-growmax-black hover:text-white transition-colors cursor-default">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-t-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Related Architecture</div>
            <h2 className="text-4xl font-bold tracking-tighter text-growmax-black uppercase mb-4" data-testid="text-related-title">See Also</h2>
            <div className="w-16 h-2 bg-growmax-red"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8" data-testid="section-related-links">
            <Link href="/revenue-platform">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-revenue-platform">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Platform</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Revenue Platform</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Enterprise B2B commerce with native ERP integration, multi-warehouse orchestration, and CPQ engine.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Explore Platform <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>
            <Link href="/industries/building-materials">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-building-materials">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Industry</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Building Materials</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Project-based pricing, contractor portals, and bulk ordering for building materials distribution.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Explore Industry <ArrowRight className="w-3 h-3" /></div>
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
          </div>
        </div>
      </section>

      <WhichGrowmax industry="Jan-San" />
    </div>
  );
}