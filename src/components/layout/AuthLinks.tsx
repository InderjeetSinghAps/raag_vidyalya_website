import Link from "next/link"

export function AuthLinks() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="inline-flex items-center justify-center w-[90px] h-[38px] text-sm font-medium rounded-lg border border-primary text-primary transition-all hover:bg-primary hover:text-primary-foreground"
      >
        Login
      </Link>
    </div>
  )
}
