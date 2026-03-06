import { Link } from "wouter";
import { ArrowRight, Zap, Building2, Truck, DollarSign, Users, ShieldCheck, CheckSquare, MapPin, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { OBOBettermannLogo } from "@/components/ui/ClientLogos";
import { webPageSchema } from "@/lib/structuredData";

const painPoints = [
  {
    icon: DollarSign,
    title: "Complex Multi-Tier Pricing",
    problem: "Contractor pricing vs. wholesaler pricing vs. project-bid pricing — spreadsheets can't keep up with the pricing tiers your customers demand.",
    solution: "Growmax's multi-tier pricing engine handles customer-specific pricing, volume brackets, SPAs, and time-based promotions natively. Every contractor and wholesaler sees their negotiated price automatically."
  },
  {
    icon: Truck,
    title: "Multi-Warehouse Inventory",
    problem: "Stock across multiple branches and warehouses with no real-time visibility leads to lost sales and costly transfers.",
    solution: "Real-time inventory orchestration across 50+ locations with intelligent allocation, geographic zone management, and automated stock transfer recommendations."
  },
  {
    icon: Users,
    title: "Contractor vs. Wholesaler Portals",
    problem: "Different customer segments need different catalogs, pricing, and ordering experiences — but you're running them all through the same outdated system.",
    solution: "Role-based portals with segment-specific catalogs, pricing tiers, and ordering workflows. Contractors see their products and prices. Wholesalers see theirs. Zero confusion."
  },
  {
    icon: Factory,
    title: "Quote-Heavy Sales Process",
    problem: "Switchgear, panel board, and conduit quotes take days to assemble — by the time you respond, the contractor has moved on.",
    solution: "CPQ engine with pre-configured product rules for electrical assemblies. Generate accurate quotes in minutes, not days. Built-in approval workflows for margin protection."
  },
  {
    icon: Building2,
    title: "ERP Disconnect",
    problem: "Your SAP or legacy ERP holds the truth on pricing and inventory, but your sales team can't access it in the field.",
    solution: "Native SAP JCo integration with bidirectional RFC calls. No middleware. Real-time pricing and ATP checks directly from your ERP to the sales rep's device."
  },
  {
    icon: ShieldCheck,
    title: "Field Sales Blind Spots",
    problem: "Reps visiting job sites and contractor offices have no access to real-time inventory or customer-specific pricing.",
    solution: "Growmax ARC — the offline-capable mobile ordering app. Reps capture orders on-site, even without connectivity. Syncs automatically when back online."
  }
];

const regions = [
  { state: "Texas", cities: "Houston, Dallas, San Antonio, Austin", note: "Fastest-growing electrical construction market in the US" },
  { state: "Georgia", cities: "Atlanta, Savannah", note: "Southeast distribution hub" },
  { state: "North Carolina", cities: "Charlotte, Raleigh-Durham", note: "Major data center construction corridor" },
  { state: "Virginia", cities: "Northern Virginia, Richmond", note: "Data center capital of the world" },
  { state: "Florida", cities: "Miami, Tampa, Orlando, Jacksonville", note: "Rapid commercial & residential growth" },
  { state: "Pennsylvania", cities: "Philadelphia, Pittsburgh", note: "Industrial heartland with modernization demand" }
];

const electricalProducts = [
  "Cable Management Systems",
  "Switchgear & Panel Boards",
  "Circuit Breakers & Protection",
  "Conduit & Raceways",
  "Wire & Cable",
  "Lighting & Controls",
  "Motor Control Centers",
  "Transformers & Power Distribution",
  "Connectors & Terminals",
  "Safety & PPE"
];

export default function ElectricalDistributors() {
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B eCommerce for Electrical Distributors | Texas & East Coast"
        description="Revenue operations platform for electrical distributors. Multi-tier pricing, multi-warehouse inventory, contractor portals, and SAP integration for electrical wholesale."
        path="/industries/electrical-distributors"
        structuredData={webPageSchema({
          title: "B2B eCommerce for Electrical Distributors",
          description: "Revenue operations platform for electrical distributors. Multi-tier pricing, multi-warehouse inventory, contractor portals, and SAP integration for electrical wholesale.",
          path: "/industries/electrical-distributors",
          keywords: [
            "B2B ecommerce for electrical distributors",
            "electrical wholesale ordering platform",
            "electrical distribution ERP integration",
            "contractor ordering portal",
            "switchgear quoting software",
            "cable management ordering system",
            "multi-warehouse electrical distribution",
            "electrical distributor Texas",
            "electrical wholesale platform East Coast",
            "SAP integrated electrical commerce",
          ],
        })}
      />
      <section className="pt-24 pb-24 border-b border-gray-200 bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="mb-6">
                <Breadcrumbs items={[
                  { label: "Industries" },
                  { label: "Electrical Distributors" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-industry-label">
                Industry // Electrical Distribution
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                Revenue Operations<br />
                for Electrical<br />
                <span className="text-growmax-red">Distributors.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                From cable management to switchgear — the connected platform that handles customer self-ordering, field sales, partner portals, and complex multi-tier pricing for electrical wholesale.
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
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Electrical Distribution Stack</div>

              <div className="space-y-3">
                <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm uppercase tracking-tight">
                  Contractors • Wholesalers • Project Engineers
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    Self-Order Portal
                  </div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    Field Sales App
                  </div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    Partner Portal
                  </div>
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
            {electricalProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-growmax-red" />
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
              We Know Electrical Distribution
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges every electrical distributor faces — and how Growmax solves each one.
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
              <OBOBettermannLogo size="lg" className="mb-4" />
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-casestudy-title">Electrical Manufacturer Goes Digital</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                OBO Bettermann, a leading manufacturer of cable management and electrical installation systems, needed to digitize their partner ordering process across multiple regions.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Growmax deployed a connected partner portal handling the full quotation-to-order lifecycle. Cable trays, cable routing systems, and fire protection products — all with region-specific pricing and approval workflows.
                </p>
              </div>

              <div className="flex gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-speed">↑ 25%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Order Processing Speed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-support">~ 30%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Reduction in Support</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Why Electrical Distributors Choose Growmax</div>

              <div className="space-y-6">
                {[
                  "Customer-specific pricing per contractor account with volume brackets",
                  "Multi-warehouse inventory visibility across all branch locations",
                  "Offline-capable field sales app for on-site order capture",
                  "Native SAP integration — real-time pricing & ATP from your ERP",
                  "Self-service ordering portal reducing CSR call volume by 40%+",
                  "CPQ engine for complex switchgear and panel board configurations",
                  "Partner portal for wholesale channel with margin controls",
                  "Approval workflows tied to discount thresholds and margin rules"
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
              US East Coast & Texas
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Purpose-built for the electrical distribution markets driving America's infrastructure growth.
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
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Electrical Distribution Keywords We Serve</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "B2B ecommerce for electrical distributors",
              "electrical wholesale ordering platform",
              "electrical distribution ERP integration",
              "contractor ordering portal",
              "switchgear quoting software",
              "cable management ordering system",
              "multi-warehouse electrical distribution",
              "electrical distributor Texas",
              "electrical wholesale platform East Coast",
              "SAP integrated electrical commerce"
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

            <Link href="/revenue-platform/compare">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-compare-enterprise">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Comparison</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Growmax vs Corevist vs SAP CC</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Enterprise B2B platform comparison — features, pricing, and implementation timelines side by side.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Comparison <ArrowRight className="w-3 h-3" /></div>
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
            <Link href="/blog/partner-engagement-strategy-industrial-brands">
              <div className="border border-gray-200 p-6 flex items-center justify-between gap-4 hover:border-growmax-black transition-colors cursor-pointer" data-testid="link-blog-partner">
                <div>
                  <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-1">Intelligence</div>
                  <p className="text-sm text-gray-700">Partner Engagement Strategy for Industrial Brands — read the full article.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-growmax-red shrink-0" />
              </div>
            </Link>
            <Link href="/arc/compare/b2b-wave">
              <div className="border border-gray-200 p-6 flex items-center justify-between gap-4 hover:border-growmax-black transition-colors cursor-pointer" data-testid="link-compare-b2bwave">
                <div>
                  <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-1">Comparison</div>
                  <p className="text-sm text-gray-700">ARC vs B2B Wave — feature-by-feature distributor platform comparison.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-growmax-red shrink-0" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 bg-growmax-black text-white text-center bg-dots-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter uppercase leading-[1.1]" data-testid="text-cta-title">
            Ready to modernize your<br />electrical distribution business?
          </h2>
          <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl mx-auto">
            See how Growmax handles your complex pricing, multi-warehouse inventory, and contractor portals — live, in 30 minutes.
          </p>
          <Link href="/demo">
            <Button className="mt-4 bg-growmax-red hover:bg-white hover:text-growmax-black text-white h-16 px-12 text-lg rounded-none transition-all duration-300 font-bold tracking-widest uppercase border-2 border-transparent hover:border-growmax-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-2 hover:translate-y-2" data-testid="button-schedule-demo">
              Schedule Industry Demo
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}