#!/usr/bin/env node
// SPEC-04 §8: performance sampling (report-only). 20 URLs x 3 samples per side;
// median TTFB and total time. Flags for the advisor if B's median TTFB is more
// than 1.5x A's on more than 3 URLs.
//
// Usage:
//   node run.mjs --base-a <origin> --base-b <origin> [--bypass-secret-file <f>] [--out <file>]

import { writeFile, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { performance } from 'node:perf_hooks'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SAMPLES = 3

async function buildUrlList(base, bypassSecret) {
  const urls = ['/', '/revenue-platform', '/minori-ai', '/demo', '/blog', '/api/blog', '/sitemap.xml']
  try {
    const headers = bypassSecret ? { 'x-vercel-protection-bypass': bypassSecret } : {}
    const res = await fetch(new URL('/api/blog', base).toString(), { headers })
    if (res.ok) {
      const posts = await res.json()
      for (const p of posts.slice(0, 5)) {
        if (p.slug) urls.push(`/blog/${p.slug}`)
      }
    }
  } catch {
    // fall through with whatever we have
  }
  // Pad to 20 with a few key product pages if still short.
  const extras = [
    '/company/about',
    '/privacy',
    '/industries/industrial-manufacturing',
    '/comparisons/salesforce-commerce-alternatives',
    '/solutions/spare-parts-ecommerce',
    '/industries/automotive-aftermarket',
    '/comparisons/netsuite-suitecommerce-alternatives',
    '/write-for-us',
  ]
  for (const e of extras) {
    if (urls.length >= 20) break
    urls.push(e)
  }
  return urls.slice(0, 20)
}

function median(nums) {
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

async function sampleUrl(base, pathOrUrl, bypassSecret) {
  const target = new URL(pathOrUrl, base).toString()
  const ttfbSamples = []
  const totalSamples = []
  for (let i = 0; i < SAMPLES; i++) {
    const headers = bypassSecret ? { 'x-vercel-protection-bypass': bypassSecret } : {}
    const start = performance.now()
    try {
      const res = await fetch(target, { headers, redirect: 'manual' })
      const ttfb = performance.now() - start // best available proxy for TTFB with fetch()
      await res.arrayBuffer()
      const total = performance.now() - start
      ttfbSamples.push(ttfb)
      totalSamples.push(total)
    } catch {
      // skip a failed sample; median is computed over whatever succeeded
    }
  }
  return {
    url: pathOrUrl,
    ttfbMedianMs: ttfbSamples.length ? Math.round(median(ttfbSamples)) : null,
    totalMedianMs: totalSamples.length ? Math.round(median(totalSamples)) : null,
    samples: ttfbSamples.length,
  }
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (!a.startsWith('--')) continue
    const key = a.slice(2)
    const next = argv[i + 1]
    if (next === undefined || next.startsWith('--')) out[key] = true
    else {
      out[key] = next
      i++
    }
  }
  return out
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!args['base-a'] || !args['base-b']) {
    console.error('Usage: node run.mjs --base-a <origin> --base-b <origin> [--bypass-secret-file <f>] [--out <file>]')
    process.exit(2)
  }
  const bypassSecretB = args['bypass-secret-file'] ? (await readFile(args['bypass-secret-file'], 'utf8')).trim() : undefined

  const urls = await buildUrlList(args['base-a'], undefined)

  const rows = []
  for (const u of urls) {
    const [a, b] = await Promise.all([sampleUrl(args['base-a'], u, undefined), sampleUrl(args['base-b'], u, bypassSecretB)])
    rows.push({ url: u, a, b })
  }

  const flagged = []
  for (const r of rows) {
    if (r.a.ttfbMedianMs != null && r.b.ttfbMedianMs != null && r.a.ttfbMedianMs > 0) {
      const ratio = r.b.ttfbMedianMs / r.a.ttfbMedianMs
      if (ratio > 1.5) flagged.push({ url: r.url, ratio: Number(ratio.toFixed(2)), aMs: r.a.ttfbMedianMs, bMs: r.b.ttfbMedianMs })
    }
  }

  const evidence = {
    kind: 'perf',
    reportOnly: true,
    baseA: args['base-a'],
    baseB: args['base-b'],
    samplesPerUrl: SAMPLES,
    urlCount: rows.length,
    rows,
    flagged,
    flaggedForAdvisor: flagged.length > 3,
  }

  const out = args.out || path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', 'evidence', 'perf-suite.json')
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, JSON.stringify(evidence, null, 2))
  console.log(`Perf suite: ${rows.length} URLs sampled, ${flagged.length} flagged (>1.5x TTFB) -> ${out}`)
  process.exit(0) // report-only: never fails the gate on its own
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
