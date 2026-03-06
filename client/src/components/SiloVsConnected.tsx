import { Building2, Users, ShoppingCart, GitMerge, AlertCircle, Eye } from "lucide-react";

interface SiloVsConnectedProps {
  competitorName: string;
}

export default function SiloVsConnected({ competitorName }: SiloVsConnectedProps) {
  return (
    <div className="my-16" data-testid="section-silo-vs-connected">
      <div className="text-center mb-10">
        <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-3">The Real Difference</div>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tighter uppercase mb-3">
          Silos vs. Connected Revenue<span className="text-growmax-red">.</span>
        </h2>
        <p className="font-mono text-xs text-gray-500 max-w-2xl mx-auto">
          Most B2B platforms give you a storefront. Growmax gives you a revenue operations platform where sales reps, partners, and customers work together — not in silos.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border-2 border-gray-200 bg-gray-50 p-6 md:p-8 opacity-75">
          <div className="font-mono text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400" />
            With {competitorName}
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full border border-gray-300 bg-white p-4 text-center">
              <ShoppingCart className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="font-bold text-sm uppercase tracking-tight text-gray-500">eCommerce Storefront</div>
              <div className="font-mono text-[10px] text-gray-400 mt-1">Online orders only</div>
            </div>

            <div className="flex flex-col items-center py-1" style={{ height: "32px" }}>
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="w-px h-full border-l border-dashed border-gray-300" />
                <div className="absolute w-1.5 h-1.5 bg-gray-400 animate-flow-down" />
              </div>
            </div>

            <div className="w-full border border-gray-300 bg-white p-3 text-center">
              <div className="font-bold text-xs uppercase text-gray-400">Customers</div>
            </div>

            <div className="w-full my-4 relative">
              <div className="border-t-2 border-dashed border-red-300 w-full" />
              <div className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-gray-50 px-2">
                <div className="flex items-center gap-1 text-red-400">
                  <AlertCircle className="w-3 h-3" />
                  <span className="font-mono text-[9px] font-bold uppercase">Disconnected</span>
                </div>
              </div>
            </div>

            <div className="w-full space-y-2">
              <div className="border border-gray-300 bg-white p-3 text-center">
                <Users className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <div className="font-bold text-xs uppercase text-gray-400">Sales Team</div>
                <div className="font-mono text-[9px] text-gray-400">Zero visibility</div>
              </div>
              <div className="border border-gray-300 bg-white p-3 text-center">
                <GitMerge className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                <div className="font-bold text-xs uppercase text-gray-400">Partners</div>
                <div className="font-mono text-[9px] text-gray-400">Separate system</div>
              </div>
            </div>

            <div className="w-full mt-4 space-y-1.5">
              {[
                "Sales reps blind to online orders",
                "Partners in separate tools",
                "No unified revenue view",
              ].map((pain, i) => (
                <div key={i} className="flex items-start gap-1.5 font-mono text-[10px] text-gray-400">
                  <span className="text-red-400 mt-0.5 shrink-0">✕</span>
                  <span>{pain}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-2 border-growmax-red/30 bg-growmax-black text-white p-6 md:p-8">
          <div className="font-mono text-[10px] font-bold text-growmax-red uppercase tracking-widest mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-growmax-red animate-ping-dot" />
            With Growmax
          </div>

          <div className="flex flex-col items-center">
            <div className="w-full border-2 border-growmax-red bg-growmax-red/10 p-4 text-center animate-pulse-glow">
              <Building2 className="w-5 h-5 text-growmax-red mx-auto mb-1" />
              <div className="font-bold text-sm uppercase tracking-tight">Your Brand</div>
              <div className="font-mono text-[10px] text-gray-400 mt-1">Revenue Operations Platform</div>
            </div>

            <div className="flex justify-center mt-1" style={{ height: "28px" }}>
              <div className="relative flex flex-col items-center py-1 h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-px h-full border-l border-dashed border-growmax-red/40" />
                </div>
                <div className="relative w-1.5 h-1.5 bg-growmax-red animate-flow-down" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full mt-1">
              <div className="border border-growmax-red/30 bg-growmax-red/5 p-3 text-center">
                <Users className="w-4 h-4 text-growmax-red mx-auto mb-1" />
                <div className="font-bold text-[10px] uppercase">Sales Reps</div>
              </div>
              <div className="border border-growmax-red/30 bg-growmax-red/5 p-3 text-center">
                <GitMerge className="w-4 h-4 text-growmax-red mx-auto mb-1" />
                <div className="font-bold text-[10px] uppercase">Partners</div>
              </div>
              <div className="border border-growmax-red/30 bg-growmax-red/5 p-3 text-center">
                <ShoppingCart className="w-4 h-4 text-growmax-red mx-auto mb-1" />
                <div className="font-bold text-[10px] uppercase">Customers</div>
              </div>
            </div>

            <div className="flex justify-center mt-1" style={{ height: "28px" }}>
              <div className="relative flex flex-col items-center py-1 h-full">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-px h-full border-l border-dashed border-emerald-500/30" />
                </div>
                <div className="relative w-1.5 h-1.5 bg-emerald-500 animate-flow-up" style={{ animationDelay: "0.5s" }} />
              </div>
            </div>

            <div className="w-full border border-emerald-500/30 bg-emerald-500/5 p-3 text-center mt-1">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                <Eye className="w-4 h-4" />
                <span className="font-bold text-xs uppercase">100% Visibility</span>
              </div>
            </div>

            <div className="w-full mt-4 space-y-1.5">
              {[
                "Sales reps see every order — online & offline",
                "Partners work on the same platform",
                "One unified revenue view",
              ].map((win, i) => (
                <div key={i} className="flex items-start gap-1.5 font-mono text-[10px] text-gray-300">
                  <span className="text-emerald-500 mt-0.5 shrink-0">■</span>
                  <span>{win}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
