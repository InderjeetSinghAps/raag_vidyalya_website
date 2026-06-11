"use client"

import { InputHTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ id, label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          {label}
        </Label>
        <Input
          id={id}
          ref={ref}
          className={`h-11 rounded-lg border-black/[0.08] bg-black/[0.04] text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 hover:border-black/[0.15] focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-white/[0.06] dark:placeholder:text-white/25 dark:hover:border-white/[0.15] ${className}`}
          {...props}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  },
)
GlassInput.displayName = "GlassInput"

export { GlassInput }
