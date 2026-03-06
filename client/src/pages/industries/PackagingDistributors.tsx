import { Link } from "wouter";
import { ArrowRight, Package, Truck, DollarSign, Users, ShieldCheck, CheckSquare, MapPin, Factory, Repeat, BarChart3, BoxSelect } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";
import WhichGrowmax from "@/components/ui/WhichGrowmax";

const painPoints = [
  {
    icon: BoxSelect,
    title: "Massive SKU Complexity",
    problem: "Thousands of packaging products across corrugated, flexible, rigid plastics, labels, tape, stretch wrap — with multiple sizes, grades, and custom print specifications for each.",
    solution: "Intelligent product hierarchy with attribute-based search across packaging categories. Customers filter by material type, dimensions, grade, and print specifications to find exactly what they need."
  },
  {
    icon: DollarSign,
    title: "Volume-Based Pricing Tiers",
    problem: "Packaging is a volume business — prices drop dramatically with quantity. Managing hundreds of price breaks across thousands of SKUs in spreadsheets leads to quoting errors and lost margin.",
    solution: "Multi-tier volume pricing engine with automatic bracket calculation. Customer-specific contracts, SPAs, and annual volume agreements applied automatically at order entry."
  },
  {
    icon: Repeat,
    title: "Recurring Orders & Blanket POs",
    problem: "Packaging customers reorder the same products on regular schedules. Manual reorder processing wastes time and creates gaps in supply that shut down your customers' production lines.",
    solution: "Automated reorder scheduling with blanket PO management. Customers set up recurring orders with flexible delivery schedules and automatic inventory reservation."
  },
  {
    icon: Truck,
    title: "Multi-Warehouse with Bulky Goods",
    problem: "Packaging products are bulky with high cube-to-weight ratios. Shipping costs dominate, making warehouse proximity critical. But your system doesn't optimize fulfillment by location.",
    solution: "Multi-warehouse inventory with geographic fulfillment optimization. Orders automatically route to the nearest warehouse with available stock, minimizing freight costs."
  },
  {
    icon: Factory,
    title: "Custom Print & Converting Orders",
    problem: "Custom-printed boxes, bags, and labels require spec sheets, artwork approvals, and converting specifications that standard ordering systems can't handle.",
    solution: "Quote-to-order workflow with file attachment, spec sheet management, and approval workflows for custom converting orders. Artwork revisions tracked through the entire process."
  },
  {
    icon: Users,
    title: "Diverse Customer Base Management",
    problem: "Food manufacturers, eCommerce fulfillment centers, industrial shippers, and retail brands all have different packaging needs, pricing tiers, and compliance requirements.",
    solution: "Role-based portals with segment-specific catalogs. Food manufacturers see FDA-compliant packaging. Industrial customers see heavy-duty options. Each segment gets relevant products and pricing."
  },
];

const features = [
  {
    icon: Package,
    title: "Packaging Product Catalog",
    description: "Organized by packaging type (corrugated, flexible, rigid, labels, tape) with attribute-based filtering for dimensions, material grade, print type, and minimum order quantities."
  },
  {
    icon: DollarSign,
    title: "Volume Pricing Engine",
    description: "Multi-tier pricing with automatic quantity breaks, annual volume rebates, custom contract pricing, and real-time margin calculation for sales reps creating quotes."
  },
  {
    icon: Repeat,
    title: "Recurring Order Management",
    description: "Blanket PO support with scheduled releases, automated reorder reminders, and consumption-based ordering for customers with predictable packaging needs."
  },
  {
    icon: Truck,
    title: "Multi-Warehouse Fulfillment",
    description: "Intelligent order routing based on warehouse proximity, stock availability, and freight cost optimization for bulky packaging shipments."
  },
  {
    icon: BarChart3,
    title: "Customer Analytics",
    description: "Track ordering patterns, forecast demand, identify upsell opportunities, and proactively reach out before customers run low on critical packaging supplies."
  },
  {
    icon: ShieldCheck,
    title: "Compliance & Certifications",
    description: "Track FDA food-contact compliance, FSC certifications, SFI chain-of-custody, and sustainability certifications across your packaging product catalog."
  },
];

