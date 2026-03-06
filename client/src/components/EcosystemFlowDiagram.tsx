import { useState } from "react";
import { Building2, Users, ShoppingCart, Truck, DollarSign, Store, Eye, Package, ArrowDown, ArrowUp } from "lucide-react";

function AnimatedConnector({ direction = "down", delay = 0, color = "red" }: { direction?: "down" | "up"; delay?: number; color?: "red" | "green" | "white" }) {
  const colorMap = {
    red: "bg-growmax-red",
    green: "bg-emerald-500",
    white: "bg-white",
  };

  return (
    <div className="relative flex flex-col items-center py-1" style={{ height: "40px" }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-px h-full border-l border-dashed border-white/30" />
      </div>
      <div
        className={`relative w-2 h-2 ${colorMap[color]} ${direction === "down" ? "animate-flow-down" : "animate-flow-up"}`}
        style={{ animationDelay: `${delay}s` }}
      />
    </div>
  );
}

function FlowNode({ icon, label, sublabel, accent = false, glowType = "none", testId }: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  accent?: boolean;
  glowType?: "none" | "red" | "white";
  testId?: string;
}) {
  const glowClass = glowType === "red" ? "animate-pulse-glow" : glowType === "white" ? "animate-pulse-glow-white" : "";
  const borderClass = accent ? "border-growmax-red bg-growmax-red/10" : "border-white/30 bg-white/5";

  return (
    <div
      className={`border-2 ${borderClass} ${glowClass} p-4 text-center hover:bg-white/10 transition-colors`}
      data-testid={testId}
    >
      <div className={`mx-auto mb-2 ${accent ? "text-growmax-red" : "text-gray-300"}`}>{icon}</div>
      <div className="font-bold text-sm uppercase tracking-tight">{label}</div>
      {sublabel && (
        <div className="font-mono text-[10px] text-gray-400 mt-1.5 leading-relaxed normal-case">{sublabel}</div>
      )}
    </div>
  );
}

function FlowLabel({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-gray-500 py-0.5">
      <div className="w-6 h-px bg-gray-600" />
      <span className="font-mono text-[10px] uppercase whitespace-nowrap">{text}</span>
      <div className="w-6 h-px bg-gray-600" />
    </div>
  );
}

function ManufacturerEcosystem() {
  return (
    <div
      className="border-2 border-white/20 p-6 md:p-8 lg:p-10 hover:border-growmax-red transition-colors"
      data-testid="diagram-manufacturer-flow"
    >
      <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-growmax-red animate-ping-dot" />
        Manufacturer + Partner Network
      </div>

      <div className="flex flex-col items-center">
        <FlowNode
          icon={<Building2 className="w-7 h-7" />}
          label="Manufacturer"
          sublabel="Full catalog, pricing rules, brand control"
          accent
          glowType="red"
          testId="node-manufacturer"
        />

        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <AnimatedConnector direction="down" delay={i * 0.4} color="red" />
            </div>
          ))}
        </div>

        <FlowLabel text="distributes through" />

        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-1">
          {[
            { label: "Dealer A", sub: "Region: West" },
            { label: "Dealer B", sub: "Region: Central" },
            { label: "Dealer C", sub: "Region: East" },
          ].map((d, i) => (
            <FlowNode
              key={i}
              icon={<Store className="w-5 h-5" />}
              label={d.label}
              sublabel={d.sub}
              testId={`node-dealer-${i}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <AnimatedConnector direction="down" delay={i * 0.3 + 0.6} color="white" />
            </div>
          ))}
        </div>

        <FlowLabel text="customers buy from partners" />

        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-1">
          {[0, 1, 2].map((i) => (
            <FlowNode
              key={i}
              icon={<ShoppingCart className="w-5 h-5" />}
              label={`Customers`}
              sublabel="Self-service portal"
              testId={`node-endcustomer-${i}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <AnimatedConnector direction="down" delay={i * 0.2 + 0.3} color="white" />
            </div>
          ))}
        </div>

        <FlowLabel text="partners fulfill orders" />

        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="border border-emerald-500/40 bg-emerald-500/5 p-3 text-center">
              <Truck className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
              <div className="font-mono text-[10px] text-emerald-400 uppercase">Fulfilled</div>
            </div>
          ))}
        </div>

        <div className="w-full mt-4 relative">
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center" style={{ top: "-12px" }}>
            <AnimatedConnector direction="up" delay={0} color="green" />
          </div>
        </div>

        <div className="w-full border-2 border-emerald-500/40 bg-emerald-500/5 p-4 text-center mt-6">
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <DollarSign className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-tight">Revenue flows back to manufacturer</span>
          </div>
          <div className="font-mono text-[10px] text-emerald-400/70 mt-1">100% visibility on orders, pricing, and partner performance</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[10px] text-gray-500 uppercase text-center">
        <span>Partners sell & fulfill — you grow revenue with full visibility</span>
      </div>
    </div>
  );
}

