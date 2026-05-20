'use client'
import { useState } from 'react'
import { AlertCircle, GitMerge, Users, ShoppingCart, Eye, Building2 } from 'lucide-react'

function TypicalEcommercePanel() {
  return (
    <div className="border-2 border-white/10 p-8 md:p-10 relative overflow-hidden opacity-70 hover:opacity-90 transition-opacity" data-testid="diagram-typical-ecommerce">
      <div className="font-mono text-xs font-bold text-gray-500 uppercase tracking-widest mb-8 flex items-center gap-2">
        <span className="w-2 h-2 bg-gray-500" />Typical B2B eCommerce Platform
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full border-2 border-white/15 bg-white/5 p-5 text-center">
          <div className="font-bold text-lg uppercase tracking-tight flex items-center justify-center gap-2 text-gray-400">
            <ShoppingCart className="w-5 h-5" />eCommerce Storefront
          </div>
          <div className="font-mono text-[10px] text-gray-500 mt-1">ONLINE ORDERS ONLY</div>
        </div>
        <div className="w-full border border-white/15 bg-white/5 p-4 text-center mt-4">
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
          <div className="font-bold text-sm uppercase tracking-tight text-gray-400">Your Partners &amp; Dealers</div>
          <div className="font-mono text-[10px] text-gray-500 mt-2">Separate system, no connection</div>
        </div>
        <div className="w-full mt-6 space-y-2">
          {["Sales reps don't know what customers buy online","Partners manage orders in separate tools","No unified view of revenue across channels"].map((pain,i) => (
            <div key={i} className="flex items-start gap-2 font-mono text-[11px] text-gray-500">
              <span className="text-growmax-red mt-0.5 shrink-0">✕</span><span>{pain}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[10px] text-gray-600 uppercase text-center">Silos kill revenue. Your teams work in the dark.</div>
    </div>
  )
}

function GrowmaxConnectedPanel() {
  return (
    <div className="border-2 border-growmax-red/40 p-8 md:p-10 hover:border-growmax-red transition-colors" data-testid="diagram-growmax-connected">
      <div className="font-mono text-xs font-bold text-growmax-red uppercase tracking-widest mb-8 flex items-center gap-2">
        <span className="w-2 h-2 bg-growmax-red animate-ping-dot" />With Growmax — Everyone Connected
      </div>
      <div className="flex flex-col items-center">
        <div className="w-full border-2 border-growmax-red bg-growmax-red/10 p-5 text-center">
          <div className="font-bold text-lg uppercase tracking-tight flex items-center justify-center gap-2">
            <Building2 className="w-5 h-5 text-growmax-red" />Your Brand
          </div>
          <div className="font-mono text-[10px] text-gray-400 mt-1">INTELLIGENT REVENUE OPERATIONS PLATFORM</div>
        </div>
        <div className="flex items-center gap-2 text-gray-500 py-2">
          <div className="w-6 h-px bg-growmax-red/30" />
          <span className="font-mono text-[10px] uppercase text-growmax-red/70">everyone on one page</span>
          <div className="w-6 h-px bg-growmax-red/30" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mt-1">
          {[
            { icon: <Users className="w-6 h-6 text-growmax-red mx-auto mb-2" />, label: 'Sales Reps', sub: 'See every order, quote, and customer interaction' },
            { icon: <GitMerge className="w-6 h-6 text-growmax-red mx-auto mb-2" />, label: 'Partners', sub: 'Order, fulfill, and manage on the same platform' },
            { icon: <ShoppingCart className="w-6 h-6 text-growmax-red mx-auto mb-2" />, label: 'Customers', sub: 'Self-serve portal, reorder, track — all connected' },
          ].map((item,i) => (
            <div key={i} className="border border-growmax-red/30 bg-growmax-red/5 p-4 text-center hover:bg-growmax-red/10 transition-colors">
              {item.icon}
              <div className="font-bold text-sm uppercase tracking-tight">{item.label}</div>
              <div className="font-mono text-[10px] text-gray-400 mt-2 leading-relaxed normal-case">{item.sub}</div>
            </div>
          ))}
        </div>
        <div className="w-full border-2 border-emerald-500/30 bg-emerald-500/5 p-5 text-center mt-4">
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <Eye className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-tight">100% Visibility</span>
          </div>
          <div className="font-mono text-[10px] text-emerald-400/60 mt-1">Every order, every channel, every stakeholder — one truth</div>
        </div>
        <div className="w-full mt-6 space-y-2">
          {["Sales reps see what every customer buys — online or offline","Partners and dealers work on the same connected platform","One unified revenue view across all channels"].map((win,i) => (
            <div key={i} className="flex items-start gap-2 font-mono text-[11px] text-gray-300">
              <span className="text-emerald-500 mt-0.5 shrink-0">■</span><span>{win}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-white/10 font-mono text-[10px] text-growmax-red uppercase text-center">B2B is a team sport. Growmax puts everyone on the same field.</div>
    </div>
  )
}

export default function HomeComparisonTabs() {
  const [comparisonTab, setComparisonTab] = useState<'others' | 'growmax'>('others')

  return (
    <div>
      <div className="lg:hidden flex border-2 border-white/20 mb-4">
        <button
          onClick={() => setComparisonTab('others')}
          className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest transition-colors border-r border-white/20 ${comparisonTab === 'others' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          data-testid="tab-others"
        >
          Typical B2B eCommerce
        </button>
        <button
          onClick={() => setComparisonTab('growmax')}
          className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest transition-colors ${comparisonTab === 'growmax' ? 'bg-growmax-red text-white' : 'text-growmax-red hover:text-white'}`}
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
        <div className={comparisonTab !== 'others' ? 'hidden' : undefined}><TypicalEcommercePanel /></div>
        <div className={comparisonTab === 'others' ? 'hidden' : undefined}><GrowmaxConnectedPanel /></div>
      </div>
    </div>
  )
}
