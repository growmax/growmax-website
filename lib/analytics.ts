import { track } from '@vercel/analytics'

type AnalyticsData = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    umami?: {
      track(name: string, data?: AnalyticsData): void
    }
  }
}

export function trackEvent(name: string, data?: AnalyticsData): void {
  if (typeof window === 'undefined') return

  try {
    window.umami?.track(name, data)
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: name, ...data })
  } catch {
    // Analytics must never interfere with the user experience.
  }

  try {
    // Vercel Web Analytics custom events (shown under Events, filterable by referrer such as
    // chatgpt.com or perplexity.ai, so AI-referred conversions can be compared with search).
    track(name, data)
  } catch {
    // Same rule: never break the page for analytics.
  }
}
