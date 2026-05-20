'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode } from 'react'
import { getQueryFn } from '@/lib/queryClient'

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        queryFn: getQueryFn({ on401: 'throw' }) as any,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        retry: false,
      },
      mutations: { retry: false },
    },
  })
}

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
