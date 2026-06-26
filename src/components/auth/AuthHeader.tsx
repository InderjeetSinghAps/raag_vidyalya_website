import { ReactNode } from "react"

interface AuthHeaderProps {
  title: string
  subtitle: ReactNode
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="space-y-1 text-center">
      <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}
