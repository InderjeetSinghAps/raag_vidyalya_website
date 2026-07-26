'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Loader2,
  Sparkles,
  Music,
  Layers,
  Video,
  CalendarClock,
  CheckCircle,
  MessageCircle,
  LogIn,
} from 'lucide-react';
import { getPurchases } from '@/lib/revenuecat';
import { useAppSelector } from '@/store/hooks';
import {
  usePurchaseSubscriptionMutation,
  useConfirmPaymentMutation,
} from '@/store/api';
import { openRazorpayCheckout } from '@/lib/razorpay';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { Package } from '@revenuecat/purchases-js';

interface Plan {
  rcPackage: Package;
  planId: string;
  title: string;
  price: number;
  priceLabel: string;
  comparePrice: string | null;
  period: string;
  periodLabel: string;
  description: string | null;
  savePercent: number | null;
}

const features: { icon: typeof CheckCircle; label: string }[] = [
  { icon: Layers, label: '10 Thaats — Clear, beginner-friendly lessons.' },
  { icon: Music, label: '31 Raags — Detailed with multiple bandishes.' },
  { icon: MessageCircle, label: 'Tutor Support — Ask doubts anytime.' },
  { icon: Video, label: 'Video Lessons — Raag explanations made simple.' },
  { icon: CalendarClock, label: 'Daily Riyaz Tips — Stay consistent and grow daily.' },
  { icon: CheckCircle, label: 'Easy Learning — Structured, step-by-step guidance.' },
];

