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
import {
  useSignupMutation,
  useCheckDeviceMutation,
} from '@/store/api';
import { getDeviceId, getDeviceToken } from '@/lib/device';

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="referralCode" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Referral Code (optional)
            </Label>
            {deviceUsed !== null && (
              <div className="flex items-center gap-1.5">
                {deviceUsed
                  ? <AlertTriangle className="size-3 text-amber-400" />
                  : <CheckCircle className="size-3 text-[#D4A44A]" />
                }
                <span className={`text-[10px] font-medium ${
                  deviceUsed
                    ? 'text-amber-300'
                    : 'bg-gradient-to-r from-[#D4A44A] to-[#F5D485] bg-clip-text text-transparent'
                }`}>
                  {deviceUsed ? 'Previously used' : 'Eligible for referral'}
                </span>
              </div>
            )}
          </div>
          <Input
            id="referralCode"
            placeholder="e.g. RV-ABCDE"
            className="h-11 rounded-lg border-black/[0.08] bg-black/[0.04] text-sm text-foreground placeholder:text-muted-foreground/50 transition-all duration-200 hover:border-black/[0.15] focus:border-primary/50 focus:ring-2 focus:ring-primary/10 dark:border-white/[0.08] dark:bg-white/[0.06] dark:placeholder:text-white/25 dark:hover:border-white/[0.15]"
            {...register('referralCode')}
          />
          {errors.referralCode?.message && (
            <p className="text-xs text-red-400">{errors.referralCode.message}</p>
          )}
        </div>

        <GoldButton
          isSubmitting={isSubmitting}
          loadingText="Creating Account..."
        >
          Create Account
        </GoldButton>
      </form>

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
