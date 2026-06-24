"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { AuthHeader } from "@/components/auth/AuthHeader"
import { GoldDivider } from "@/components/auth/GoldDivider"
import { GlassInput } from "@/components/auth/GlassInput"
import { GoldButton } from "@/components/auth/GoldButton"
import { useForgotPasswordMutation } from "@/store/api"

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
})

type ForgotForm = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [forgotPassword, { isLoading: isSubmitting }] = useForgotPasswordMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
  })

  const router = useRouter()

  const onSubmit = async (data: ForgotForm) => {
    try {
      await forgotPassword({ email: data.email }).unwrap()
      toast.success("OTP sent to your email")
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}&type=2`)
    } catch {
      toast.success("If an account exists, an OTP has been sent")
    }
  }

  return (
    <AuthLayout>
      <AuthHeader
        title="Forgot Password"
        subtitle="Enter your email and we'll send you a reset link"
      />
      <GoldDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <GlassInput
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <GoldButton isSubmitting={isSubmitting} loadingText="Sending...">
          Send Reset Link
        </GoldButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Remember your password?{" "}
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
