"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { IS_MOCK_AUTH } from "@/lib/constants"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated && !IS_MOCK_AUTH) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated && !IS_MOCK_AUTH) return null

  return <>{children}</>
}
