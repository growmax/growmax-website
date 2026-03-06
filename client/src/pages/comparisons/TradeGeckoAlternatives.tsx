import { Link } from "wouter";
import { Check, X, ArrowRight, AlertTriangle, RefreshCw, Shield, Zap, Globe, Database, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/Breadcrumbs";
import SEOHead from "@/components/SEOHead";
import { webPageSchema } from "@/lib/structuredData";

const alternatives = [
  {
    name: "Growmax ARC",
    tagline: "Best for industrial distributors migrating from TradeGecko",
    highlight: true,
    pros: [
      "Native Zoho integration — natural migration path from TradeGecko's Zoho ecosystem",
      "Offline-capable mobile app for field sales reps",
      "Multi-warehouse inventory with intelligent allocation",
      "B2B customer self-ordering portal included",
      "Quote-to-order workflow with approval chains",
      "No QuickBooks lock-in — works with Zoho, SAP, QuickBooks",
    ],
    cons: [
      "Focused on B2B wholesale/distribution — not ideal for DTC brands",
      "No built-in manufacturing/BOM management",
    ],
    pricing: "From $199/mo",
    bestFor: "B2B distributors, manufacturers, and wholesalers who used TradeGecko for order management and want a platform without QuickBooks lock-in",
  },
  {
    name: "Cin7 Core (formerly DEAR Inventory)",
    tagline: "Inventory-first platform with manufacturing features",
    highlight: false,
    pros: [
      "Strong inventory management with BOM support",
      "Multi-channel selling (B2B + DTC)",
      "Built-in manufacturing module",
      "Integrates with major eCommerce platforms",
    ],
    cons: [
      "Complex pricing — costs escalate quickly with add-ons",
      "Steep learning curve for new users",
      "No offline mobile ordering capability",
      "Limited B2B portal customization",
    ],
    pricing: "From $349/mo",
    bestFor: "Small manufacturers who need inventory + light manufacturing in one tool",
  },
  {
    name: "Cin7 Omni",
    tagline: "Enterprise inventory and order management",
    highlight: false,
    pros: [
      "Advanced warehouse management (WMS) built in",
      "EDI support for large retail partners",
      "Multi-location inventory orchestration",
      "Strong reporting and analytics",
    ],
    cons: [
      "Enterprise pricing — starts at $799/mo",
      "Overkill for small-to-mid distributors",
      "No native Zoho integration",
      "Long implementation timelines (3-6 months)",
    ],
    pricing: "From $799/mo",
    bestFor: "Large enterprises with complex warehouse operations and EDI requirements",
  },
  {
    name: "Unleashed Software",
    tagline: "Cloud inventory for product businesses",
    highlight: false,
    pros: [
      "Clean, modern interface",
      "Good Xero and QuickBooks integration",
      "Batch and serial number tracking",
      "B2B eCommerce module available",
    ],
    cons: [
      "Now owned by MYOB — future direction uncertain",
      "Limited B2B ordering portal features",
      "No offline mobile app",
      "No native Zoho integration",
      "No field sales rep tools",
    ],
    pricing: "From $349/mo",
    bestFor: "Product businesses focused on inventory accuracy with Xero/QuickBooks accounting",
  },
  {
    name: "QuickBooks Commerce (Intuit)",
    tagline: "What TradeGecko became — now part of QuickBooks",
    highlight: false,
    pros: [
      "Deep QuickBooks Online integration",
      "Familiar interface for TradeGecko users",
      "Basic inventory and order management",
      "Backed by Intuit's ecosystem",
    ],
    cons: [
      "Significantly reduced feature set vs. original TradeGecko",
      "Locked into QuickBooks ecosystem",
      "No standalone B2B portal",
      "Limited multi-warehouse capabilities",
      "No offline ordering or field sales tools",
      "Many TradeGecko features were removed after acquisition",
    ],
    pricing: "Bundled with QuickBooks Plus ($99/mo+)",
    bestFor: "Small businesses already fully committed to the QuickBooks ecosystem",
  },
];

const featureComparison = [
  { category: "Ordering & Commerce", items: [
    { feature: "B2B Customer Self-Ordering Portal", growmax: true, cin7core: false, cin7omni: false, unleashed: true, qbcommerce: false },
    { feature: "Offline Mobile Order-Taking App", growmax: true, cin7core: false, cin7omni: false, unleashed: false, qbcommerce: false },
    { feature: "Field Sales Rep App (iOS/Android)", growmax: true, cin7core: false, cin7omni: false, unleashed: false, qbcommerce: false },
    { feature: "Customer-Specific Pricing", growmax: true, cin7core: true, cin7omni: true, unleashed: true, qbcommerce: false },
    { feature: "Quote-to-Order Workflow", growmax: true, cin7core: false, cin7omni: true, unleashed: false, qbcommerce: false },
    { feature: "Re-Order Automation", growmax: true, cin7core: false, cin7omni: false, unleashed: false, qbcommerce: false },
  ]},
  { category: "Inventory Management", items: [
    { feature: "Multi-Warehouse Support", growmax: true, cin7core: true, cin7omni: true, unleashed: true, qbcommerce: false },
    { feature: "Real-Time Inventory Sync", growmax: true, cin7core: true, cin7omni: true, unleashed: true, qbcommerce: true },
    { feature: "Batch & Serial Tracking", growmax: false, cin7core: true, cin7omni: true, unleashed: true, qbcommerce: false },
    { feature: "Intelligent Stock Allocation", growmax: true, cin7core: false, cin7omni: true, unleashed: false, qbcommerce: false },
    { feature: "Low Stock Alerts", growmax: true, cin7core: true, cin7omni: true, unleashed: true, qbcommerce: true },
  ]},
  { category: "Integrations", items: [
    { feature: "Native Zoho Integration", growmax: true, cin7core: false, cin7omni: false, unleashed: false, qbcommerce: false },
    { feature: "QuickBooks Integration", growmax: true, cin7core: true, cin7omni: true, unleashed: true, qbcommerce: true },
    { feature: "Xero Integration", growmax: false, cin7core: true, cin7omni: true, unleashed: true, qbcommerce: false },
    { feature: "SAP / ERP Connectivity", growmax: true, cin7core: false, cin7omni: true, unleashed: false, qbcommerce: false },
    { feature: "API Access", growmax: true, cin7core: true, cin7omni: true, unleashed: true, qbcommerce: false },
  ]},
  { category: "Sales & CRM", items: [
    { feature: "Partner/Channel Portal", growmax: true, cin7core: false, cin7omni: false, unleashed: false, qbcommerce: false },
    { feature: "Visit Logging & Field Data", growmax: true, cin7core: false, cin7omni: false, unleashed: false, qbcommerce: false },
    { feature: "Account-Level Price Matrices", growmax: true, cin7core: true, cin7omni: true, unleashed: true, qbcommerce: false },
    { feature: "Reporting Dashboards", growmax: true, cin7core: true, cin7omni: true, unleashed: true, qbcommerce: true },
  ]},
];

const pricingComparison = [
  { label: "Starting Price", growmax: "$199/mo", cin7core: "$349/mo", cin7omni: "$799/mo", unleashed: "$349/mo", qbcommerce: "$99/mo*" },
  { label: "B2B Portal Included", growmax: "Yes", cin7core: "No", cin7omni: "No", unleashed: "Add-on", qbcommerce: "No" },
  { label: "Mobile App Included", growmax: "Yes", cin7core: "No", cin7omni: "No", unleashed: "No", qbcommerce: "No" },
  { label: "Free Trial", growmax: "14 days", cin7core: "14 days", cin7omni: "Demo only", unleashed: "14 days", qbcommerce: "30 days" },
  { label: "Setup Fee", growmax: "$0", cin7core: "$0", cin7omni: "Custom", unleashed: "$0", qbcommerce: "$0" },
  { label: "Zoho Integration", growmax: "Native", cin7core: "None", cin7omni: "None", unleashed: "None", qbcommerce: "None" },
];

const migrationSteps = [
  {
    step: "01",
    title: "Export Your TradeGecko Data",
    description: "Download your products, customers, pricing tiers, and order history from TradeGecko/QuickBooks Commerce before your account is fully transitioned.",
  },
  {
    step: "02",
    title: "Map Your Data Model",
    description: "Our migration team maps your TradeGecko product catalog, customer-specific pricing, and inventory locations to the Growmax data model — typically completed in 48 hours.",
  },
  {
    step: "03",
    title: "Import & Validate",
    description: "Bulk import via Excel or API. Every product, customer account, pricing tier, and inventory level is validated against your source data before going live.",
  },
  {
    step: "04",
    title: "Connect Your Integrations",
    description: "Set up native Zoho sync, QuickBooks integration, or SAP connectivity. Most integrations are live within 24 hours — no middleware required.",
  },
  {
    step: "05",
    title: "Train & Launch",
    description: "Your team gets hands-on training with the B2B portal, mobile app, and admin dashboard. Most TradeGecko migrations go live within 2-3 weeks.",
  },
];

export default function TradeGeckoAlternatives() {
  return (
    <div className="min-h-screen bg-white selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Best TradeGecko (QuickBooks Commerce) Alternatives in 2026 | Migration Guide"
        description="TradeGecko was shut down and absorbed into QuickBooks Commerce. Compare the best TradeGecko alternatives: Growmax ARC, Cin7, DEAR Inventory, and Unleashed. Find the right migration path for your B2B business."
        path="/comparisons/tradegecko-alternatives"
        structuredData={webPageSchema({
          title: "Best TradeGecko (QuickBooks Commerce) Alternatives in 2026",
          description: "TradeGecko was shut down and absorbed into QuickBooks Commerce. Compare the best TradeGecko alternatives for B2B distributors and wholesalers.",
          path: "/comparisons/tradegecko-alternatives",
          keywords: [
            "tradegecko alternative",
            "tradegecko alternatives",
            "quickbooks commerce alternatives",
            "tradegecko replacement",
            "tradegecko migration",
            "tradegecko shut down",
            "best tradegecko alternative 2026",
            "tradegecko vs growmax",
          ],
        })}
      />

      <section className="pt-32 pb-24 border-b border-gray-200 bg-grid-pattern relative">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-6">
              <Breadcrumbs items={[
                { label: "Comparisons" },
                { label: "TradeGecko Alternatives" },
              ]} />
            </div>
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6" data-testid="text-page-label">
              Migration Guide // TradeGecko Alternatives 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8" data-testid="text-page-title">
              Best TradeGecko<br/>
              Alternatives.<br/>
              <span className="text-gray-400">After the shutdown.</span>
            </h1>
            <div className="w-16 h-1 bg-growmax-black mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed max-w-2xl" data-testid="text-page-description">
              TradeGecko was acquired by Intuit and absorbed into QuickBooks Commerce — with many features removed. If you're looking for a true replacement that doesn't lock you into the QuickBooks ecosystem, here are the best alternatives for 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-amber-50 border-b border-amber-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="flex items-start gap-4" data-testid="banner-tradegecko-shutdown">
            <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold text-amber-900 mb-2">What Happened to TradeGecko?</h2>
              <p className="text-amber-800 leading-relaxed">
                TradeGecko was acquired by Intuit in June 2020 and rebranded as QuickBooks Commerce. By 2022, Intuit began sunsetting TradeGecko features and migrating users to QuickBooks. Many beloved features — including the standalone B2B portal, advanced inventory rules, and Zoho integration — were removed. Former TradeGecko users now face a choice: stay locked in QuickBooks or migrate to a platform that offers the features they originally chose TradeGecko for.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Alternatives Ranked</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black" data-testid="text-alternatives-title">Top 5 TradeGecko Alternatives for 2026</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="space-y-8">
            {alternatives.map((alt, i) => (
              <div
                key={i}
                className={`border-2 p-8 md:p-10 ${alt.highlight ? 'border-growmax-red shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' : 'border-gray-200'}`}
                data-testid={`card-alternative-${i}`}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold tracking-tight">{alt.name}</h3>
                      {alt.highlight && (
                        <span className="bg-growmax-red text-white text-[10px] font-mono uppercase tracking-widest px-3 py-1 font-bold" data-testid="badge-recommended">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 font-light">{alt.tagline}</p>
                  </div>
                  <div className="font-mono text-lg font-bold text-growmax-black whitespace-nowrap">{alt.pricing}</div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-6">
                  <div>
                    <div className="font-mono text-xs text-green-700 uppercase tracking-widest mb-3 font-bold">Pros</div>
                    <ul className="space-y-2">
                      {alt.pros.map((pro, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                          <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="font-mono text-xs text-red-700 uppercase tracking-widest mb-3 font-bold">Cons</div>
                    <ul className="space-y-2">
                      {alt.cons.map((con, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                          <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-4">
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-widest font-bold">Best For: </span>
                  <span className="text-sm text-gray-700">{alt.bestFor}</span>
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
            <h2 className="text-3xl font-bold tracking-tight mb-4" data-testid="text-comparison-title">Side-by-Side Feature Comparison</h2>
            <div className="w-16 h-1 bg-growmax-red"></div>
          </div>

          {featureComparison.map((group, gi) => (
            <div key={gi} className="mb-12" data-testid={`section-features-${gi}`}>
              <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                {group.category}
              </div>
              <div className="border border-gray-800 overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-6 border-b border-gray-800 bg-gray-900">
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase">Feature</div>
                    <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-gray-800 font-bold">Growmax ARC</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Cin7 Core</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Cin7 Omni</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">Unleashed</div>
                    <div className="p-4 font-mono text-xs text-gray-400 uppercase text-center border-l border-gray-800">QB Commerce</div>
                  </div>
                  {group.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-6 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors" data-testid={`row-feature-${gi}-${i}`}>
                      <div className="p-4 font-mono text-sm text-gray-300">{item.feature}</div>
                      {[item.growmax, item.cin7core, item.cin7omni, item.unleashed, item.qbcommerce].map((val, vi) => (
                        <div key={vi} className="p-4 flex justify-center items-center border-l border-gray-800">
                          {val ? (
                            <Check className={`w-5 h-5 ${vi === 0 ? 'text-growmax-red' : 'text-gray-500'}`} />
                          ) : (
                            <X className="w-5 h-5 text-gray-700" />
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Commercials</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black" data-testid="text-pricing-title">Pricing Comparison</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="border border-growmax-black overflow-x-auto" data-testid="section-pricing-comparison">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 border-b border-growmax-black bg-gray-50">
                <div className="p-4 font-mono text-xs text-gray-500 uppercase"></div>
                <div className="p-4 font-mono text-xs text-growmax-red uppercase text-center border-l border-growmax-black font-bold">Growmax ARC</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Cin7 Core</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Cin7 Omni</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">Unleashed</div>
                <div className="p-4 font-mono text-xs text-gray-500 uppercase text-center border-l border-growmax-black font-bold">QB Commerce</div>
              </div>
              {pricingComparison.map((row, i) => (
                <div key={i} className="grid grid-cols-6 border-b border-gray-200 last:border-b-0" data-testid={`row-pricing-${i}`}>
                  <div className="p-4 font-mono text-sm text-growmax-black font-bold">{row.label}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-growmax-black font-bold">{row.growmax}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.cin7core}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.cin7omni}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.unleashed}</div>
                  <div className="p-4 font-mono text-sm text-center border-l border-gray-200 text-gray-600">{row.qbcommerce}</div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4 font-mono">* QuickBooks Commerce pricing is bundled with QuickBooks Plus subscription. Standalone pricing not available.</p>
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Why Growmax ARC</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4" data-testid="text-why-growmax-title">The Natural TradeGecko Migration Path</h2>
            <div className="w-16 h-1 bg-growmax-red mb-8"></div>
            <p className="text-lg text-gray-400 font-light leading-relaxed max-w-3xl">
              TradeGecko users chose the platform for its clean B2B ordering experience and Zoho integration. QuickBooks Commerce removed both. Growmax ARC brings them back — and adds field sales, multi-warehouse intelligence, and partner commerce.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-why-growmax-wins">
            {[
              {
                icon: Database,
                number: "01",
                title: "Native Zoho Integration",
                description: "TradeGecko's Zoho integration was killed after the Intuit acquisition. Growmax ARC was built Zoho-first — bidirectional sync with Zoho Inventory, Zoho CRM, and Zoho Books. No middleware, no Zapier workarounds."
              },
              {
                icon: Globe,
                number: "02",
                title: "B2B Self-Ordering Portal",
                description: "TradeGecko's B2B portal was one of its best features — and Intuit removed it. Growmax includes a full customer self-ordering portal with customer-specific pricing, catalog visibility rules, and re-order automation."
              },
              {
                icon: RefreshCw,
                number: "03",
                title: "No Platform Lock-In",
                description: "QuickBooks Commerce only works with QuickBooks. Growmax connects to Zoho, QuickBooks, SAP, and any ERP via API. You choose your accounting system — we integrate with it."
              },
              {
                icon: Zap,
                number: "04",
                title: "Offline Mobile App",
                description: "TradeGecko never had a proper offline mobile app for field sales. Growmax ARC includes iOS/Android apps with offline order creation, customer-specific pricing, and visit logging — even without connectivity."
              },
              {
                icon: Shield,
                number: "05",
                title: "Multi-Warehouse Intelligence",
                description: "Go beyond TradeGecko's basic multi-location inventory. Growmax manages stock across multiple warehouses with intelligent allocation logic, geographic zone management, and automated reorder points."
              },
              {
                icon: DollarSign,
                number: "06",
                title: "Lower Cost, More Value",
                description: "At $199/mo with B2B portal and mobile app included, Growmax delivers more B2B functionality than Cin7 ($349/mo) or Cin7 Omni ($799/mo) — without nickel-and-diming you on add-ons."
              },
            ].map((item, i) => (
              <div key={i} className="border border-gray-800 p-8 hover:border-growmax-red transition-colors group" data-testid={`card-advantage-${i}`}>
                <item.icon className="w-8 h-8 text-growmax-red mb-4" />
                <div className="font-mono text-xs text-growmax-red mb-3 uppercase">{item.number}</div>
                <h3 className="text-xl font-bold mb-4 tracking-tight">{item.title}</h3>
                <p className="text-gray-400 font-light text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Migration Playbook</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black" data-testid="text-migration-title">How to Migrate from TradeGecko to Growmax</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="space-y-6">
            {migrationSteps.map((step, i) => (
              <div key={i} className="border-2 border-growmax-black p-8 flex flex-col md:flex-row gap-6 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid={`card-migration-step-${i}`}>
                <div className="font-mono text-4xl font-bold text-growmax-red shrink-0">{step.step}</div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">{step.title}</h3>
                  <p className="text-gray-600 font-light leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="mb-16">
            <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-4 font-bold">Related Architecture</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-growmax-black">Explore More</h2>
            <div className="w-16 h-1 bg-growmax-black"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8" data-testid="section-related-links">
            <Link href="/arc">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-arc-platform">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Product</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">Growmax ARC Platform</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">The connected distributor platform — ordering portal, field sales app, and real-time inventory.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Explore ARC <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/arc/compare/b2b-wave">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-compare-b2bwave">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Comparison</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">ARC vs B2B Wave</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">Feature-by-feature comparison with B2B Wave's QuickBooks-centric ordering platform.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Comparison <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>

            <Link href="/arc/compare/pepperi">
              <div className="border-2 border-growmax-black p-8 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 cursor-pointer h-full" data-testid="link-compare-pepperi">
                <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-3 font-bold">Comparison</div>
                <h3 className="text-lg font-bold tracking-tight mb-3 uppercase">ARC vs Pepperi</h3>
                <p className="text-sm text-gray-600 font-light leading-relaxed">See how ARC stacks up against Pepperi's enterprise CPG platform — at a fraction of the cost.</p>
                <div className="mt-4 font-mono text-xs text-growmax-red uppercase font-bold flex items-center gap-1">Read Comparison <ArrowRight className="w-3 h-3" /></div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8">
          <div className="font-mono text-xs text-growmax-black font-bold mb-8 uppercase tracking-widest text-center">TradeGecko Alternative Keywords</div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto" data-testid="text-seo-keywords">
            {[
              "tradegecko alternative",
              "tradegecko alternatives",
              "quickbooks commerce alternatives",
              "tradegecko replacement",
              "tradegecko migration",
              "tradegecko shut down",
              "best tradegecko alternative 2026",
              "tradegecko vs cin7",
              "tradegecko zoho integration",
              "b2b ordering platform",
            ].map((keyword, i) => (
              <span key={i} className="border border-growmax-black px-3 py-1 font-mono text-xs uppercase tracking-widest text-gray-600 hover:bg-growmax-black hover:text-white transition-colors cursor-default">
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 text-center bg-white">
        <div className="container mx-auto px-4">
          <div className="font-mono text-xs text-growmax-red uppercase tracking-widest mb-6 font-bold">Migrate Now</div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter text-growmax-black" data-testid="text-cta-title">
            Move on from TradeGecko.<br/>Deploy Growmax ARC today.
          </h2>
          <p className="text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Start your 14-day free trial. Our migration team will help you move your data from TradeGecko/QuickBooks Commerce — typically live in 2-3 weeks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/demo">
              <Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-10 text-lg rounded-none transition-all duration-300 font-bold tracking-tight" data-testid="button-cta-demo">
                Book a Migration Consult <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/arc/pricing">
              <Button variant="outline" className="border-growmax-black text-growmax-black hover:bg-growmax-black hover:text-white h-14 px-10 text-lg rounded-none transition-all duration-300 font-bold tracking-tight" data-testid="button-cta-pricing">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}