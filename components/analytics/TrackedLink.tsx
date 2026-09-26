'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { trackEvent } from '@/lib/analytics'

type AnalyticsData = Record<string, string | number | boolean>

export default function TrackedLink({
  href,
  eventName,
  eventData,
  className,
  children,
}: {
  href: string
  eventName: string
  eventData?: AnalyticsData
  className?: string
  children: ReactNode
}) {
  return (
    <Link href={href} className={className} onClick={() => trackEvent(eventName, eventData)}>
      {children}
    </Link>
  )
}