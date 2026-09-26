// Shared HTTP fetch helper for the parity harness.
//
// - redirect: 'manual' always (the caller inspects Location itself)
// - retries: 3x on network errors and 502/503/504, with backoff; never on other 4xx/5xx
// - records the attempt count used
// - optional `resolve` map (host -> ip) for the Sandbox runner, where DNS must be
//   pinned because the container's proxy is not present there
// - optional bypass secret adds ONLY `x-vercel-protection-bypass` (never the
//   cookie-setting `x-vercel-set-bypass-cookie`, which triggers a redirect)

import { setTimeout as sleep } from 'node:timers/promises'

const RETRYABLE_STATUS = new Set([502, 503, 504])
const DEFAULT_UA = 'growmax-migration-verifier/1.0'

let cachedAgentCtor = null
async function getUndiciAgent() {
  if (cachedAgentCtor) return cachedAgentCtor
  const undici = await import('undici')
  cachedAgentCtor = undici.Agent
  return cachedAgentCtor
}

/**
 * Build a fetch dispatcher that pins DNS for the given host -> ip map.
 * Entries look like "host:443:ip" per SPEC-04 §3; the port is informational
 * (connections are always over 443/https here) and kept only for parity with
 * the spec's own flag shape.
 */
export async function buildResolveDispatcher(resolveEntries) {
  if (!resolveEntries || resolveEntries.length === 0) return undefined
  const map = new Map()
  for (const entry of resolveEntries) {
    const [host, , ip] = entry.split(':')
    if (!host || !ip) throw new Error(`Invalid --resolve entry (want host:port:ip): ${entry}`)
    map.set(host, ip)
  }
  const Agent = await getUndiciAgent()
  const dns = await import('node:dns')
  return new Agent({
    connect: {
      lookup(hostname, options, callback) {
        const pinned = map.get(hostname)
        if (pinned) {
          callback(null, pinned, 4)
          return
        }
        dns.lookup(hostname, options, callback)
      },
    },
  })
}

/**
 * Fetch a single URL with manual redirects, retry-on-transient-failure, and
 * bookkeeping of the attempt count.
 *
 * @param {string} url
 * @param {object} opts
 * @param {string} [opts.bypassSecret]
 * @param {string} [opts.ua]
 * @param {import('undici').Agent} [opts.dispatcher]
 * @param {number} [opts.timeoutMs]
 */
export async function fetchOnce(url, opts = {}) {
  const {
    bypassSecret,
    ua = DEFAULT_UA,
    dispatcher,
    timeoutMs = 20000,
  } = opts

  const headers = { 'user-agent': ua }
  if (bypassSecret) headers['x-vercel-protection-bypass'] = bypassSecret

  let attempts = 0
  let lastErr = null

  for (let attempt = 1; attempt <= 3; attempt++) {
    attempts = attempt
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, {
        redirect: 'manual',
        headers,
        dispatcher,
        signal: controller.signal,
      })
      clearTimeout(timer)

      if (RETRYABLE_STATUS.has(res.status) && attempt < 3) {
        await sleep(backoffMs(attempt))
        continue
      }

      const buf = Buffer.from(await res.arrayBuffer())
      return { ok: true, res, buf, attempts }
    } catch (err) {
      clearTimeout(timer)
      lastErr = err
      if (attempt < 3) {
        await sleep(backoffMs(attempt))
        continue
      }
    }
  }
  return { ok: false, error: lastErr, attempts }
}

function backoffMs(attempt) {
  return 300 * 2 ** (attempt - 1) // 300, 600
}

export function normalizeLocation(location, base, knownHosts) {
  if (!location) return null
  try {
    const url = new URL(location, base)
    const host = url.host.toLowerCase()
    const isKnown = knownHosts.some((h) => {
      if (h.startsWith('*.')) return host.endsWith(h.slice(1))
      return host === h
    })
    if (isKnown) {
      return url.pathname + (url.search || '')
    }
    return url.toString()
  } catch {
    return location
  }
}
