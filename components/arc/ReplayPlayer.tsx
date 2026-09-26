'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronLeft, ChevronRight, FileText, Gauge, Pause, Play, RotateCcw, SkipForward, Volume2 } from 'lucide-react'
import { trackEvent } from '@/lib/analytics'

type ReplayEvent = { t: number; type: string; [key: string]: unknown }
type ReplayRenderEvent = ReplayEvent & { turnIndex: number; user?: { text?: string; attachments?: { name: string; mime?: string; bytes?: number }[] } }
type ReplayCard = { cardId?: string; kind?: string; statusBefore?: string; statusAfter?: string; payload?: Record<string, unknown>; transitions?: { t: number; status: string; by?: string }[] }
export type ReplayBundle = {
  schemaVersion?: number
  lane?: string
  sceneId?: string
  title?: string
  tenant?: { name?: string; currency?: string }
  modelTier?: string
  recordedAt?: string
  totalMs?: number
  turns?: { turnIndex: number; user?: { text?: string; attachments?: { name: string; mime?: string; bytes?: number }[] }; events?: ReplayEvent[]; summary?: string }[]
  cards?: ReplayCard[]
  ledger?: unknown
}

export interface ReplayScene {
  sceneId: string
  title: string
}

const fallbackScenes = [
  { sceneId: 'quote-ladder', title: 'Create a customer quote' },
  { sceneId: 'external-mcp', title: 'Place an approved order' },
  { sceneId: 'supplier-catalog', title: 'Turn files into products' },
]

const tierName = (value?: string) => {
  const valueLower = value?.toLowerCase()
  if (valueLower?.includes('high')) return 'High'
  if (valueLower?.includes('balanced')) return 'Balanced'
  return 'Fast'
}

const zar = (value: unknown) => {
  if (typeof value !== 'number' && typeof value !== 'string') return null
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return null
  const [whole, decimal] = numeric.toFixed(2).split('.')
  return `ZAR ${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}.${decimal}`
}

function eventText(event: ReplayEvent) {
  return typeof event.text === 'string' ? event.text : typeof event.content === 'string' ? event.content : ''
}

function safeLabel(value: unknown, fallback: string) {
  return typeof value === 'string' && value.trim() ? value : fallback
}

function sanitizeReplayBundle(data: ReplayBundle): ReplayBundle {
  const cardIndexes = new Map(data.cards?.map((card, index) => [card.cardId, index]).filter(([id]) => id) as [string, number][] ?? [])
  return {
    ...data,
    cards: data.cards?.map(({ cardId: _cardId, ...card }) => card),
    turns: data.turns?.map((turn) => ({
      ...turn,
      events: turn.events?.map((event) => {
        if (event.type !== 'card' || typeof event.cardId !== 'string') return event
        const { cardId: _cardId, ...safeEvent } = event
        return { ...safeEvent, cardIndex: cardIndexes.get(event.cardId) }
      }),
    })),
  }
}

