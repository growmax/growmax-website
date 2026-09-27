#!/usr/bin/env node
// SPEC-04 §7: visual diff (Playwright screenshots + pixelmatch), container only,
// secondary evidence — a failure here does not block a gate that parity + functional
// already passed, but new console/request errors on B that don't happen on A do.
//
// Usage:
//   node run.mjs --base-a <origin> --base-b <origin> [--bypass-secret-file <f>] \
//     [--out <evidence.json>] [--shots-dir <dir>]

import { writeFile, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// This container's outbound HTTPS goes through a local agent proxy that re-terminates TLS
// with its own CA (/root/.ccr/README.md). curl/node's own fetch already trust it (pre-set
// via the usual CA env vars / system trust store), but Playwright's bundled, headless-only
// Chromium build does NOT do NSS/desktop trust-store integration, so a page.goto() through
// the proxy fails closed with net::ERR_CERT_AUTHORITY_INVALID regardless. Rather than
// disabling TLS verification (which would also hide a genuinely bad cert on the real
// origin), pin Chromium to exactly this one CA via --ignore-certificate-errors-spki-list.
const PROXY_CA_PATH = '/root/.ccr/agent-proxy-ca.crt'

async function proxyCaSpkiPinArgs() {
  if (!process.env.HTTPS_PROXY) return []
  try {
    const pem = await readFile(PROXY_CA_PATH, 'utf8')
    const { X509Certificate, createHash } = await import('node:crypto')
    const cert = new X509Certificate(pem)
    const spki = cert.publicKey.export({ type: 'spki', format: 'der' })
    const pin = createHash('sha256').update(spki).digest('base64')
    return [`--ignore-certificate-errors-spki-list=${pin}`]
  } catch {
    // No proxy CA available here (e.g. a different environment without this container's
    // agent proxy) — launch without the pin; a real TLS failure then still fails closed and
    // is reported as not_run below, same as before this fix.
    return []
  }
}

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'revenue-platform', path: '/revenue-platform' },
  { name: 'minori-ai', path: '/minori-ai' },
  { name: 'demo', path: '/demo' },
  { name: 'blog-index', path: '/blog' },
  { name: 'blog-post', path: null }, // filled in from the live blog index, if reachable
  { name: 'comparison', path: '/comparisons/salesforce-commerce-alternatives' },
  { name: 'industry', path: '/industries/industrial-manufacturing' },
  { name: 'about', path: '/company/about' },
  { name: 'privacy', path: '/privacy' },
]

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

const INJECT_CSS = '*{animation:none!important;transition:none!important;caret-color:transparent!important}'

// Hosts treated as "first-party" even when they differ from the capturing page's own host:
// A is captured from www.growmax.io, B from a *.vercel.app deployment alias, and neither is
// itself in this list, but a same-site absolute link/asset on either side should still
// reconcile with the other (mirrors CANONICAL_PRODUCTION_HOSTS in parity/lib/extract.mjs).
const CANONICAL_PRODUCTION_HOSTS = ['www.growmax.io', 'growmax.io']

// P5.3 fix: a P5.2 attempt-2 run flagged 20/20 page/viewport combinations as having "new
// failed requests on B" purely because run.mjs compared failed requests by exact full URL.
// The failures were net::ERR_ABORTED Google Analytics / Google Ads / DoubleClick beacons
// (analytics.google.com/g/collect, www.google.com/ccm|rmkt/collect, ad.doubleclick.net/ccm/s/collect)
// that also abort identically on A — confirmed by independent standalone reproduction — but
// their query strings are randomized per page load (cid/auid session ids, rnd/tft
// timestamps, cache-busting params), so they never match byte-for-byte across captures.
//
// Fix: compare failed requests by a normalized key instead of the raw URL.
//  - Cross-origin (third-party) requests: the query string is where the random noise lives,
//    so it's dropped entirely — key is method + scheme://host + pathname + failure text.
//    Two different third-party paths, or the same path failing for a different reason, still
//    produce different keys and are still flagged.
//  - First-party requests (the page's own host, or one of CANONICAL_PRODUCTION_HOSTS): these
//    should compare exactly, query string included, since a first-party querystring (e.g. a
//    cache-busted /_next/static/ chunk) is meaningful, not random noise. The host itself is
//    dropped from the key so that A's www.growmax.io and B's *.vercel.app — which are the same
//    site captured from two different origins — reconcile instead of every first-party
//    request being flagged as "new" purely because the hostname changed.
function isFirstPartyHost(host, pageHost) {
  return host === pageHost || CANONICAL_PRODUCTION_HOSTS.includes(host)
}

