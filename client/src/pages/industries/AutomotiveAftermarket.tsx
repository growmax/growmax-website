import { Link } from "wouter";
import { ArrowRight, Car, Building2, Truck, DollarSign, Users, Wrench, CheckSquare, MapPin, Package, Search, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";
import WhichGrowmax from "@/components/ui/WhichGrowmax";

const painPoints = [
  {
    icon: Search,
    title: "Complex Part Fitment Data",
    problem: "Customers can't find the right part for their vehicle — year, make, model, engine type, trim level. Wrong parts = costly returns and lost trust.",
    solution: "Growmax's fitment engine supports VIN decode, year-make-model lookup, and cross-reference search. Customers find the exact part for their vehicle in seconds — reducing returns by 60%+."
  },
  {
    icon: Layers,
    title: "Massive Catalog Complexity",
    problem: "100,000+ SKUs across OEM, aftermarket, and remanufactured parts — impossible to manage with spreadsheets or basic eCommerce tools.",
    solution: "Hierarchical catalog with unlimited SKUs, configurable attributes, cross-references, and supersession chains. Bulk import from ACES/PIES data standards natively."
  },
  {
    icon: DollarSign,
    title: "OEM vs. Aftermarket Pricing",
    problem: "Different pricing for OEM parts, aftermarket alternatives, and remanufactured options — plus customer-specific discounts, jobber pricing, and installer tiers.",
    solution: "Multi-tier pricing engine with customer-specific price lists, jobber/installer/retail tiers, volume brackets, and automatic margin protection across all part categories."
  },
  {
    icon: Truck,
    title: "Multi-Warehouse Fulfillment",
    problem: "Parts spread across regional warehouses, local stores, and drop-ship suppliers — no unified visibility means stockouts and slow delivery.",
    solution: "Real-time inventory orchestration across all locations with intelligent routing, split-shipment logic, and drop-ship automation. Customers see live availability by location."
  },
  {
    icon: Users,
    title: "Installer & Garage Portals",
    problem: "Your best customers — mechanics, garages, fleet managers — still ordering by phone or walking in. No self-service means high CSR costs and order errors.",
    solution: "Role-based self-ordering portals for installers, garages, and fleet managers with saved vehicles, reorder lists, and account-specific pricing. 24/7 ordering reduces CSR calls by 40%+."
  },
  {
    icon: Building2,
    title: "ERP & DMS Integration Gaps",
    problem: "Your DMS or ERP holds inventory and pricing truth, but your digital channels are disconnected — causing stock mismatches and manual double-entry.",
    solution: "Native integration with automotive DMS platforms and ERPs. Bidirectional sync for inventory, pricing, orders, and customer data — no middleware required."
  }
];

const regions = [
  { state: "Texas", cities: "Houston, Dallas, San Antonio", note: "Largest automotive aftermarket hub in the US" },
  { state: "California", cities: "Los Angeles, San Diego, Sacramento", note: "Highest vehicle density — massive parts demand" },
  { state: "Florida", cities: "Miami, Tampa, Orlando", note: "Year-round driving market with high parts turnover" },
  { state: "Michigan", cities: "Detroit, Grand Rapids", note: "Automotive industry epicenter — OEM & aftermarket" },
  { state: "Ohio", cities: "Columbus, Cleveland, Cincinnati", note: "Central distribution corridor for parts logistics" },
  { state: "Georgia", cities: "Atlanta, Savannah", note: "Southeast distribution hub — growing fleet market" }
];

const automotiveSegments = [
  "Brake Systems & Components",
  "Engine Parts & Accessories",
  "Transmission & Drivetrain",
  "Suspension & Steering",
  "Electrical & Lighting",
  "Body Parts & Collision",
  "Filters & Fluids",
  "Bike & Motorcycle Spare Parts",
  "Heavy Equipment Parts",
  "Fleet Maintenance Supplies"
];

export default function AutomotiveAftermarket() {
  const structuredData = webPageSchema({
    title: "B2B Commerce Platform for Automotive Aftermarket & Spare Parts",
    description: "Revenue operations platform for automotive aftermarket distributors. VIN-based part fitment, multi-warehouse fulfillment, installer portals, and OEM/aftermarket pricing for auto parts businesses.",
    path: "/industries/automotive-aftermarket",
    keywords: [
      "automotive aftermarket ecommerce",
      "sell car spare parts online",
      "automotive parts B2B platform",
      "bike spare parts business",
      "auto parts wholesale platform",
      "VIN lookup parts ordering",
      "automotive parts distributor software",
      "how to sell automotive accessories online",
      "how to sell car spare parts",
      "sell car accessories online",
      "aftermarket auto parts ecommerce",
      "motorcycle spare parts online store"
    ]
  });

  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B eCommerce for Automotive Aftermarket & Spare Parts | Growmax"
        description="Revenue operations platform for automotive aftermarket distributors. VIN-based part fitment, multi-warehouse fulfillment, installer portals, and OEM/aftermarket pricing for auto parts businesses."
        path="/industries/automotive-aftermarket"
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
                  { label: "Automotive Aftermarket" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-industry-label">
                Industry // Automotive Aftermarket
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                Revenue Operations<br />
                for Automotive<br />
                <span className="text-growmax-red">Aftermarket.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                From brake pads to bike spare parts — the connected platform that handles VIN-based fitment, installer self-ordering, multi-warehouse fulfillment, and complex aftermarket pricing for auto parts distributors.
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
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Automotive Aftermarket Stack</div>

              <div className="space-y-3">
                <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm uppercase tracking-tight">
                  Installers • Garages • Fleet Managers • Retailers
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    Self-Order Portal
                  </div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    VIN Lookup
                  </div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    Field Sales App
                  </div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="border border-growmax-black bg-growmax-black text-white p-4 flex justify-between items-center font-mono">
                  <div className="text-[10px] uppercase w-1/4 text-center">Fitment</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Pricing</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Catalog</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Inventory</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-2 gap-3 font-mono text-growmax-black">
                  <div className="border-2 border-growmax-black bg-white p-3 text-center font-bold text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">ERP / DMS</div>
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
            {automotiveSegments.map((segment, i) => (
              <div key={i} className="flex items-center gap-2">
                <Car className="w-3 h-3 text-growmax-red" />
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
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-6 uppercase" data-testid="text-painpoints-title">
              We Know Automotive Aftermarket
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges every auto parts distributor faces — and how Growmax solves each one.
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
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Market Opportunity</div>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-market-title">$400B+ Global Aftermarket</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                The global automotive aftermarket is projected to exceed $400 billion by 2027. Digital ordering is transforming how parts move from manufacturers to installers — and distributors who digitize first capture the most market share.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Whether you're selling OEM brake rotors, aftermarket suspension kits, or remanufactured engines — Growmax gives your customers the self-service ordering experience they expect while protecting your margins and streamlining your operations.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-skus">100K+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">SKUs Supported</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-returns">↓ 60%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Part Return Reduction</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Why Auto Parts Distributors Choose Growmax</div>

              <div className="space-y-6">
                {[
                  "VIN decode & year-make-model fitment search for exact part matching",
                  "100,000+ SKU catalog with ACES/PIES data standard support",
                  "OEM, aftermarket, and remanufactured pricing tiers per customer",
                  "Multi-warehouse inventory with real-time ATP across all locations",
                  "Self-service installer portal with saved vehicles and reorder lists",
                  "Offline-capable field sales app for counter staff and outside reps",
                  "Drop-ship automation for parts not stocked locally",
                  "Cross-reference and supersession chain management"
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
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Bike & Motorcycle Spare Parts</div>

              <div className="space-y-6">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  The bike and motorcycle spare parts segment is one of the fastest-growing categories in aftermarket eCommerce. From chain sprockets to brake shoes, handlebar assemblies to engine gaskets — parts distributors need a platform that handles the unique fitment requirements of two-wheelers.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Model Fitment", desc: "Year-make-model lookup for bikes and motorcycles" },
                    { label: "Visual Catalogs", desc: "Exploded view diagrams for part identification" },
                    { label: "Bulk Ordering", desc: "Workshop and garage bulk order capabilities" },
                    { label: "Cross-Reference", desc: "OEM to aftermarket part number mapping" }
                  ].map((item, i) => (
                    <div key={i} className="border border-growmax-black bg-white p-4">
                      <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-2">{item.label}</div>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  Growmax powers spare parts businesses selling bike, motorcycle, and automotive components across India, Southeast Asia, and the US.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Use Case</div>
              <h2 className="text-4xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-usecase-title">Sell Car Accessories & Spare Parts Online</h2>
              <p className="text-lg text-gray-600 mb-6 font-light leading-relaxed">
                Whether you're launching a new online spare parts business or digitizing an existing distributor operation, Growmax provides the complete B2B commerce stack:
              </p>
              <div className="space-y-4">
                {[
                  "Launch a branded B2B storefront for your parts catalog in weeks",
                  "Let garages and installers self-order with fitment-verified results",
                  "Manage OEM vs. aftermarket vs. remanufactured pricing automatically",
                  "Sync inventory across warehouses, stores, and drop-ship suppliers",
                  "Mobile app for your sales reps and counter staff"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Wrench className="w-4 h-4 text-growmax-red shrink-0 mt-1" />
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
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 uppercase" data-testid="text-regional-title">
              Automotive Aftermarket<br/>Across America
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Purpose-built for the automotive aftermarket hubs driving America's $200B+ parts industry.
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
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Automotive Aftermarket Keywords We Serve</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "automotive aftermarket ecommerce",
              "sell car spare parts online",
              "automotive parts B2B platform",
              "bike spare parts business",
              "auto parts wholesale platform",
              "VIN lookup parts ordering",
              "how to sell automotive accessories online",
              "how to sell car spare parts",
              "motorcycle spare parts online",
              "aftermarket auto parts distributor"
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

            <Link href="/industries/industrial-manufacturing">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-industrial-manufacturing">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Industry</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Industrial Manufacturing</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Dealer portals, spare parts management, BOM pricing, and field service ordering for equipment manufacturers.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">View Industry <ArrowRight className="w-3 h-3" /></div>
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
            <Link href="/blog/how-to-sell-automotive-accessories-online">
              <div className="border border-gray-200 p-6 flex items-center justify-between gap-4 hover:border-growmax-black transition-colors cursor-pointer" data-testid="link-blog-automotive">
                <div>
                  <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-1">Intelligence</div>
                  <p className="text-sm text-gray-700">How to Sell Automotive Accessories Online — read the full guide.</p>
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

      <WhichGrowmax industry="Automotive" />
    </div>
  );
}