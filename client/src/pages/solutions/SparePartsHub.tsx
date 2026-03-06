import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Wrench, DollarSign, Package, TrendingUp, Search, ShieldCheck, CheckSquare, BarChart3, Layers, Cog, Truck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import { SchwingSttetterLogo } from "@/components/ui/ClientLogos";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";

const sparePartsTypes = [
  {
    icon: Cog,
    title: "OEM Manufacturers",
    description: "Equipment manufacturers selling genuine replacement parts through dealer networks and direct-to-customer portals.",
    examples: "Pumps, compressors, turbines, CNC machines, construction equipment"
  },
  {
    icon: Truck,
    title: "Aftermarket Distributors",
    description: "Independent distributors stocking compatible parts from multiple brands for equipment maintenance and repair.",
    examples: "Automotive parts, hydraulic components, bearings, seals, filters"
  },
  {
    icon: Wrench,
    title: "MRO Suppliers",
    description: "Maintenance, repair, and operations suppliers providing consumable and replacement parts for industrial facilities.",
    examples: "Electrical components, fasteners, lubricants, safety equipment"
  },
  {
    icon: Users,
    title: "Multi-Brand Dealers",
    description: "Authorized dealers representing multiple equipment brands, managing complex part catalogs across product lines.",
    examples: "Agricultural equipment, material handling, HVAC systems"
  }
];

const challenges = [
  {
    icon: Search,
    title: "Part Identification Complexity",
    problem: "Customers don't know part numbers. They describe parts by appearance, equipment model, or old superseded numbers from 15-year-old manuals.",
    solution: "Equipment-linked catalogs with serial number lookup, exploded-view navigation, AI visual identification, and supersession chain mapping. Customers find the right part in seconds."
  },
  {
    icon: DollarSign,
    title: "Pricing Strategy Chaos",
    problem: "OEM vs aftermarket pricing, customer-specific contracts, volume tiers, and emergency markup rules scattered across spreadsheets and ERP systems.",
    solution: "Centralized pricing engine with contract management, customer-tier pricing, emergency markup rules, and competitive price monitoring. Every channel gets the right price automatically."
  },
  {
    icon: Package,
    title: "Inventory Fragmentation",
    problem: "100K+ SKUs across multiple warehouses with intermittent demand patterns — 80% of parts account for just 5% of revenue. Stockouts on critical parts cost thousands.",
    solution: "Multi-warehouse inventory orchestration with demand forecasting, safety stock optimization, and intelligent allocation. Real-time ATP checks prevent overselling."
  },
  {
    icon: TrendingUp,
    title: "Missed Revenue Opportunities",
    problem: "30-50% of potential aftermarket revenue leaks because customers can't find parts, don't know they need maintenance, or buy from aftermarket competitors.",
    solution: "AI-powered recommendations, automated reorder reminders based on maintenance schedules, and cross-sell suggestions that capture revenue at every touchpoint."
  },
  {
    icon: Layers,
    title: "Catalog Complexity at Scale",
    problem: "Managing product hierarchies with equipment-to-assembly-to-part relationships, fitment data, compatibility matrices, and supersession chains across thousands of equipment models.",
    solution: "Hierarchical catalog management with BOM integration, fitment validation, cross-reference search, and automated supersession chain updates from ERP master data."
  },
  {
    icon: ShieldCheck,
    title: "Warranty & Returns Friction",
    problem: "Warranty claims require manual verification of equipment serial numbers, purchase history, and coverage terms — delaying resolution and frustrating customers.",
    solution: "Integrated warranty management linking parts orders to equipment serial numbers, automated coverage verification, and streamlined claim-to-credit workflows."
  }
];

const revenueStats = [
  { value: "30-50%", label: "Of total revenue from spare parts for typical manufacturers", icon: DollarSign },
  { value: "2-5x", label: "Higher margins on spare parts vs. original equipment sales", icon: TrendingUp },
  { value: "25-40%", label: "Revenue increase with purpose-built spare parts platform", icon: BarChart3 },
  { value: "40%+", label: "Reduction in support calls with self-service portals", icon: Users }
];

