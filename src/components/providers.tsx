"use client"

import { Provider } from 'react-redux'
import { store } from '@/store'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#0B1220',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              color: '#94A3B8',
            },
          }}
        />
      </QueryClientProvider>
    </Provider>
  )
}
