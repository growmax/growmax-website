import { Link } from "wouter";
import { ArrowRight, Wrench, Truck, DollarSign, Users, ShieldCheck, CheckSquare, MapPin, Package, ClipboardList, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";
import WhichGrowmax from "@/components/ui/WhichGrowmax";

const painPoints = [
  {
    icon: DollarSign,
    title: "SKU Explosion & Pricing Complexity",
    problem: "A single bolt comes in 50+ variations — thread type, grade, finish, length, material — and each customer expects different pricing per variation. Managing millions of SKU-price combinations is impossible.",
    solution: "Growmax's parametric catalog with attribute-based pricing handles millions of SKU variations. Customer-specific pricing applies automatically across all thread types, grades, and finishes without manual price list management."
  },
  {
    icon: Search,
    title: "Technical Part Finding",
    problem: "Customers know they need an M10x1.5 Grade 8.8 hex bolt in zinc plating — but your website search returns 500 irrelevant results because it can't filter by technical specifications.",
    solution: "Parametric search with multi-attribute filtering. Customers find exact fasteners by thread size, grade, material, finish, head type, and drive style in seconds. Cross-reference lookup by competitor part numbers included."
  },
  {
    icon: Package,
    title: "Bin Replenishment & VMI",
    problem: "Your top accounts need vendor-managed inventory with automated bin replenishment — but your system can't track bin levels or trigger automated reorders by location.",
    solution: "VMI portal with bin-level tracking, par-level alerts, and automated replenishment triggers. Customers manage bin locations, and Growmax generates reorder POs when stock hits configurable thresholds."
  },
  {
    icon: Users,
    title: "OEM vs. MRO Customer Segments",
    problem: "OEM customers buy production-run quantities at negotiated annual pricing while MRO buyers need small quantities at list price — but both use the same ordering system with no differentiation.",
    solution: "Segment-specific portals with OEM production scheduling integration and MRO spot-buy catalogs. Annual contract pricing for OEM accounts, tiered volume pricing for MRO — all in one platform."
  },
  {
    icon: Truck,
    title: "Kitting & Assembly Requirements",
    problem: "Customers need custom fastener kits assembled to spec — hardware bags for equipment manufacturers, maintenance kits for MRO — but your system can't manage kit configurations or assembly pricing.",
    solution: "Kit configurator with BOM-based assembly, component substitution rules, and kit-specific pricing. Customers configure and order custom fastener kits directly through the portal."
  },
  {
    icon: ShieldCheck,
    title: "Material Certifications & Traceability",
    problem: "Aerospace, automotive, and nuclear customers require mill certifications, material test reports, and full traceability — but documentation is buried in filing cabinets.",
    solution: "Integrated certification management with lot-level traceability, automated mill cert attachment to orders, and customer-accessible documentation portal for audit compliance."
  }
];

const regions = [
  { state: "Michigan", cities: "Detroit, Grand Rapids, Lansing", note: "Automotive OEM fastener demand hub" },
  { state: "Ohio", cities: "Cleveland, Columbus, Akron", note: "Major industrial fastener distribution corridor" },
  { state: "Texas", cities: "Houston, Dallas-Fort Worth, San Antonio", note: "Oil & gas and construction fastener market" },
  { state: "Indiana", cities: "Indianapolis, Fort Wayne, South Bend", note: "Manufacturing heartland with dense fastener demand" },
  { state: "Pennsylvania", cities: "Pittsburgh, Philadelphia, Erie", note: "Steel country with deep fastener manufacturing roots" },
  { state: "Illinois", cities: "Chicago, Rockford, Elgin", note: "Midwest distribution hub for industrial fasteners" }
];

const products = [
  "Hex Bolts & Cap Screws",
  "Nuts & Washers",
  "Socket Head Fasteners",
  "Self-Tapping Screws",
  "Rivets & Pins",
  "Anchors & Inserts",
  "Threaded Rod & Studs",
  "Specialty Fasteners",
  "Aerospace Fasteners",
  "Stainless Steel Fasteners"
];

const faqs = [
  {
    question: "How does Growmax handle the massive SKU count in fastener distribution?",
    answer: "Growmax uses a parametric catalog system that manages millions of SKU variations through attribute-based product configuration. Instead of listing every individual SKU, products are defined by attributes (thread size, grade, material, finish, length) and pricing is calculated dynamically based on these attributes and customer-specific agreements."
  },
  {
    question: "Can customers search by technical specifications?",
    answer: "Yes. Growmax includes parametric search with multi-attribute filtering that lets customers find exact fasteners by thread size, grade, material, finish, head type, and drive style. The system also supports cross-reference lookup by competitor part numbers for easy migration from other suppliers."
  },
  {
    question: "Does Growmax support vendor-managed inventory (VMI)?",
    answer: "Absolutely. Growmax includes a VMI portal with bin-level tracking, par-level alerts, and automated replenishment triggers. Customers can manage bin locations across their facilities, and the system automatically generates reorder purchase orders when stock hits configurable thresholds."
  },
  {
    question: "How does kit configuration work for custom fastener assemblies?",
    answer: "Growmax includes a kit configurator that lets customers build custom fastener kits based on BOM specifications. The configurator supports component substitution rules, kit-specific pricing, and assembly instructions. OEM customers can save kit configurations for repeat ordering."
  },
  {
    question: "Can Growmax handle material certifications and traceability?",
    answer: "Yes. Growmax provides integrated certification management with lot-level traceability, automated mill cert attachment to orders, and a customer-accessible documentation portal. This ensures full compliance with aerospace, automotive, and nuclear industry traceability requirements."
  }
];

export default function IndustrialFasteners() {
  const structuredData = [
    webPageSchema({
      title: "B2B eCommerce for Industrial Fastener Distributors",
      description: "Revenue operations platform for industrial fastener distributors. Parametric catalog, VMI bin replenishment, kit configuration, and material certification tracking.",
      path: "/industries/industrial-fasteners",
      keywords: [
        "B2B ecommerce fastener distributors",
        "industrial fastener ordering platform",
        "fastener wholesale portal",
        "bolt and nut distribution software",
        "VMI fastener management system",
        "fastener distributor ecommerce"
      ]
    }),
    faqPageSchema({
      title: "Industrial Fastener Distribution FAQ",
      path: "/industries/industrial-fasteners",
      faqs
    })
  ];

  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B eCommerce for Industrial Fastener Distributors | Growmax"
        description="Revenue operations platform for industrial fastener distributors. Parametric catalog search, VMI bin replenishment, kit configuration, and material certification tracking for fastener wholesale."
        path="/industries/industrial-fasteners"
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
                  { label: "Industrial Fasteners" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-industry-label">
                Industry // Industrial Fastener Distribution
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                Revenue Operations<br />
                for Industrial<br />
                <span className="text-growmax-red">Fastener Distributors.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                From hex bolts to aerospace fasteners — the connected platform that handles parametric catalog search, VMI bin replenishment, custom kit configuration, and material certification tracking for fastener wholesale.
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
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Industrial Fastener Distribution Stack</div>
              <div className="space-y-3">
                <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm uppercase tracking-tight">
                  OEM Buyers • MRO Managers • Procurement Teams
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Self-Order Portal</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">VMI Portal</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Kit Configurator</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="border border-growmax-black bg-growmax-black text-white p-4 flex justify-between items-center font-mono">
                  <div className="text-[10px] uppercase w-1/4 text-center">Pricing</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Search</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Catalog</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Certs</div>
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
                <Wrench className="w-3 h-3 text-growmax-red" />
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
              We Know Fastener Distribution
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges every industrial fastener distributor faces — and how Growmax solves each one.
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
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Case Study // OEM & MRO</div>
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-casestudy-title">Fastener Distributor Digitizes VMI Programs</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                A Midwest fastener distributor managing VMI programs for 200+ manufacturing accounts needed to digitize bin-level tracking and automate replenishment across automotive, aerospace, and general industrial segments.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Growmax deployed a VMI portal with parametric search, bin-level inventory tracking, and automated replenishment. OEM buyers now manage production-run orders through the platform, and VMI fill rates improved to 99.2%.
                </p>
              </div>
              <div className="flex gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-orders">↑ 55%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Online Order Volume</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-fill">99.2%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">VMI Fill Rate</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Why Fastener Distributors Choose Growmax</div>
              <div className="space-y-6">
                {[
                  "Parametric catalog with attribute-based product search and pricing",
                  "VMI bin replenishment with par-level alerts and auto-reorder triggers",
                  "Kit configurator for custom fastener assembly and hardware bags",
                  "Material certification management with lot-level traceability",
                  "Cross-reference lookup by competitor part numbers",
                  "Segment-specific portals for OEM production and MRO spot-buy",
                  "Customer-specific pricing across millions of SKU variations",
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
              Industrial Fasteners<br/>Across America
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Purpose-built for the industrial fastener distribution markets serving America's manufacturing and construction sectors.
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
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Industrial Fastener Distribution Keywords We Serve</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "B2B ecommerce fastener distributors",
              "industrial fastener ordering platform",
              "fastener wholesale portal",
              "bolt and nut distribution software",
              "VMI fastener management system",
              "fastener parametric search",
              "industrial hardware wholesale platform",
              "fastener kit configurator",
              "fastener distributor ERP integration",
              "aerospace fastener ordering portal"
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
            <Link href="/industries/automotive-aftermarket">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-automotive-aftermarket">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Industry</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Automotive Aftermarket</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Vehicle fitment, VIN lookup, and dealer portal management for automotive parts distribution.</p>
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

      <WhichGrowmax industry="Fastener" />
    </div>
  );
}