export function normalizeFailedRequestKey({ url, method, failure }, pageOrigin) {
  const m = method || ''
  const f = failure || ''
  let u
  try {
    u = new URL(url)
  } catch {
    // Unparseable request URL: fall back to the raw url as the key so it still compares
    // (exactly, since there's nothing safe to normalize) rather than being silently dropped.
    return `unparseable|${m}|${url}|${f}`
  }
  let pageHost = null
  try {
    pageHost = new URL(pageOrigin).host
  } catch {
    // leave pageHost null; isFirstPartyHost then only matches CANONICAL_PRODUCTION_HOSTS
  }
  if (isFirstPartyHost(u.host, pageHost)) {
    return `firstparty|${m}|${u.pathname}${u.search}|${f}`
  }
  return `thirdparty|${m}|${u.protocol}//${u.host}${u.pathname}|${f}`
}

/** Pure diff: which of B's failed requests (by normalized key) don't occur among A's failed
 *  requests on the same page/viewport. Exported so the self-test can exercise the exact
 *  comparison the main loop uses, without needing a browser. */
export function diffNewFailedRequests(failedA, failedB) {
  return failedB.filter((f) => !failedA.some((fa) => fa.key === f.key))
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

async function resolveBlogPostPath(base, bypassSecret) {
  try {
    const headers = bypassSecret ? { 'x-vercel-protection-bypass': bypassSecret } : {}
    const res = await fetch(new URL('/api/blog', base).toString(), { headers })
    if (!res.ok) return null
    const posts = await res.json()
    const first = posts.find((p) => p.slug)
    return first ? `/blog/${first.slug}` : null
  } catch {
    return null
  }
}

async function checkReachable(base) {
  try {
    const res = await fetch(new URL('/', base).toString(), { redirect: 'manual' })
    return res.status > 0
  } catch {
    return false
  }
}

async function captureShots({ chromium, base, bypassSecret, shotsDir, label, pages, chromiumArgs }) {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined
  const baseHost = new URL(base).host
  const browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    proxy,
    args: chromiumArgs || [],
  })
  const results = []
  const consoleErrors = {}
  const failedRequests = {}
  const errorResponses = {}

  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        reducedMotion: 'reduce',
      })
      if (bypassSecret) {
        // Per review: `extraHTTPHeaders` on the context applies to EVERY request it makes,
        // including third-party ones (analytics/font/tag-manager hosts) the page itself
        // loads — sending our Vercel protection-bypass secret to hosts that have nothing to
        // do with the deployment being captured. Route instead, and only add the header to
        // requests actually going to `base`'s host.
        await context.route('**/*', (route) => {
          let host = null
          try {
            host = new URL(route.request().url()).host
          } catch {
            // unparseable request URL; fall through and forward unmodified
          }
          if (host === baseHost) {
            route.continue({ headers: { ...route.request().headers(), 'x-vercel-protection-bypass': bypassSecret } })
          } else {
            route.continue()
          }
        })
      }
      await context.addInitScript((css) => {
        const style = document.createElement('style')
        style.textContent = css
        document.documentElement.appendChild(style)
      }, INJECT_CSS)

      for (const p of pages) {
        if (!p.path) continue
        const key = `${p.name}/${vp.name}`
        const page = await context.newPage()
        const errs = []
        const failedReqs = []
        const errorResps = []
        page.on('console', (msg) => {
          if (msg.type() === 'error') errs.push(msg.text())
        })
        page.on('requestfailed', (req) => {
          const entry = { url: req.url(), method: req.method(), failure: req.failure()?.errorText }
          entry.key = normalizeFailedRequestKey(entry, base)
          failedReqs.push(entry)
        })
        // 'requestfailed' never fires for an HTTP 4xx/5xx — the request itself succeeded at
        // the network level, it just came back with a bad status (e.g. a missing public/
        // asset, a broken image optimizer, a 404'd JS/CSS chunk). Catch those here instead.
        page.on('response', (res) => {
          if (res.status() >= 400) errorResps.push({ url: res.url(), status: res.status() })
        })

        try {
          await page.goto(new URL(p.path, base).toString(), { waitUntil: 'networkidle', timeout: 30000 })
          await page.evaluate(() => document.fonts?.ready)
          const shotPath = path.join(shotsDir, `${label}-${p.name}-${vp.name}.png`)
          await mkdir(shotsDir, { recursive: true })
          // fullPage (per review): a viewport-only shot never captures a below-the-fold
          // styling regression. pixelDiff() already treats a height mismatch between A/B as
          // "not comparable" rather than a false fail, so this is a pure coverage gain.
          await page.screenshot({ path: shotPath, fullPage: true })
          results.push({ page: p.name, viewport: vp.name, shotPath, ok: true })
        } catch (err) {
          results.push({ page: p.name, viewport: vp.name, ok: false, error: String(err.message || err) })
        } finally {
          consoleErrors[key] = errs
          failedRequests[key] = failedReqs
          errorResponses[key] = errorResps
          await page.close()
        }
      }
      await context.close()
    }
  } finally {
    await browser.close()
  }

  return { results, consoleErrors, failedRequests, errorResponses }
}

