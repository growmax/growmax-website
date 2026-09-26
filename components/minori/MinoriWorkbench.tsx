'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronUp, CircleCheck, LockKeyhole, MessageSquare, PackageCheck, Pause, Play, RotateCcw, ShieldCheck } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

type Mode = 'quote' | 'order'
type MobileView = 'conversation' | 'work'
type Stage = 0 | 1 | 2 | 3 | 4 | 5

const stageDurations = [1500, 1900, 1400, 1500, 1900, 1800]
const captions = ['Customer request received', 'Clarifying delivery location', 'Context confirmed', 'Running governed checks', 'Preparing quote draft', 'Review required before write']

const workData = {
  quote: {
    label: 'Quote draft', code: 'Q-ILL-042', customer: 'Harbourline Components', destination: 'Eastport warehouse',
    validity: 'Valid for 14 days', delivery: 'Delivery target · within 5 business days', status: 'Ready for review',
    lines: [{ name: '18mm conduit · graphite', qty: 24, unit: 'R 184.00', discount: '5%', total: 'R 4 195.20' }, { name: 'Conduit coupler · 18mm', qty: 48, unit: 'R 21.50', discount: '0%', total: 'R 1 032.00' }],
    subtotal: 'R 5 227.20', tax: 'R 784.08', total: 'R 6 011.28',
  },
  order: {
    label: 'Order draft', code: 'O-ILL-019', customer: 'Harbourline Components', destination: 'Eastport warehouse',
    validity: 'Requested delivery · within 5 business days', delivery: 'Availability checked · 2 lines', status: 'Waiting for approval',
    lines: [{ name: '18mm conduit · graphite', qty: 24, unit: 'R 184.00', discount: '5%', total: 'R 4 195.20' }, { name: 'Conduit coupler · 18mm', qty: 48, unit: 'R 21.50', discount: '0%', total: 'R 1 032.00' }],
    subtotal: 'R 5 227.20', tax: 'R 784.08', total: 'R 6 011.28',
  },
} as const

const workedSteps = ['Catalog match · 18mm conduit / graphite', 'Customer account · Harbourline Components', 'Price list · distributor tier / current', 'Availability · checked against Eastport']

function elapsedForStage(stage: Stage) {
  return stageDurations.slice(0, stage).reduce((sum, value) => sum + value, 0)
}

