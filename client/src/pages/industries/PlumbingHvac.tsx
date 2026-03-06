import { Link } from "wouter";
import { ArrowRight, Droplets, Thermometer, Truck, DollarSign, Users, ShieldCheck, CheckSquare, MapPin, Wrench, Package, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";

const painPoints = [
  {
    icon: DollarSign,
    title: "Contractor-Tier Pricing Complexity",
    problem: "Licensed plumbers and HVAC contractors expect different pricing tiers based on volume, project size, and account history — but your system treats everyone the same.",
    solution: "Growmax's multi-tier pricing engine handles contractor-specific rates, volume brackets, project-bid pricing, and seasonal promotions. Every contractor sees their negotiated price automatically."
  },
  {
    icon: Truck,
    title: "Multi-Branch Inventory Chaos",
    problem: "Stock across multiple branches and warehouses with no real-time visibility leads to emergency transfers and lost sales on time-sensitive HVAC jobs.",
    solution: "Real-time inventory orchestration across all branch locations with intelligent allocation, geographic zone management, and automated stock transfer recommendations."
  },
  {
    icon: Users,
    title: "Plumber vs. HVAC Contractor Portals",
    problem: "Plumbing contractors need pipe, fittings, and fixtures while HVAC contractors need ductwork, refrigerant, and equipment — but they share the same clunky ordering system.",
    solution: "Role-based portals with segment-specific catalogs, pricing tiers, and ordering workflows. Plumbing contractors see their products. HVAC contractors see theirs. Zero confusion."
  },
  {
    icon: Wrench,
    title: "Technical Specification Matching",
    problem: "Contractors need exact pipe sizes, fitting types, BTU ratings, and SEER specifications — but your catalog search can't filter by technical attributes.",
    solution: "Advanced parametric search with technical attribute filtering. Find the right copper fitting, PVC coupling, or HVAC unit by exact specifications in seconds."
  },
  {
    icon: ClipboardList,
    title: "Quote-Heavy Project Sales",
    problem: "Rough-in packages and HVAC system quotes take days to assemble — by the time you respond, the contractor has sourced from a competitor.",
    solution: "CPQ engine with pre-configured product bundles for common plumbing rough-ins and HVAC installations. Generate accurate quotes in minutes with automated margin protection."
  },
  {
    icon: Package,
    title: "Will-Call & Job-Site Delivery",
    problem: "Contractors need flexible fulfillment — will-call pickups at the counter, staged job-site deliveries, and emergency same-day orders — but your system only handles standard shipping.",
    solution: "Flexible fulfillment with will-call reservations, job-site delivery scheduling, counter pickup notifications, and emergency order fast-tracking built in."
  }
];

const regions = [
  { state: "Texas", cities: "Houston, Dallas-Fort Worth, San Antonio, Austin", note: "Largest HVAC market — extreme heat drives year-round demand" },
  { state: "Florida", cities: "Miami, Tampa, Orlando, Jacksonville", note: "Year-round HVAC demand with rapid construction growth" },
  { state: "Arizona", cities: "Phoenix, Tucson, Scottsdale", note: "Desert climate drives massive HVAC replacement market" },
  { state: "Georgia", cities: "Atlanta, Savannah, Augusta", note: "Southeast plumbing & HVAC distribution hub" },
  { state: "California", cities: "Los Angeles, San Diego, Sacramento", note: "Largest state market with strict efficiency codes" },
  { state: "North Carolina", cities: "Charlotte, Raleigh-Durham", note: "Fast-growing residential construction corridor" }
];

const products = [
  "Copper Pipe & Fittings",
  "PVC & CPVC Systems",
  "HVAC Equipment & Units",
  "Ductwork & Ventilation",
  "Water Heaters & Boilers",
  "Valves & Controls",
  "Refrigerant & Supplies",
  "Plumbing Fixtures",
  "Insulation & Sealants",
  "Tools & Safety Equipment"
];

const faqs = [
  {
    question: "How does Growmax handle plumbing and HVAC pricing tiers?",
    answer: "Growmax supports unlimited pricing tiers based on contractor type, volume brackets, project bids, and account history. Licensed plumbers, HVAC contractors, and general contractors each see their negotiated prices automatically upon login."
  },
  {
    question: "Can contractors order both plumbing and HVAC products from one portal?",
    answer: "Yes. Growmax supports multi-catalog ordering where contractors can browse plumbing supplies and HVAC equipment in a unified portal, with segment-specific pricing applied automatically to each product category."
  },
  {
    question: "Does Growmax support will-call and job-site delivery?",
    answer: "Absolutely. Growmax offers flexible fulfillment options including will-call counter pickup with reservation notifications, scheduled job-site deliveries, and emergency same-day order fast-tracking."
  },
  {
    question: "How does inventory work across multiple branch locations?",
    answer: "Growmax provides real-time inventory visibility across all branch and warehouse locations. Contractors can check stock at their nearest branch, and the system automatically suggests transfers or alternative locations when items are out of stock."
  },
  {
    question: "Can Growmax integrate with our existing ERP system?",
    answer: "Yes. Growmax offers native integration with SAP, Oracle, and other major ERPs via bidirectional API connections. Pricing, inventory, and order data sync in real-time without middleware."
  }
];

export default function PlumbingHvac() {
  const structuredData = [
    webPageSchema({
      title: "B2B eCommerce for Plumbing & HVAC Distributors",
      description: "Revenue operations platform for plumbing and HVAC distributors. Contractor pricing tiers, multi-branch inventory, will-call ordering, and ERP integration.",
      path: "/industries/plumbing-hvac",
      keywords: [
        "B2B ecommerce plumbing distributors",
        "HVAC distributor ordering platform",
        "plumbing wholesale portal",
        "HVAC parts ordering system",
        "plumbing contractor portal",
        "HVAC distribution software"
      ]
    }),
    faqPageSchema({
      title: "Plumbing & HVAC Distribution FAQ",
      path: "/industries/plumbing-hvac",
      faqs
    })
  ];

  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B eCommerce for Plumbing & HVAC Distributors | Growmax"
        description="Revenue operations platform for plumbing and HVAC distributors. Contractor pricing tiers, multi-branch inventory, will-call ordering, and ERP integration for plumbing and HVAC wholesale."
        path="/industries/plumbing-hvac"
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
                  { label: "Plumbing & HVAC" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-industry-label">
                Industry // Plumbing & HVAC Distribution
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                Revenue Operations<br />
                for Plumbing & HVAC<br />
                <span className="text-growmax-red">Distributors.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                From copper fittings to HVAC systems — the connected platform that handles contractor self-ordering, will-call pickups, multi-branch inventory, and project-based quoting for plumbing and HVAC wholesale.
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
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Plumbing & HVAC Distribution Stack</div>
              <div className="space-y-3">
                <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm uppercase tracking-tight">
                  Plumbers • HVAC Contractors • Mechanical Engineers
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Self-Order Portal</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Field Sales App</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Will-Call Portal</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="border border-growmax-black bg-growmax-black text-white p-4 flex justify-between items-center font-mono">
                  <div className="text-[10px] uppercase w-1/4 text-center">Pricing</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Quotes</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Catalog</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Inventory</div>
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
                <Droplets className="w-3 h-3 text-growmax-red" />
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
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-6 uppercase" data-testid="text-painpoints-title">
              We Know Plumbing & HVAC Distribution
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges every plumbing and HVAC distributor faces — and how Growmax solves each one.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {painPoints.map((point, i) => (
              <div key={i} className="bg-white border-2 border-growmax-black p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid={`card-painpoint-${i}`}>
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
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-casestudy-title">Plumbing & HVAC Distributor Goes Digital</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                A multi-branch plumbing and HVAC distributor with 18 locations across the Sun Belt needed to digitize their contractor ordering process and streamline will-call operations across their pipe, fittings, and equipment divisions.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Growmax deployed a connected contractor portal with will-call reservations, multi-branch inventory visibility, and project-based quoting. Contractors now self-serve 65% of repeat orders via the portal and mobile app.
                </p>
              </div>
              <div className="flex gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-orders">↑ 35%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Online Order Volume</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-calls">↓ 45%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Counter Wait Time</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Why Plumbing & HVAC Distributors Choose Growmax</div>
              <div className="space-y-6">
                {[
                  "Contractor-specific pricing with volume brackets and project-bid rates",
                  "Will-call reservation system with counter pickup notifications",
                  "Multi-branch inventory visibility across all locations in real-time",
                  "Technical attribute filtering for pipe sizes, BTU ratings, and SEER specs",
                  "Offline-capable field sales app for on-site order capture",
                  "CPQ engine for plumbing rough-in packages and HVAC system quotes",
                  "Contractor self-service portal reducing counter traffic by 45%+",
                  "Native ERP integration with real-time pricing and ATP checks"
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
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Regional Focus</div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 uppercase" data-testid="text-regional-title">
              Sun Belt & High-Growth Markets
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Purpose-built for the plumbing and HVAC distribution markets driving America's construction and retrofit boom.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Plumbing & HVAC Distribution Keywords We Serve</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "B2B ecommerce plumbing distributors",
              "HVAC distributor ordering platform",
              "plumbing wholesale portal",
              "HVAC parts ordering system",
              "plumbing contractor portal",
              "HVAC distribution software",
              "plumbing supply will-call system",
              "HVAC equipment wholesale platform",
              "plumbing distributor ERP integration",
              "mechanical contractor ordering portal"
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
            <Link href="/industries/electrical-distributors">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-electrical-distributors">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Industry</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Electrical Distributors</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Multi-tier pricing, multi-warehouse inventory, and contractor portals for electrical wholesale distribution.</p>
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

      <section className="py-32 bg-growmax-black text-white text-center bg-dots-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter uppercase leading-[1.1]" data-testid="text-cta-title">
            Ready to modernize your<br />plumbing & HVAC distribution?
          </h2>
          <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl mx-auto">
            See how Growmax handles your contractor pricing, will-call operations, and multi-branch inventory — live, in 30 minutes.
          </p>
          <Link href="/demo">
            <Button className="mt-4 bg-growmax-red hover:bg-white hover:text-growmax-black text-white h-16 px-12 text-lg rounded-none transition-all duration-300 font-bold tracking-widest uppercase border-2 border-transparent hover:border-growmax-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-2 hover:translate-y-2" data-testid="button-schedule-demo">
              Schedule a 30-Min Demo <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}