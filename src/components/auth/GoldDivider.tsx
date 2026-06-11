export function GoldDivider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/[0.06] to-white/[0.02]" />
      <div className="h-2 w-2 rotate-45 border border-[#D4A44A]/40" />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/[0.06] to-white/[0.02]" />
    </div>
  )
}
