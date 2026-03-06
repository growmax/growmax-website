import { Link } from "wouter";
import { ArrowRight, Cog, Building2, Truck, DollarSign, Users, Wrench, CheckSquare, MapPin, Package, Layers, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { SchwingSttetterLogo, SiemensLogo } from "@/components/ui/ClientLogos";
import { webPageSchema } from "@/lib/structuredData";
import WhichGrowmax from "@/components/ui/WhichGrowmax";

const painPoints = [
  {
    icon: Layers,
    title: "Complex BOM Management",
    problem: "Bills of materials with thousands of components across multiple levels — your sales team can't price or quote configurations accurately without engineering involvement.",
    solution: "Growmax handles multi-level BOMs natively. Sales reps configure products, select options, and generate accurate quotes with real-time pricing — no engineering bottleneck."
  },
  {
    icon: Users,
    title: "Multi-Tier Dealer Networks",
    problem: "Managing 200+ dealers across regions with different pricing tiers, territory rules, and approval workflows through spreadsheets and email chains.",
    solution: "Dealer portal with territory-based access, tier-specific pricing, automated approval workflows, and real-time order visibility. Every dealer sees their catalog, their price, their orders."
  },
  {
    icon: Wrench,
    title: "Spare Parts Management",
    problem: "Aftermarket revenue leaking because customers can't find the right spare part for their equipment model and serial number.",
    solution: "Equipment-linked spare parts portal with serial number lookup, exploded view navigation, and AI-powered part identification. Customers self-serve 24/7."
  },
  {
    icon: Truck,
    title: "Field Service & Warranty",
    problem: "Field technicians on job sites without access to parts availability, pricing, or warranty status — leading to repeat visits and lost revenue.",
    solution: "Growmax ARC mobile app gives field teams offline access to parts catalogs, warranty lookup, and instant order placement from the job site."
  },
  {
    icon: DollarSign,
    title: "Contract-Based Pricing",
    problem: "Annual contracts, rate cards, SPAs, and project-specific pricing scattered across ERP, CRM, and spreadsheets — impossible to enforce consistently.",
    solution: "Centralized pricing engine with contract management, SPA tracking, volume-based tiers, and automatic price expiry. Every channel gets the right price, every time."
  },
  {
    icon: Building2,
    title: "ERP Integration Gaps",
    problem: "SAP or Oracle holds your master data, but your digital channels are disconnected — causing inventory mismatches, pricing errors, and duplicate data entry.",
    solution: "Native SAP JCo and REST API integration with bidirectional sync. Real-time ATP checks, pricing lookups, and order pushback — no middleware layer required."
  }
];

const regions = [
  { state: "Ohio", cities: "Cleveland, Cincinnati, Columbus", note: "Manufacturing heartland — heavy equipment & machinery" },
  { state: "Michigan", cities: "Detroit, Grand Rapids", note: "Automotive & industrial equipment manufacturing hub" },
  { state: "Pennsylvania", cities: "Philadelphia, Pittsburgh", note: "Steel, machinery & industrial automation corridor" },
  { state: "New York", cities: "Buffalo, Rochester, Syracuse", note: "Precision manufacturing & aerospace components" },
  { state: "Indiana", cities: "Indianapolis, Fort Wayne", note: "Engine, transmission & heavy equipment manufacturing" },
  { state: "North Carolina", cities: "Charlotte, Greensboro", note: "Growing advanced manufacturing & automation market" }
];

const manufacturingSegments = [
  "Heavy Equipment & Machinery",
  "Industrial Automation",
  "Pumps & Compressors",
  "HVAC & Refrigeration",
  "Power Generation",
  "Construction Equipment",
  "Material Handling",
  "Agricultural Equipment",
  "Packaging Machinery",
  "Hydraulic Systems"
];

export default function IndustrialManufacturing() {
  const structuredData = webPageSchema({
    title: "B2B Commerce for Industrial Manufacturers | Dealer Portal for Equipment Manufacturers",
    description: "Revenue operations platform for industrial equipment and machinery manufacturers. Complex BOM management, multi-tier dealer networks, spare parts portals, and SAP integration.",
    path: "/industries/industrial-manufacturing",
    keywords: [
      "B2B commerce for industrial manufacturers",
      "dealer portal for equipment manufacturers",
      "industrial manufacturing ecommerce",
      "spare parts portal manufacturers",
      "BOM management B2B",
      "dealer network management platform",
      "equipment manufacturer digital commerce",
      "SAP integrated manufacturing commerce"
    ]
  });

  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B Commerce for Industrial Manufacturers | Dealer Portal & Spare Parts"
        description="Revenue operations platform for industrial equipment and machinery manufacturers. Complex BOM management, multi-tier dealer networks, spare parts portals, and SAP integration for manufacturers across America."
        path="/industries/industrial-manufacturing"
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
                  { label: "Industrial Manufacturing" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-industry-label">
                Industry // Industrial Manufacturing
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                Revenue Operations<br />
                for Industrial<br />
                <span className="text-growmax-red">Manufacturers.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                From heavy equipment to spare parts — the connected platform that handles dealer portals, field service ordering, complex BOM pricing, and multi-tier channel management for industrial manufacturers.
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
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Industrial Manufacturing Stack</div>

              <div className="space-y-3">
                <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm uppercase tracking-tight">
                  Dealers • Distributors • Field Technicians • OEM Customers
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    Dealer Portal
                  </div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    Spare Parts Portal
                  </div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    Field Sales App
                  </div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="border border-growmax-black bg-growmax-black text-white p-4 flex justify-between items-center font-mono">
                  <div className="text-[10px] uppercase w-1/4 text-center">BOM Pricing</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">CPQ Engine</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Catalog</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Warranty</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-2 gap-3 font-mono text-growmax-black">
                  <div className="border-2 border-growmax-black bg-white p-3 text-center font-bold text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">SAP / ERP</div>
                  <div className="border-2 border-growmax-black bg-white p-3 text-center font-bold text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">CRM / DMS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-growmax-black text-white border-b-4 border-growmax-red">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 font-mono text-xs uppercase tracking-widest" data-testid="text-product-categories">
            {manufacturingSegments.map((segment, i) => (
              <div key={i} className="flex items-center gap-2">
                <Cog className="w-3 h-3 text-growmax-red" />
                <span className="text-gray-300">{segment}</span>
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
              We Know Industrial Manufacturing
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges every industrial manufacturer faces — and how Growmax solves each one.
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
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Case Study</div>
              <SchwingSttetterLogo size="lg" className="mb-4" />
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-casestudy-title">Concrete Equipment Manufacturer Goes Digital</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                Schwing Stetter, a global leader in concrete technology and equipment manufacturing, needed to digitize their dealer ordering and spare parts management across multiple regions.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Growmax deployed a connected dealer portal handling the full quotation-to-order lifecycle for concrete pumps, batching plants, and transit mixers — with equipment-linked spare parts ordering and regional pricing controls.
                </p>
              </div>

              <div className="flex gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-dealer">200+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Dealers Connected</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-parts">↑ 40%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Parts Order Efficiency</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Why Industrial Manufacturers Choose Growmax</div>

              <div className="space-y-6">
                {[
                  "Multi-level BOM pricing with configurable options and variants",
                  "Dealer portal with territory-based access and tier-specific pricing",
                  "Equipment-linked spare parts catalog with serial number lookup",
                  "Native SAP integration — real-time ATP, pricing & order sync",
                  "Offline-capable field sales app for technicians on job sites",
                  "CPQ engine for complex equipment configurations and assemblies",
                  "Warranty management with service history tracking",
                  "Channel conflict prevention with territory and margin controls"
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

      <section className="py-32 bg-white border-t-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-4 mb-8">
                <SiemensLogo size="sm" />
                <span className="font-mono text-xs text-growmax-black font-bold uppercase tracking-widest">Reference Architecture</span>
              </div>

              <div className="space-y-6">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Global industrial automation leaders like Siemens demonstrate the need for connected digital commerce platforms that handle complex product hierarchies, regional pricing, and multi-tier distribution networks.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Product Hierarchy", desc: "Multi-level catalog with configurable assemblies" },
                    { label: "Regional Pricing", desc: "Territory-based pricing with currency management" },
                    { label: "Dealer Tiers", desc: "Platinum, Gold, Silver with differentiated margins" },
                    { label: "Service Parts", desc: "Equipment-linked aftermarket ordering" }
                  ].map((item, i) => (
                    <div key={i} className="border border-growmax-black bg-white p-4">
                      <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-2">{item.label}</div>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  Growmax provides the same enterprise-grade capabilities at a fraction of the cost and implementation time.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Aftermarket Revenue</div>
              <h2 className="text-4xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-aftermarket-title">Spare Parts = 30-50% of Revenue</h2>
              <p className="text-lg text-gray-600 mb-6 font-light leading-relaxed">
                For most industrial manufacturers, aftermarket spare parts represent 30-50% of total revenue and often carry higher margins than original equipment sales.
              </p>
              <div className="space-y-4">
                {[
                  "Self-service spare parts portal reduces CSR call volume by 40%+",
                  "Equipment serial number lookup for exact part matching",
                  "AI-powered visual part identification from photos",
                  "Automated reorder suggestions based on maintenance schedules",
                  "Warranty claim management integrated with parts ordering"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Settings className="w-4 h-4 text-growmax-red shrink-0 mt-1" />
                    <span className="text-sm text-gray-700">{item}</span>
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
              Industrial Manufacturing<br/>Across America
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Purpose-built for the industrial manufacturing corridors driving America's equipment and machinery production.
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

      <section className="py-16 bg-white border-t-2 border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Industrial Manufacturing Keywords We Serve</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "B2B commerce for industrial manufacturers",
              "dealer portal for equipment manufacturers",
              "spare parts ecommerce platform",
              "industrial equipment ordering system",
              "BOM pricing software B2B",
              "dealer network management platform",
              "aftermarket parts portal",
              "equipment manufacturer digital commerce",
              "SAP integrated manufacturing commerce",
              "industrial distributor portal"
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
                <p className="text-sm text-gray-600 font-light leading-relaxed">Enterprise B2B commerce with native SAP integration, multi-warehouse orchestration, and CPQ engine.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Explore Platform <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/industries/electrical-distributors">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-electrical-distributors">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Industry</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Electrical Distributors</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Multi-tier pricing, multi-warehouse inventory, contractor portals, and SAP integration for electrical wholesale.</p>
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

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link href="/blog/b2b-ecommerce-strategy-industrial-manufacturers">
              <div className="border border-gray-200 p-6 flex items-center justify-between gap-4 hover:border-growmax-black transition-colors cursor-pointer" data-testid="link-blog-strategy">
                <div>
                  <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-1">Intelligence</div>
                  <p className="text-sm text-gray-700">B2B eCommerce Strategy for Industrial Manufacturers — read the full article.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-growmax-red shrink-0" />
              </div>
            </Link>
            <Link href="/revenue-platform/compare">
              <div className="border border-gray-200 p-6 flex items-center justify-between gap-4 hover:border-growmax-black transition-colors cursor-pointer" data-testid="link-compare-enterprise">
                <div>
                  <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-1">Comparison</div>
                  <p className="text-sm text-gray-700">Growmax vs Corevist vs SAP Commerce Cloud — enterprise platform comparison.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-growmax-red shrink-0" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <WhichGrowmax industry="Manufacturing" />
    </div>
  );
}