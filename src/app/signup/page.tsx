'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { GoldDivider } from '@/components/auth/GoldDivider';
import { GlassInput } from '@/components/auth/GlassInput';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordField } from '@/components/auth/PasswordField';
import { GoldButton } from '@/components/auth/GoldButton';
import { Button } from '@/components/ui/button';
import {
  useSignupMutation,
  useCheckDeviceMutation,
  useSocialLoginMutation,
} from '@/store/api';
import { getDeviceId, getDeviceToken } from '@/lib/device';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getFirebaseApp } from '@/lib/firebase';
import { initRevenueCat } from '@/lib/revenuecat';

const signupSchema = z
  .object({
    userName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password'),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [signup, { isLoading: isSubmitting }] = useSignupMutation();
  const [checkDevice, { isLoading: deviceChecking }] =
    useCheckDeviceMutation();
  const [deviceUsed, setDeviceUsed] = useState<boolean | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [socialLogin] = useSocialLoginMutation();

  useEffect(() => {
    const deviceId = getDeviceId();
    if (deviceId) {
      checkDevice({ deviceId })
        .unwrap()
        .then((res) => {
          setDeviceUsed(res.deviceUsed);
        })
        .catch(() => {
          // silently fail - don't block signup
        });
    }
  }, [checkDevice]);

  const handleGoogleSignup = async () => {
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

      await initRevenueCat(socialRes.user.id);
      toast.success('Successfully Logged in!');
      router.push('/home');
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
        'Google sign-up failed. Please try again.';
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (data: SignupForm) => {
    try {
      const deviceId = getDeviceId();
      const deviceToken = await getDeviceToken();
      const res = await signup({
        email: data.email,
        password: data.password,
        userName: data.userName,
        deviceType: 2,
        deviceToken,
        deviceId,
        language: 'English',
        referralCode: data.referralCode || undefined,
      }).unwrap();
      toast.success(res.message || 'Account created!');
      router.push(
        `/verify-otp?email=${encodeURIComponent(data.email)}&type=1`,
      );
    } catch (error: unknown) {
      const msg =
        (error as { data?: { message?: string } })?.data?.message ||
        (error as { message?: string })?.message ||
        'Signup failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        title="Create Account"
        subtitle="Begin your Gurmat Sangeet journey"
      />
      <GoldDivider />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <GlassInput
          id="userName"
          label="Full Name"
          placeholder="Your name"
          error={errors.userName?.message}
          {...register('userName')}
        />

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
          placeholder="At least 6 characters"
          error={errors.password?.message}
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
          {...register('password')}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          showPassword={showConfirm}
          onToggle={() => setShowConfirm(!showConfirm)}
          {...register('confirmPassword')}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="referralCode"
              className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Referral Code (optional)
            </Label>
            {deviceUsed !== null && (
              <div className="flex items-center gap-1.5">
                {deviceUsed ? (
                  <AlertTriangle className="size-3 text-amber-400" />
                ) : (
                  <CheckCircle className="size-3 text-[#D4A44A]" />
                )}
                <span
                  className={`text-[10px] font-medium ${
                    deviceUsed
                      ? 'text-amber-300'
                      : 'bg-gradient-to-r from-[#D4A44A] to-[#F5D485] bg-clip-text text-transparent'
                  }`}
                >
                  {deviceUsed
                    ? 'Previously used'
                    : 'Eligible for referral'}
                </span>
              </div>
            )}
          </div>
          <Input
            id="referralCode"
            placeholder="e.g. RV-ABCDE"
            className="h-10 mb-2 rounded-lg border-black/[0.08] bg-black/[0.04] text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 hover:border-black/[0.15] focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-white/[0.06] dark:placeholder:text-white/25 dark:hover:border-white/[0.15]"
            {...register('referralCode')}
          />
          {errors.referralCode?.message && (
            <p className="text-xs text-red-400">
              {errors.referralCode.message}
            </p>
          )}
        </div>

        <GoldButton
          isSubmitting={isSubmitting}
          loadingText="Creating Account..."
        >
          Create Account
        </GoldButton>
      </form>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={googleLoading}
        onClick={handleGoogleSignup}
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
        {googleLoading ? 'Signing in...' : 'Sign up with Google'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-semibold text-[#D4A44A] transition-colors hover:text-[#F5D485]"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
