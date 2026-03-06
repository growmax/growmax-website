import { Link } from "wouter";
import { ArrowRight, HardHat, Truck, DollarSign, Users, ShieldCheck, CheckSquare, MapPin, Package, ClipboardList, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";
import WhichGrowmax from "@/components/ui/WhichGrowmax";

const painPoints = [
  {
    icon: DollarSign,
    title: "Contract & Compliance Pricing",
    problem: "Government agencies, large industrials, and healthcare systems all have negotiated safety supply contracts — but managing compliance-mandated pricing across accounts is impossible in spreadsheets.",
    solution: "Growmax's contract pricing engine handles GSA schedules, corporate safety program pricing, and compliance-mandated product lists. Every account sees their exact contracted pricing and approved product catalog."
  },
  {
    icon: AlertTriangle,
    title: "Regulatory Compliance Tracking",
    problem: "OSHA, ANSI, and NFPA standards require specific PPE for different job classifications — but your system can't enforce compliance-based product requirements per customer.",
    solution: "Compliance-based catalogs with product certification tracking, regulatory standard tagging, and automated enforcement of required PPE per job classification and industry segment."
  },
  {
    icon: Users,
    title: "Multi-Site Safety Programs",
    problem: "Large industrial accounts have dozens of facilities with different PPE requirements, budgets, and approval workflows — all managed through one overwhelmed safety coordinator.",
    solution: "Hierarchical account management with site-level PPE programs, budget controls per location, automated reorder triggers, and consolidated reporting for corporate safety managers."
  },
  {
    icon: Package,
    title: "Sizing & Fit Complexity",
    problem: "PPE comes in multiple sizes, fits, and configurations — gloves alone have 8+ size options per SKU, and wrong sizing means returns and safety violations.",
    solution: "Size-matrix ordering with employee profile management, saved size preferences per worker, and bulk sizing programs for new hire onboarding kits."
  },
  {
    icon: ShieldCheck,
    title: "Product Certification & Documentation",
    problem: "Customers need product certifications, test reports, and compliance documentation for audits — but it's scattered across vendor websites and email attachments.",
    solution: "Integrated certification library with ANSI/ISEA ratings, NFPA compliance docs, and test reports attached to every product. Audit-ready documentation accessible from order history."
  },
  {
    icon: Truck,
    title: "Emergency & Expedited Orders",
    problem: "Safety supply shortages create urgent compliance risks — but your system treats emergency PPE orders the same as standard restocks.",
    solution: "Priority order flagging with emergency fulfillment workflows, expedited shipping options, and automated alerts for critical safety supply stockouts across customer sites."
  }
];

const regions = [
  { state: "Texas", cities: "Houston, Dallas-Fort Worth, Midland-Odessa", note: "Oil & gas drives massive PPE demand" },
  { state: "Louisiana", cities: "Baton Rouge, New Orleans, Lake Charles", note: "Petrochemical corridor with strict safety mandates" },
  { state: "Pennsylvania", cities: "Philadelphia, Pittsburgh, Allentown", note: "Industrial heartland with heavy manufacturing PPE needs" },
  { state: "Ohio", cities: "Cleveland, Columbus, Cincinnati", note: "Major manufacturing and construction safety market" },
  { state: "California", cities: "Los Angeles, San Francisco, Bakersfield", note: "Strict Cal/OSHA requirements drive specialized PPE demand" },
  { state: "Illinois", cities: "Chicago, Rockford, Peoria", note: "Midwest industrial safety distribution hub" }
];

const products = [
  "Head Protection",
  "Eye & Face Protection",
  "Hand Protection",
  "Respiratory Protection",
  "Fall Protection",
  "High-Visibility Clothing",
  "Hearing Protection",
  "Protective Footwear",
  "Arc Flash Protection",
  "Gas Detection Equipment"
];

const faqs = [
  {
    question: "How does Growmax handle PPE sizing and fit management?",
    answer: "Growmax includes size-matrix ordering that lets customers manage employee PPE profiles with saved size preferences. When ordering gloves, hard hats, or respirators, the system pre-selects the correct sizes for each worker, reducing returns and ensuring proper fit compliance."
  },
  {
    question: "Can Growmax enforce compliance-based product requirements?",
    answer: "Yes. Growmax supports compliance-based catalogs where products are tagged with regulatory standards (OSHA, ANSI, NFPA). Safety managers can configure required PPE per job classification, and the system enforces that only approved, compliant products are ordered for each site."
  },
  {
    question: "How does multi-site safety program management work?",
    answer: "Growmax supports hierarchical account structures where a corporate safety manager oversees PPE programs across multiple facilities. Each site can have its own PPE requirements, budgets, and approval workflows while reporting rolls up to the corporate level for consolidated visibility."
  },
  {
    question: "Does Growmax provide product certification documentation?",
    answer: "Absolutely. Every safety product in Growmax includes attached certification documents, ANSI/ISEA ratings, NFPA compliance documentation, and test reports. Customers can access audit-ready documentation directly from product pages and order history."
  },
  {
    question: "Can Growmax handle emergency PPE orders?",
    answer: "Yes. Growmax includes priority order flagging with emergency fulfillment workflows, expedited shipping options, and automated stockout alerts. When a critical safety supply runs low at any customer site, the system can trigger automatic reorders to prevent compliance gaps."
  }
];

export default function SafetyPpe() {
  const structuredData = [
    webPageSchema({
      title: "B2B eCommerce for Safety & PPE Distributors",
      description: "Revenue operations platform for safety and PPE distributors. Compliance-based catalogs, size-matrix ordering, multi-site safety programs, and certification tracking.",
      path: "/industries/safety-ppe",
      keywords: [
        "B2B ecommerce safety distributors",
        "PPE distributor ordering platform",
        "safety supply wholesale portal",
        "PPE compliance ordering system",
        "safety equipment distribution software",
        "industrial safety supply ecommerce"
      ]
    }),
    faqPageSchema({
      title: "Safety & PPE Distribution FAQ",
      path: "/industries/safety-ppe",
      faqs
    })
  ];

  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="B2B eCommerce for Safety & PPE Distributors | Growmax"
        description="Revenue operations platform for safety and PPE distributors. Compliance-based catalogs, size-matrix ordering, multi-site safety programs, and product certification tracking for industrial safety wholesale."
        path="/industries/safety-ppe"
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
                  { label: "Safety & PPE" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-industry-label">
                Industry // Safety & PPE Distribution
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                Revenue Operations<br />
                for Safety & PPE<br />
                <span className="text-growmax-red">Distributors.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                From hard hats to arc flash protection — the connected platform that handles compliance-based catalogs, size-matrix ordering, multi-site safety programs, and emergency fulfillment for industrial safety wholesale.
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
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Safety & PPE Distribution Stack</div>
              <div className="space-y-3">
                <div className="border border-growmax-black bg-white p-4 text-center font-bold text-sm uppercase tracking-tight">
                  Safety Managers • EHS Directors • Procurement Teams
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Self-Order Portal</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Safety Programs</div>
                  <div className="border-2 border-growmax-red bg-growmax-red/5 p-3 text-center font-mono text-[10px] text-growmax-red uppercase tracking-widest font-bold">Compliance Portal</div>
                </div>
                <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-growmax-black rotate-90" /></div>
                <div className="border border-growmax-black bg-growmax-black text-white p-4 flex justify-between items-center font-mono">
                  <div className="text-[10px] uppercase w-1/4 text-center">Pricing</div>
                  <div className="text-[10px] uppercase w-1/4 text-center">Sizing</div>
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
                <HardHat className="w-3 h-3 text-growmax-red" />
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
              We Know Safety & PPE Distribution
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges every safety and PPE distributor faces — and how Growmax solves each one.
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
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Case Study // Industrial Safety</div>
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-casestudy-title">Safety Distributor Digitizes PPE Programs</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                A regional safety distributor serving 500+ industrial accounts needed to digitize their PPE program management and automate size-matrix ordering for clients across oil & gas, manufacturing, and construction.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Growmax deployed a compliance-based ordering portal with employee size profiles, automated reorder triggers, and integrated certification tracking. Safety managers now manage PPE programs for 10,000+ workers through a single dashboard.
                </p>
              </div>
              <div className="flex gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-orders">↑ 45%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Online Order Volume</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-returns">↓ 70%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Sizing-Related Returns</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">Why Safety & PPE Distributors Choose Growmax</div>
              <div className="space-y-6">
                {[
                  "Compliance-based catalogs with OSHA, ANSI, and NFPA standard tagging",
                  "Size-matrix ordering with saved employee PPE profiles",
                  "Multi-site safety program management with budget controls",
                  "Integrated product certification and compliance documentation",
                  "Emergency fulfillment workflows with priority order flagging",
                  "Automated reorder triggers for critical safety supplies",
                  "Contract pricing with GSA schedule and corporate program support",
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
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Regional Focus</div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6 uppercase" data-testid="text-regional-title">
              Industrial Heartland & Energy Corridor
            </h2>
            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
              Purpose-built for the safety and PPE distribution markets serving America's most demanding industrial environments.
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
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Safety & PPE Distribution Keywords We Serve</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "B2B ecommerce safety distributors",
              "PPE distributor ordering platform",
              "safety supply wholesale portal",
              "PPE compliance ordering system",
              "industrial safety ecommerce",
              "PPE program management software",
              "safety equipment wholesale platform",
              "PPE sizing management system",
              "safety distributor ERP integration",
              "industrial PPE ordering portal"
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
                <p className="text-sm text-gray-600 font-light leading-relaxed">Complex configuration, multi-tier pricing, and partner portals for industrial manufacturers.</p>
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

      <WhichGrowmax industry="Safety & PPE" />
    </div>
  );
}