export default function SubscriptionPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [purchase] = usePurchaseSubscriptionMutation();
  const [confirm] = useConfirmPaymentMutation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const purchases = getPurchases();
        if (!purchases) {
          if (!isAuthenticated) {
            setError('login_required');
          } else {
            setError('Purchase system not available.');
          }
          setLoading(false);
          return;
        }
        const offerings = await purchases.getOfferings();
        const current = offerings.current;
        if (!current || current.availablePackages.length === 0) {
          setError('No plans available right now.');
          setLoading(false);
          return;
        }

        const allowed = new Set(['P1M', 'P3M', 'P1Y']);
        let rate = 1;
        try {
          const r = await fetch('https://open.er-api.com/v6/latest/USD');
          const d = await r.json();
          rate = d.rates.INR || 1;
        } catch {
          rate = 83;
        }

        const periodLabels: Record<string, string> = {
          P1M: 'month',
          P3M: 'quarter',
          P1Y: 'year',
        };

        const mapped: Plan[] = current.availablePackages
          .filter((pkg) => {
            const d = pkg.webBillingProduct.normalPeriodDuration;
            return d != null && allowed.has(d);
          })
          .map((pkg) => {
            const usd = pkg.webBillingProduct.price.amountMicros / 1_000_000;
            const inr = usd * rate;
            const period = pkg.webBillingProduct.normalPeriodDuration ?? '';
            return {
              rcPackage: pkg,
              planId: pkg.webBillingProduct.identifier,
              title: pkg.webBillingProduct.title,
              price: Math.round(inr * 100),
              priceLabel: new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(inr),
              comparePrice: null,
              period,
              periodLabel: periodLabels[period] || period,
              description: pkg.webBillingProduct.description,
              savePercent: null,
            };
          });
        mapped.sort(
          (a, b) => a.rcPackage.webBillingProduct.price.amountMicros - b.rcPackage.webBillingProduct.price.amountMicros,
        );
        const monthlyUsd = mapped[0]?.rcPackage.webBillingProduct.price.amountMicros / 1_000_000;
        if (monthlyUsd && monthlyUsd > 0) {
          for (const plan of mapped) {
            const usd = plan.rcPackage.webBillingProduct.price.amountMicros / 1_000_000;
            const months = plan.period === 'P3M' ? 3 : plan.period === 'P1Y' ? 12 : 0;
            if (months > 0) {
              plan.savePercent = Math.round((1 - usd / (monthlyUsd * months)) * 100);
              const compareInr = monthlyUsd * months * rate;
              plan.comparePrice = new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0,
              }).format(compareInr);
            }
          }
        }
        setPlans(mapped);
      } catch {
        setError('Failed to load plans. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubscribe(plan: Plan) {
    setBusy(true);
    try {
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) throw new Error('Razorpay key not configured');

      const response = await openRazorpayCheckout({
        key: razorpayKey,
        amount: plan.price,
        currency: 'INR',
        name: 'Raag Vidyalya',
        description: `${plan.title} Subscription`,
        theme: { color: '#059669' },
      });

      const purchaseRes = await purchase({
        planId: plan.planId,
        paymentReference: response.razorpay_order_id,
      }).unwrap();

      await confirm({
        id: purchaseRes.id,
        paymentReference: response.razorpay_payment_id,
      }).unwrap();

      toast.success('Subscription activated!');
      router.push('/home');
    } catch (err: unknown) {
      if (err instanceof Error && err.message === 'Payment cancelled') {
        toast.info('Payment cancelled.');
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    if (error === 'login_required') {
      return (
        <div className="relative mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="rounded-full bg-emerald-100 p-4 dark:bg-emerald-500/20">
            <LogIn className="size-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-[#1E1B4B] dark:text-white">
              Sign in to Subscribe
            </h2>
            <p className="text-muted-foreground">Please log in to your account to view subscription plans and start your learning journey.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.back()}>Go back</Button>
            <Button onClick={() => router.push('/login?redirectTo=/subscription')}>Log in</Button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{error}</p>
        <Button variant="outline" onClick={() => router.back()}>Go back</Button>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-4 md:px-6 py-12">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 size-[30rem] rounded-full bg-gradient-to-br from-emerald-200/30 to-transparent blur-3xl dark:from-emerald-500/10" />
        <div className="absolute -bottom-24 -right-24 size-[25rem] rounded-full bg-gradient-to-br from-indigo-200/20 to-transparent blur-3xl dark:from-indigo-400/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[20rem] rounded-full bg-gradient-to-tr from-emerald-100/20 via-transparent to-indigo-100/20 blur-3xl dark:from-emerald-500/10" />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 size-4" /> Back
        </Button>
      </div>

      <div className="relative mb-12 text-center">
        <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-xs font-semibold tracking-wider text-emerald-700 mb-4 dark:bg-emerald-500/20 dark:text-emerald-300">
          PRICING
        </span>
        <h1 className="text-4xl font-bold tracking-tight text-[#1E1B4B] dark:text-white">
          Choose Your Learning Journey
        </h1>
        <p className="mt-3 pb-3 text-lg text-slate-600 max-w-2xl mx-auto dark:text-white/60">
          Get full access to our complete collection of raag courses and sheet music. Cancel anytime.
        </p>
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {plans.map((plan, i) => {
          const isMiddle = i === 1;
          return (
            <div
              key={plan.planId}
              style={{ animationDelay: `${i * 120}ms` }}
              className={`relative flex flex-col rounded-2xl border backdrop-blur-md transition-all duration-300 cursor-pointer animate-[fadeInUp_0.5s_ease-out_both] ${
                isMiddle
                  ? 'bg-emerald-50/80 border-emerald-300/50 shadow-2xl order-first md:order-none ring-2 ring-emerald-500 -mt-9 mb-3 z-10 dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:ring-emerald-400'
                  : 'bg-white/70 border-white/30 shadow-xl hover:shadow-2xl hover:-translate-y-1 dark:bg-white/[0.06] dark:border-white/[0.08]'
              }`}
            >
              <div className="flex flex-col flex-1 p-6 md:p-8">
                {isMiddle && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="gap-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg px-4 py-1 text-sm font-semibold">
                      <Sparkles className="size-4" /> Best Value
                    </Badge>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-[#1E1B4B] dark:text-white">{plan.title}</h3>
                  {plan.description && (
                    <p className="mt-1 text-sm text-slate-500 dark:text-white/60 line-clamp-1">{plan.description}</p>
                  )}
                </div>

                <div className="mb-6">
                  {plan.comparePrice && (
                    <span className="text-lg text-slate-400 line-through mr-2 dark:text-white/40">{plan.comparePrice}</span>
                  )}
                  <span className="text-4xl font-bold text-[#1E1B4B] dark:text-white">{plan.priceLabel}</span>
                  <span className="ml-1 text-sm text-slate-500 dark:text-white/50">/{plan.periodLabel}</span>
                  {plan.savePercent && plan.savePercent > 0 && (
                    <div className="mt-1.5">
                      <span className="inline-block rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        Save {plan.savePercent}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-200/50 pt-6 mb-6 flex-1 dark:border-white/[0.08]">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-white/50">
                    What&apos;s included
                  </p>
                  <ul className="space-y-3">
                    {features.map((f) => {
                      const Icon = f.icon;
                      return (
                        <li key={f.label} className="flex items-start gap-3 text-sm text-slate-700 dark:text-white/70">
                          <Icon className="mt-0.5 size-4 shrink-0 text-emerald-500 dark:text-emerald-400" />
                          <span>{f.label}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <Button
                  disabled={busy}
                  className={`w-full rounded-xl py-6 text-base font-semibold transition-all duration-200 ${
                    isMiddle
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-white/80 hover:bg-white text-[#1E1B4B] border border-slate-200 hover:border-emerald-300 dark:bg-white/[0.06] dark:text-white/80 dark:border-white/[0.12] dark:hover:border-emerald-400'
                  }`}
                  size="lg"
                  onClick={() => handleSubscribe(plan)}
                >
                  {busy ? (
                    <><Loader2 className="mr-2 size-4 animate-spin" /> Processing...</>
                  ) : (
                    `Subscribe — ${plan.priceLabel}`
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 space-y-4 text-center text-sm text-slate-500 dark:text-white/50">
        <p>Subscription auto-renews. Cancel anytime.</p>
        <div className="flex justify-center gap-4 text-xs">
          <a href="/terms" className="underline hover:text-emerald-600 transition-colors">Terms of Use</a>
          <span className="text-slate-300 dark:text-white/20">·</span>
          <a href="/privacy" className="underline hover:text-emerald-600 transition-colors">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
