import { NextResponse, after } from 'next/server'
import { storage } from '@/lib/storage'
import { insertDemoRequestSchema } from '@/lib/schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = insertDemoRequestSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const result = await storage.createDemoRequest(parsed.data)

    const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL
    const data = parsed.data
    if (webhookUrl) {
      after(async () => {
        try {
          const res = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: `*New Demo Request*\n\n*Name:* ${data.firstName} ${data.lastName}\n*Email:* ${data.email}\n*Company:* ${data.company}\n*Company Size:* ${data.companySize}\n*Modules:* ${data.modules.join(', ')}\n*Message:* ${data.message || 'N/A'}`,
            }),
          })
          if (res.ok) {
            console.log('[webhook] delivered', res.status)
          } else {
            console.error('[webhook] Failed:', res.status)
          }
        } catch (err) {
          console.error('[webhook] Failed:', err instanceof Error ? err.message : String(err))
        }
      })
    } else {
      console.warn('[webhook] GOOGLE_CHAT_WEBHOOK_URL not set; skipping notification')
    }

    return NextResponse.json(result, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to submit demo request' }, { status: 500 })
  }
}
