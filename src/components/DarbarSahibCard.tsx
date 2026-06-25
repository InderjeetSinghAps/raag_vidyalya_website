"use client"

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
      <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center">
        <span className="leading-none text-muted-foreground/[0.025] text-[min(40vw,300px)]">ੴ</span>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-amber-500/50">Live Kirtan</p>
        <h3 className="mt-1 text-balance text-center text-lg font-semibold text-foreground">
          Darbar Sahib{' '}
          <span className="text-amber-500/40">&bull;</span>{' '}
          <span className="text-amber-500/70">Amritsar</span>
        </h3>

        <div className="relative mt-5 size-[180px] md:size-[240px]">
          <div
            className="absolute inset-0 rounded-full border-2 border-amber-500/20"
            style={{ boxShadow: '0 0 60px rgba(212,175,55,.08), 0 0 120px rgba(212,175,55,.04)' }}
          />
          <div
            className="absolute inset-[3px] flex items-center justify-center rounded-full bg-gradient-to-b from-[#171732]/80 to-[#090912]/80"
            style={{ boxShadow: 'inset 0 0 40px rgba(212,175,55,.06)' }}
          >
            <span className="select-none text-5xl text-amber-500/15 md:text-6xl">ੴ</span>
          </div>
        </div>
      </div>
    </div>
  )
}
