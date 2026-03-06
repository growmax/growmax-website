import { Link } from "wouter";
import { ArrowRight, Users, Building2, ShoppingCart, GitMerge } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WhichGrowmaxProps {
  industry?: string;
}

export default function WhichGrowmax({ industry }: WhichGrowmaxProps) {
  return (
    <section className="py-24 bg-growmax-black text-white border-t-2 border-growmax-red" data-testid="section-which-growmax">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4">Choose Your Platform</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-4">
            Which Growmax Is Right{industry ? ` for Your ${industry} Business` : " for You"}?
          </h2>
          <p className="font-mono text-sm text-gray-400 uppercase max-w-xl mx-auto">
            Two products. Two different scales. Pick the one that fits your operation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="border-2 border-growmax-red p-8 md:p-10 flex flex-col justify-between hover:bg-growmax-red/5 transition-colors" data-testid="card-which-enterprise">
            <div>
              <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-growmax-red"></span>
                Growmax Enterprise
              </div>
              <h3 className="text-3xl font-bold tracking-tighter uppercase mb-4">Multi-Party Revenue Ecosystem</h3>
              <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">
                Connect your sales reps, partners, and customers. Multi-version quotes, partner commerce, dealer portals — with 100% visibility across the entire revenue chain.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <Users className="w-4 h-4 text-growmax-red shrink-0" />
                  <span className="text-gray-300">100+ employees</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <GitMerge className="w-4 h-4 text-growmax-red shrink-0" />
                  <span className="text-gray-300">Partner/dealer networks</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <Building2 className="w-4 h-4 text-growmax-red shrink-0" />
                  <span className="text-gray-300">SAP, Epicor, industry-specific ERPs</span>
                </div>
              </div>

              <div className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-6">
                Custom Pricing — Tailored to your ecosystem
              </div>
            </div>

            <Link href="/demo">
              <Button className="w-full bg-growmax-red hover:bg-white hover:text-growmax-black text-white h-14 rounded-none font-bold font-mono text-sm uppercase tracking-widest transition-colors border-2 border-growmax-red" data-testid="button-which-enterprise-demo">
                Book a Demo <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="border-2 border-white/30 p-8 md:p-10 flex flex-col justify-between hover:bg-white/5 transition-colors" data-testid="card-which-arc">
            <div>
              <div className="font-mono text-xs font-bold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-white/60"></span>
                Growmax ARC
              </div>
              <h3 className="text-3xl font-bold tracking-tighter uppercase mb-4">All-in-One Distributor Platform</h3>
              <p className="text-gray-400 font-mono text-sm leading-relaxed mb-6">
                Self-service signup. Inventory, customer portal, and mobile sales app — ready in minutes. One-to-one simplicity for growing distributors.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <Users className="w-4 h-4 text-white/60 shrink-0" />
                  <span className="text-gray-300">Up to 100 employees</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <ShoppingCart className="w-4 h-4 text-white/60 shrink-0" />
                  <span className="text-gray-300">Direct sales, one-to-one</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest">
                  <Building2 className="w-4 h-4 text-white/60 shrink-0" />
                  <span className="text-gray-300">QuickBooks, Zoho, Xero</span>
                </div>
              </div>

              <div className="font-mono text-xs text-white font-bold uppercase tracking-widest mb-6">
                Starts at $199/month
              </div>
            </div>

            <Link href="/arc">
              <Button className="w-full bg-white/10 hover:bg-white hover:text-growmax-black text-white h-14 rounded-none font-bold font-mono text-sm uppercase tracking-widest transition-colors border-2 border-white/30" data-testid="button-which-arc-signup">
                Explore Growmax ARC <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
