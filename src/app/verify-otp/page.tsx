"use client"

import { useRef, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { GoldDivider } from "@/components/auth/GoldDivider"
import { GoldButton } from "@/components/auth/GoldButton"
import { AuthSuspenseFallback } from "@/components/auth/AuthSuspenseFallback"
import { useVerifyOtpMutation } from "@/store/api"
import { useAppDispatch } from "@/store/hooks"

function VerifyOtpForm() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const otpType = parseInt(searchParams.get("type") || "1") as 1 | 2
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    const newOtp = Array(6).fill("")
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i]
    }
    setOtp(newOtp)
    const nextIndex = Math.min(pasted.length, 5)
    inputRefs.current[nextIndex]?.focus()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join("")
    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit code")
      return
    }
    try {
      await verifyOtp({ email, otp: code, type: otpType }).unwrap()
      router.push("/home")
    } catch {
      toast.error("Invalid or expired OTP")
    }
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Verify OTP"
        subtitle={
          <>
            Enter the 6-digit code sent to{" "}
            <span className="text-white/60">{email || "your email"}</span>
          </>
        }
      />
      <GoldDivider />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="h-14 w-11 rounded-xl border border-white/[0.08] bg-white/[0.06] text-center text-lg font-semibold text-white outline-none transition-all duration-200 focus:border-[#D4A44A]/50 focus:ring-2 focus:ring-[#D4A44A]/10"
            />
          ))}
        </div>

        <GoldButton
          isSubmitting={isLoading}
          loadingText="Verifying..."
          disabled={isLoading || otp.join("").length !== 6}
        >
          Verify OTP
        </GoldButton>
      </form>

      <p className="text-center text-sm text-white/40">
        <Link
          href="/login"
          className="font-semibold text-[#D4A44A] transition-colors hover:text-[#F5D485]"
        >
          Back to Sign In
        </Link>
      </p>
    </AuthLayout>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<AuthSuspenseFallback />}>
      <VerifyOtpForm />
    </Suspense>
  )
}
