import { Link } from "wouter";
import { Check, X, ArrowRight, Star, Globe, Smartphone, DollarSign, Package, Zap, Building2, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema, faqPageSchema } from "@/lib/structuredData";

const competitors = [
  {
    name: "Growmax Enterprise",
    tagline: "Multi-Party Revenue Ecosystem for Industrial Manufacturers",
    highlight: true,
    description: "The intelligent revenue operations platform that connects your entire ecosystem — sales reps, partners, dealers, and customers — on one platform with full visibility. Where NetSuite SuiteCommerce bundles commerce into an ERP monolith, Growmax Enterprise delivers best-of-breed multi-party revenue operations with native SAP ECC/S4HANA integration.",
    pros: [
      "Multi-party ecosystem: Brand → Sales Reps → Partners → Customers with 100% visibility",
      "Native SAP ECC/S4HANA integration with bidirectional sync",
      "Multi-version quote workflows with approval engine",
      "Partner commerce portal for dealer and channel networks",
      "Offline-capable mobile app for field sales reps (iOS & Android)",
      "2-4 week implementation vs. NetSuite's 6-12 months",
    ],
    cons: [
      "Focused on B2B industrial — not designed for B2C retail",
      "Doesn't include ERP/accounting (by design — it integrates with yours)",
    ],
    pricing: "Custom pricing",
    bestFor: "Industrial manufacturers with 100+ employees, partner/dealer networks, and complex multi-party revenue operations",
    rating: "4.8",
  },
  {
    name: "BigCommerce B2B",
    tagline: "Best B2C+B2B Hybrid Alternative",
    highlight: false,
    description: "BigCommerce B2B Edition provides a standalone commerce platform with NetSuite integration available through connectors. Good for companies wanting to decouple commerce from ERP.",
    pros: [
      "SaaS with no infrastructure to manage",
      "NetSuite integration via certified connectors",
      "Large app marketplace (1,000+ apps)",
      "Good for B2C + B2B hybrid businesses",
    ],
    cons: [
      "B2B features are add-ons, not native",
      "NetSuite integration requires middleware",
      "No offline mobile app for field sales",
      "Customer-specific pricing is basic",
      "No partner commerce portal",
    ],
    pricing: "From ~$400/mo",
    bestFor: "Companies on NetSuite wanting a standalone commerce platform with B2C capabilities",
    rating: "4.3",
  },
  {
    name: "Sana Commerce",
    tagline: "ERP-Integrated Commerce",
    highlight: false,
    description: "Sana Commerce integrates with Microsoft Dynamics and SAP Business One. While it doesn't directly connect to NetSuite, it's a popular alternative for companies migrating to Dynamics or SAP.",
    pros: [
      "Deep ERP integration (Dynamics/SAP B1)",
      "Real-time ERP data without duplication",
      "Self-service customer portal",
      "Content management built in",
    ],
    cons: [
      "No NetSuite integration — requires ERP switch",
      "High implementation costs ($50K-$200K+)",
      "No offline mobile app",
      "No multi-party ecosystem support",
      "4-8 month implementation",
    ],
    pricing: "Custom (~$1,500+/mo + implementation)",
    bestFor: "Companies migrating from NetSuite to Dynamics or SAP B1",
    rating: "4.2",
  },
  {
    name: "Shopify Plus",
    tagline: "Simplest Standalone Commerce",
    highlight: false,
    description: "Shopify Plus offers the simplest commerce experience if you want to fully decouple from NetSuite for your storefront. NetSuite integration available through Celigo and other middleware.",
    pros: [
      "World-class UX and ease of use",
      "Fastest time-to-launch",
      "Massive app ecosystem",
      "Good for DTC with wholesale channel",
    ],
    cons: [
      "B2B features are basic — designed for DTC brands",
      "No customer-specific pricing with volume brackets",
      "NetSuite integration requires middleware ($500+/mo)",
      "No offline mobile app or field sales tools",
      "No multi-warehouse inventory management",
      "Transaction fees add up",
    ],
    pricing: "From $2,300/mo",
    bestFor: "DTC brands on NetSuite wanting the simplest storefront",
    rating: "4.5",
  },
  {
    name: "OroCommerce",
    tagline: "Open-Source Enterprise B2B",
    highlight: false,
    description: "OroCommerce offers an open-source B2B platform with multi-organization architecture. NetSuite integration requires custom development, but the platform is powerful for complex B2B scenarios.",
    pros: [
      "Purpose-built for B2B from the ground up",
      "Multi-organization and multi-storefront",
      "Built-in CRM (OroCRM)",
      "Open-source flexibility",
    ],
    cons: [
      "No native NetSuite integration",
      "Requires PHP/Symfony developers",
      "Expensive enterprise edition",
      "6-12 month implementation",
      "No offline mobile app",
    ],
    pricing: "Custom (~$45K+/year)",
    bestFor: "Large enterprises wanting open-source B2B commerce with custom NetSuite integration",
    rating: "4.1",
  },
];