const faqs = [
  {
    question: "What is the best B2B eCommerce platform for packaging distributors?",
    answer: "Growmax is the best B2B eCommerce platform for packaging distributors, offering volume-based pricing tiers, multi-warehouse fulfillment optimization for bulky goods, recurring order management, and native ERP integration. It handles the complexity of thousands of packaging SKUs with attribute-based search and customer-specific pricing."
  },
  {
    question: "How can packaging distributors manage volume pricing online?",
    answer: "Growmax's multi-tier pricing engine automatically calculates volume brackets, annual volume rebates, and customer-specific contract pricing. When a customer adds items to their cart, pricing adjusts in real-time based on quantity, contract tier, and volume agreements — eliminating manual pricing calculations."
  },
  {
    question: "Can packaging distributors automate recurring orders?",
    answer: "Yes. Growmax supports blanket purchase orders with scheduled releases, automated reorder reminders based on consumption patterns, and recurring order templates. Customers can set up standing orders with flexible delivery schedules and automatic inventory reservation."
  },
  {
    question: "How do packaging distributors handle custom print orders online?",
    answer: "Growmax's quote-to-order workflow supports custom converting and print orders with file attachments for artwork, spec sheet management, approval workflows, and revision tracking. Sales reps can create quotes with custom specifications that convert to orders after customer approval."
  },
];

export default function PackagingDistributors() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B eCommerce for Packaging Distributors | Growmax"
        description="The B2B commerce platform built for packaging distributors. Volume pricing, multi-warehouse fulfillment, recurring orders, and custom print workflows for corrugated, flexible, and rigid packaging."
        path="/industries/packaging-distributors"
        structuredData={[
          webPageSchema({
            title: "B2B eCommerce for Packaging Distributors",
            description: "Digital commerce platform for packaging distributors with volume pricing, multi-warehouse fulfillment, and recurring order management.",
            path: "/industries/packaging-distributors",
            keywords: ["packaging distributor ecommerce", "packaging b2b platform", "wholesale packaging ordering", "corrugated packaging software"],
          }),
          faqPageSchema({
            title: "Packaging Distribution B2B eCommerce FAQ",
            path: "/industries/packaging-distributors",
            faqs,
          }),
        ]}
      />

      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6">
              <Breadcrumbs items={[
                { label: "Industries" },
                { label: "Packaging Distributors" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Industry Solution // Packaging Distribution
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              B2B Commerce for<br/>
              Packaging<br/>
              <span className="text-gray-400">Distributors.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              From corrugated boxes to stretch wrap, packaging distribution demands volume pricing, bulky goods logistics, and recurring order automation. Growmax is purpose-built for the complexity of packaging wholesale.
            </p>
            <div className="mt-10">
              <Link href="/demo">
                <Button size="lg" className="bg-growmax-red hover:bg-red-700 text-white rounded-none font-bold px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all" data-testid="button-hero-cta">
                  See It In Action <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Pain Points</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Challenges Packaging Distributors Face Every Day</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-pain-points">
            {painPoints.map((point, i) => (
              <div key={i} className="border border-gray-800 p-8 hover:border-growmax-red transition-colors" data-testid={`card-pain-point-${i}`}>
                <point.icon className="w-10 h-10 text-growmax-red mb-6" />
                <h3 className="text-xl font-bold mb-3 tracking-tight">{point.title}</h3>
                <p className="text-red-400 font-mono text-xs uppercase tracking-widest mb-3">The Problem</p>
                <p className="text-gray-400 font-light text-sm leading-relaxed mb-4">{point.problem}</p>
                <p className="text-growmax-red font-mono text-xs uppercase tracking-widest mb-3">The Solution</p>
                <p className="text-gray-300 font-light text-sm leading-relaxed">{point.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Platform Features</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Built for Packaging Distribution</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-features">
            {features.map((feature, i) => (
              <div key={i} className="border-2 border-gray-200 p-8 hover:border-growmax-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all" data-testid={`card-feature-${i}`}>
                <feature.icon className="w-10 h-10 text-growmax-red mb-6" />
                <h3 className="text-lg font-bold mb-3 tracking-tight text-growmax-black">{feature.title}</h3>
                <p className="text-gray-600 font-light text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">FAQ</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>
          <div className="space-y-8" data-testid="section-faq">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-8" data-testid={`faq-item-${i}`}>
                <h3 className="text-lg font-bold text-growmax-black mb-3">{faq.question}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WhichGrowmax industry="Packaging" />
    </div>
  );
}
