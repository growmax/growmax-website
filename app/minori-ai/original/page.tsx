import type { Metadata } from 'next'
import MinoriV1, { minoriV1Metadata } from '@/components/minori/MinoriV1'

export const metadata: Metadata = minoriV1Metadata

export default function OriginalMinoriAiPage() {
  return <MinoriV1 />
}