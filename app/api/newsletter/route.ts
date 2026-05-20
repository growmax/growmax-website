import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { insertNewsletterSchema } from '@/lib/schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = insertNewsletterSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    const result = await storage.createNewsletterSubscription(parsed.data)
    return NextResponse.json(result ?? { message: 'Already subscribed' }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
