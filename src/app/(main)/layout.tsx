"use client"

import { TopNavbar } from "@/components/layout/TopNavbar"
import { MiniPlayer } from "@/components/layout/MiniPlayer"
import { CartSheet } from "@/components/layout/CartSheet"
import { useAppSelector } from "@/store/hooks"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

const PROTECTED_ROUTES = [
  "/profile",
  "/wallet",
  "/courses/my-courses",
  "/courses/bookmarks",
  "/courses/bookmarks/[id]",
  "/courses/[id]",
  "/courses/[id]/lecture/[videoId]",
]

function isProtected(pathname: string) {
  return PROTECTED_ROUTES.some((route) => {
    const regex = new RegExp("^" + route.replace(/\[.*?\]/g, "[^/]+") + "$")
    return regex.test(pathname)
  })
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const hasTrack = useAppSelector((state) => state.player.currentTrack !== null)
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const protected_ = isProtected(pathname)

  useEffect(() => {
    if (!isLoading && !isAuthenticated && protected_) {
      router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`)
    }
  }, [isAuthenticated, isLoading, pathname, router, protected_])

  if (isLoading && protected_) {
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

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <main className={`pt-[72px] ${hasTrack ? "pb-32" : "pb-8"}`}>{children}</main>
      <MiniPlayer />
      <CartSheet />
    </div>
  )
}
