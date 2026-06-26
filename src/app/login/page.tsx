'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { AuthSuspenseFallback } from '@/components/auth/AuthSuspenseFallback';
import { GoldDivider } from '@/components/auth/GoldDivider';
import { GlassInput } from '@/components/auth/GlassInput';
import { PasswordField } from '@/components/auth/PasswordField';
import { GoldButton } from '@/components/auth/GoldButton';
import { Button } from '@/components/ui/button';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { useAppSelector } from '@/store/hooks';
import {
  useLoginMutation,
  useSocialLoginMutation,
} from '@/store/api';
import { getFirebaseApp } from '@/lib/firebase';
import { initRevenueCat } from '@/lib/revenuecat';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/home';
  const [login, { isLoading: isSubmitting }] = useLoginMutation();
  const [socialLogin] = useSocialLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, redirectTo, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const [googleLoading, setGoogleLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await login({
        email: data.email,
        password: data.password,
        rememberMe,
      }).unwrap()
      if (res.user) {
        await initRevenueCat(res.user.id)
        toast.success('Welcome back!');
        router.push(redirectTo);
      }
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        (error as { message?: string })?.message ||
        'Invalid credentials. Please try again.';
      toast.error(msg);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const app = await getFirebaseApp();
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const socialRes = await socialLogin({
        email: user.email ?? '',
        provider: 'google',
        providerId: user.uid,
        firstName: user.displayName ?? 'User',
        profileImage: user.photoURL ?? undefined,
      }).unwrap();

      await initRevenueCat(socialRes.user.id)
      toast.success('Welcome back!');
      router.push(redirectTo);
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === 'auth/popup-closed-by-user'
      ) {
        return;
      }
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        'Google sign-in failed. Please try again.';
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <AuthLayout>
        <AuthHeader
          title="Welcome back"
          subtitle="Sign in to continue your learning"
        />
        <GoldDivider />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <GlassInput
            id="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <PasswordField
            id="password"
            label="Password"
            placeholder="Enter your password"
            error={errors.password?.message}
            showPassword={showPassword}
            onToggle={() => setShowPassword(!showPassword)}
            {...register('password')}
          />

          <div className="flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-border bg-muted accent-[#D4A44A]"
              />
              <span className="text-xs text-muted-foreground">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-[#D4A44A] transition-colors hover:text-[#F5D485]"
            >
              Forgot password?
            </Link>
          </div>

          <GoldButton
            isSubmitting={isSubmitting}
            loadingText="Signing in..."
          >
            Sign In
          </GoldButton>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className=" px-2 text-muted-foreground">
              or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={googleLoading}
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 border-border py-5 text-sm font-medium"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
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
          {googleLoading ? 'Signing in...' : 'Sign in with Google'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="font-semibold text-[#D4A44A] transition-colors hover:text-[#F5D485]"
          >
            Create Account
          </Link>
        </p>
      </AuthLayout>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthSuspenseFallback />}>
      <LoginForm />
    </Suspense>
  );
}
