"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
  rightPanelContent?: ReactNode
}

export function AuthLayout({ children, rightPanelContent }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* LEFT PANEL — Visual branding with image */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/login.png"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-[#05091A]/90 via-[#0B1730]/60 to-[#0B1730]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05091A] via-transparent to-transparent" />

        {/* Gold corner accents */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="absolute left-8 top-8 h-16 w-px bg-gradient-to-b from-[#D4A44A]/30 to-transparent" />
          <span className="absolute left-8 top-8 h-px w-16 bg-gradient-to-r from-[#D4A44A]/30 to-transparent" />
          <span className="absolute bottom-8 right-8 h-16 w-px bg-gradient-to-t from-[#D4A44A]/30 to-transparent" />
          <span className="absolute bottom-8 right-8 h-px w-16 bg-gradient-to-l from-[#D4A44A]/30 to-transparent" />
        </div>

        {/* Brand content */}
        <div className="absolute bottom-16 left-12 right-12 z-10">
          <h1 className="font-display text-[2rem] font-bold leading-tight text-white">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[#D4A44A] to-[#F5D485] bg-clip-text text-transparent">
              Raag Vidyalaya
            </span>
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
            Immerse yourself in the divine art of Gurmat Sangeet. Learn ancient
            raags, sacred hymns, and timeless melodies from the comfort of your
            home.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL — Liquid Glass */}
      <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary to-background dark:from-[#0B1220] dark:via-[#0F1A2E] dark:to-[#0B1730]">
        {/* Ambient liquid light orbs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[#D4A44A]/[0.04] blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[#D4A44A]/[0.03] blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage:
                "radial-gradient(ellipse at 20% 50%, #D4A44A 0%, transparent 50%), radial-gradient(ellipse at 80% 30%, #D4A44A 0%, transparent 40%)",
            }}
          />
        </div>

        {/* Optional content above form */}
        {rightPanelContent && <div className="relative mb-8">{rightPanelContent}</div>}

        {/* Glass form card */}
        <div className="relative w-full max-w-md rounded-2xl border border-border/50 bg-card/80 p-10 shadow-lg backdrop-blur-2xl dark:border-white/[0.06] dark:bg-white/[0.04] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
            className="space-y-6"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
