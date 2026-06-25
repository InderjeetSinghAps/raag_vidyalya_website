"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setLoading } from "@/store/authSlice"
import { loadAppConstants } from "@/lib/appData"
import { initRevenueCat } from "@/lib/revenuecat"

export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (user?.id) {
      initRevenueCat(user.id)
    }
  }, [user?.id])

  useEffect(() => {
    loadAppConstants().finally(() => {
      dispatch(setLoading(false))
      setReady(true)
    })
  }, [dispatch])

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-3 w-64">
          <div className="h-4 rounded bg-muted animate-pulse" />
          <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
          <div className="h-4 w-3/5 rounded bg-muted animate-pulse" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
