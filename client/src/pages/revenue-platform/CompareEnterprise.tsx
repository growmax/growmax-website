import { Link } from "wouter";
import { ArrowRight, Check, X, Minus, Clock, DollarSign, Server, Shield, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const featureMatrix = [
  {
    category: "ERP Integration",
    features: [
      { name: "Native SAP JCo Protocol", growmax: true, corevist: true, sapcc: true },
      { name: "Bidirectional RFC Calls", growmax: true, corevist: true, sapcc: true },
      { name: "No Middleware Required", growmax: true, corevist: false, sapcc: false },
      { name: "Multi-ERP Support (SAP, Oracle, Infor, etc.)", growmax: true, corevist: false, sapcc: false },
      { name: "Pre-built SAP Integration Points", growmax: "32+", corevist: "49", sapcc: "Native" },
      { name: "Real-time Inventory Sync", growmax: true, corevist: true, sapcc: true },
      { name: "Custom ERP Connector Framework", growmax: true, corevist: false, sapcc: false },
    ],
  },
  {
    category: "Commerce Capabilities",
    features: [
      { name: "B2B Self-Service Portal", growmax: true, corevist: true, sapcc: true },
      { name: "Partner Commerce Portal", growmax: true, corevist: false, sapcc: "Add-on" },
      { name: "Field Sales Mobile App (Offline)", growmax: true, corevist: false, sapcc: false },
      { name: "Multi-Tier Pricing Engine", growmax: true, corevist: "Limited", sapcc: true },
      { name: "CPQ / Configure-Price-Quote", growmax: true, corevist: false, sapcc: "Add-on" },
      { name: "Spare Parts Portal", growmax: true, corevist: false, sapcc: "Add-on" },
      { name: "Customer-Specific Catalogs", growmax: true, corevist: true, sapcc: true },
      { name: "Multi-Warehouse Orchestration", growmax: true, corevist: "Limited", sapcc: true },
    ],
  },
  {
    category: "Quoting & Orders",
    features: [
      { name: "Quote-to-Order Workflow", growmax: true, corevist: false, sapcc: "Add-on" },
      { name: "Multi-Level Approval Engine", growmax: true, corevist: false, sapcc: "Custom" },
      { name: "Bulk Order Upload (CSV/Excel)", growmax: true, corevist: true, sapcc: true },
      { name: "Order-on-Behalf (OBO)", growmax: true, corevist: true, sapcc: true },
      { name: "Reorder from History", growmax: true, corevist: true, sapcc: true },
    ],
  },
  {
    category: "Platform & Infrastructure",
    features: [
      { name: "Cloud-Native (AWS/K8s)", growmax: true, corevist: true, sapcc: true },
      { name: "Headless / API-First Architecture", growmax: true, corevist: "Limited", sapcc: true },
      { name: "Multi-Tenant SaaS", growmax: true, corevist: true, sapcc: false },
      { name: "White-Label / Custom Branding", growmax: true, corevist: true, sapcc: true },
      { name: "GDPR & SOC 2 Compliance", growmax: true, corevist: true, sapcc: true },
      { name: "Role-Based Access Control (RBAC)", growmax: true, corevist: true, sapcc: true },
    ],
  },
];

const implementationComparison = [
  { phase: "Discovery & Planning", growmax: "1–2 weeks", corevist: "2–4 weeks", sapcc: "4–8 weeks" },
  { phase: "ERP Integration Setup", growmax: "2–3 weeks", corevist: "3–6 weeks", sapcc: "8–16 weeks" },
  { phase: "Portal Configuration", growmax: "2–3 weeks", corevist: "4–6 weeks", sapcc: "12–24 weeks" },
  { phase: "Testing & UAT", growmax: "1–2 weeks", corevist: "2–4 weeks", sapcc: "4–8 weeks" },
  { phase: "Go-Live & Training", growmax: "1–2 weeks", corevist: "1–2 weeks", sapcc: "2–4 weeks" },
  { phase: "Total Timeline", growmax: "8–12 weeks", corevist: "12–22 weeks", sapcc: "12–18 months" },
];

const pricingComparison = [
  { tier: "Implementation Cost", growmax: "$15K–$40K", corevist: "$50K–$150K", sapcc: "$250K–$1M+" },
  { tier: "Annual Platform License", growmax: "$12K–$48K/yr", corevist: "$60K–$120K/yr", sapcc: "$150K–$1M/yr" },
  { tier: "ERP Connector License", growmax: "Included", corevist: "$20K–$40K/yr", sapcc: "Included (SAP only)" },
  { tier: "Partner Portal Add-on", growmax: "Included", corevist: "Not Available", sapcc: "$50K–$100K/yr" },
  { tier: "Field Sales App", growmax: "Included", corevist: "Not Available", sapcc: "Not Available" },
  { tier: "3-Year Total Cost of Ownership", growmax: "$50K–$185K", corevist: "$230K–$510K", sapcc: "$700K–$4M+" },
];

function FeatureCell({ value }: { value: boolean | string }) {
  if (value === true) return <Check className="w-5 h-5 text-green-600 mx-auto" />;
  if (value === false) return <X className="w-5 h-5 text-red-500 mx-auto" />;
  return <span className="font-mono text-xs text-center block">{value}</span>;
}

export default function CompareEnterprise() {
  return (
    <div className="min-h-screen bg-white pt-16 selection:bg-growmax-red selection:text-white">
      <section className="pt-24 pb-24 border-b-4 border-growmax-black bg-grid-blueprint relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-white pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl">
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 border-l-2 border-growmax-red pl-3" data-testid="text-page-category">
              Competitive Analysis // Enterprise Commerce
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-growmax-black leading-[1.05] mb-8 uppercase" data-testid="text-page-title">
              Growmax vs Corevist<br />
              vs SAP Commerce Cloud
            </h1>
            <div className="w-16 h-2 bg-growmax-red mb-8"></div>
            <p className="text-xl text-gray-600 font-light leading-relaxed mb-10 max-w-2xl" data-testid="text-page-description">
              Enterprise-grade SAP-integrated B2B commerce — without the enterprise timeline or price tag. See how Growmax Revenue Platform compares feature-by-feature against Corevist and SAP Commerce Cloud.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/demo">
                <Button className="bg-growmax-red hover:bg-growmax-black text-white h-14 px-8 text-lg rounded-none transition-colors duration-300 font-bold tracking-tight shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5" data-testid="button-request-demo">
                  Request Demo <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/revenue-platform">
                <Button variant="outline" className="h-14 px-8 text-lg rounded-none border-2 border-growmax-black font-bold tracking-tight hover:bg-growmax-black hover:text-white transition-colors" data-testid="button-explore-platform">
                  Explore Platform
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-growmax-black text-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-0">
            <div className="border border-white/20 p-8 text-center">
              <div className="font-mono text-growmax-red text-xs uppercase tracking-widest font-bold mb-4">Growmax</div>
              <div className="text-3xl font-bold font-mono mb-2" data-testid="text-growmax-timeline">8–12 Weeks</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest">To Go-Live</div>
            </div>
            <div className="border border-white/20 p-8 text-center">
              <div className="font-mono text-gray-400 text-xs uppercase tracking-widest font-bold mb-4">Corevist</div>
              <div className="text-3xl font-bold font-mono mb-2 text-gray-400" data-testid="text-corevist-timeline">12–22 Weeks</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">To Go-Live</div>
            </div>
            <div className="border border-white/20 p-8 text-center">
              <div className="font-mono text-gray-400 text-xs uppercase tracking-widest font-bold mb-4">SAP Commerce Cloud</div>
              <div className="text-3xl font-bold font-mono mb-2 text-gray-400" data-testid="text-sapcc-timeline">12–18 Months</div>
              <div className="text-xs text-gray-500 uppercase tracking-widest">To Go-Live</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-growmax-black uppercase mb-4" data-testid="text-feature-matrix-title">Feature-by-Feature Comparison</h2>
            <div className="w-16 h-2 bg-growmax-red"></div>
          </div>

          {featureMatrix.map((section) => (
            <div key={section.category} className="mb-12" data-testid={`section-feature-${section.category.toLowerCase().replace(/\s+/g, "-")}`}>
              <h3 className="font-mono text-sm font-bold text-growmax-red uppercase tracking-widest mb-4 border-l-2 border-growmax-red pl-3">
                {section.category}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-2 border-growmax-black text-sm">
                  <thead>
                    <tr className="bg-growmax-black text-white">
                      <th className="text-left p-4 font-mono uppercase tracking-widest text-xs w-2/5">Feature</th>
                      <th className="p-4 font-mono uppercase tracking-widest text-xs text-center w-1/5 text-growmax-red">Growmax</th>
                      <th className="p-4 font-mono uppercase tracking-widest text-xs text-center w-1/5">Corevist</th>
                      <th className="p-4 font-mono uppercase tracking-widest text-xs text-center w-1/5">SAP CC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.features.map((feature, idx) => (
                      <tr key={feature.name} className={`border-b border-gray-200 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="p-4 font-medium">{feature.name}</td>
                        <td className="p-4 text-center bg-green-50/50"><FeatureCell value={feature.growmax} /></td>
                        <td className="p-4 text-center"><FeatureCell value={feature.corevist} /></td>
                        <td className="p-4 text-center"><FeatureCell value={feature.sapcc} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-growmax-black text-white bg-dots-dark">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4" data-testid="text-implementation-title">Implementation Timeline</h2>
            <div className="w-16 h-2 bg-growmax-red"></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-2 border-white/30 text-sm">
              <thead>
                <tr className="border-b-2 border-growmax-red">
                  <th className="text-left p-4 font-mono uppercase tracking-widest text-xs w-2/5">
                    <Clock className="w-4 h-4 inline mr-2" />Phase
                  </th>
                  <th className="p-4 font-mono uppercase tracking-widest text-xs text-center w-1/5 text-growmax-red">Growmax</th>
                  <th className="p-4 font-mono uppercase tracking-widest text-xs text-center w-1/5 text-gray-400">Corevist</th>
                  <th className="p-4 font-mono uppercase tracking-widest text-xs text-center w-1/5 text-gray-400">SAP CC</th>
                </tr>
              </thead>
              <tbody>
                {implementationComparison.map((row, idx) => (
                  <tr
                    key={row.phase}
                    className={`border-b border-white/10 ${row.phase === "Total Timeline" ? "bg-white/10 font-bold" : ""}`}
                  >
                    <td className="p-4 font-medium">{row.phase}</td>
                    <td className="p-4 text-center font-mono text-growmax-red">{row.growmax}</td>
                    <td className="p-4 text-center font-mono text-gray-400">{row.corevist}</td>
                    <td className="p-4 text-center font-mono text-gray-400">{row.sapcc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-growmax-black uppercase mb-4" data-testid="text-pricing-title">Pricing Comparison</h2>
            <p className="text-gray-600 font-light text-lg">Total cost of ownership over 3 years — no hidden middleware fees.</p>
            <div className="w-16 h-2 bg-growmax-red mt-4"></div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-2 border-growmax-black text-sm">
              <thead>
                <tr className="bg-growmax-black text-white">
                  <th className="text-left p-4 font-mono uppercase tracking-widest text-xs w-2/5">
                    <DollarSign className="w-4 h-4 inline mr-2" />Cost Component
                  </th>
                  <th className="p-4 font-mono uppercase tracking-widest text-xs text-center w-1/5 text-growmax-red">Growmax</th>
                  <th className="p-4 font-mono uppercase tracking-widest text-xs text-center w-1/5">Corevist</th>
                  <th className="p-4 font-mono uppercase tracking-widest text-xs text-center w-1/5">SAP CC</th>
                </tr>
              </thead>
              <tbody>
                {pricingComparison.map((row, idx) => (
                  <tr
                    key={row.tier}
                    className={`border-b border-gray-200 ${row.tier === "3-Year Total Cost of Ownership" ? "bg-growmax-red/5 font-bold border-t-2 border-growmax-red" : idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="p-4 font-medium">{row.tier}</td>
                    <td className="p-4 text-center font-mono text-growmax-red font-bold">{row.growmax}</td>
                    <td className="p-4 text-center font-mono text-gray-600">{row.corevist}</td>
                    <td className="p-4 text-center font-mono text-gray-600">{row.sapcc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="py-24 bg-growmax-gray border-t-4 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-growmax-black uppercase mb-4" data-testid="text-why-growmax-title">Why Growmax Wins</h2>
            <div className="w-16 h-2 bg-growmax-red"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid="card-advantage-erp">
              <Server className="w-10 h-10 text-growmax-red mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">Native SAP JCo — No Middleware</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Direct SAP ECC integration via JCo protocol with bidirectional RFC calls. No fragile middleware layers. Plus, Growmax connects to any ERP — Oracle, Infor, Microsoft Dynamics — not just SAP.
              </p>
            </div>

            <div className="bg-white border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid="card-advantage-deployment">
              <Zap className="w-10 h-10 text-growmax-red mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">Live in 8–12 Weeks</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                While SAP Commerce Cloud takes 12–18 months and $500K+ to deploy, Growmax goes live in 8–12 weeks at a fraction of the cost. Pre-built connectors, configurable workflows, zero custom ABAP.
              </p>
            </div>

            <div className="bg-white border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid="card-advantage-allinone">
              <Users className="w-10 h-10 text-growmax-red mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">All-in-One Platform</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Partner commerce portal, spare parts portal, field sales app with offline mode, CPQ, and multi-tier pricing — all included. Corevist lacks partner portals and field sales. SAP CC charges extra for each add-on.
              </p>
            </div>

            <div className="bg-white border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid="card-advantage-pricing">
              <DollarSign className="w-10 h-10 text-growmax-red mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">Fraction of the Cost</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                3-year TCO under $185K vs $510K+ for Corevist and $4M+ for SAP Commerce Cloud. No middleware licensing fees. No surprise consulting bills. Predictable SaaS pricing.
              </p>
            </div>

            <div className="bg-white border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300" data-testid="card-advantage-multierp">
              <Shield className="w-10 h-10 text-growmax-red mb-4" />
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3">Not Locked to SAP</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed">
                Corevist is SAP-only with 49 integration points. SAP CC is SAP-only by design. Growmax handles any ERP through its custom connector framework — future-proof your commerce stack.
              </p>
            </div>

            <div className="bg-white border-2 border-growmax-black p-8 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 bg-grid-blueprint relative overflow-hidden" data-testid="card-advantage-field-sales">
              <div className="absolute top-0 right-0 bg-growmax-red text-white font-mono text-[10px] px-2 py-1 uppercase tracking-widest font-bold">Unique</div>
              <Zap className="w-10 h-10 text-growmax-red mb-4 relative z-10" />
              <h3 className="text-xl font-bold uppercase tracking-tight mb-3 relative z-10 bg-white inline-block pr-2">Offline Field Sales App</h3>
              <p className="text-gray-600 font-light text-sm leading-relaxed relative z-10 bg-white/90 p-3 border border-growmax-black">
                Neither Corevist nor SAP Commerce Cloud offer a native offline mobile app for field reps. Growmax ARC lets reps take orders, check inventory, and create quotes — even without connectivity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-growmax-black text-white border-t border-gray-800 border-b-4 border-growmax-red">
        <div className="container mx-auto px-4 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-gray-400">
            Target Keywords: SAP Integrated B2B Commerce Platform · Corevist Alternative · SAP Commerce Cloud Alternative for Manufacturers
          </p>
        </div>
      </section>

      <section className="py-32 bg-growmax-black text-white text-center bg-dots-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter uppercase leading-[1.1]" data-testid="text-cta-heading">
            Enterprise Commerce.<br />Without the Enterprise Price Tag.
          </h2>
          <p className="text-gray-400 text-lg font-light max-w-2xl mx-auto mb-12">
            Deploy SAP-integrated B2B commerce in weeks, not years. See why manufacturers are choosing Growmax over legacy platforms.
          </p>
          <Link href="/demo">
            <Button className="bg-growmax-red hover:bg-white hover:text-growmax-black text-white h-16 px-12 text-lg rounded-none transition-all duration-300 font-bold tracking-widest uppercase border-2 border-transparent hover:border-growmax-black shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-2 hover:translate-y-2" data-testid="button-schedule-review">
              Schedule Architecture Review
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}