function ReplayDocumentCard({ card, elapsed }: { card: ReplayCard; elapsed: number }) {
  const status = card.transitions?.filter((item) => item.t <= elapsed).findLast(() => true)?.status ?? card.statusBefore
  const payload = card.payload ?? {}
  const lines = Array.isArray(payload.lines) ? payload.lines.filter((line): line is Record<string, unknown> => !!line && typeof line === 'object') : []
  const hiddenKeys = new Set(['lines', 'totals'])
  const details = Object.entries(payload).filter(([key]) => !hiddenKeys.has(key) && !/id|token|secret/i.test(key)).slice(0, 6)
  const totals = payload.totals && typeof payload.totals === 'object' && !Array.isArray(payload.totals)
    ? Object.entries(payload.totals as Record<string, unknown>)
    : details.filter(([key]) => /total|amount|price|value/i.test(key))

  return (
    <div className="border-2 border-growmax-black bg-white p-5">
      <div className="flex items-center justify-between border-b border-gray-300 pb-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-growmax-red">{card.kind ?? 'Proposal'} / document</span>
        <span className="border border-growmax-black px-2 py-1 font-mono text-[9px] uppercase">{status ?? 'Proposed'}</span>
      </div>
      {lines.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[420px] border-collapse text-left font-mono text-[11px]">
            <thead><tr className="border-b border-growmax-black text-gray-500"><th className="py-2 pr-3 font-normal uppercase">Line</th><th className="px-3 py-2 text-right font-normal uppercase">Qty</th><th className="px-3 py-2 text-right font-normal uppercase">Price</th><th className="py-2 pl-3 text-right font-normal uppercase">Total</th></tr></thead>
            <tbody>{lines.map((line, index) => {
              const quantity = line.quantity ?? line.qty ?? ''
              const price = line.unitPrice ?? line.price
              const lineTotal = line.total ?? line.lineTotal
              return <tr key={index} className="border-b border-gray-100"><td className="py-3 pr-3">{safeLabel(line.name ?? line.description ?? line.product, `Line ${index + 1}`)}</td><td className="px-3 py-3 text-right">{String(quantity)}</td><td className="px-3 py-3 text-right">{zar(price) ?? '—'}</td><td className="py-3 pl-3 text-right font-bold">{zar(lineTotal) ?? '—'}</td></tr>
            })}</tbody>
          </table>
        </div>
      )}
      <div className="mt-4 space-y-2 font-mono text-xs">
        {details.filter(([key]) => !/total|amount|price|value/i.test(key)).map(([key, value]) => <div key={key} className="flex justify-between gap-4 border-b border-gray-100 py-2"><span className="text-gray-500">{key.replace(/([A-Z])/g, ' $1')}</span><span className="text-right">{typeof value === 'object' ? 'Included in proposal' : String(value)}</span></div>)}
        {totals.map(([key, value]) => <div key={key} className="flex justify-between gap-4 border-t border-growmax-black pt-3 font-bold"><span className="uppercase">{key.replace(/([A-Z])/g, ' $1')}</span><span>{zar(value) ?? String(value)}</span></div>)}
      </div>
      {status?.toLowerCase() === 'applied' && <div className="mt-4 flex items-center gap-2 border-t border-gray-300 pt-3 font-mono text-[10px] uppercase text-gray-500"><FileText className="h-3 w-3" /> Applied with undo available</div>}
    </div>
  )
}