function DistributorBranches() {
  return (
    <div
      className="border-2 border-white/20 p-6 md:p-8 lg:p-10 hover:border-growmax-red transition-colors"
      data-testid="diagram-distributor-flow"
    >
      <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-6 flex items-center gap-2">
        <span className="w-2 h-2 bg-growmax-red animate-ping-dot" style={{ animationDelay: "1s" }} />
        Distributor + Branch Network
      </div>

      <div className="flex flex-col items-center">
        <FlowNode
          icon={<Building2 className="w-7 h-7" />}
          label="Distributor HQ"
          sublabel="Central catalog, pricing, user management"
          glowType="white"
          testId="node-distributor-hq"
        />

        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <AnimatedConnector direction="down" delay={i * 0.3} color="white" />
            </div>
          ))}
        </div>

        <FlowLabel text="manages branches" />

        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-1">
          {[
            { label: "Houston", sub: "Branch store" },
            { label: "Dallas", sub: "Branch store" },
            { label: "Austin", sub: "Branch store" },
          ].map((b, i) => (
            <div key={i} className="border border-white/30 bg-white/5 p-4 text-center hover:bg-white/10 transition-colors" data-testid={`node-branch-${i}`}>
              <Store className="w-5 h-5 text-gray-300 mx-auto mb-2" />
              <div className="font-bold text-xs uppercase tracking-tight">{b.label}</div>
              <div className="font-mono text-[10px] text-gray-400 mt-1">{b.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full mt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <AnimatedConnector direction="down" delay={i * 0.25 + 0.5} color="white" />
            </div>
          ))}
        </div>

        <FlowLabel text="customers buy from their branch" />

        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-1">
          {[0, 1, 2].map((i) => (
            <FlowNode
              key={i}
              icon={<ShoppingCart className="w-5 h-5" />}
              label="Customers"
              sublabel="Connected store"
              testId={`node-branch-customer-${i}`}
            />
          ))}
        </div>

        <div className="w-full mt-4 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <AnimatedConnector direction="up" delay={i * 0.35 + 0.2} color="white" />
            </div>
          ))}
        </div>

        <FlowLabel text="sales reps see everything" />

        <div className="w-full grid grid-cols-3 gap-3 mt-1">
          {[
            { name: "Rep: Mike", status: "12 active orders" },
            { name: "Rep: Sarah", status: "8 active orders" },
            { name: "Rep: James", status: "15 active orders" },
          ].map((rep, i) => (
            <div key={i} className="border border-white/20 bg-white/5 p-3 text-center" data-testid={`node-salesrep-${i}`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Users className="w-4 h-4 text-gray-400" />
                <div className="w-1.5 h-1.5 bg-emerald-500 animate-ping-dot" style={{ animationDelay: `${i * 0.5}s` }} />
              </div>
              <div className="font-bold text-[10px] uppercase">{rep.name}</div>
              <div className="font-mono text-[9px] text-emerald-400/70 mt-0.5">{rep.status}</div>
            </div>
          ))}
        </div>

        <div className="w-full border border-white/20 bg-white/5 p-4 text-center mt-4">
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <Eye className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-tight">HQ has full control & visibility</span>
          </div>
          <div className="font-mono text-[10px] text-gray-400 mt-1">Every branch, every rep, every order — one dashboard</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[10px] text-gray-500 uppercase text-center">
        <span>Every branch, every rep, every order — one connected platform</span>
      </div>
    </div>
  );
}

export default function EcosystemFlowDiagram() {
  const [activeTab, setActiveTab] = useState<"enterprise" | "arc">("enterprise");

  return (
    <div data-testid="section-ecosystem-flow">
      <div className="md:hidden flex border-2 border-white/20 mb-4">
        <button
          onClick={() => setActiveTab("enterprise")}
          className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${
            activeTab === "enterprise"
              ? "bg-growmax-red text-white"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
          data-testid="tab-enterprise-flow"
        >
          Partners
        </button>
        <button
          onClick={() => setActiveTab("arc")}
          className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${
            activeTab === "arc"
              ? "bg-growmax-red text-white"
              : "bg-transparent text-gray-400 hover:text-white"
          }`}
          data-testid="tab-arc-flow"
        >
          Branches
        </button>
      </div>

      <div className="hidden md:grid md:grid-cols-2 gap-4">
        <ManufacturerEcosystem />
        <DistributorBranches />
      </div>

      <div className="md:hidden">
        {activeTab === "enterprise" ? <ManufacturerEcosystem /> : <DistributorBranches />}
      </div>
    </div>
  );
}
