import { Link } from "wouter";
import { ArrowRight, Beaker, Truck, DollarSign, Users, ShieldCheck, CheckSquare, MapPin, Package, ClipboardList, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";
import WhichGrowmax from "@/components/ui/WhichGrowmax";

const painPoints = [
  {
    icon: ShieldCheck,
    title: "Hazmat & Regulatory Compliance",
    problem: "Chemical distribution requires DOT hazmat classification, SDS management, EPA reporting, and state-specific regulations — but your ordering system doesn't enforce any compliance rules.",
    solution: "Built-in hazmat classification with DOT shipping rules, automated SDS attachment, EPA reporting data capture, and state-specific regulatory compliance enforcement at the point of order."
  },
  {
    icon: DollarSign,
    title: "Contract & Formula-Based Pricing",
    problem: "Chemical prices fluctuate with raw material indices, and customers have formula-based contracts tied to ICIS benchmarks — but your pricing system can't handle index-linked calculations.",
    solution: "Formula-based pricing engine with index linkage to ICIS, Platts, and custom benchmarks. Automatic price adjustments on contract-defined schedules with customer-facing price change notifications."
  },
  {
    icon: Package,
    title: "Packaging & Container Management",
    problem: "Customers order chemicals in drums, totes, tanker loads, and custom blends — but your system can't manage container deposits, returns, or packaging-specific pricing.",
    solution: "Container lifecycle management with deposit tracking, return scheduling, and packaging-specific pricing. Support for drums, IBC totes, ISO tanks, and bulk tanker deliveries with automatic deposit/return calculations."
  },
  {
    icon: Truck,
    title: "Hazmat Shipping & Delivery",
    problem: "Chemical shipments require hazmat placarding, DOT documentation, and special handling — but your delivery system treats chemicals like standard freight.",
    solution: "Integrated hazmat shipping with automated DOT classification, placarding requirements, driver certification verification, and chain-of-custody documentation for every delivery."
  },
  {
    icon: Users,
    title: "Technical Sales & Product Selection",
    problem: "Customers need help selecting the right chemical formulation for their application — but your sales team can't access technical datasheets or application guides in the field.",
    solution: "Technical product catalog with application-based search, TDS/SDS documentation, formulation recommendations, and guided product selection based on end-use requirements."
  },
  {
    icon: AlertTriangle,
    title: "Lot Traceability & Recall Management",
    problem: "FDA, EPA, and customer requirements demand full lot traceability from manufacturer to end-user — but your system can't trace a specific lot through the distribution chain.",
    solution: "Full lot traceability with manufacturer COA attachment, distribution chain tracking, and automated recall notification workflows. Trace any lot from receipt to delivery in seconds."
  }
];

const regions = [
  { state: "Texas", cities: "Houston, Beaumont, Corpus Christi", note: "Gulf Coast chemical corridor — largest US chemical market" },
  { state: "Louisiana", cities: "Baton Rouge, Lake Charles, New Orleans", note: "Petrochemical manufacturing hub with dense chemical distribution" },
  { state: "New Jersey", cities: "Newark, Elizabeth, Trenton", note: "Northeast chemical distribution gateway" },
  { state: "Illinois", cities: "Chicago, Joliet, Rockford", note: "Midwest chemical distribution and blending hub" },
  { state: "California", cities: "Los Angeles, Long Beach, San Francisco", note: "Strict CARB regulations drive specialized chemical handling" },
  { state: "Ohio", cities: "Cleveland, Cincinnati, Akron", note: "Chemical manufacturing and distribution corridor" }
];

const products = [
  "Industrial Solvents",
  "Acids & Bases",
  "Specialty Chemicals",
  "Water Treatment Chemicals",
  "Lubricants & Greases",
  "Adhesives & Sealants",
  "Coatings & Resins",
  "Food-Grade Chemicals",
  "Pharmaceutical Intermediates",
  "Agricultural Chemicals"
];

const faqs = [
  {
    question: "How does Growmax handle hazmat compliance for chemical orders?",
    answer: "Growmax includes built-in DOT hazmat classification that automatically applies shipping rules, generates required documentation, and enforces packaging requirements at the point of order. The system also manages SDS attachment, EPA reporting data capture, and state-specific regulatory compliance to ensure every chemical shipment is fully compliant."
  },
  {
    question: "Can Growmax handle formula-based chemical pricing?",
    answer: "Yes. Growmax supports formula-based pricing engines linked to industry indices like ICIS and Platts. Customer contracts can define pricing formulas with base rates, index multipliers, and adjustment schedules. Prices update automatically on contract-defined schedules with customer-facing notifications."
  },
  {
    question: "How does container management work for drums and totes?",
    answer: "Growmax includes full container lifecycle management with deposit tracking, return scheduling, and container-specific pricing. The system supports drums, IBC totes, ISO tanks, and bulk tanker deliveries with automatic deposit/return calculations and container inventory tracking across customer sites."
  },
  {
    question: "Does Growmax provide lot traceability for chemicals?",
    answer: "Absolutely. Growmax provides full lot traceability from manufacturer to end-user with COA attachment, distribution chain tracking, and automated recall notification workflows. Any lot can be traced through the entire distribution chain in seconds for FDA, EPA, or customer audit requirements."
  },
  {
    question: "Can Growmax integrate with our ERP and chemical management systems?",
    answer: "Yes. Growmax offers native integration with SAP, Oracle, and other major ERPs via bidirectional API connections. The platform also integrates with chemical management systems, hazmat compliance software, and transportation management systems for end-to-end chemical distribution workflow automation."
  }
];

export default function ChemicalDistributors() {
  const structuredData = [
    webPageSchema({
      title: "B2B eCommerce for Chemical Distributors",
      description: "Revenue operations platform for chemical distributors. Hazmat compliance, formula-based pricing, container management, and lot traceability for chemical wholesale.",
      path: "/industries/chemical-distributors",
      keywords: [
        "B2B ecommerce chemical distributors",
        "chemical distribution ordering platform",
        "chemical wholesale portal",
        "hazmat ordering compliance system",
        "chemical distributor software",
        "industrial chemical distribution ecommerce"
      ]
    }),
    faqPageSchema({
      title: "Chemical Distribution FAQ",
      path: "/industries/chemical-distributors",
      faqs
    })
  ];

  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B eCommerce for Chemical Distributors | Growmax"
        description="Revenue operations platform for chemical distributors. Hazmat compliance, formula-based pricing, container management, and full lot traceability for chemical wholesale distribution."
        path="/industries/chemical-distributors"
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
                  { label: "Chemical Distributors" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-industry-label">
                Industry // Chemical Distribution
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                Revenue Operations<br />
                for Chemical<br />
                <span className="text-growmax-red">Distributors.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                From specialty chemicals to bulk solvents — the connected platform that handles hazmat compliance, formula-based pricing, container management, and lot traceability for chemical wholesale distribution.
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
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Chemical Distribution Stack</div>
              <div className="space-y-3">
                <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm uppercase tracking-tight">
                  Manufacturers • Industrial Users • Formulators
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Self-Order Portal</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Compliance Engine</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Container Mgmt</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="border border-growmax-black bg-growmax-black text-white p-4 flex justify-between items-center font-mono">
                  <div className="text-[10px] uppercase w-1/4 text-center">Pricing</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Hazmat</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Catalog</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Traceability</div>
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
                <Beaker className="w-3 h-3 text-growmax-red" />
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
              We Know Chemical Distribution
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges every chemical distributor faces — and how Growmax solves each one.
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
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Case Study // Specialty Chemical</div>
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-casestudy-title">Chemical Distributor Digitizes Ordering</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                A Gulf Coast specialty chemical distributor managing 3,000+ SKUs across multiple hazmat classifications needed to digitize their ordering process and automate compliance documentation for customers across petrochemical, water treatment, and food processing segments.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Growmax deployed a compliance-integrated ordering portal with formula-based pricing, container management, and full lot traceability. Customers now self-serve 60% of orders with automated SDS and COA documentation.
                </p>
              </div>
              <div className="flex gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-orders">↑ 40%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Online Order Volume</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-compliance">100%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Compliance Doc Accuracy</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Why Chemical Distributors Choose Growmax</div>
              <div className="space-y-6">
                {[
                  "Built-in DOT hazmat classification with automated shipping compliance",
                  "Formula-based pricing linked to ICIS and Platts industry indices",
                  "Container lifecycle management with deposit tracking and return scheduling",
                  "Full lot traceability from manufacturer COA to customer delivery",
                  "Automated SDS and TDS attachment to every product and order",
                  "Application-based product search with formulation recommendations",
                  "Customer-specific contract pricing with index-linked adjustments",
                  "Native ERP integration with real-time inventory and pricing sync"
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
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 uppercase" data-testid="text-regional-title">
              Chemical Distribution<br/>Across America
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Purpose-built for the chemical distribution markets serving America's manufacturing and process industries.
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
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Chemical Distribution Keywords We Serve</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "B2B ecommerce chemical distributors",
              "chemical distribution ordering platform",
              "chemical wholesale portal",
              "hazmat ordering compliance system",
              "chemical distributor software",
              "industrial chemical ecommerce",
              "specialty chemical wholesale platform",
              "chemical container management",
              "chemical distributor ERP integration",
              "chemical lot traceability system"
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
            <Link href="/industries/food-beverage">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-food-beverage">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Industry</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Food & Beverage</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Lot traceability, expiration management, and food safety compliance for F&B distribution.</p>
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

      <WhichGrowmax industry="Chemical" />
    </div>
  );
}