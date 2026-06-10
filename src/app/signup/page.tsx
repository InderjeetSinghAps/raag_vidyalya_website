"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { AuthLayout } from "@/components/auth/AuthLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/services/auth"
import { useAppDispatch } from "@/store/hooks"
import { setUser } from "@/store/authSlice"

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
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) })

  const onSubmit = async (data: SignupForm) => {
    try {
      const response = await authService.signup({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      const { user, token } = response.data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))
      dispatch(setUser({ user, token }))
      toast.success("Account created!")
      router.push("/verify-otp?type=1")
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || "Signup failed. Please try again."
      toast.error(msg)
    }
  }

  return (
    <AuthLayout
      rightPanelContent={
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.2, 0, 0, 1] }}
          className="flex flex-col items-center justify-center text-center"
        >
          <p
            className="max-w-[240px] font-sans text-sm font-light italic leading-relaxed"
            style={{ color: "#6B5E4A" }}
          >
            "Join a community devoted to the sacred art of Sikh classical music."
          </p>
        </motion.div>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.08, ease: [0.2, 0, 0, 1] }}
        className="space-y-7"
      >
        {/* Header */}
        <div className="space-y-3 text-center">
          <h1
            className="text-balance font-sans text-[28px] font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #D4A44A 0%, #B8860B 60%, #8B6508 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Create Account
          </h1>
          <p className="font-sans text-[13px] font-light tracking-wide" style={{ color: "#64748B" }}>
            Begin your Gurmat Sangeet journey
          </p>
        </div>

        {/* Ornamental gold divider */}
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#D4A44A]/40" />
          <Sparkles size={10} className="text-[#D4A44A]/50" />
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#D4A44A]/40" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="font-sans text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "#475569" }}
            >
              Full Name
            </Label>
            <Input
              id="name"
              placeholder="Your name"
              className="h-11 rounded-lg border-[#D4C4A0] bg-white text-sm shadow-sm transition-all duration-200 placeholder:text-[#94A3B8] hover:border-[#D4A44A]/40 focus:border-[#D4A44A] focus:ring-2 focus:ring-[#D4A44A]/15 focus:shadow-[0_0_0_3px_rgba(212,164,74,0.08)]"
              {...register("name")}
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500"
              >
                {errors.name.message}
              </motion.p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="font-sans text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "#475569" }}
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="h-11 rounded-lg border-[#D4C4A0] bg-white text-sm shadow-sm transition-all duration-200 placeholder:text-[#94A3B8] hover:border-[#D4A44A]/40 focus:border-[#D4A44A] focus:ring-2 focus:ring-[#D4A44A]/15 focus:shadow-[0_0_0_3px_rgba(212,164,74,0.08)]"
              {...register("email")}
            />
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="font-sans text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "#475569" }}
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                className="h-11 rounded-lg border-[#D4C4A0] bg-white pr-10 text-sm shadow-sm transition-all duration-200 placeholder:text-[#94A3B8] hover:border-[#D4A44A]/40 focus:border-[#D4A44A] focus:ring-2 focus:ring-[#D4A44A]/15 focus:shadow-[0_0_0_3px_rgba(212,164,74,0.08)]"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#475569]"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="font-sans text-[11px] font-semibold uppercase tracking-widest"
              style={{ color: "#475569" }}
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Re-enter your password"
                className="h-11 rounded-lg border-[#D4C4A0] bg-white pr-10 text-sm shadow-sm transition-all duration-200 placeholder:text-[#94A3B8] hover:border-[#D4A44A]/40 focus:border-[#D4A44A] focus:ring-2 focus:ring-[#D4A44A]/15 focus:shadow-[0_0_0_3px_rgba(212,164,74,0.08)]"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] transition-colors hover:text-[#475569]"
              >
                {showConfirm ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-500"
              >
                {errors.confirmPassword.message}
              </motion.p>
            )}
          </div>

          {/* Submit */}
          <div className="rounded-xl bg-white/60 p-[1px]">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-[10px] bg-gradient-to-r from-[#D4A44A] to-[#C49A3A] text-sm font-semibold text-white shadow-[0_2px_12px_rgba(212,164,74,0.25)] transition-all duration-200 hover:shadow-[0_4px_20px_rgba(212,164,74,0.38)] hover:brightness-110 active:scale-[0.97] disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </div>
        </form>

        {/* Sign In link */}
        <p
          className="text-center font-sans text-sm font-light"
          style={{ color: "#64748B" }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#D4A44A] transition-colors hover:text-[#B8860B]"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </AuthLayout>
  )
}