const featureComparison = [
  { category: "B2B Commerce", items: [
    { feature: "B2B Self-Service Portal", growmax: true, bigcommerce: true, sana: true, shopify: true, oro: true },
    { feature: "Customer-Specific Pricing", growmax: true, bigcommerce: true, sana: true, shopify: false, oro: true },
    { feature: "Volume Bracket Pricing", growmax: true, bigcommerce: false, sana: true, shopify: false, oro: true },
    { feature: "Quote-to-Order Workflow", growmax: true, bigcommerce: false, sana: false, shopify: false, oro: true },
    { feature: "Purchase Order Support", growmax: true, bigcommerce: true, sana: true, shopify: true, oro: true },
    { feature: "Partner Commerce Portal", growmax: true, bigcommerce: false, sana: false, shopify: false, oro: false },
  ]},
  { category: "Mobile & Field Sales", items: [
    { feature: "Native Mobile App", growmax: true, bigcommerce: false, sana: false, shopify: false, oro: false },
    { feature: "Offline Ordering", growmax: true, bigcommerce: false, sana: false, shopify: false, oro: false },
    { feature: "GPS Visit Logging", growmax: true, bigcommerce: false, sana: false, shopify: false, oro: false },
  ]},
  { category: "Integrations", items: [
    { feature: "Native SAP ECC/S4HANA Integration", growmax: true, bigcommerce: false, sana: true, shopify: false, oro: false },
    { feature: "Native SAP Integration", growmax: true, bigcommerce: false, sana: true, shopify: false, oro: false },
    { feature: "QuickBooks Integration", growmax: true, bigcommerce: true, sana: false, shopify: true, oro: false },
    { feature: "Multi-Warehouse Inventory", growmax: true, bigcommerce: false, sana: true, shopify: false, oro: true },
    { feature: "API Access", growmax: true, bigcommerce: true, sana: true, shopify: true, oro: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "Custom pricing", bigcommerce: "~$400/mo", sana: "~$1,500+/mo", shopify: "$2,300/mo", oro: "~$45K+/yr" },
  { label: "Setup Fee", growmax: "Custom", bigcommerce: "$0", sana: "$50K-$200K+", shopify: "$0", oro: "$20K-$100K+" },
  { label: "Implementation", growmax: "2-4 weeks", bigcommerce: "2-4 months", sana: "4-8 months", shopify: "1-3 months", oro: "6-12 months" },
  { label: "Mobile App", growmax: "Included", bigcommerce: "No", sana: "No", shopify: "No", oro: "No" },
  { label: "ERP Flexibility", growmax: "SAP/Epicor", bigcommerce: "Middleware", sana: "SAP/Dynamics", shopify: "Middleware", oro: "Custom" },
];

const whyNetSuiteUsersSwitch = [
  {
    icon: DollarSign,
    title: "NetSuite Licensing Is Crushing Your Margins",
    description: "NetSuite SuiteCommerce costs $999+/mo on top of your existing NetSuite ERP license. Combined with per-user fees, customization costs, and SuiteCloud development, total commerce costs easily exceed $50K+/year. Growmax Enterprise offers purpose-built multi-party revenue operations at competitive custom pricing."
  },
  {
    icon: Clock,
    title: "SuiteCommerce Implementations Take Too Long",
    description: "Typical SuiteCommerce implementations take 6-12 months with specialized NetSuite developers. By the time you launch, your requirements have changed. Growmax Enterprise deploys in 2-4 weeks."
  },
  {
    icon: Smartphone,
    title: "No Real Mobile Experience for B2B",
    description: "SuiteCommerce offers a responsive web design but no native mobile app. Industrial field sales reps need offline ordering, GPS visit logging, and native performance — not a responsive website."
  },
  {
    icon: Building2,
    title: "Locked Into the NetSuite Ecosystem",
    description: "SuiteCommerce only works with NetSuite ERP. If you ever switch ERPs or migrate divisions to SAP, you're starting over. Growmax Enterprise integrates natively with SAP ECC/S4HANA and Epicor."
  },
  {
    icon: Package,
    title: "B2B Features Are Secondary to B2C",
    description: "SuiteCommerce was designed primarily for B2C retail. B2B features like customer-specific pricing, partner portals, and quote management are afterthoughts compared to purpose-built B2B platforms."
  },
  {
    icon: ShieldCheck,
    title: "Your Commerce Should Be Best-of-Breed",
    description: "The 'all-in-one ERP' approach means compromising on commerce capabilities. Best-of-breed B2B commerce platforms deliver deeper functionality while still integrating with your ERP."
  },
];

const faqs = [
  {
    question: "What is the best alternative to NetSuite SuiteCommerce?",
    answer: "Growmax Enterprise is the best alternative for industrial manufacturers with 100+ employees, offering a multi-party revenue ecosystem with native SAP integration, multi-version quote workflows, partner portals, and dealer management. For B2C-focused businesses, Shopify Plus offers the simplest alternative."
  },
  {
    question: "Can I use a different eCommerce platform with NetSuite ERP?",
    answer: "Yes. You can keep NetSuite as your ERP while using a separate best-of-breed commerce platform. Growmax Enterprise integrates natively with SAP ECC/S4HANA and Epicor, with API connectivity for other ERPs. BigCommerce and Shopify Plus also offer NetSuite connectors through middleware."
  },
  {
    question: "How much does NetSuite SuiteCommerce cost?",
    answer: "NetSuite SuiteCommerce typically costs $999+/month on top of your existing NetSuite ERP license ($999+/month). Add per-user fees, SuiteCloud development costs, and implementation services ($50-200K+), and total first-year costs often exceed $100K. Growmax Enterprise offers custom pricing with dramatically lower total cost of ownership."
  },
  {
    question: "Is NetSuite SuiteCommerce good for B2B?",
    answer: "SuiteCommerce has basic B2B capabilities but was primarily designed for B2C retail. It lacks key B2B features like multi-party ecosystem management, multi-version quote workflows, advanced partner portals, and deep multi-ERP integration. Purpose-built platforms like Growmax Enterprise offer significantly more depth for manufacturers with partner networks."
  },
];

export default function NetSuiteSuiteCommerceAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best NetSuite SuiteCommerce Alternatives & Competitors in 2026 | Growmax"
        description="Compare the best NetSuite SuiteCommerce alternatives for B2B distributors: Growmax, BigCommerce, Sana Commerce, Shopify Plus, and OroCommerce. Feature comparison, pricing, and migration guide."
        path="/comparisons/netsuite-suitecommerce-alternatives"
        structuredData={[
          webPageSchema({
            title: "Best NetSuite SuiteCommerce Alternatives & Competitors in 2026",
            description: "Comprehensive comparison of NetSuite SuiteCommerce alternatives for B2B distributors.",
            path: "/comparisons/netsuite-suitecommerce-alternatives",
            keywords: ["netsuite suitecommerce alternatives", "netsuite alternatives", "suitecommerce competitors", "netsuite ecommerce alternative"],
          }),
          faqPageSchema({
            title: "NetSuite SuiteCommerce Alternatives FAQ",
            path: "/comparisons/netsuite-suitecommerce-alternatives",
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
                { label: "Comparisons" },
                { label: "NetSuite SuiteCommerce Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Competitive Analysis // NetSuite SuiteCommerce Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best NetSuite<br/>
              SuiteCommerce<br/>
              <span className="text-gray-400">Alternatives in 2026.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              NetSuite SuiteCommerce bundles eCommerce into the ERP monolith — but at what cost? Compare best-of-breed B2B commerce platforms that deliver deeper functionality, faster implementation, and lower total cost of ownership.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Switch</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Companies Are Leaving NetSuite SuiteCommerce</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="section-why-switch">
            {whyNetSuiteUsersSwitch.map((item, i) => (
              <div key={i} className="border border-gray-800 p-8 hover:border-growmax-red transition-colors group" data-testid={`card-reason-${i}`}>
                <item.icon className="w-10 h-10 text-growmax-red mb-6" />
                <h3 className="text-xl font-bold mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Platform Reviews</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Top 5 NetSuite SuiteCommerce Alternatives</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>
          <div className="space-y-8" data-testid="section-competitor-cards">
            {competitors.map((comp, i) => (
              <div key={i} className={`border-2 p-8 md:p-10 ${comp.highlight ? "border-growmax-red shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" : "border-gray-200"}`} data-testid={`card-competitor-${i}`}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold tracking-tight text-growmax-black">{comp.name}</h3>
                      {comp.highlight && (
                        <span className="bg-growmax-red text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 font-bold" data-testid="badge-recommended">Recommended</span>
                      )}
                    </div>
                    <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold mb-3">{comp.tagline}</div>
                    <p className="text-gray-600 font-light leading-relaxed max-w-2xl">{comp.description}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="flex items-center gap-1 justify-end mb-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-mono text-sm font-bold text-growmax-black">{comp.rating}/5</span>
                    </div>
                    <div className="font-mono text-xs text-gray-500 uppercase tracking-widest">{comp.pricing}</div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="font-mono text-xs text-green-700 uppercase tracking-widest font-bold mb-4">Pros</div>
                    <div className="space-y-3">
                      {comp.pros.map((pro, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{pro}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-mono text-xs text-red-700 uppercase tracking-widest font-bold mb-4">Cons</div>
                    <div className="space-y-3">
                      {comp.cons.map((con, j) => (
                        <div key={j} className="flex items-start gap-3">
                          <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{con}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="font-mono text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Best For</div>
                  <p className="text-sm text-gray-600 font-light">{comp.bestFor}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Feature Matrix</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4">Feature-by-Feature Comparison</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>
          <div className="overflow-x-auto">
            {featureComparison.map((group, gi) => (
              <div key={gi} className="mb-12" data-testid={`section-features-${gi}`}>
                <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">{group.category}</div>
                <div className="border border-gray-800 min-w-[800px]">
                  <div className="grid grid-cols-6 border-b border-gray-800 bg-gray-900">
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase">Feature</div>
                    <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-gray-800 font-bold">Growmax Enterprise</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">BigCommerce</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Sana</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Shopify Plus</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">OroCommerce</div>
                  </div>
                  {group.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors" data-testid={`row-feature-${gi}-${i}`}>
                      <div className="p-4 font-mono text-sm text-gray-300">{item.feature}</div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.growmax ? <Check className="w-5 h-5 text-growmax-red" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.bigcommerce ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.sana ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.shopify ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                      <div className="p-4 flex justify-center items-center border-l border-gray-800">
                        {item.oro ? <Check className="w-5 h-5 text-gray-500" /> : <X className="w-5 h-5 text-gray-700" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Commercials</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Pricing Comparison</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>
          <div className="overflow-x-auto">
            <div className="border border-growmax-black min-w-[800px]" data-testid="section-pricing-comparison">
              <div className="grid grid-cols-6 border-b border-growmax-black bg-gray-50">
                <div className="p-4 font-mono text-xs text-gray-500 uppercase"></div>
                <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-growmax-black font-bold">Growmax Enterprise</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">BigCommerce</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Sana</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Shopify Plus</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">OroCommerce</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.bigcommerce}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.sana}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.shopify}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.oro}</div>
                </div>
              ))}
            </div>
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

      <section className="py-24 bg-growmax-red text-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
          <h2 className="text-4xl font-bold tracking-tighter mb-6">Ready to Break Free from SuiteCommerce?</h2>
          <p className="text-xl font-light mb-8 opacity-90 max-w-2xl mx-auto">
            See why industrial distributors are choosing best-of-breed B2B commerce over bundled ERP modules. Deploy in weeks, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="bg-white text-growmax-red hover:bg-gray-100 rounded-none font-bold px-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]" data-testid="button-cta-demo">
                Schedule a Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/arc">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-none font-bold px-8" data-testid="button-cta-arc">
                Explore Growmax ARC
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
