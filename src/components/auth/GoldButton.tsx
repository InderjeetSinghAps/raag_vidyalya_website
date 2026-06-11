"use client"

import { ButtonHTMLAttributes, ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GoldButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isSubmitting: boolean
  loadingText: string
  children: ReactNode
}

export function GoldButton({
  isSubmitting,
  loadingText,
  children,
  className = "",
  ...props
}: GoldButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isSubmitting}
      className={`h-12 w-full rounded-xl bg-gradient-to-r from-[#D4A44A] to-[#C49A3A] text-sm font-semibold text-white shadow-[0_4px_20px_rgba(212,164,74,0.2)] transition-all duration-200 hover:shadow-[0_6px_24px_rgba(212,164,74,0.35)] hover:brightness-110 active:scale-[0.98] disabled:opacity-50 ${className}`}
      {...props}
    >
      {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
      {isSubmitting ? loadingText : children}
    </Button>
  )
}
