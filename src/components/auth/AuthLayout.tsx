"use client"

import Image from "next/image"
import { ReactNode } from "react"
import { cn } from "@/lib/utils"

const MIN_WIDTH = "min-w-[900px]"
const CARD_MAX_W = "max-w-[1100px]"
const CARD_H = "h-[650px]"

interface AuthLayoutProps {
  children: ReactNode
  rightPanelContent: ReactNode
  className?: string
}

export function AuthLayout({ children, rightPanelContent }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-screen items-stretch overflow-hidden bg-background">
      {/* LEFT PANEL — login.png with deep indigo overlay + gold texture */}
      <div className={cn("relative hidden w-1/2 lg:flex", MIN_WIDTH)}>
        {/* Base image */}
        <Image
          src="/login.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="50vw"
        />

        {/* Gold ornamental corner lines */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="absolute top-6 left-6 h-16 w-px bg-gradient-to-b from-[#D4A44A]/20 to-transparent" />
          <span className="absolute top-6 left-6 h-px w-16 bg-gradient-to-r from-[#D4A44A]/20 to-transparent" />
          <span className="absolute bottom-6 left-6 h-16 w-px bg-gradient-to-t from-[#D4A44A]/20 to-transparent" />
          <span className="absolute bottom-6 left-6 h-px w-16 bg-gradient-to-r from-transparent to-[#D4A44A]/20" />
          <span className="absolute top-6 right-6 h-16 w-px bg-gradient-to-b from-[#D4A44A]/20 to-transparent" />
          <span className="absolute top-6 right-6 h-px w-16 bg-gradient-to-l from-[#D4A44A]/20 to-transparent" />
          <span className="absolute bottom-6 right-6 h-16 w-px bg-gradient-to-t from-[#D4A44A]/20 to-transparent" />
          <span className="absolute bottom-6 right-6 h-px w-16 bg-gradient-to-l from-transparent to-[#D4A44A]/20" />
        </div>

        {/* Deeper indigo overlay — shows more of the floral pattern */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #05091A 0%, #0B1730 35%, rgba(11,23,48,0.55) 62%, transparent 78%, #05091A 100%)",
          }}
        />

        {/* Subtle gold texture overlay — mimics the Persian floral pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 15% 45%, #D4A44A 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, #D4A44A 0%, transparent 50%), radial-gradient(ellipse at 50% 85%, #D4A44A 0%, transparent 60%)",
          }}
        />

        {/* Bottom fade for smooth transition */}
        <div
          className="absolute inset-x-0 bottom-0 h-28"
          style={{ background: "linear-gradient(to top, #05091A 0%, transparent 100%)" }}
        />

        {/* Foreground content */}
        <div className="relative z-10 flex flex-col justify-center p-12">
          <h1 className="font-display text-balance text-4xl font-bold leading-tight text-white">
            Welcome to
            <br />
            <span
              className="bg-gradient-to-r from-[#D4A44A] to-[#F5D485] bg-clip-text text-transparent"
              style={{ textShadow: "none" }}
            >
              Raag Vidyalaya
            </span>
          </h1>
          <p
            className="mt-4 max-w-sm text-pretty text-sm leading-relaxed"
            style={{ color: "rgba(203,213,225,0.8)" }}
          >
            Immerse yourself in the divine art of Gurmat Sangeet. Learn ancient raags,
            sacred hymns, and timeless melodies from the comfort of your home.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — warm gallery parchment */}
      <div
        className="flex flex-1 items-center justify-center overflow-y-auto"
        style={{ background: "#F5EFE0" }}
      >
        <div className="w-full max-w-md p-8">{children}</div>
      </div>
    </div>
  )
}
