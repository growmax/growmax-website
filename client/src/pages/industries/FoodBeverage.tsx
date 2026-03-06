import { Link } from "wouter";
import { ArrowRight, UtensilsCrossed, Building2, Truck, DollarSign, Users, ShieldCheck, CheckSquare, MapPin, Thermometer, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";
import WhichGrowmax from "@/components/ui/WhichGrowmax";

const painPoints = [
  {
    icon: Thermometer,
    title: "Perishable Inventory Management",
    problem: "Products with strict shelf-life requirements and temperature-controlled storage — manual tracking leads to spoilage, waste, and compliance violations.",
    solution: "Real-time inventory sync with expiry date tracking, FIFO enforcement, and automated alerts for products approaching shelf-life limits. Reduce waste and ensure compliance across your cold chain."
  },
  {
    icon: Truck,
    title: "Route-Based Delivery Complexity",
    problem: "Delivery routes spanning dozens of stops with time windows, temperature requirements, and variable order sizes — planned manually on spreadsheets every morning.",
    solution: "Route-optimized delivery scheduling with stop sequencing, delivery window management, and driver mobile app. Customers track deliveries in real-time with accurate ETAs."
  },
  {
    icon: DollarSign,
    title: "MOQ & Tiered Pricing Enforcement",
    problem: "Minimum order quantities, case-pack rules, and volume-based pricing tiers — reps constantly override rules, eroding margins and creating fulfillment headaches.",
    solution: "Automated MOQ enforcement with case-pack validation at checkout. Volume-based pricing tiers applied automatically. Override controls with approval workflows to protect margins."
  },
  {
    icon: Clock,
    title: "Seasonal Demand Fluctuation",
    problem: "Demand swings 40-60% between seasons — summer beverages, holiday specialty items, back-to-school snacks — and your ordering system can't adapt fast enough.",
    solution: "Dynamic catalog management with seasonal product visibility, pre-order windows, and demand-based inventory allocation. Promote seasonal items automatically and manage pre-orders seamlessly."
  },
  {
    icon: Users,
    title: "Multi-Channel Order Capture",
    problem: "Orders coming in via phone, fax, email, WhatsApp, and occasional portal visits — no single system of record, leading to errors and missed orders.",
    solution: "Unified self-ordering portal where retailers, restaurants, and institutional buyers place orders 24/7. Mobile app for field reps captures orders on-route. Every order flows into one system."
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Traceability",
    problem: "FDA regulations, lot tracking, allergen management, and recall procedures — paper-based systems can't keep up with food safety requirements.",
    solution: "Built-in lot tracking and batch management with full traceability. Allergen flagging on product catalogs. One-click recall identification across all orders containing affected lots."
  }
];

const regions = [
  { state: "California", cities: "Los Angeles, San Francisco, Sacramento", note: "Largest food distribution market in the US" },
  { state: "Texas", cities: "Houston, Dallas, San Antonio", note: "Fastest-growing food & beverage distribution" },
  { state: "Florida", cities: "Miami, Tampa, Orlando", note: "Gateway for Latin American food imports" },
  { state: "New York", cities: "New York City, Long Island, Westchester", note: "Highest-density foodservice market" },
  { state: "Illinois", cities: "Chicago, Naperville", note: "Midwest food distribution hub" },
  { state: "Georgia", cities: "Atlanta, Savannah", note: "Southeast distribution & logistics corridor" }
];

const foodBeverageSegments = [
  "Beverage Distribution",
  "Frozen Foods",
  "Fresh Produce",
  "Dairy & Cheese",
  "Snacks & Confectionery",
  "Meat & Poultry",
  "Bakery & Bread",
  "Specialty & Organic",
  "Foodservice Supplies",
  "FMCG Wholesale"
];

export default function FoodBeverage() {
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B eCommerce for Food & Beverage Distributors | Wholesale Ordering Platform"
        description="B2B commerce platform for food and beverage distributors. Self-ordering apps, real-time inventory sync, route-based delivery, MOQ enforcement, and perishable inventory management for FMCG wholesale."
        path="/industries/food-beverage"
        structuredData={webPageSchema({
          title: "B2B Commerce Platform for Food & Beverage Distributors",
          description: "B2B commerce platform for food and beverage distributors. Self-ordering apps, real-time inventory sync, route-based delivery, MOQ enforcement, and perishable inventory management for FMCG wholesale.",
          path: "/industries/food-beverage",
          keywords: [
            "b2b ecommerce food and beverage",
            "fmcg wholesale app",
            "food distributor ordering platform",
            "wholesale ordering app",
            "food distribution software",
            "beverage distribution platform",
            "FMCG b2b wholesale",
            "food and beverage wholesale ordering",
            "perishable inventory management",
            "route delivery management software",
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
                  { label: "Food & Beverage" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-industry-label">
                Industry // Food & Beverage Distribution
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                Revenue Operations<br />
                for Food &<br />
                <span className="text-growmax-red">Beverage.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                From perishable inventory to route-based delivery — the connected platform that handles self-ordering, field sales, MOQ enforcement, and seasonal demand management for food & beverage distributors.
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
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Food & Beverage Distribution Stack</div>

              <div className="space-y-3">
                <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm uppercase tracking-tight">
                  Retailers • Restaurants • Institutional Buyers • Convenience Stores
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    Self-Order Portal
                  </div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    Route Sales App
                  </div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">
                    Driver App
                  </div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="border border-growmax-black bg-growmax-black text-white p-4 flex justify-between items-center font-mono">
                  <div className="text-[10px] uppercase w-1/4 text-center">Pricing</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">MOQ Rules</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Catalog</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Inventory</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-2 gap-3 font-mono text-growmax-black">
                  <div className="border-2 border-growmax-black bg-white p-3 text-center font-bold text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">ERP / WMS</div>
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
            {foodBeverageSegments.map((segment, i) => (
              <div key={i} className="flex items-center gap-2">
                <UtensilsCrossed className="w-3 h-3 text-growmax-red" />
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
              We Know Food & Beverage Distribution
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges every food & beverage distributor faces — and how Growmax solves each one.
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
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Industry Insight</div>
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-casestudy-title">Self-Ordering Transforms F&B Distribution</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                Food and beverage distributors who deploy self-ordering portals see dramatic reductions in order errors and CSR call volumes — while increasing average order values through intelligent product recommendations.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Growmax deploys a connected ordering platform handling the full order-to-delivery lifecycle. Retailers and restaurants browse catalogs with real-time availability, place orders on their schedule, and track deliveries — all without a single phone call.
                </p>
              </div>

              <div className="flex gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-orders">↓ 60%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Phone Order Volume</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-aov">↑ 18%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Average Order Value</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Why F&B Distributors Choose Growmax</div>

              <div className="space-y-6">
                {[
                  "Self-ordering portal with real-time inventory and delivery window selection",
                  "MOQ and case-pack enforcement with automatic validation at checkout",
                  "Route-based delivery scheduling with driver mobile app and live tracking",
                  "Perishable inventory management with expiry tracking and FIFO enforcement",
                  "Seasonal catalog management with pre-order windows and promotional pricing",
                  "Customer-specific pricing with volume brackets and contract rates",
                  "Mobile ordering app for field reps capturing orders on delivery routes",
                  "Lot tracking and traceability for food safety compliance and recalls"
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
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">FMCG Wholesale Platform Capabilities</div>

              <div className="space-y-6">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Fast-moving consumer goods distribution demands speed, accuracy, and scalability. Growmax is purpose-built for high-velocity B2B ordering environments where thousands of SKUs move daily.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Quick Reorder", desc: "One-click repeat orders from purchase history" },
                    { label: "Barcode Scanning", desc: "Mobile app with barcode scan-to-order capability" },
                    { label: "Delivery Windows", desc: "Time-slot based delivery scheduling per route" },
                    { label: "Promotions Engine", desc: "Buy-X-Get-Y, bundle deals, and seasonal offers" }
                  ].map((item, i) => (
                    <div key={i} className="border border-growmax-black bg-white p-4">
                      <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-2">{item.label}</div>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">
                  Growmax handles 10,000+ SKU catalogs with sub-second search and real-time availability.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Growth Opportunity</div>
              <h2 className="text-4xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-growth-title">Digital Ordering = Competitive Advantage</h2>
              <p className="text-lg text-gray-600 mb-6 font-light leading-relaxed">
                Only 23% of food & beverage distributors have adopted digital B2B ordering. Early movers are capturing market share by offering retailers and restaurants a modern ordering experience.
              </p>
              <div className="space-y-4">
                {[
                  "24/7 ordering convenience increases customer retention by 35%",
                  "Automated reorder suggestions boost repeat purchase rates",
                  "Real-time inventory visibility eliminates out-of-stock surprises",
                  "Digital payment processing accelerates cash collection cycles",
                  "Order analytics reveal cross-sell and upsell opportunities"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Package className="w-4 h-4 text-growmax-red shrink-0 mt-1" />
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
              Food & Beverage<br/>Across America
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Purpose-built for food and beverage distribution markets across America's largest metro areas.
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
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Food & Beverage Distribution Keywords We Serve</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "b2b ecommerce food and beverage",
              "fmcg wholesale app",
              "food distributor ordering platform",
              "wholesale ordering app",
              "food distribution software",
              "beverage distribution platform",
              "FMCG b2b wholesale",
              "perishable inventory management",
              "route delivery management software",
              "food wholesale ecommerce"
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
            <Link href="/arc">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-arc-platform">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Platform</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Growmax ARC</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">The connected distributor platform with ordering portal, field sales app, and Zoho integration — ideal for F&B distributors.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Explore ARC <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/industries/building-materials">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-building-materials">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Industry</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Building Materials</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">B2B commerce for building materials distributors with multi-warehouse inventory and contractor portals.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">View Industry <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/revenue-platform">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-revenue-platform">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Enterprise</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Revenue Platform</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Enterprise B2B commerce with native ERP integration, multi-warehouse orchestration, and CPQ engine.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Explore Platform <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>
          </div>

          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <Link href="/blog/fmcg-wholesale-b2b-self-ordering-app">
              <div className="border border-gray-200 p-6 flex items-center justify-between gap-4 hover:border-growmax-black transition-colors cursor-pointer" data-testid="link-blog-fmcg">
                <div>
                  <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-1">Intelligence</div>
                  <p className="text-sm text-gray-700">FMCG Wholesale B2B Self-Ordering App — read the full article.</p>
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

      <WhichGrowmax industry="Food & Beverage" />
    </div>
  );
}