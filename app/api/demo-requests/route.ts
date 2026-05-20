import { NextResponse } from 'next/server'
import { storage } from '@/lib/storage'
import { insertDemoRequestSchema } from '@/lib/schema'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = insertDemoRequestSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

    const result = await storage.createDemoRequest(parsed.data)

    const webhookUrl = 'https://chat.googleapis.com/v1/spaces/AAQAsJFg7Xs/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=68Ej0IZj6mUOe2Q5hMpkkmmIkWl8nnnyfHUymGvaesU'
    const data = parsed.data
    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `*New Demo Request*\n\n*Name:* ${data.firstName} ${data.lastName}\n*Email:* ${data.email}\n*Company:* ${data.company}\n*Company Size:* ${data.companySize}\n*Modules:* ${data.modules.join(', ')}\n*Message:* ${data.message || 'N/A'}`,
      }),
    }).catch(err => console.error('[webhook] Failed:', err.message))

    return NextResponse.json(result, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to submit demo request' }, { status: 500 })
  }
}