export default function MinoriWorkbench() {
  const [mode, setMode] = useState<Mode>('quote')
  const [stage, setStage] = useState<Stage>(0)
  const [elapsed, setElapsed] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mobileView, setMobileView] = useState<MobileView>('conversation')
  const [expanded, setExpanded] = useState(false)
  const completedRef = useRef(false)
  const autoMovedRef = useRef(false)
  const totalDuration = stageDurations.reduce((sum, value) => sum + value, 0)
  const data = workData[mode]

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => {
      setReducedMotion(media.matches)
      if (media.matches) { setStage(5); setElapsed(totalDuration); setPlaying(false) }
    }
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [totalDuration])

  useEffect(() => {
    const pauseWhenHidden = () => { if (document.hidden) setPlaying(false) }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden)
  }, [])

  useEffect(() => {
    if (!playing || reducedMotion) return
    const timer = window.setInterval(() => {
      setElapsed((current) => {
        const next = current + 50
        if (next >= totalDuration) { setStage(5); setPlaying(false); if (!completedRef.current) { completedRef.current = true; trackEvent('minori_walkthrough_completed', { mode }) }; return totalDuration }
        const foundStage = stageDurations.findIndex((_, index) => next < elapsedForStage((index + 1) as Stage))
        setStage((foundStage < 0 ? 5 : foundStage) as Stage)
        return next
      })
    }, 50)
    return () => window.clearInterval(timer)
  }, [playing, reducedMotion, stage, totalDuration, mode])

  useEffect(() => {
    if (stage >= 4 && !autoMovedRef.current) { autoMovedRef.current = true; setMobileView('work') }
  }, [stage])

  const restart = (track = true) => {
    setStage(reducedMotion ? 5 : 0); setElapsed(reducedMotion ? totalDuration : 0); setPlaying(!reducedMotion); setExpanded(false); completedRef.current = false; autoMovedRef.current = false; setMobileView('conversation')
    if (track) trackEvent('minori_walkthrough_restarted', { mode })
  }

  const switchMode = (next: Mode) => {
    setMode(next)
    trackEvent('minori_demo_mode_selected', { mode: next })
    restart(false)
  }

  const togglePlayback = () => {
    if (stage === 5) { restart(false); trackEvent('minori_walkthrough_played', { mode }); return }
    setPlaying((current) => { trackEvent(current ? 'minori_walkthrough_paused' : 'minori_walkthrough_played', { mode }); return !current })
  }

  const conversationVisible = (required: Stage) => stage >= required

  return (
    <section aria-labelledby="workbench-title" className="border-2 border-growmax-black bg-[#f3f3f0] shadow-[8px_8px_0px_0px_rgba(13,13,13,1)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-growmax-black bg-growmax-black px-4 py-3 text-white md:px-5">
        <div className="flex items-center gap-3"><span className="h-2 w-2 bg-growmax-red" aria-hidden="true" /><p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">Illustrative workbench / no live connection</p></div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">Review state only</span>
      </div>
      <div className="border-b border-gray-300 bg-white px-4 py-5 md:px-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-growmax-red">A request becomes a document</p>
        <h2 id="workbench-title" className="mt-2 max-w-3xl text-2xl font-bold uppercase leading-tight md:text-4xl">Conversation on one side. The work on the other.</h2>
        <div className="mt-5 flex flex-wrap items-center gap-2" role="tablist" aria-label="Illustrative outcome">
          {(['quote', 'order'] as Mode[]).map((item) => <button key={item} type="button" role="tab" aria-selected={mode === item} onClick={() => switchMode(item)} className={`border-2 px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest ${mode === item ? 'border-growmax-red bg-growmax-red text-white' : 'border-growmax-black bg-white hover:bg-gray-100'}`}>{item === 'quote' ? 'Quote example' : 'Order example'}</button>)}
        </div>
      </div>
      <div className="border-b border-gray-300 bg-[#f3f3f0] px-4 py-3 md:px-6" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-growmax-red">{captions[stage]}</p><span className="font-mono text-[10px] text-gray-500">{Math.round(elapsed / 1000)}s / {Math.round(totalDuration / 1000)}s</span></div>
        <div className="mt-2 h-1 bg-gray-300" role="progressbar" aria-label="Walkthrough progress" aria-valuemin={0} aria-valuemax={totalDuration} aria-valuenow={elapsed}><div className="h-full bg-growmax-red transition-[width] duration-100" style={{ width: `${(elapsed / totalDuration) * 100}%` }} /></div>
        <div className="mt-3 flex items-center gap-2"><button type="button" onClick={togglePlayback} aria-label={playing ? 'Pause walkthrough' : 'Play walkthrough'} className="flex h-8 w-8 items-center justify-center bg-growmax-black text-white hover:bg-growmax-red">{playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}</button><button type="button" onClick={() => restart()} aria-label="Restart walkthrough" className="flex h-8 w-8 items-center justify-center border border-gray-400 hover:border-growmax-black"><RotateCcw className="h-3.5 w-3.5" /></button><span className="ml-1 font-mono text-[9px] uppercase text-gray-500">{reducedMotion ? 'Reduced motion · final state' : playing ? 'Playing silently' : 'Paused'}</span></div>
      </div>
      <div className="flex border-b-2 border-growmax-black bg-white md:hidden" role="tablist" aria-label="Workbench view">
        {(['conversation', 'work'] as MobileView[]).map((view) => <button key={view} type="button" role="tab" aria-selected={mobileView === view} onClick={() => setMobileView(view)} className={`flex-1 border-r border-gray-300 px-3 py-3 font-mono text-[10px] font-bold uppercase tracking-widest ${mobileView === view ? 'bg-[#f3f3f0]' : 'text-gray-500'}`}>{view === 'conversation' ? 'Conversation' : 'Work pane'}</button>)}
      </div>
      <div className="grid min-w-0 md:grid-cols-[.85fr_1.15fr]">
        <div className={`${mobileView === 'work' ? 'hidden md:block' : ''} border-b border-gray-300 bg-[#f3f3f0] p-4 md:border-b-0 md:border-r md:p-6`}>
          <div className="mb-5 flex items-center justify-between"><span className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest"><MessageSquare className="h-3.5 w-3.5 text-growmax-red" /> Conversation</span><span className="font-mono text-[9px] uppercase text-gray-500">Example 01</span></div>
          <div className="space-y-4" aria-live="polite">
            {conversationVisible(0) && <div className="ml-auto max-w-[92%] border border-growmax-black bg-white p-3.5"><p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-widest text-gray-500">Sales request</p><p className="text-sm leading-relaxed">{mode === 'quote' ? 'Prepare a quote for 24 cases of 18mm conduit in graphite for Harbourline Components. Include the matching couplers.' : 'Repeat Harbourline Components’ last conduit order with the same quantities.'}</p></div>}
            {conversationVisible(1) && <div className="max-w-[94%] border-l-4 border-growmax-red bg-white p-3.5"><p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-widest text-growmax-red">Minori AI</p><p className="text-sm leading-relaxed">I found two delivery locations for this customer: Eastport warehouse and South Dock. Which should I use?</p></div>}
            {conversationVisible(2) && <div className="ml-auto max-w-[92%] border border-growmax-black bg-white p-3.5"><p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-widest text-gray-500">Sales reply</p><p className="text-sm leading-relaxed">Use Eastport warehouse.</p></div>}
            {conversationVisible(3) && <><div className="max-w-[94%] border-l-4 border-growmax-red bg-white p-3.5"><p className="mb-2 font-mono text-[9px] font-bold uppercase tracking-widest text-growmax-red">Minori AI</p><p className="text-sm leading-relaxed">I checked the customer, products, pricing, and availability. The proposed {mode} is ready for review.</p></div><button type="button" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} className="flex w-full items-center justify-between border border-gray-400 bg-white px-3 py-2.5 text-left font-mono text-[10px] uppercase tracking-wider hover:border-growmax-black"><span className="flex items-center gap-2"><CircleCheck className="h-3.5 w-3.5 text-growmax-red" /> Worked · 4 checks completed</span>{expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}</button>{expanded && <div className="border border-t-0 border-gray-400 bg-[#fafaf8] px-3 py-1">{workedSteps.map((step) => <p key={step} className="border-b border-gray-200 py-2 font-mono text-[10px] text-gray-600 last:border-0"><span className="mr-2 text-growmax-red">✓</span>{step}</p>)}</div>}</>}
            {conversationVisible(5) && <div className="border-2 border-growmax-red bg-white p-3.5"><p className="font-mono text-[9px] font-bold uppercase tracking-widest text-growmax-red">Review required</p><p className="mt-2 text-sm leading-relaxed">The document is ready. A person reviews the exact details before anything is written or emailed.</p></div>}
          </div>
          <div className="mt-5 flex items-start gap-2 border-t border-gray-300 pt-4 text-[11px] leading-relaxed text-gray-600"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-growmax-red" />No silent guesses. Missing recipient or context blocks the next action.</div>
        </div>
        <div className={`${mobileView === 'conversation' ? 'hidden md:block' : ''} min-w-0 max-w-full overflow-hidden bg-white p-4 md:p-6`}>
          {stage < 4 ? <div className="flex min-h-[420px] flex-col justify-between border border-dashed border-gray-400 bg-[#f3f3f0] p-4 md:p-5"><div className="flex items-center justify-between"><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">Work / preparing</p><span className="h-2 w-2 animate-pulse bg-growmax-red" /></div><div><div className="h-4 w-2/3 animate-pulse bg-gray-300" /><div className="mt-3 h-3 w-1/2 animate-pulse bg-gray-300" /><p className="mt-8 max-w-sm font-mono text-[10px] uppercase leading-relaxed text-gray-500">The structured document appears after the request has enough context. No result is shown early.</p></div><p className="font-mono text-[9px] uppercase text-gray-500">Waiting for clarification and checks</p></div> : <div className="animate-fade-in-up">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b-2 border-growmax-black pb-4"><div><p className="font-mono text-[10px] font-bold uppercase tracking-widest text-growmax-red">Work</p><h3 className="mt-1 text-xl font-bold uppercase">{data.label}</h3></div><span className="border border-growmax-black px-2 py-1 font-mono text-[9px] font-bold uppercase">{data.status}</span></div>
            <div className="grid gap-3 border-b border-gray-300 pb-4 text-xs sm:grid-cols-2"><div><p className="font-mono text-[9px] uppercase text-gray-500">Customer</p><p className="mt-1 font-semibold">{data.customer}</p></div><div><p className="font-mono text-[9px] uppercase text-gray-500">Reference</p><p className="mt-1 font-mono">{data.code}</p></div><div><p className="font-mono text-[9px] uppercase text-gray-500">Delivery location</p><p className="mt-1">{data.destination}</p></div><div><p className="font-mono text-[9px] uppercase text-gray-500">Terms</p><p className="mt-1">{data.validity}</p></div></div>
            <div className="mt-5 max-w-full overflow-x-auto overscroll-x-contain"><table className="w-full min-w-[480px] border-collapse text-left font-mono text-[10px]"><thead><tr className="border-b-2 border-growmax-black uppercase text-gray-500"><th className="pb-2 pr-3 font-normal">Line item</th><th className="px-2 pb-2 text-right font-normal">Qty</th><th className="px-2 pb-2 text-right font-normal">Unit</th><th className="px-2 pb-2 text-right font-normal">Discount</th><th className="pb-2 pl-2 text-right font-normal">Total</th></tr></thead><tbody>{data.lines.map((line) => <tr key={line.name} className="border-b border-gray-200"><td className="py-3 pr-3 font-sans text-xs">{line.name}</td><td className="px-2 py-3 text-right">{line.qty}</td><td className="px-2 py-3 text-right">{line.unit}</td><td className="px-2 py-3 text-right">{line.discount}</td><td className="py-3 pl-2 text-right font-bold">{line.total}</td></tr>)}</tbody></table></div>
            <div className="ml-auto mt-5 max-w-xs space-y-2 border-t border-gray-300 pt-3 font-mono text-xs"><div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>{data.subtotal}</span></div><div className="flex justify-between"><span className="text-gray-500">Tax</span><span>{data.tax}</span></div><div className="flex justify-between border-t-2 border-growmax-black pt-2 text-sm font-bold"><span>Total</span><span>{data.total}</span></div></div>
            <div className="mt-5 grid gap-2 border-t border-gray-300 pt-4 text-[11px] text-gray-600 sm:grid-cols-2"><p className="flex gap-2"><PackageCheck className="h-3.5 w-3.5 shrink-0 text-growmax-red" />{data.delivery}</p><p className="flex gap-2"><ShieldCheck className="h-3.5 w-3.5 shrink-0 text-growmax-red" />Context notes attached</p></div>
            <div className="mt-5 border-2 border-dashed border-gray-400 bg-[#f3f3f0] p-3"><p className="font-mono text-[9px] font-bold uppercase tracking-widest text-gray-500">Public preview / illustrative only</p><p className="mt-1 text-xs leading-relaxed text-gray-600">Controls are intentionally inactive. In the product, a person reviews the exact document before any write or email.</p><div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled className="border border-gray-300 px-3 py-2 font-mono text-[9px] uppercase text-gray-400">Review required</button><button type="button" disabled className="border border-gray-300 px-3 py-2 font-mono text-[9px] uppercase text-gray-400">Approve</button><button type="button" disabled className="border border-gray-300 px-3 py-2 font-mono text-[9px] uppercase text-gray-400">Email</button></div></div>
          </div>}
        </div>
      </div>
    </section>
  )
}