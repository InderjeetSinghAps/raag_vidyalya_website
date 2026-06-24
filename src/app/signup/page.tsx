"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { AlertTriangle, CheckCircle } from "lucide-react"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { GoldDivider } from "@/components/auth/GoldDivider"
import { GlassInput } from "@/components/auth/GlassInput"
import { PasswordField } from "@/components/auth/PasswordField"
import { GoldButton } from "@/components/auth/GoldButton"
import { useSignupMutation, useCheckDeviceMutation } from "@/store/api"
import { getDeviceId, getDeviceToken } from "@/lib/device"

const signupSchema = z
  .object({
    userName: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [signup, { isLoading: isSubmitting }] = useSignupMutation()
  const [checkDevice, { isLoading: deviceChecking }] = useCheckDeviceMutation()
  const [deviceUsed, setDeviceUsed] = useState<boolean | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const deviceId = getDeviceId()
    if (deviceId) {
      checkDevice({ deviceId }).unwrap().then((res) => {
        setDeviceUsed(res.deviceUsed)
      }).catch(() => {
        // silently fail - don't block signup
      })
    }
  }, [checkDevice])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) })

  const onSubmit = async (data: SignupForm) => {
    try {
      const deviceId = getDeviceId()
      const deviceToken = await getDeviceToken()
      const res = await signup({
        email: data.email,
        password: data.password,
        userName: data.userName,
        deviceType: 2,
        deviceToken,
        deviceId,
        referralCode: data.referralCode || undefined,
      }).unwrap()
      toast.success(res.message || "Account created!")
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&type=1`)
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        (error as { message?: string })?.message ||
        "Signup failed. Please try again."
      toast.error(msg)
    }
  }

  return (
    <AuthLayout>
      <AuthHeader title="Create Account" subtitle="Begin your Gurmat Sangeet journey" />
      <GoldDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <GlassInput
          id="userName"
          label="Full Name"
          placeholder="Your name"
          error={errors.userName?.message}
          {...register("userName")}
        />

        <GlassInput
          id="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <PasswordField
          id="password"
          label="Password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          {...register("password")}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          showPassword={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
          {...register("confirmPassword")}
        />

        <GlassInput
          id="referralCode"
          label="Referral Code (optional)"
          placeholder="e.g. RV-ABCDE"
          error={errors.referralCode?.message}
          {...register("referralCode")}
        />

        {deviceUsed === true && (
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-400" />
            <p className="text-xs text-amber-300">
              This device was used before. Signing up with a referral code won't count toward the referrer's unlocks.
            </p>
          </div>
        )}

        {deviceUsed === false && (
          <div className="flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3">
            <CheckCircle className="mt-0.5 size-4 shrink-0 text-green-400" />
            <p className="text-xs text-green-300">
              This device is eligible for referral.
            </p>
          </div>
        )}

        <GoldButton isSubmitting={isSubmitting} loadingText="Creating Account...">
          Create Account
        </GoldButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#D4A44A] transition-colors hover:text-[#F5D485]"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  )
}
