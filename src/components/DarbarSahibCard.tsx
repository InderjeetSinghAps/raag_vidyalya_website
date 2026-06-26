"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"

export function DarbarSahibCard() {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push("/live")}
      className="group relative mx-auto flex w-full max-w-sm cursor-pointer flex-col items-center py-8"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="size-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.06),transparent_50%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0">
        <Image src="/logo3.svg" fill className="object-contain opacity-[0.025]" alt="" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-amber-500/50">Live Kirtan</p>
        <h3 className="mt-1 text-balance text-center text-lg font-semibold text-foreground">
          Darbar Sahib{' '}
          <span className="text-amber-500/40">&bull;</span>{' '}
          <span className="text-amber-500/70">Amritsar</span>
        </h3>

        <span className="mt-6 select-none text-7xl md:text-8xl">ੴ</span>
      </div>
    </div>
  )
}
