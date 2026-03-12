import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Server, Box, GitMerge, Activity, CheckSquare, Maximize, AlertCircle, Fingerprint, Layers, Cpu, Users, Eye, ShoppingCart, FileText, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEOHead from "@/components/SEOHead";
import { organizationSchema } from "@/lib/structuredData";
import { SiemensLogo, SchwingSttetterLogo, OBOBettermannLogo } from "@/components/ui/ClientLogos";
import EcosystemFlowDiagram from "@/components/EcosystemFlowDiagram";

function TypicalEcommercePanel() {
  return (
    <div className="border-2 border-white/10 p-8 md:p-10 relative overflow-hidden opacity-70 hover:opacity-90 transition-opacity" data-testid="diagram-typical-ecommerce">
      <div className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
        <span className="w-2 h-2 bg-gray-500" />
        Typical B2B eCommerce Platform
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full border-2 border-white/15 bg-white/5 p-5 text-center">
          <div className="font-bold text-lg uppercase tracking-tight flex items-center justify-center gap-2 text-gray-400">
            <ShoppingCart className="w-5 h-5" />
            eCommerce Storefront
          </div>
          <div className="font-mono text-[10px] text-gray-500 mt-1">ONLINE ORDERS ONLY</div>
        </div>

        <div className="flex flex-col items-center py-2" style={{ height: "48px" }}>
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-px h-full border-l border-dashed border-gray-600" />
            <div className="absolute w-2 h-2 bg-gray-500 animate-flow-down" />
          </div>
        </div>

        <div className="w-full border border-white/15 bg-white/5 p-4 text-center">
          <ShoppingCart className="w-5 h-5 text-gray-500 mx-auto mb-2" />
          <div className="font-bold text-sm uppercase tracking-tight text-gray-400">Customers Order Online</div>
          <div className="font-mono text-[10px] text-gray-500 mt-1">Self-service only</div>
        </div>

        <div className="w-full my-6 relative">
          <div className="border-t-2 border-dashed border-growmax-red/50 w-full" />
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-growmax-black px-3">
            <div className="flex items-center gap-1.5 text-growmax-red">
              <AlertCircle className="w-4 h-4" />
              <span className="font-mono text-[10px] font-bold uppercase">Disconnected</span>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="w-full border border-white/15 bg-white/5 p-5 text-center">
          <Users className="w-6 h-6 text-gray-500 mx-auto mb-2" />
          <div className="font-bold text-sm uppercase tracking-tight text-gray-400">Your Sales Team</div>
          <div className="font-mono text-[10px] text-gray-500 mt-2">ZERO visibility into online orders</div>
        </div>

        <div className="mt-3 w-full border border-white/15 bg-white/5 p-5 text-center">
          <GitMerge className="w-6 h-6 text-gray-500 mx-auto mb-2" />
          <div className="font-bold text-sm uppercase tracking-tight text-gray-400">Your Partners & Dealers</div>
          <div className="font-mono text-[10px] text-gray-500 mt-2">Separate system, no connection</div>
        </div>

        <div className="w-full mt-6 space-y-2">
          {[
            "Sales reps don't know what customers buy online",
            "Partners manage orders in separate tools",
            "No unified view of revenue across channels",
          ].map((pain, i) => (
            <div key={i} className="flex items-start gap-2 font-mono text-[11px] text-gray-500">
              <span className="text-growmax-red mt-0.5 shrink-0">✕</span>
              <span>{pain}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[10px] text-gray-600 uppercase text-center">
        Silos kill revenue. Your teams work in the dark.
      </div>
    </div>
  );
}

function GrowmaxConnectedPanel() {
  return (
    <div className="border-2 border-growmax-red/40 p-8 md:p-10 hover:border-growmax-red transition-colors" data-testid="diagram-growmax-connected">
      <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-8 flex items-center gap-2">
        <span className="w-2 h-2 bg-growmax-red animate-ping-dot" />
        With Growmax — Everyone Connected
      </div>

      <div className="flex flex-col items-center">
        <div className="w-full border-2 border-growmax-red bg-growmax-red/10 p-5 text-center animate-pulse-glow">
          <div className="font-bold text-lg uppercase tracking-tight flex items-center justify-center gap-2">
            <Building2 className="w-5 h-5 text-growmax-red" />
            Your Brand
          </div>
          <div className="font-mono text-[10px] text-gray-400 mt-1">INTELLIGENT REVENUE OPERATIONS PLATFORM</div>
        </div>

        <div className="flex justify-center mt-1">
          <div className="relative flex flex-col items-center py-1" style={{ height: "40px" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full border-l border-dashed border-growmax-red/40" />
            </div>
            <div className="relative w-2 h-2 bg-growmax-red animate-flow-down" />
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 py-0.5">
          <div className="w-6 h-px bg-growmax-red/30" />
          <span className="font-mono text-[10px] uppercase text-growmax-red/70">everyone on one page</span>
          <div className="w-6 h-px bg-growmax-red/30" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-1">
          <div className="border border-growmax-red/30 bg-growmax-red/5 p-4 text-center hover:bg-growmax-red/10 transition-colors">
            <Users className="w-6 h-6 text-growmax-red mx-auto mb-2" />
            <div className="font-bold text-sm uppercase tracking-tight">Sales Reps</div>
            <div className="font-mono text-[10px] text-gray-400 mt-2 leading-relaxed normal-case">
              See every order, quote, and customer interaction
            </div>
          </div>
          <div className="border border-growmax-red/30 bg-growmax-red/5 p-4 text-center hover:bg-growmax-red/10 transition-colors">
            <GitMerge className="w-6 h-6 text-growmax-red mx-auto mb-2" />
            <div className="font-bold text-sm uppercase tracking-tight">Partners</div>
            <div className="font-mono text-[10px] text-gray-400 mt-2 leading-relaxed normal-case">
              Order, fulfill, and manage on the same platform
            </div>
          </div>
          <div className="border border-growmax-red/30 bg-growmax-red/5 p-4 text-center hover:bg-growmax-red/10 transition-colors">
            <ShoppingCart className="w-6 h-6 text-growmax-red mx-auto mb-2" />
            <div className="font-bold text-sm uppercase tracking-tight">Customers</div>
            <div className="font-mono text-[10px] text-gray-400 mt-2 leading-relaxed normal-case">
              Self-serve portal, reorder, track — all connected
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-1">
          <div className="relative flex flex-col items-center py-1" style={{ height: "40px" }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full border-l border-dashed border-emerald-500/30" />
            </div>
            <div className="relative w-2 h-2 bg-emerald-500 animate-flow-up" style={{ animationDelay: "0.5s" }} />
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-500 py-0.5">
          <div className="w-6 h-px bg-emerald-500/30" />
          <span className="font-mono text-[10px] uppercase text-emerald-400/70">full visibility flows back</span>
          <div className="w-6 h-px bg-emerald-500/30" />
        </div>

        <div className="w-full border-2 border-emerald-500/30 bg-emerald-500/5 p-5 text-center mt-1">
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <Eye className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-tight">100% Visibility</span>
          </div>
          <div className="font-mono text-[10px] text-emerald-400/60 mt-1">Every order, every channel, every stakeholder — one truth</div>
        </div>

        <div className="w-full mt-6 space-y-2">
          {[
            "Sales reps see what every customer buys — online or offline",
            "Partners and dealers work on the same connected platform",
            "One unified revenue view across all channels",
          ].map((win, i) => (
            <div key={i} className="flex items-start gap-2 font-mono text-[11px] text-gray-300">
              <span className="text-emerald-500 mt-0.5 shrink-0">■</span>
              <span>{win}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[10px] text-growmax-red uppercase text-center">
        B2B is a team sport. Growmax puts everyone on the same field.
      </div>
    </div>
  );
}

interface BlogPost {
  id: number;
  title: string;
  category: string;
  date: string;
  slug: string;
  author: string;
  excerpt: string;
}

export default function Home() {
  const [comparisonTab, setComparisonTab] = useState<"others" | "growmax">("others");
  const { data: blogPosts = [] } = useQuery<BlogPost[]>({ queryKey: ["/api/blog"] });
  const latestPosts = blogPosts.slice(0, 4);
  return (
    <div className="flex flex-col min-h-screen pt-16 selection:bg-growmax-red selection:text-white">
      <SEOHead
        title="Growmax | Intelligent B2B Revenue Operations Platform"
        description="Connect your sales reps, partners, and customers on one intelligent platform. From quote to fulfillment with full visibility. For industrial manufacturers and distributors."
        path="/"
        structuredData={organizationSchema()}
      />
      
      {/* SECTION 1: ECOSYSTEM HERO */}
      <section className="relative min-h-[90vh] flex flex-col justify-center border-b-2 border-growmax-black overflow-hidden bg-growmax-white bg-grid-blueprint">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-growmax-white pointer-events-none opacity-80"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col md:flex-row items-end gap-12 pt-20 pb-20">
          
          <div className="w-full md:w-3/4">
            <div className="inline-flex items-center gap-3 px-3 py-1 bg-growmax-black text-white text-xs font-mono font-medium mb-10 uppercase tracking-widest">
              <span className="w-2 h-2 bg-growmax-red"></span>
              Intelligent Revenue Operations
            </div>
            
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-[110px] font-bold tracking-tighter text-growmax-black leading-[0.9] mb-8 uppercase" data-testid="text-hero-headline">
              Your Reps<span className="text-growmax-red">.</span> <br/>
              Your Partners<span className="text-growmax-red">.</span> <br/>
              Your Customers<span className="text-growmax-red">.</span>
            </h1>
            
            <div className="grid md:grid-cols-2 gap-8 border-t-2 border-growmax-black pt-8">
              <p className="text-xl text-growmax-black font-medium leading-relaxed" data-testid="text-hero-subheadline">
                One Platform. Full Visibility. <br/> From Quote to Fulfillment.
              </p>
              <div className="flex flex-col items-start gap-4">
                <p className="text-sm font-mono text-gray-500 uppercase leading-relaxed" data-testid="text-hero-description">
                  Whether you sell directly to customers or through partner networks, Growmax connects your sales reps, dealers, and customers on one intelligent platform — replacing disconnected spreadsheets, manual quote workflows, and siloed ERPs.
                </p>
                <Link href="/demo">
                  <Button className="bg-growmax-black hover:bg-growmax-red text-white rounded-none h-12 px-8 font-mono text-xs uppercase tracking-widest border border-growmax-black transition-colors duration-0" data-testid="button-hero-demo">
                    Book a Demo <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/4 flex flex-col justify-end gap-4 font-mono text-xs uppercase tracking-widest text-gray-400">
            <div className="border border-gray-300 p-4 bg-white/50 backdrop-blur-sm">
              <div className="text-growmax-black font-bold mb-2 border-b border-gray-200 pb-2">Target Verticals</div>
              <ul className="space-y-2">
                <li>Industrial</li>
                <li>Electrical</li>
                <li>Construction Eq.</li>
                <li>Building Materials</li>
                <li>Spares & Aftermarket</li>
              </ul>
            </div>
          </div>
          
        </div>
      </section>

      {/* SECTION 2: THEM VS US — THE "AHA" MOMENT */}
      <section className="py-24 bg-growmax-black text-white border-b-2 border-growmax-red" data-testid="section-ecosystem-diagram">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Why B2B Needs More Than eCommerce</div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-4">Not Just eCommerce<span className="text-growmax-red">.</span></h2>
            <p className="font-mono text-sm text-gray-400 max-w-3xl mx-auto">
              B2B is not retail. Your sales reps, partners, and customers must work together — not in silos. That's why you need an Intelligent Revenue Operations Platform.
            </p>
          </div>

          <div className="lg:hidden flex border-2 border-white/20 mb-4">
            <button
              onClick={() => setComparisonTab("others")}
              className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest transition-colors border-r border-white/20 ${
                comparisonTab === "others" ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
              }`}
              data-testid="tab-others"
            >
              Typical B2B eCommerce
            </button>
            <button
              onClick={() => setComparisonTab("growmax")}
              className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${
                comparisonTab === "growmax" ? "bg-growmax-red text-white" : "text-growmax-red hover:text-white"
              }`}
              data-testid="tab-growmax"
            >
              With Growmax
            </button>
          </div>

          <div className="hidden lg:grid lg:grid-cols-2 gap-4">
            <TypicalEcommercePanel />
            <GrowmaxConnectedPanel />
          </div>

          <div className="lg:hidden">
            {comparisonTab === "others" ? <TypicalEcommercePanel /> : <GrowmaxConnectedPanel />}
          </div>
        </div>
      </section>

      {/* TRUSTED BY / DEPLOYMENT PARTNERS */}
      <section className="py-16 bg-growmax-white border-b-2 border-growmax-black" data-testid="section-trusted-by">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-6 mb-12">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">Trusted By</div>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-12">
            {[
              { logo: <SiemensLogo size="lg" />, logoLight: <SiemensLogo size="lg" variant="light" />, label: "Partner Commerce" },
              { logo: <SchwingSttetterLogo size="lg" />, logoLight: <SchwingSttetterLogo size="lg" variant="light" />, label: "Spares Portal" },
              { logo: <OBOBettermannLogo size="lg" />, logoLight: <OBOBettermannLogo size="lg" variant="light" />, label: "Dealer Portal" },
            ].map((partner, i) => (
              <div
                key={i}
                className="border-2 border-growmax-black p-6 md:p-8 flex flex-col items-center justify-center text-center hover:bg-growmax-black group transition-colors"
                data-testid={`partner-logo-${i}`}
              >
                <div className="group-hover:hidden">
                  {partner.logo}
                </div>
                <div className="hidden group-hover:block">
                  {partner.logoLight}
                </div>
                <span className="font-mono text-[10px] md:text-xs uppercase tracking-widest text-gray-500 group-hover:text-gray-400 mt-3">
                  {partner.label}
                </span>
              </div>
            ))}
          </div>

          <div className="overflow-hidden relative">
            <div className="flex animate-marquee whitespace-nowrap gap-8 font-mono text-sm uppercase tracking-widest text-gray-400">
              {[
                "Electrical Distribution",
                "Industrial Manufacturing",
                "Building Materials",
                "MRO Supplies",
                "Construction Equipment",
                "Spare Parts",
                "Electrical Distribution",
                "Industrial Manufacturing",
                "Building Materials",
                "MRO Supplies",
                "Construction Equipment",
                "Spare Parts",
              ].map((vertical, i) => (
                <span key={i} className="flex items-center gap-8">
                  <span className="text-growmax-red">■</span>
                  <span>{vertical}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: THE PROBLEM WITH B2C PLATFORMS */}
      <section className="py-24 bg-growmax-black text-white border-b-2 border-growmax-red bg-dots-dark">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
                Why generic platforms breakdown.
              </h2>
              <p className="font-mono text-sm text-gray-400 uppercase leading-relaxed border-l-2 border-growmax-red pl-4">
                "We tried X platform. Spent 8 months customizing. Still couldn't handle customer-specific pricing."
                <br/><br/>
                <span className="text-growmax-red">— Common industry post-mortem</span>
              </p>
            </div>

            <div className="lg:col-span-8">
              <div className="border-2 border-white/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 bg-white/5 border-b-2 border-white/20 font-mono text-xs font-bold uppercase tracking-widest">
                  <div className="p-4 text-gray-400">What B2C platforms assume</div>
                  <div className="p-4 border-t sm:border-t-0 sm:border-l-2 border-white/20 text-white bg-growmax-red/20">What your business needs</div>
                </div>
                
                {[
                  { b2c: "One price for everyone", b2b: "Customer-specific pricing" },
                  { b2c: "Instant checkout", b2b: "Quote → Approval → PO → Invoice" },
                  { b2c: "One warehouse", b2b: "Multi-branch, multi-warehouse" },
                  { b2c: "Anonymous buyers", b2b: "Long-term partnership relationships" },
                  { b2c: "Simple cart", b2b: "100-line quotes with version control" },
                  { b2c: "Credit card / UPI", b2b: "Net 30/45/60 payment terms" }
                ].map((row, i) => (
                  <div key={i} className="grid grid-cols-1 sm:grid-cols-2 border-b border-white/10 hover:bg-white/5 transition-colors">
                    <div className="p-4 font-mono text-sm text-gray-500 line-through decoration-gray-700">{row.b2c}</div>
                    <div className="p-4 font-mono text-sm text-white border-t sm:border-t-0 sm:border-l-2 border-white/20 flex items-center gap-3">
                      <CheckSquare className="w-4 h-4 text-growmax-red shrink-0" /> {row.b2b}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: THE REVENUE LEAKS WE FIX */}
      <section className="py-32 bg-growmax-white border-b-2 border-growmax-black">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between border-b-4 border-growmax-black pb-8 gap-8">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9]">
              The Revenue <br/>Leaks We Fix
            </h2>
            <div className="font-mono text-sm font-bold text-growmax-red uppercase max-w-sm">
              "These aren't nice to have features. They're daily business flows."
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 font-mono">
            {[
              { num: "01", title: "Pricing Complexity", desc: "Customer A gets 15%, Customer B gets 18.5%. Special Price overrides for large orders. Built-in logic." },
              { num: "02", title: "Approval Bottlenecks", desc: "Quote request → Manager approval → Director approval → Converted to order with zero edits." },
              { num: "03", title: "Multi-branch / Warehouse", desc: "Sales reps from different branches send quotes or orders to discrete warehouses automatically." },
              { num: "04", title: "Quote Management", desc: "100s of line item quotes, strict version control, validity periods, and quote-to-order tracking." },
              { num: "05", title: "Payment Terms Logic", desc: "Net 30/45/60, payment against delivery, cash discounts, packing & forwarding cost matrices." },
              { num: "06", title: "ERP Integration sync", desc: "Two-way real-time sync for inventory, customers, orders & invoices. Native SAP JCo." }
            ].map((leak, i) => (
              <div key={i} className="group relative pt-6 border-t border-growmax-black hover:border-growmax-red transition-colors">
                <div className="absolute top-0 right-0 -mt-10 text-6xl font-bold text-gray-100 group-hover:text-growmax-red/10 transition-colors z-0">
                  {leak.num}
                </div>
                <h3 className="text-lg font-bold mb-4 uppercase text-growmax-black relative z-10">{leak.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed relative z-10">{leak.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: THE GROWMAX ADVANTAGE — ANIMATED ECOSYSTEM FLOW */}
      <section className="py-32 bg-growmax-black text-white border-b-2 border-growmax-red">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">The Growmax Advantage</div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-4">How Revenue Flows<span className="text-growmax-red">.</span></h2>
            <p className="font-mono text-sm text-gray-400 uppercase max-w-3xl mx-auto">
              See how orders move through your ecosystem — from customer purchase to partner fulfillment to revenue growth — with 100% visibility back to you.
            </p>
          </div>

          <EcosystemFlowDiagram />
        </div>
      </section>

      {/* SECTION 6: CASE STUDIES */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-6 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Deployment Validation</h2>
            <div className="h-0.5 flex-1 bg-growmax-black"></div>
          </div>

          <div className="space-y-4">
            <div className="border-2 border-growmax-black p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-start hover:bg-gray-50 transition-colors">
              <div className="lg:w-1/3">
                <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Case Study 01</div>
                <SiemensLogo size="lg" className="mb-2" />
                <p className="font-mono text-sm text-gray-500 uppercase">Partner Commerce Platform</p>
              </div>
              <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-mono text-gray-600 leading-relaxed">
                    <strong>Challenge:</strong> Sales teams prioritized top 20% customers (80% revenue), leaving smaller contractors underserved despite significant collective volume.
                  </p>
                  <p className="text-sm font-mono text-gray-600 leading-relaxed mt-4">
                    <strong>Solution:</strong> Rolled out connected platform between internal sales, partners, and the 80% base. Scalable digital sales reps serving high-volume, lower-touch profitably.
                  </p>
                </div>
                <div className="bg-growmax-black text-white p-6 flex flex-col justify-center gap-4 font-mono">
                  <div className="flex justify-between items-center border-b border-white/20 pb-2">
                    <span className="text-xs uppercase text-gray-400">Scale</span>
                    <span className="font-bold text-xl">300+ Partners</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase text-gray-400">Reach</span>
                    <span className="font-bold text-xl">100K+ Customers</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-2 border-growmax-black p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-start hover:bg-gray-50 transition-colors">
              <div className="lg:w-1/3">
                <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Case Study 02</div>
                <SchwingSttetterLogo size="lg" className="mb-2" />
                <p className="font-mono text-sm text-gray-500 uppercase">Spares Portal</p>
              </div>
              <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-mono text-gray-600 leading-relaxed">
                    <strong>Challenge:</strong> 800+ service engineers across 50 branches manually giving quotes/orders. Customers unhappy with delayed processes.
                  </p>
                  <p className="text-sm font-mono text-gray-600 leading-relaxed mt-4">
                    <strong>Solution:</strong> Unified portal for contracted pricing, engineers creating quotes on the move, tightly integrated with backend SAP ECC.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="bg-growmax-red text-white p-4 flex flex-col justify-center">
                    <div className="text-3xl font-bold">↑74%</div>
                    <div className="text-[10px] uppercase mt-2">Quote Response Time</div>
                  </div>
                  <div className="bg-growmax-black text-white p-4 flex flex-col justify-center">
                    <div className="text-3xl font-bold">↑36%</div>
                    <div className="text-[10px] uppercase mt-2">Quote-to-Close Rate</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 7: ARCHITECTURE SPLIT / PRODUCT ROUTING */}
      <section className="py-0 bg-growmax-black text-white border-t-2 border-growmax-red" data-testid="section-architecture-split">
        <div className="flex flex-col md:flex-row">
          
          <Link href="/revenue-platform" className="w-full md:w-1/2 p-12 md:p-16 border-b border-gray-800 md:border-b-0 md:border-r border-gray-800 hover:bg-growmax-red group transition-colors duration-300 flex flex-col justify-between min-h-[auto] md:min-h-[600px]" data-testid="link-enterprise-split">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-widest mb-6 border border-white/20 inline-block px-3 py-1 group-hover:border-white">Growmax Enterprise</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 uppercase">Multi-Party<br/>Revenue Ecosystem</h2>
              <p className="font-mono text-sm text-gray-400 group-hover:text-white/90 leading-relaxed max-w-md mb-6">
                Connect your sales reps, partners, and customers. Multi-version quotes, partner commerce, dealer portals — with 100% visibility across the entire revenue chain.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <span className="text-growmax-red group-hover:text-white">■</span>
                  <span className="text-gray-400 group-hover:text-white/80">Industrial, Electrical, Construction, Building Materials</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <span className="text-growmax-red group-hover:text-white">■</span>
                  <span className="text-gray-400 group-hover:text-white/80">SAP, Epicor + Industry-specific ERPs</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <span className="text-growmax-red group-hover:text-white">■</span>
                  <span className="text-gray-400 group-hover:text-white/80">100+ Employees</span>
                </div>
              </div>

              <div className="inline-block border border-white/20 group-hover:border-white px-3 py-2 font-mono text-xs uppercase tracking-widest text-gray-400 group-hover:text-white">
                Custom Pricing — Book a Demo
              </div>
            </div>
            <div className="flex items-center gap-4 font-mono font-bold uppercase tracking-widest mt-8">
              Explore Growmax Enterprise <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-4" />
            </div>
          </Link>

          <Link href="/arc" className="w-full md:w-1/2 p-12 md:p-16 hover:bg-white hover:text-growmax-black group transition-colors duration-300 flex flex-col justify-between min-h-[auto] md:min-h-[600px]" data-testid="link-arc-split">
            <div>
              <div className="font-mono text-xs font-bold uppercase tracking-widest mb-6 border border-gray-800 inline-block px-3 py-1 group-hover:border-growmax-black">Growmax ARC</div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 uppercase">All-in-One<br/>Distributor Platform</h2>
              <p className="font-mono text-sm text-gray-400 group-hover:text-growmax-black leading-relaxed max-w-md mb-6">
                Self-service signup. Inventory, customer portal, and mobile sales app — ready in minutes. One-to-one simplicity for growing distributors.
              </p>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <span className="text-growmax-red">■</span>
                  <span className="text-gray-400 group-hover:text-gray-600">Direct sales, one-to-one relationship</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <span className="text-growmax-red">■</span>
                  <span className="text-gray-400 group-hover:text-gray-600">QuickBooks, Zoho, Xero</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <span className="text-growmax-red">■</span>
                  <span className="text-gray-400 group-hover:text-gray-600">Up to 100 Employees</span>
                </div>
              </div>

              <div className="inline-block border border-growmax-red px-3 py-2 font-mono text-xs uppercase tracking-widest text-growmax-red group-hover:bg-growmax-red group-hover:text-white">
                Starts at $199/month
              </div>
            </div>
            <div className="flex items-center gap-4 font-mono font-bold uppercase tracking-widest mt-8 text-growmax-red">
              Explore Growmax ARC <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-4" />
            </div>
          </Link>

        </div>
      </section>

      {/* SECTION 8: LATEST FROM INTELLIGENCE */}
      {latestPosts.length > 0 && (
        <section className="py-24 bg-growmax-white border-t-2 border-growmax-black" data-testid="section-latest-intelligence">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between mb-16 border-b-4 border-growmax-black pb-6">
              <div>
                <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-3">Growmax Intelligence</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">Latest Insights</h2>
              </div>
              <Link href="/blog" className="hidden md:flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-growmax-red hover:text-growmax-black transition-colors font-bold" data-testid="link-view-all-blog">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block border border-gray-200 bg-white hover:border-growmax-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  data-testid={`link-latest-post-${post.slug}`}
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-0.5 border border-gray-200">
                        {post.category}
                      </span>
                      <span className="font-mono text-[10px] text-gray-400">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-growmax-black tracking-tight group-hover:text-growmax-red transition-colors mb-3 leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-400 font-mono">{post.author}</span>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-growmax-red transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-growmax-red font-bold" data-testid="link-view-all-blog-mobile">
                View All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section className="py-32 bg-growmax-white text-center border-t-2 border-growmax-black bg-grid-blueprint">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-6 text-growmax-black">
            Let's connect your <br/>revenue ecosystem.
          </h2>
          <p className="font-mono text-lg mb-12 text-gray-600 max-w-2xl mx-auto uppercase">
            Pilot live in 8-12 weeks. Scale based on results.
          </p>
          <Link href="/demo">
            <Button className="bg-growmax-red hover:bg-growmax-black text-white rounded-none h-16 px-12 font-bold font-mono text-sm uppercase tracking-widest transition-colors duration-0 border-2 border-growmax-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-2 hover:translate-y-2" data-testid="button-final-cta">
              Book a Demo
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
