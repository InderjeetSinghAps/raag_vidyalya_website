"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { GoldDivider } from "@/components/auth/GoldDivider"
import { GlassInput } from "@/components/auth/GlassInput"
import { PasswordField } from "@/components/auth/PasswordField"
import { GoldButton } from "@/components/auth/GoldButton"
import { AuthSuspenseFallback } from "@/components/auth/AuthSuspenseFallback"
import { useResetPasswordMutation } from "@/store/api"

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type ResetForm = z.infer<typeof resetSchema>

function ResetPasswordForm() {
  const router = useRouter()
  const [resetPassword, { isLoading: isSubmitting }] = useResetPasswordMutation()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetForm) => {
    if (!email) {
      toast.error("Email not found. Please start the password reset process again.")
      router.push("/forgot-password")
      return
    }
    try {
      await resetPassword({ email, password: data.password }).unwrap()
      toast.success("Password reset successfully")
      router.push("/login")
    } catch {
      toast.error("Failed to reset password. Please try again.")
    }
  }

  return (
    <AuthLayout>
      <AuthHeader title="Reset Password" subtitle="Enter your new password" />
      <GoldDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <PasswordField
          id="password"
          label="New Password"
          placeholder="Min. 6 characters"
          error={errors.password?.message}
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          {...register("password")}
        />

        <GlassInput
          id="confirmPassword"
          label="Confirm Password"
          type={showPassword ? "text" : "password"}
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <GoldButton isSubmitting={isSubmitting} loadingText="Resetting...">
          Reset Password
        </GoldButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthSuspenseFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
