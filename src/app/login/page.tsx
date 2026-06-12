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
import { Button } from "@/components/ui/button"
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google"
import { useLoginMutation, useSocialLoginMutation } from "@/store/api"
import { useAppDispatch } from "@/store/hooks"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginForm = z.infer<typeof loginSchema>

/* Google login — temporarily disabled
function GoogleLoginButton({ socialLogin }: { socialLogin: ReturnType<typeof useSocialLoginMutation>[0] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    onSuccess: async (response) => {
      setLoading(true)
      try {
        const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${response.access_token}` },
        }).then((r) => r.json())

        await socialLogin({
          email: userInfo.email,
          provider: "google",
          providerId: userInfo.sub,
          firstName: userInfo.given_name || userInfo.name?.split(" ")[0] || "",
          profileImage: userInfo.picture || undefined,
        }).unwrap()

        toast.success("Welcome!")
        router.push("/home")
      } catch {
        toast.error("Google sign in failed")
      } finally {
        setLoading(false)
      }
    },
    onError: () => {
      setLoading(false)
      toast.error("Google sign in failed")
    },
  })

  return (
    <Button
      variant="outline"
      disabled={loading}
      onClick={() => googleLogin()}
      className="h-11 w-full rounded-xl border-white/[0.08] bg-white/[0.04] text-sm font-medium text-white/70 shadow-sm transition-all duration-200 hover:border-white/[0.15] hover:bg-white/[0.08] hover:text-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <svg className="mr-2 size-4" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      Continue with Google
    </Button>
  )
}
*/

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [login, { isLoading: isSubmitting }] = useLoginMutation()
  const [socialLogin] = useSocialLoginMutation()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginForm) => {
    try {
      await login({ email: data.email, password: data.password, rememberMe }).unwrap()
      toast.success("Welcome back!")
      router.push("/home")
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        (error as { message?: string })?.message ||
        "Invalid credentials. Please try again."
      toast.error(msg)
    }
  }

  return (
    <>
    <AuthLayout>
      <AuthHeader title="Welcome back" subtitle="Sign in to continue your learning" />
      <GoldDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          placeholder="Enter your password"
          error={errors.password?.message}
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          {...register("password")}
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-white/[0.15] bg-white/[0.06] accent-[#D4A44A]"
            />
            <span className="text-xs text-white/40">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-semibold text-[#D4A44A] transition-colors hover:text-[#F5D485]"
          >
            Forgot password?
          </Link>
        </div>

        <GoldButton isSubmitting={isSubmitting} loadingText="Signing in...">
          Sign In
        </GoldButton>
      </form>

      {/* Google login divider + button — temporarily disabled
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/[0.06]" />
        <span className="text-[10px] uppercase tracking-widest text-white/30">
          or continue with
        </span>
        <div className="h-px flex-1 bg-white/[0.06]" />
      </div>

      {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
        <GoogleLoginButton socialLogin={socialLogin} />
      )}
      */}

      <p className="text-center text-sm text-white/40">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#D4A44A] transition-colors hover:text-[#F5D485]"
        >
          Create Account
        </Link>
      </p>
      </AuthLayout>
    </>
  )
}