const inventoryStrategies = [
  {
    title: "ABC-XYZ Classification",
    description: "Combine revenue impact (ABC) with demand predictability (XYZ) to optimize stocking levels. A-X parts get maximum availability; C-Z parts are made-to-order."
  },
  {
    title: "Safety Stock Optimization",
    description: "Calculate optimal safety stock using service level targets, lead times, and demand variability — not arbitrary rules of thumb."
  },
  {
    title: "Demand Sensing",
    description: "Use equipment operating hours, maintenance schedules, and seasonal patterns to predict demand before orders arrive."
  },
  {
    title: "Multi-Echelon Inventory",
    description: "Optimize stock placement across central warehouses, regional DCs, and dealer locations to minimize total inventory cost while maximizing fill rates."
  }
];

const pricingStrategies = [
  {
    title: "Value-Based Pricing",
    description: "Price parts based on criticality and downtime cost, not just cost-plus markup. A $5 seal that prevents a $50K/day production shutdown commands premium pricing."
  },
  {
    title: "Competitive Monitoring",
    description: "Track aftermarket competitor pricing in real-time. Adjust prices dynamically to maintain margins where you have captive demand, compete aggressively on commodity parts."
  },
  {
    title: "Contract & SPA Management",
    description: "Manage customer-specific pricing agreements, volume rebates, and special pricing authorizations with automated expiry and renewal tracking."
  },
  {
    title: "Emergency vs. Planned Pricing",
    description: "Differentiate pricing for emergency orders (expedited) vs. planned maintenance orders (standard). Incentivize planned ordering to reduce fulfillment costs."
  }
];

const faqItems = [
  {
    question: "What percentage of revenue do spare parts typically represent for manufacturers?",
    answer: "For most industrial equipment manufacturers, aftermarket spare parts represent 30-50% of total revenue and often carry 2-5x higher margins than original equipment sales. Companies like Caterpillar, Komatsu, and Siemens generate billions annually from parts and service alone."
  },
  {
    question: "How do I sell spare parts online effectively?",
    answer: "Selling spare parts online requires a purpose-built platform that handles part identification complexity (serial number lookup, cross-reference search, visual identification), equipment-based navigation, customer-specific pricing, and integration with your ERP for real-time inventory and pricing. Generic eCommerce platforms fail because they don't support these specialized workflows."
  },
  {
    question: "What is a spare parts eCommerce platform?",
    answer: "A spare parts eCommerce platform is a specialized B2B commerce system designed for manufacturers and distributors to sell replacement parts online. Unlike generic eCommerce, it includes equipment-to-part mapping, BOM navigation, supersession chain management, warranty integration, and AI-powered part identification capabilities."
  },
  {
    question: "How can I increase spare parts sales for my manufacturing business?",
    answer: "Key strategies include: deploying a self-service ordering portal (captures orders 24/7), implementing AI-powered recommendations (increases basket size 18-25%), sending automated reorder reminders based on maintenance schedules, offering emergency ordering with expedited fulfillment, and providing visual part identification to reduce identification friction."
  },
  {
    question: "What is spare parts inventory management?",
    answer: "Spare parts inventory management involves optimizing stock levels for replacement components across multiple locations. It requires ABC-XYZ classification, demand sensing based on equipment operating hours, safety stock optimization using service level targets, and multi-echelon inventory planning across central warehouses, regional DCs, and dealer locations."
  },
  {
    question: "How does Growmax handle spare parts for manufacturers?",
    answer: "Growmax provides a connected platform with equipment-linked catalogs, serial number lookup, AI visual identification, multi-tier pricing, and ERP integration. Manufacturers use Growmax to power dealer spare parts portals, customer self-service ordering, and field technician mobile apps — all connected to SAP or other ERP systems for real-time inventory and pricing."
  }
];

