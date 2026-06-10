"use client"

import { TopNavbar } from "@/components/layout/TopNavbar"
import { MiniPlayer } from "@/components/layout/MiniPlayer"
import { CartSheet } from "@/components/layout/CartSheet"
import { useAppSelector } from "@/store/hooks"

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hasTrack = useAppSelector((state) => state.player.currentTrack !== null)

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <main className={`pt-[72px] ${hasTrack ? "pb-32" : "pb-8"}`}>{children}</main>
      <MiniPlayer />
      <CartSheet />
    </div>
  )
}
