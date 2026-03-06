import { Link } from "wouter";
import { ArrowRight, Gauge, Truck, DollarSign, Users, ShieldCheck, CheckSquare, MapPin, Package, ClipboardList, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";
import WhichGrowmax from "@/components/ui/WhichGrowmax";

const painPoints = [
  {
    icon: Settings,
    title: "Complex Configuration Requirements",
    problem: "Pumps and valves require exact specifications — materials of construction, pressure ratings, connection types, seal materials — but your catalog can't guide customers through valid configurations.",
    solution: "Guided product configurator with rule-based validation ensures customers select compatible materials, pressure ratings, and connection types. Invalid combinations are automatically blocked, reducing configuration errors by 90%."
  },
  {
    icon: DollarSign,
    title: "Engineered Quote Complexity",
    problem: "Custom pump packages and valve assemblies require engineering review, cost buildup, and multi-level approvals — but your quote process is manual and takes weeks.",
    solution: "CPQ engine with engineered-to-order workflows, automated cost buildup from component BOMs, multi-level approval routing, and customer-facing quote portals with revision tracking."
  },
  {
    icon: Truck,
    title: "Long Lead Time Management",
    problem: "Specialty pumps and custom valves have 8-16 week lead times — but customers have no visibility into order status, production schedules, or estimated delivery dates.",
    solution: "Order lifecycle tracking with real-time production status updates, estimated delivery date visibility, and automated milestone notifications from PO to delivery."
  },
  {
    icon: Users,
    title: "OEM vs. End-User vs. Contractor Channels",
    problem: "OEM integrators, end-user plants, and mechanical contractors all buy through different channels with different pricing, catalogs, and service expectations.",
    solution: "Channel-specific portals with tailored catalogs, pricing tiers, and service offerings. OEMs see integration specs and volume pricing. End-users see replacement parts and maintenance kits. Contractors see project-bid pricing."
  },
  {
    icon: Package,
    title: "Spare Parts & Repair Kits",
    problem: "Installed-base customers need replacement seals, impellers, and repair kits — but they can't find the right parts for their specific pump or valve model.",
    solution: "Installed-base equipment registry with model-specific spare parts lookup. Customers enter their pump or valve serial number and see only the compatible replacement parts and repair kits."
  },
  {
    icon: ShieldCheck,
    title: "API & ASME Compliance Documentation",
    problem: "Process industry customers require API, ASME, and PED compliance documentation with every order — but pulling certificates for each line item is manual and error-prone.",
    solution: "Integrated compliance documentation with automated API/ASME certificate attachment, material test reports, and hydrostatic test records linked to every shipment."
  }
];

const regions = [
  { state: "Texas", cities: "Houston, Midland-Odessa, Corpus Christi", note: "Oil & gas capital — largest pump & valve market in the US" },
  { state: "Louisiana", cities: "Baton Rouge, Lake Charles, New Orleans", note: "Petrochemical corridor with dense process industry demand" },
  { state: "California", cities: "Los Angeles, Bakersfield, San Francisco", note: "Water infrastructure and agricultural pump market" },
  { state: "Pennsylvania", cities: "Philadelphia, Pittsburgh, Allentown", note: "Chemical processing and power generation hub" },
  { state: "Ohio", cities: "Cleveland, Cincinnati, Columbus", note: "Manufacturing and process industry valve demand" },
  { state: "Washington", cities: "Seattle, Tacoma, Spokane", note: "Pulp & paper and hydroelectric pump market" }
];

const products = [
  "Centrifugal Pumps",
  "Positive Displacement Pumps",
  "Gate & Globe Valves",
  "Ball & Butterfly Valves",
  "Control Valves & Actuators",
  "Metering & Dosing Pumps",
  "Seals & Gaskets",
  "Repair Kits & Spare Parts",
  "Pipe Fittings & Flanges",
  "Instrumentation & Controls"
];

const faqs = [
  {
    question: "How does Growmax handle pump and valve configuration?",
    answer: "Growmax includes a guided product configurator with rule-based validation that walks customers through selecting compatible materials of construction, pressure ratings, connection types, and seal materials. The system automatically blocks invalid combinations and suggests alternatives, reducing configuration errors by up to 90%."
  },
  {
    question: "Can Growmax manage engineered-to-order quotes?",
    answer: "Yes. Growmax's CPQ engine supports engineered-to-order workflows with automated cost buildup from component BOMs, multi-level engineering and commercial approval routing, and customer-facing quote portals with full revision tracking and comparison."
  },
  {
    question: "How does spare parts lookup work for installed equipment?",
    answer: "Growmax supports an installed-base equipment registry where customers can register their pumps and valves by serial number. When they need replacement parts, they simply select their equipment and see only the compatible spare parts, seals, and repair kits for that specific model and configuration."
  },
  {
    question: "Does Growmax support long lead time order tracking?",
    answer: "Absolutely. Growmax provides full order lifecycle tracking with real-time production status updates, estimated delivery date visibility, and automated milestone notifications. Customers can track their orders from PO acceptance through production, testing, and final delivery."
  },
  {
    question: "Can Growmax handle API and ASME compliance documentation?",
    answer: "Yes. Growmax includes integrated compliance documentation management that automatically attaches API, ASME, and PED certificates, material test reports, and hydrostatic test records to every order. All documentation is accessible from the customer's order history for audit compliance."
  }
];

export default function PumpValve() {
  const structuredData = [
    webPageSchema({
      title: "B2B eCommerce for Pump & Valve Distributors",
      description: "Revenue operations platform for pump and valve distributors. Product configuration, engineered quotes, spare parts lookup, and API/ASME compliance tracking.",
      path: "/industries/pump-valve",
      keywords: [
        "B2B ecommerce pump distributors",
        "valve distributor ordering platform",
        "pump and valve wholesale portal",
        "industrial pump distribution software",
        "valve configuration ordering system",
        "pump spare parts ecommerce"
      ]
    }),
    faqPageSchema({
      title: "Pump & Valve Distribution FAQ",
      path: "/industries/pump-valve",
      faqs
    })
  ];

  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B eCommerce for Pump & Valve Distributors | Growmax"
        description="Revenue operations platform for pump and valve distributors. Guided product configuration, engineered-to-order quotes, spare parts lookup, and API/ASME compliance documentation for industrial flow control."
        path="/industries/pump-valve"
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
                  { label: "Pump & Valve" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-industry-label">
                Industry // Pump & Valve Distribution
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                Revenue Operations<br />
                for Pump & Valve<br />
                <span className="text-growmax-red">Distributors.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                From centrifugal pumps to control valves — the connected platform that handles product configuration, engineered quotes, spare parts lookup, and compliance documentation for industrial flow control distribution.
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
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Pump & Valve Distribution Stack</div>
              <div className="space-y-3">
                <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm uppercase tracking-tight">
                  OEM Integrators • Plant Engineers • Mechanical Contractors
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Self-Order Portal</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Configurator</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Spare Parts</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="border border-growmax-black bg-growmax-black text-white p-4 flex justify-between items-center font-mono">
                  <div className="text-[10px] uppercase w-1/4 text-center">Pricing</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">CPQ</div>
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
                <Gauge className="w-3 h-3 text-growmax-red" />
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
              We Know Pump & Valve Distribution
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges every pump and valve distributor faces — and how Growmax solves each one.
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
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Case Study // Process Industry</div>
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-casestudy-title">Pump & Valve Distributor Goes Digital</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                A Gulf Coast pump and valve distributor serving petrochemical, refining, and power generation customers needed to digitize their configuration-to-quote process and provide self-service spare parts ordering for installed equipment.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Growmax deployed a guided configurator with CPQ, installed-base spare parts lookup, and integrated API/ASME compliance documentation. Quote turnaround time dropped from 5 days to same-day, and spare parts reorder volume increased 65%.
                </p>
              </div>
              <div className="flex gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-quote">↓ 80%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Quote Turnaround Time</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-parts">↑ 65%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Spare Parts Reorders</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Why Pump & Valve Distributors Choose Growmax</div>
              <div className="space-y-6">
                {[
                  "Guided product configurator with rule-based material and pressure validation",
                  "CPQ engine for engineered-to-order quotes with multi-level approvals",
                  "Installed-base equipment registry with serial-number spare parts lookup",
                  "Order lifecycle tracking with production status and delivery milestones",
                  "Channel-specific portals for OEM, end-user, and contractor segments",
                  "Integrated API/ASME compliance documentation and material certs",
                  "Customer-specific pricing with project-bid and blanket PO support",
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
              Pump & Valve<br/>Across America
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Purpose-built for the pump and valve distribution markets serving America's critical process industries.
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
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Pump & Valve Distribution Keywords We Serve</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "B2B ecommerce pump distributors",
              "valve distributor ordering platform",
              "pump and valve wholesale portal",
              "industrial pump distribution software",
              "valve configurator ordering system",
              "pump spare parts ecommerce",
              "flow control distribution platform",
              "industrial valve wholesale",
              "pump distributor ERP integration",
              "process industry valve ordering"
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
            <Link href="/solutions/spare-parts-ecommerce">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-spare-parts">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Solution</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Spare Parts Hub</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Self-service spare parts ordering with equipment-based lookup and automated reorder triggers.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Explore Solution <ArrowRight className="w-3 h-3" /></div>
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

      <WhichGrowmax industry="Pump & Valve" />
    </div>
  );
}