const blogLinks = [
  {
    slug: "spare-parts-ecommerce-self-service-portal",
    title: "Self-Service Spare Parts Portal: Reducing Support Costs While Increasing Revenue",
    category: "Self-Service"
  },
  {
    slug: "manufacturers-dedicated-spare-parts-ordering-system",
    title: "Why Manufacturers Need a Dedicated Spare Parts Ordering System",
    category: "Strategy"
  },
  {
    slug: "spare-parts-pricing-strategy-margin-retention",
    title: "Spare Parts Pricing Strategy: Balancing Margin and Customer Retention",
    category: "Pricing"
  },
  {
    slug: "spare-parts-identification-ai-visual-lookup",
    title: "Spare Parts Identification: Using AI for Visual Part Lookup",
    category: "Technology"
  },
  {
    slug: "ai-powered-product-recommendations-spare-parts",
    title: "AI-Powered Product Recommendations for B2B Spare Parts Catalogs",
    category: "AI & ML"
  }
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map(item => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer
    }
  }))
};

export default function SparePartsHub() {
  const structuredData = webPageSchema({
    title: "The Complete Guide to Spare Parts eCommerce for Manufacturers",
    description: "Everything manufacturers need to know about selling spare parts online. Part identification, pricing strategies, inventory management, and how to capture 30-50% of revenue from aftermarket parts.",
    path: "/solutions/spare-parts-ecommerce",
    keywords: [
      "spare parts ecommerce",
      "sell spare parts online",
      "spare parts business",
      "spare parts management",
      "how to increase spare parts sales",
      "spare parts inventory management",
      "spare parts pricing strategy",
      "aftermarket parts ecommerce",
      "spare parts portal",
      "spare parts ordering system"
    ]
  });

  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Spare Parts eCommerce for Manufacturers | Complete Guide"
        description="The complete guide to selling spare parts online. Part identification, pricing strategies, inventory management, and how to capture 30-50% of aftermarket revenue with a purpose-built platform."
        path="/solutions/spare-parts-ecommerce"
        structuredData={structuredData}
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <section className="pt-24 pb-24 border-b border-gray-200 bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="mb-6">
                <Breadcrumbs items={[
                  { label: "Solutions" },
                  { label: "Spare Parts eCommerce" },
                ]} />
              </div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-solution-label">
                Pillar Guide // Spare Parts eCommerce
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-hero-title">
                The Complete Guide<br />
                to Spare Parts<br />
                <span className="text-growmax-red">eCommerce.</span>
              </h1>
              <div className="w-16 h-2 bg-growmax-black mb-8"></div>
              <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-lg" data-testid="text-hero-description">
                Spare parts represent 30-50% of revenue for most manufacturers — yet most sell them through phone calls, faxes, and spreadsheets. This guide covers everything you need to sell spare parts online profitably.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/demo">
                  <Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-8 text-lg rounded-none transition-colors duration-300 font-bold tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5" data-testid="button-request-demo">
                    See Spare Parts Platform <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block bg-growmax-gray border-2 border-growmax-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-growmax-red animate-pulse"></div>
              </div>
              <div className="font-mono text-xs text-growmax-black mb-6 uppercase font-bold tracking-widest">Spare Parts Revenue Impact</div>

              <div className="space-y-4">
                {revenueStats.map((stat, i) => (
                  <div key={i} className="border border-growmax-black bg-white p-4 flex items-center gap-4">
                    <stat.icon className="w-8 h-8 text-growmax-red shrink-0" />
                    <div>
                      <div className="text-2xl font-bold font-mono text-growmax-black" data-testid={`text-stat-${i}`}>{stat.value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-growmax-black text-white border-b-4 border-growmax-red">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter uppercase mb-4" data-testid="text-revenue-headline">
            Why Spare Parts Matter: <span className="text-growmax-red">30-50% of Revenue</span>
          </h2>
          <p className="text-lg text-gray-400 font-light max-w-3xl mx-auto">
            For companies like Caterpillar, Komatsu, and Siemens, aftermarket parts and service generate billions annually — often with 2-5x higher margins than original equipment. Yet most mid-market manufacturers still handle parts through phone calls and faxes.
          </p>
        </div>
      </section>

      <section className="py-32 bg-growmax-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Types of Businesses</div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-6 uppercase" data-testid="text-types-title">
              Who Sells Spare Parts Online?
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Four distinct business models — each with unique requirements for digital spare parts commerce.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {sparePartsTypes.map((type, i) => (
              <div key={i} className="bg-white border-2 border-growmax-black p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid={`card-type-${i}`}>
                <type.icon className="w-12 h-12 text-growmax-red mb-6" />
                <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase">{type.title}</h3>
                <p className="text-gray-600 font-light mb-4">{type.description}</p>
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest font-bold">{type.examples}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white border-t-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Challenges // Solutions</div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-6 uppercase" data-testid="text-challenges-title">
              How to Sell Spare Parts Online
            </h2>
            <p className="text-xl text-gray-600 font-light border-b-2 border-growmax-black inline-block pb-4">
              Six critical challenges that make spare parts eCommerce fundamentally different from standard B2B commerce.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {challenges.map((challenge, i) => (
              <div key={i} className="bg-white border-2 border-growmax-black p-10 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid={`card-challenge-${i}`}>
                <challenge.icon className="w-12 h-12 text-growmax-red mb-6" />
                <h3 className="text-2xl font-bold mb-4 tracking-tight uppercase">{challenge.title}</h3>
                <div className="space-y-4 text-gray-600 font-light">
                  <p className="line-through decoration-gray-400 font-mono text-sm text-gray-400">{challenge.problem}</p>
                  <p className="font-mono text-sm bg-growmax-black text-white p-3 border-l-4 border-growmax-red">{challenge.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-growmax-black text-white bg-dots-dark">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Inventory Management</div>
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-inventory-title">
                Spare Parts Inventory Management
              </h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed mb-10">
                With 100K+ SKUs and intermittent demand patterns, spare parts inventory requires specialized approaches that go beyond standard min/max rules.
              </p>

              <div className="space-y-6">
                {inventoryStrategies.map((strategy, i) => (
                  <div key={i} className="border border-gray-700 bg-white/5 p-6 hover:border-growmax-red transition-colors duration-300" data-testid={`card-inventory-${i}`}>
                    <h3 className="font-bold text-lg uppercase tracking-tight mb-2">{strategy.title}</h3>
                    <p className="text-sm text-gray-400 font-light">{strategy.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Pricing Strategy</div>
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-pricing-title">
                Spare Parts Pricing Strategies
              </h2>
              <p className="text-xl text-gray-400 font-light leading-relaxed mb-10">
                Price too high and customers buy aftermarket. Price too low and you leave margin on the table. Smart pricing requires data, not guesswork.
              </p>

              <div className="space-y-6">
                {pricingStrategies.map((strategy, i) => (
                  <div key={i} className="border border-gray-700 bg-white/5 p-6 hover:border-growmax-red transition-colors duration-300" data-testid={`card-pricing-${i}`}>
                    <h3 className="font-bold text-lg uppercase tracking-tight mb-2">{strategy.title}</h3>
                    <p className="text-sm text-gray-400 font-light">{strategy.description}</p>
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
            <div className="lg:col-span-5">
              <div className="font-mono text-xs text-growmax-red font-bold uppercase mb-4 tracking-widest border-l-2 border-growmax-red pl-2">Case Study</div>
              <SchwingSttetterLogo className="h-10 w-auto mb-4" />
              <h2 className="text-5xl font-bold tracking-tighter mb-8 uppercase leading-[1.1]" data-testid="text-casestudy-title">Equipment Manufacturer Digitizes Spare Parts</h2>
              <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
                Schwing Stetter, a global leader in concrete technology, needed to transform how their 200+ dealers ordered spare parts for concrete pumps, batching plants, and transit mixers.
              </p>
              <div className="bg-gray-50 border border-gray-200 p-6 mb-8">
                <p className="text-sm font-mono text-gray-600 leading-relaxed">
                  Growmax deployed an equipment-linked spare parts portal where dealers navigate by machine model and serial number to find exact replacement parts. Integrated with SAP for real-time pricing, inventory, and order processing.
                </p>
              </div>

              <div className="flex gap-8 border-t-2 border-growmax-black pt-6">
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-efficiency">↑ 40%</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Parts Order Efficiency</div>
                </div>
                <div>
                  <div className="text-4xl font-bold font-mono text-growmax-black" data-testid="text-stat-dealers">200+</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest mt-1 font-bold">Dealers Connected</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-growmax-gray border-2 border-growmax-black p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
              <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest">How Growmax Powers Spare Parts Commerce</div>

              <div className="space-y-6">
                {[
                  "Equipment-linked catalogs with serial number and model lookup",
                  "AI-powered visual part identification from photos",
                  "Supersession chain mapping — old part numbers resolve to current equivalents",
                  "Customer-specific pricing with contract and SPA management",
                  "Multi-warehouse inventory with real-time ATP checks",
                  "Automated reorder reminders based on maintenance schedules",
                  "Self-service portal reducing support calls by 40%+",
                  "Native SAP and ERP integration for real-time pricing and inventory"
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

      <section className="py-32 bg-growmax-white border-t-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Content Hub</div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-6 uppercase" data-testid="text-blog-hub-title">
              Spare Parts Intelligence
            </h2>
            <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto">
              Deep-dive articles on every aspect of spare parts eCommerce — from AI-powered identification to pricing strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {blogLinks.map((post, i) => (
              <Link key={i} href={`/blog/${post.slug}`}>
                <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full flex flex-col" data-testid={`link-blog-${i}`}>
                  <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">{post.category}</div>
                  <h3 className="text-lg font-bold tracking-tight mb-4 uppercase flex-1">{post.title}</h3>
                  <div className="mt-auto font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">
                    Read Article <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white border-t-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">FAQ</div>
            <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-growmax-black mb-6 uppercase" data-testid="text-faq-title">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {faqItems.map((item, i) => (
              <div key={i} className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid={`card-faq-${i}`}>
                <h3 className="text-xl font-bold tracking-tight uppercase mb-4">{item.question}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-t-2 border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">Spare Parts eCommerce Keywords</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "spare parts ecommerce",
              "sell spare parts online",
              "spare parts business",
              "spare parts management",
              "how to increase spare parts sales",
              "spare parts inventory management",
              "spare parts pricing strategy",
              "aftermarket parts ecommerce",
              "spare parts ordering system",
              "bike spare parts online",
              "machine spare parts",
              "heavy equipment spare parts",
              "spare parts portal"
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
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Related</div>
            <h2 className="text-4xl font-bold tracking-tighter text-growmax-black uppercase mb-4" data-testid="text-related-title">See Also</h2>
            <div className="w-16 h-2 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-related-links">
            <Link href="/industries/industrial-manufacturing">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-industrial-manufacturing">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Industry</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Industrial Manufacturing</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Dealer portals, BOM management, and field service ordering for equipment manufacturers.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Explore <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/revenue-platform">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-revenue-platform">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Platform</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Revenue Platform</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Enterprise B2B commerce with native SAP integration, multi-warehouse orchestration, and CPQ engine.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Explore Platform <ArrowRight className="w-3 h-3" /></div>
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

      <section className="py-32 bg-growmax-black text-white text-center bg-dots-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tighter uppercase leading-[1.1]" data-testid="text-cta-title">
            Ready to capture your<br />spare parts revenue?
          </h2>
          <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl mx-auto">
            See how Growmax powers spare parts commerce for manufacturers — equipment-linked catalogs, AI part identification, and ERP integration. Live demo in 30 minutes.
          </p>
          <Link href="/demo">
            <Button className="mt-4 bg-growmax-red hover:bg-white hover:text-growmax-black text-white h-16 px-12 text-lg rounded-none transition-all duration-300 font-bold tracking-widest uppercase border-2 border-transparent hover:border-growmax-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-2 hover:translate-y-2" data-testid="button-schedule-demo">
              Schedule Parts Platform Demo
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}