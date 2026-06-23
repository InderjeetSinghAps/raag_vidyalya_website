"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/store/hooks"
import { setLoading } from "@/store/authSlice"
import { loadAppConstants } from "@/lib/appData"

export function AppBootstrap({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    loadAppConstants().finally(() => dispatch(setLoading(false)))
  }, [dispatch])

  return <>{children}</>
}