export default function ReplayPlayer() {
  const [scenes, setScenes] = useState(fallbackScenes)
  const [recordingsAvailable, setRecordingsAvailable] = useState(false)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [bundle, setBundle] = useState<ReplayBundle | null>(null)
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [transcript, setTranscript] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const replayRequest = useRef(0)

  const scene = scenes[sceneIndex]
  const sceneId = scene?.sceneId
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  useEffect(() => {
    fetch('/replay/index.json', { cache: 'no-store' })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('missing')))
      .then((data) => {
        const entries = Array.isArray(data) ? data : data.scenes
        if (Array.isArray(entries) && entries.length) {
          setScenes(entries.map((item: { sceneId?: string; id?: string; title?: string }) => ({ sceneId: item.sceneId ?? item.id ?? '', title: item.title ?? 'Replay session' })))
          setRecordingsAvailable(true)
        }
      })
      .catch(() => undefined)
  }, [])
  useEffect(() => {
    const request = ++replayRequest.current
    setBundle(null)
    setElapsed(0)
    setPlaying(false)
    if (!recordingsAvailable || !sceneId) { setLoading(false); return }
    fetch(`/replay/${sceneId}.replay.json`, { cache: 'no-store' })
      .then((res) => res.ok ? res.json() : Promise.reject(new Error('missing')))
      .then((data: ReplayBundle) => {
        if (data.schemaVersion !== 1) throw new Error('unsupported replay schema')
        if (replayRequest.current === request) {
          setBundle(sanitizeReplayBundle(data))
          setPlaying(true)
        }
      })
      .catch(() => {
        if (replayRequest.current === request) setBundle(null)
      })
      .finally(() => {
        if (replayRequest.current === request) setLoading(false)
      })
    return () => {
      if (replayRequest.current === request) replayRequest.current += 1
    }
  }, [recordingsAvailable, sceneId])
  useEffect(() => {
    if (reducedMotion && bundle) {
      setElapsed(bundle.totalMs ?? 0)
      setPlaying(false)
    }
  }, [reducedMotion, bundle])
  useEffect(() => {
    if (!playing || !bundle) return
    timer.current = setInterval(() => {
      setElapsed((value) => {
        const end = bundle.totalMs ?? 0
        const next = value + 100 * speed
        if (next >= end) { setPlaying(false); return end }
        return next
      })
    }, 100)
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [playing, bundle, speed])

  const events = useMemo<ReplayRenderEvent[]>(() => bundle?.turns?.flatMap((turn) => (turn.events ?? []).map((event) => ({ ...event, turnIndex: turn.turnIndex, user: turn.user }))) ?? [], [bundle])
  const visibleEvents = events.filter((event) => event.t <= elapsed)
  const total = bundle?.totalMs ?? 0
  const visibleTurns = bundle?.turns?.filter((turn) => {
    const firstEventAt = turn.events?.reduce((minimum, event) => Math.min(minimum, event.t), Number.POSITIVE_INFINITY)
    return reducedMotion || elapsed >= (firstEventAt ?? 0)
  })
  const jump = (amount: number) => setElapsed((value) => Math.min(total, Math.max(0, value + amount)))
  const showFull = () => { setElapsed(total); setPlaying(false) }

  return (
    <section tabIndex={0} onKeyDown={(event) => { if (event.key === ' ') { event.preventDefault(); setPlaying((value) => !value) } if (event.key === 'ArrowRight') jump(10000); if (event.key === 'ArrowLeft') jump(-10000); if (event.key === 'End') showFull() }} className="border-2 border-growmax-black bg-[#f1f1ef] shadow-[10px_10px_0px_0px_rgba(13,13,13,1)] focus:outline focus:outline-2 focus:outline-growmax-red" aria-label="Replay player. Space plays or pauses. Arrow keys skip. End skips to end.">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-growmax-black bg-growmax-black px-4 py-3 text-white">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="h-2 w-2 animate-pulse bg-growmax-red" aria-hidden="true" /> LIVE SESSION / REPLAY
        </div>
        {bundle && <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">{tierName(bundle.modelTier)} model tier</span>}
      </div>
      <div className="flex flex-wrap gap-0 border-b border-gray-300 bg-white" role="tablist" aria-label="Replay scenes">
        {scenes.map((item, index) => (
          <button key={item.sceneId || index} role="tab" aria-selected={sceneIndex === index} onClick={() => { setSceneIndex(index); trackEvent('minori_replay_selected', { scene: item.sceneId || `scene_${index + 1}`, recording_available: recordingsAvailable }) }} className={`border-r border-gray-300 px-4 py-4 text-left font-mono text-[10px] uppercase tracking-wider transition-colors ${sceneIndex === index ? 'bg-growmax-red text-white' : 'hover:bg-gray-100'}`}>
            <span className="mr-2 opacity-60">0{index + 1}</span>{item.title}
          </button>
        ))}
      </div>
      <div className="min-h-[390px] p-4 md:p-8">
        {loading ? (
          <div className="space-y-4 animate-pulse" aria-label="Loading recording">
            <div className="h-4 w-40 bg-gray-300" /><div className="h-20 w-3/4 bg-gray-300" /><div className="ml-auto h-16 w-2/3 bg-gray-300" /><div className="h-28 w-full bg-gray-300" />
          </div>
        ) : !bundle ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center border border-dashed border-gray-400 px-6 text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center border-2 border-growmax-black"><Volume2 className="h-5 w-5" /></div>
            <h3 className="font-sans text-2xl font-bold uppercase tracking-tight">Recording coming soon.</h3>
            <p className="mt-3 max-w-md font-mono text-xs leading-relaxed text-gray-500">Replay files will appear here when the evaluation harness recording is available. No transcript has been invented for this preview.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-5">
            {events.length === 0 && <p className="font-mono text-xs text-gray-500">This recording contains no renderable events.</p>}
            {visibleTurns?.map((turn) => {
              const turnEvents = (turn.events ?? []).filter((event) => event.t <= elapsed)
              const assistantText = turnEvents.filter((event) => event.type === 'token').map(eventText).join('')
              const toolEvents = turnEvents.filter((event) => event.type === 'step' || event.type === 'tool_call' || event.type === 'tool_result')
              const cardEvents = turnEvents.filter((event) => event.type === 'card')
              const questions = turnEvents.filter((event) => event.type === 'question')
              const thinking = turnEvents.some((event) => event.type === 'thinking')
              const usage = turnEvents.some((event) => event.type === 'usage')
              const done = turnEvents.some((event) => event.type === 'done')
              return (
                <div key={turn.turnIndex} className="space-y-4 border-b border-gray-300 pb-6 last:border-b-0">
                  {turn.user?.text && <div className="ml-auto max-w-[85%] border border-growmax-black bg-white p-4"><div className="mb-2 font-mono text-[9px] uppercase tracking-widest text-growmax-red">User action</div><p className="text-sm leading-relaxed">{turn.user.text}</p>{turn.user.attachments?.map((attachment) => <div key={attachment.name} className="mt-3 border-t border-gray-200 pt-2 font-mono text-[9px] uppercase text-gray-500">{attachment.name} · {attachment.mime ?? 'file'}{attachment.bytes ? ` · ${attachment.bytes} bytes` : ''}</div>)}</div>}
                  {thinking && <div className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Reasoning through the governed steps…</div>}
                  {assistantText && <div className="max-w-[90%] border-l-4 border-growmax-red bg-white p-4"><div className="mb-2 font-mono text-[9px] uppercase tracking-widest text-gray-500">Assistant stream</div><p className="whitespace-pre-wrap text-sm leading-relaxed">{assistantText}</p></div>}
                  {toolEvents.length > 0 && <div className="flex flex-wrap gap-2">{toolEvents.map((event, index) => <span key={`${event.t}-${index}`} className="inline-flex items-center gap-2 border border-gray-400 bg-white px-3 py-2 font-mono text-[10px] uppercase"><Check className="h-3 w-3 text-growmax-red" />{event.type === 'tool_result' ? 'Result' : event.type === 'tool_call' ? 'Call' : 'Step'} · {safeLabel(event.name ?? event.label, 'Commerce operation')} <span className="text-gray-400">{event.elapsedMs ? `${String(event.elapsedMs)}ms` : ''}</span></span>)}</div>}
                  {cardEvents.map((event, index) => {
                    const card = bundle.cards?.[typeof event.cardIndex === 'number' ? event.cardIndex : index]
                    return card ? <ReplayDocumentCard key={`${event.t}-${index}`} card={card} elapsed={elapsed} /> : null
                  })}
                  {questions.map((event, index) => <div key={`${event.t}-${index}`} className="max-w-[90%] border-2 border-growmax-red bg-white p-4"><div className="mb-2 font-mono text-[9px] uppercase tracking-widest text-growmax-red">Confirmation required</div><p className="text-sm leading-relaxed">{eventText(event) || 'Review the proposal and confirm the next action.'}</p></div>)}
                  {(usage || done) && <div className="flex flex-wrap gap-3 font-mono text-[9px] uppercase tracking-widest text-gray-400">{usage && <span>Usage recorded</span>}{done && <span>Turn complete</span>}</div>}
                  {done && turn.summary && <p className="border-t border-gray-200 pt-3 text-sm leading-relaxed text-gray-600">{turn.summary}</p>}
                </div>
              )
            })}
          </div>
        )}
      </div>
      {bundle && <div className="border-t-2 border-growmax-black bg-white p-4">
        <div className="mb-3 flex items-center gap-3"><button aria-label={playing ? 'Pause replay' : 'Play replay'} onClick={() => setPlaying(!playing)} className="flex h-9 w-9 items-center justify-center bg-growmax-black text-white hover:bg-growmax-red">{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</button><button aria-label="Skip back 10 seconds" onClick={() => jump(-10000)} className="border border-gray-300 p-2 hover:border-growmax-black"><ChevronLeft className="h-4 w-4" /></button><button aria-label="Skip forward 10 seconds" onClick={() => jump(10000)} className="border border-gray-300 p-2 hover:border-growmax-black"><ChevronRight className="h-4 w-4" /></button><button onClick={showFull} className="ml-auto flex items-center gap-2 border border-gray-300 px-3 py-2 font-mono text-[10px] uppercase hover:border-growmax-black"><SkipForward className="h-3 w-3" /> Skip to end</button></div>
        <input aria-label="Replay timeline" type="range" min="0" max={total || 1} value={elapsed} onChange={(event) => setElapsed(Number(event.target.value))} className="w-full accent-[#e61a1a]" />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-wider text-gray-500"><span>{Math.round(elapsed / 1000)}s / {Math.round(total / 1000)}s</span><div className="flex items-center gap-2"><Gauge className="h-3 w-3" />{[1, 2, 4].map((value) => <button key={value} onClick={() => setSpeed(value)} className={speed === value ? 'font-bold text-growmax-red' : 'hover:text-growmax-black'}>{value}×</button>)}<button onClick={() => setTranscript(!transcript)} className="ml-3 underline">{transcript ? 'Hide transcript' : 'Plain transcript'}</button><button onClick={() => { setElapsed(0); setPlaying(false) }} aria-label="Restart replay"><RotateCcw className="ml-2 h-3 w-3" /></button></div></div>
        {transcript && <div className="mt-4 max-h-40 overflow-auto whitespace-pre-wrap border border-gray-300 bg-[#f7f7f5] p-3 font-mono text-xs leading-relaxed">{bundle.turns?.flatMap((turn) => [`USER · ${turn.user?.text ?? ''}`, ...(turn.events ?? []).map((event) => `${event.t}ms · ${event.type}${eventText(event) ? ` · ${eventText(event)}` : ''}`)]).join('\n')}</div>}
        {reducedMotion && <p className="mt-3 font-mono text-[10px] uppercase text-gray-500">Reduced motion: full transcript rendered instantly.</p>}
      </div>}
    </section>
  )
}