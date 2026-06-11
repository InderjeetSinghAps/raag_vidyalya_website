"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { useSignupMutation } from "@/store/api"
import { useAppDispatch } from "@/store/hooks"

const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [signup, { isLoading: isSubmitting }] = useSignupMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) })

  const onSubmit = async (data: SignupForm) => {
    try {
      await signup({ name: data.name, email: data.email, password: data.password }).unwrap()
      toast.success("Account created!")
      router.push("/verify-otp?type=1")
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
          id="name"
          label="Full Name"
          placeholder="Your name"
          error={errors.name?.message}
          {...register("name")}
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

        <GoldButton isSubmitting={isSubmitting} loadingText="Creating Account...">
          Create Account
        </GoldButton>
      </form>

      <p className="text-center text-sm text-white/40">
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
