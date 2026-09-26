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
}