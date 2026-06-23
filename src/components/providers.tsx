"use client"

import { Provider } from 'react-redux'
import { store } from '@/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import { AppBootstrap } from '@/components/auth/AppBootstrap'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppBootstrap>{children}</AppBootstrap>
        <Toaster />
      </QueryClientProvider>
    </Provider>
  )
}