async function pixelDiff(pathA, pathB, outDiffPath) {
  const { PNG } = await import('pngjs')
  const pixelmatch = (await import('pixelmatch')).default
  const imgA = PNG.sync.read(await readFile(pathA))
  const imgB = PNG.sync.read(await readFile(pathB))
  if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
    return { ratio: null, comparable: false, reason: `size mismatch ${imgA.width}x${imgA.height} vs ${imgB.width}x${imgB.height}` }
  }
  const { width, height } = imgA
  const diff = new PNG({ width, height })
  const mismatched = pixelmatch(imgA.data, imgB.data, diff.data, width, height, { threshold: 0.1 })
  await mkdir(path.dirname(outDiffPath), { recursive: true })
  await writeFile(outDiffPath, PNG.sync.write(diff))
  const ratio = mismatched / (width * height)
  return { ratio, comparable: true, mismatched, totalPixels: width * height, diffPath: outDiffPath }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!args['base-a'] || !args['base-b']) {
    console.error('Usage: node run.mjs --base-a <origin> --base-b <origin> [--bypass-secret-file <f>] [--out <file>] [--shots-dir <dir>]')
    process.exit(2)
  }
  const out =
    args.out || path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', 'evidence', 'visual-suite.json')
  const shotsDir = args['shots-dir'] || path.resolve(__dirname, '..', '..', '..', 'docs', 'migration', '.scratch', 'visual')

  const bypassSecret = args['bypass-secret-file'] ? (await readFile(args['bypass-secret-file'], 'utf8')).trim() : undefined

  const [reachableA, reachableB] = await Promise.all([checkReachable(args['base-a']), checkReachable(args['base-b'])])
  if (!reachableA || !reachableB) {
    const evidence = {
      kind: 'visual',
      status: 'not_run',
      reason: `container could not reach both sites (A reachable=${reachableA}, B reachable=${reachableB})`,
    }
    await mkdir(path.dirname(out), { recursive: true })
    await writeFile(out, JSON.stringify(evidence, null, 2))
    console.log(`Visual suite: not_run (${evidence.reason})`)
    process.exit(0)
  }

  const { chromium } = await import('playwright-core')
  const chromiumArgs = await proxyCaSpkiPinArgs()
  const preflightProxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined

  // A plain fetch() being reachable doesn't guarantee the browser itself can navigate here:
  // e.g. a container whose corporate egress proxy re-terminates TLS with its own CA (see
  // /root/.ccr/README.md) can have every other tool trust that CA while Playwright's bundled,
  // headless-only Chromium build still doesn't (no NSS/desktop trust-store integration) — the
  // chromiumArgs SPKI pin above (and using the same proxy here as captureShots does) covers
  // that case. Probe with a real navigation first so any OTHER browser-specific issue is still
  // honestly reported as not_run, rather than silently producing zero screenshots while still
  // calling the suite "pass".
  const preflight = await chromium
    .launch({
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      proxy: preflightProxy,
      args: chromiumArgs,
    })
    .then(async (browser) => {
      try {
        const page = await browser.newPage()
        await page.goto(new URL('/', args['base-a']).toString(), { waitUntil: 'domcontentloaded', timeout: 20000 })
        return { ok: true }
      } catch (err) {
        return { ok: false, error: String(err.message || err) }
      } finally {
        await browser.close()
      }
    })
  if (!preflight.ok) {
    const evidence = {
      kind: 'visual',
      status: 'not_run',
      reason: `browser could not navigate to ${args['base-a']} (fetch() was reachable, so this is a browser-specific issue, e.g. TLS trust in this container): ${preflight.error}`,
    }
    await mkdir(path.dirname(out), { recursive: true })
    await writeFile(out, JSON.stringify(evidence, null, 2))
    console.log(`Visual suite: not_run (${evidence.reason})`)
    process.exit(0)
  }

  const pages = [...PAGES]
  // Base A is www.growmax.io / Replit: never send it the Vercel protection-bypass secret
  // (P1.2 review r4), same as captureShots for A below.
  const blogPostPath = await resolveBlogPostPath(args['base-a'], undefined)
  const blogPostIdx = pages.findIndex((p) => p.name === 'blog-post')
  if (blogPostPath) pages[blogPostIdx] = { name: 'blog-post', path: blogPostPath }

  const [capA, capB] = await Promise.all([
    captureShots({ chromium, base: args['base-a'], bypassSecret: undefined, shotsDir, label: 'a', pages, chromiumArgs }),
    captureShots({ chromium, base: args['base-b'], bypassSecret, shotsDir, label: 'b', pages, chromiumArgs }),
  ])

  const pageResults = []
  let anyFail = false
  const flagged = []

  for (const p of pages) {
    if (!p.path) continue
    for (const vp of VIEWPORTS) {
      const key = `${p.name}/${vp.name}`
      const shotA = capA.results.find((r) => r.page === p.name && r.viewport === vp.name)
      const shotB = capB.results.find((r) => r.page === p.name && r.viewport === vp.name)
      let diffInfo = { ratio: null, comparable: false, reason: 'missing screenshot' }
      if (shotA?.ok && shotB?.ok) {
        diffInfo = await pixelDiff(shotA.shotPath, shotB.shotPath, path.join(shotsDir, `diff-${p.name}-${vp.name}.png`))
      }
      let verdict = 'not_run'
      if (diffInfo.comparable) {
        if (diffInfo.ratio <= 0.005) verdict = 'pass'
        else if (diffInfo.ratio <= 0.03) verdict = 'needs-inspection'
        else verdict = 'fail'
      } else {
        // The browser itself works (preflight passed above), so a missing screenshot here means
        // this specific page failed to load/capture — a real gap in coverage, not a benign skip.
        anyFail = true
      }
      if (verdict === 'fail') anyFail = true
      if (verdict !== 'pass')
        flagged.push({ page: key, verdict, ratio: diffInfo.ratio, shotAError: shotA?.error, shotBError: shotB?.error })

      const errsA = capA.consoleErrors[key] || []
      const errsB = capB.consoleErrors[key] || []
      const newErrors = errsB.filter((e) => !errsA.includes(e))
      const failedA = capA.failedRequests[key] || []
      const failedB = capB.failedRequests[key] || []
      // Normalized-key comparison (P5.3): see normalizeFailedRequestKey/diffNewFailedRequests
      // above. Raw URLs (and method/failure) are still kept on each entry for evidence.
      const newFailedRequests = diffNewFailedRequests(failedA, failedB)
      const errorRespA = capA.errorResponses[key] || []
      const errorRespB = capB.errorResponses[key] || []
      const newErrorResponses = errorRespB.filter((f) => !errorRespA.some((fa) => fa.url === f.url && fa.status === f.status))
      if (newErrors.length > 0 || newFailedRequests.length > 0 || newErrorResponses.length > 0) {
        anyFail = true
        flagged.push({ page: key, verdict: 'new-errors-on-b', newErrors, newFailedRequests, newErrorResponses })
      }

      pageResults.push({
        page: p.name,
        viewport: vp.name,
        pixelDiff: diffInfo,
        verdict,
        newConsoleErrorsOnB: newErrors,
        newFailedRequestsOnB: newFailedRequests,
        newErrorResponsesOnB: newErrorResponses,
      })
    }
  }

  const evidence = {
    kind: 'visual',
    status: anyFail ? 'fail' : 'pass',
    baseA: args['base-a'],
    baseB: args['base-b'],
    pages: pageResults,
    flagged,
  }
  await mkdir(path.dirname(out), { recursive: true })
  await writeFile(out, JSON.stringify(evidence, null, 2))
  console.log(`Visual suite: ${evidence.status} (${flagged.length} flagged) -> ${out}`)
  process.exit(evidence.status === 'pass' ? 0 : 1)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
