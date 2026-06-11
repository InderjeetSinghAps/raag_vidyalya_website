import { Loader2 } from "lucide-react"

export function AuthSuspenseFallback() {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-background via-secondary to-background">
      <Loader2 className="size-6 animate-spin text-primary" />
    </div>
  )
}
