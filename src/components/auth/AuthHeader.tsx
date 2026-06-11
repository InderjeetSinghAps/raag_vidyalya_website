import { ReactNode } from "react"

interface AuthHeaderProps {
  title: string
  subtitle: ReactNode
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="space-y-2 text-center">
      <h1 className="font-display text-3xl font-bold tracking-tight text-white">
        {title}
      </h1>
      <p className="text-sm text-white/40">{subtitle}</p>
    </div>
  )
}
