import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await getSession()
    return NextResponse.json({ isAdmin: !!session.isAdmin })
  } catch {
    return NextResponse.json({ isAdmin: false })
  }
}
