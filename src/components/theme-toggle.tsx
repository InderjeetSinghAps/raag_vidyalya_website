"use client"

import React, { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark" || theme === "dark"

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark or light theme"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className="flex size-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 shadow-2xs hover:border-amber-500 hover:text-amber-500 dark:hover:border-amber-400 dark:hover:text-amber-400 transition-all active:scale-95 cursor-pointer"
    >
      {mounted ? (
        isDark ? (
          <Sun className="size-4 text-amber-400 transition-transform rotate-0" />
        ) : (
          <Moon className="size-4 text-slate-700 transition-transform rotate-0" />
        )
      ) : (
        <span className="size-4 block" />
      )}
    </button>
  )
}
