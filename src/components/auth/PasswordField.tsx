"use client"

import { InputHTMLAttributes, forwardRef } from "react"
import { Eye, EyeOff } from "lucide-react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string
  label: string
  error?: string
  showPassword: boolean
  onToggle: () => void
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ id, label, error, showPassword, onToggle, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label
          htmlFor={id}
          className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
        >
          {label}
        </Label>
        <div className="relative">
          <Input
            id={id}
            ref={ref}
            type={showPassword ? "text" : "password"}
            className={`h-10 w-full rounded-lg border-black/[0.08] bg-black/[0.04] pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 hover:border-black/[0.15] focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-white/[0.06] dark:placeholder:text-white/25 dark:hover:border-white/[0.15] ${className}`}
            {...props}
          />
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-foreground/60"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
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
PasswordField.displayName = "PasswordField"

export { PasswordField }
