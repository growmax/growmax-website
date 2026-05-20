import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'

export interface SessionData {
  isAdmin?: boolean
}

if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET environment variable is required and must be at least 32 characters long.')
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'growmax-admin',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 24 * 60 * 60,
  },
}

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}
