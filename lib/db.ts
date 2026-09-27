import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import { attachDatabasePool } from '@vercel/functions'
import * as schema from './schema'

const { Pool } = pg

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set.')
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 10_000 })
// Release idle clients before a Vercel Fluid compute instance suspends.
if (process.env.VERCEL) attachDatabasePool(pool)
export const db = drizzle(pool, { schema })
