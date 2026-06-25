"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setLoading } from "@/store/authSlice"
import { loadAppConstants } from "@/lib/appData"
import { initRevenueCat } from "@/lib/revenuecat"

export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((s) => s.auth.user)

  useEffect(() => {
    if (user?.id) {
      initRevenueCat(user.id)
    }
  }, [user?.id])

  useEffect(() => {
    loadAppConstants().finally(() => dispatch(setLoading(false)))
  }, [dispatch])

  return <>{children}</>
}
