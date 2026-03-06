import { Link } from "wouter";
import { ArrowRight, Building, Hammer, Truck, DollarSign, Users, ShieldCheck, CheckSquare, MapPin, HardHat, Package, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";
import WhichGrowmax from "@/components/ui/WhichGrowmax";

const painPoints = [
  {
    icon: DollarSign,
    title: "Project-Based Pricing Chaos",
    problem: "Every contractor expects job-specific pricing, negotiated rates, and project-bid discounts — but your team manages it all in disconnected spreadsheets and emails.",
    solution: "Growmax's project-based pricing engine handles contractor-specific rates, job quotes, volume brackets, and time-limited bids natively. Contractors see their negotiated prices the moment they log in."
  },
  {
    icon: Users,
    title: "Contractor Account Management",
    problem: "Managing hundreds of contractor accounts with different credit terms, pricing tiers, and ordering permissions across multiple branches is overwhelming.",
    solution: "Role-based contractor portals with account hierarchies, credit limit enforcement, approval workflows, and segment-specific catalogs. Each contractor sees only their products, prices, and terms."
  },
  {
    icon: Package,
    title: "Bulk Ordering Complexity",
    problem: "Contractors order in bulk — pallets of drywall, truckloads of lumber, mixed loads of roofing materials — and your ordering system can't handle unit-of-measure conversions or minimum order quantities.",
    solution: "Flexible UOM management with automatic conversions between pieces, bundles, pallets, and truckloads. Minimum order quantities, weight-based pricing, and mixed-load optimization built in."
  },
  {
    icon: Truck,
    title: "Delivery Scheduling Nightmares",
    problem: "Job-site deliveries require precise scheduling, crane coordination, and phased drops — but your system treats every order like a warehouse pickup.",
    solution: "Integrated delivery scheduling with job-site address management, delivery window selection, phased delivery planning, and real-time delivery status tracking for contractors."
  },
  {
    icon: ClipboardList,
    title: "Quote-Heavy Sales Process",
    problem: "Material takeoffs and project quotes take days to assemble. By the time your rep responds, the contractor has sourced from a competitor.",
    solution: "CPQ engine with pre-configured product bundles for common construction projects. Generate accurate material quotes in minutes with automated margin protection and approval workflows."
  },
  {
    icon: HardHat,
    title: "Field Sales Blind Spots",
    problem: "Reps visiting job sites and contractor offices have no access to real-time inventory, delivery schedules, or account-specific pricing.",
    solution: "Growmax ARC — the offline-capable mobile ordering app. Reps capture orders on-site, check inventory across yards, and confirm delivery windows — even without connectivity."
  }
];

const regions = [
  { state: "Texas", cities: "Houston, Dallas-Fort Worth, San Antonio, Austin", note: "Largest construction market in the US — $150B+ annually" },
  { state: "Florida", cities: "Miami, Tampa, Orlando, Jacksonville", note: "Rapid residential & commercial growth corridor" },
  { state: "Georgia", cities: "Atlanta, Savannah, Augusta", note: "Southeast distribution and logistics hub" },
  { state: "North Carolina", cities: "Charlotte, Raleigh-Durham, Greensboro", note: "Top 5 state for construction spending growth" },
  { state: "Tennessee", cities: "Nashville, Memphis, Knoxville", note: "Booming commercial construction market" },
  { state: "South Carolina", cities: "Charleston, Greenville, Columbia", note: "Fastest-growing construction market in Southeast" }
];

const buildingProducts = [
  "Lumber & Engineered Wood",
  "Drywall & Ceiling Systems",
  "Roofing Materials",
  "Concrete & Masonry",
  "Insulation & Weatherproofing",
  "Doors & Windows",
  "Plumbing & HVAC Supplies",
  "Fasteners & Hardware",
  "Steel & Metal Products",
  "Flooring & Tile"
];

export default function BuildingMaterials() {
  const structuredData = webPageSchema({
    title: "B2B eCommerce for Building Materials Distributors",
    description: "Revenue operations platform for building materials distributors. Project-based pricing, contractor portals, bulk ordering, and delivery scheduling for construction supply.",
    path: "/industries/building-materials",
    keywords: [
      "B2B ecommerce building materials distributors",
      "construction supply ordering platform",
      "building materials wholesale portal",
      "contractor ordering system",
      "lumber distributor ecommerce",
      "building supply delivery scheduling"
    ]
  });

  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B eCommerce for Building Materials Distributors | Growmax"
        description="Revenue operations platform for building materials distributors. Project-based pricing, contractor account management, bulk ordering, and delivery scheduling for construction supply wholesale."
        path="/industries/building-materials"
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
                  { label: "Building Materials" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-industry-label">
                Industry // Building Materials Distribution
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                Revenue Operations<br />
                for Building Materials<br />
                <span className="text-growmax-red">Distributors.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                From lumber yards to roofing supply — the connected platform that handles contractor self-ordering, project-based pricing, bulk ordering, and job-site delivery scheduling for building materials wholesale.
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
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Building Materials Distribution Stack</div>

              <div className="space-y-3">
                <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm uppercase tracking-tight">
                  Contractors • Builders • Project Managers
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
                    Delivery Portal
                  </div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="border border-growmax-black bg-growmax-black text-white p-4 flex justify-between items-center font-mono">
                  <div className="text-[10px] uppercase w-1/4 text-center">Pricing</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Quotes</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Catalog</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Delivery</div>
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
            {buildingProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-2">
                <Building className="w-3 h-3 text-growmax-red" />
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
              We Know Building Materials Distribution
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges every building materials distributor faces — and how Growmax solves each one.
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
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-casestudy-title">Building Materials Distributor Goes Digital</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                A leading Southeast US building materials distributor with 12 yard locations needed to digitize their contractor ordering process and eliminate phone-and-fax order entry across their lumber, drywall, and roofing divisions.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Growmax deployed a connected contractor portal handling project-based quoting, bulk ordering with UOM conversions, and integrated delivery scheduling. Contractors now self-serve 70% of repeat orders, freeing inside sales to focus on new project quotes.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-orders">↑ 40%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Online Order Volume</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-calls">↓ 55%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Inbound Call Volume</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Why Building Materials Distributors Choose Growmax</div>

              <div className="space-y-6">
                {[
                  "Project-based pricing per contractor with job-specific rates and volume brackets",
                  "Bulk ordering with automatic UOM conversions — pieces, bundles, pallets, truckloads",
                  "Integrated delivery scheduling with job-site address management",
                  "Multi-yard inventory visibility across all branch and yard locations",
                  "Offline-capable field sales app for on-site order capture at job sites",
                  "CPQ engine for material takeoffs and project-based quoting",
                  "Contractor self-service portal reducing inside sales call volume by 55%+",
                  "Credit limit enforcement and approval workflows tied to account terms"
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
              Building Materials<br/>Across America
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Purpose-built for the building materials distribution markets driving America's construction boom.
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

      <section className="py-16 bg-white border-t-2 border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Building Materials Distribution Keywords We Serve</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "B2B ecommerce building materials distributors",
              "construction supply ordering platform",
              "building materials wholesale portal",
              "contractor ordering system",
              "lumber distributor ecommerce",
              "roofing supply ordering platform",
              "building supply delivery scheduling",
              "drywall distributor ecommerce",
              "building materials B2B platform",
              "construction materials bulk ordering"
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

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link href="/blog/roi-digital-channel-management-building-materials">
              <div className="border border-gray-200 p-6 flex items-center justify-between gap-4 hover:border-growmax-black transition-colors cursor-pointer" data-testid="link-blog-roi">
                <div>
                  <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-1">Intelligence</div>
                  <p className="text-sm text-gray-700">ROI of Digital Channel Management for Building Materials — read the full article.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-growmax-red shrink-0" />
              </div>
            </Link>
            <Link href="/revenue-platform/compare">
              <div className="border border-gray-200 p-6 flex items-center justify-between gap-4 hover:border-growmax-black transition-colors cursor-pointer" data-testid="link-compare-enterprise">
                <div>
                  <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-1">Comparison</div>
                  <p className="text-sm text-gray-700">Growmax vs Corevist vs SAP CC — enterprise B2B platform comparison.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-growmax-red shrink-0" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <WhichGrowmax industry="Building Materials" />
    </div>
  );
}
