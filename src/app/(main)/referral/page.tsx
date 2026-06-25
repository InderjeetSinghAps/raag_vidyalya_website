'use client';

import { useState } from 'react';
import {
  Gift,
  Copy,
  Share2,
  Check,
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  useGetMyReferralCodeQuery,
  useGetReferralHistoryQuery,
} from '@/store/api';
import type { ReferralHistoryStats } from '@/types';
import { toast } from 'sonner';

const TOTAL_UNLOCKABLE = 29;

const statCards = [
  {
    key: 'total' as const,
    label: 'Total',
    icon: Users,
    text: 'text-blue-400',
  },
  {
    key: 'successful' as const,
    label: 'Success',
    icon: CheckCircle,
    text: 'text-green-400',
  },
  {
    key: 'pending' as const,
    label: 'Pending',
    icon: Clock,
    text: 'text-yellow-400',
  },
  {
    key: 'failed' as const,
    label: 'Failed',
    icon: XCircle,
    text: 'text-red-400',
  },
];

const statusConfig: Record<
  string,
  { label: string; classes: string; border: string }
> = {
  pending: {
    label: 'Pending',
    classes: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
    border: 'border-l-yellow-500',
  },
  successful: {
    label: 'Successful',
    classes: 'border-green-500/30 bg-green-500/10 text-green-400',
    border: 'border-l-green-500',
  },
  failed: {
    label: 'Failed',
    classes: 'border-red-500/30 bg-red-500/10 text-red-400',
    border: 'border-l-red-500',
  },
};

interface ReferralItem {
  email?: string;
  userName?: string;
  status: 'pending' | 'successful' | 'failed';
  createdAt: string;
}

export default function ReferralPage() {
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);

  const { data: referralData, isLoading: referralLoading } =
    useGetMyReferralCodeQuery(undefined);
  const { data: historyData, isLoading: historyLoading } =
    useGetReferralHistoryQuery({ page, limit: 20 });

  const stats = historyData?.stats as
    | ReferralHistoryStats
    | undefined;
  const referrals = (historyData?.referrals ?? []) as ReferralItem[];
  const totalPages = historyData?.totalPages ?? 1;
  const isLoading = referralLoading || historyLoading;

  const handleCopy = () => {
    if (!referralData?.referralCode) return;
    navigator.clipboard.writeText(referralData.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Referral code copied!');
  };

  const handleShare = async () => {
    if (!referralData?.shareText) return;
    if (navigator.share) {
      await navigator.share({ text: referralData.shareText });
    } else {
      await navigator.clipboard.writeText(referralData.shareText);
      toast.success('Share text copied!');
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[760px] px-4 py-20">
        <div className="flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground/60" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[760px] px-4 py-8">
      <Link
        href="/profile"
        className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground/80 transition-colors hover:text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Profile
      </Link>

      <div className="mb-10 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
          <Gift className="size-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Referrals
          </h1>
          <p className="text-sm text-muted-foreground">
            Share your code and earn rewards
          </p>
        </div>
      </div>

      {referralData && (
        <div className="mb-10 rounded-2xl border border-green-500/40 bg-card/60 p-8 backdrop-blur-sm shadow-[0_0_32px_rgba(34,197,94,0.15)] ring-1 ring-green-500/20 dark:border-green-400/30 dark:bg-white/[0.03] dark:shadow-[0_0_32px_rgba(34,197,94,0.1)]">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground/40">
              Your Referral Code
            </p>
            <div className="flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1">
              <div className="size-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] font-medium text-green-400">
                Active
              </span>
            </div>
          </div>
          <p className="mt-5 text-center text-5xl font-bold tracking-[0.3em] text-foreground">
            {referralData.referralCode}
          </p>
          <div className="mt-8 flex justify-center gap-8">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {copied ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <span className="text-muted-foreground/20">|</span>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Share2 className="size-4" />
              Share
            </button>
          </div>
          <div className="mt-6 rounded-xl border border-border/50 bg-muted/50 p-4 backdrop-blur-sm">
            <p className="text-xs text-muted-foreground leading-relaxed">
              {referralData.shareText}
            </p>
          </div>
        </div>
      )}

      {stats && (
        <div className="mb-10 rounded-xl border border-border/50 bg-card/60 p-8 backdrop-blur-sm shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03]">
          <div className="flex justify-around">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.key}
                  className="flex flex-col items-center gap-1.5"
                >
                  <Icon className={`size-4 ${card.text}`} />
                  <p className={`text-2xl font-bold ${card.text}`}>
                    {stats[card.key]}
                  </p>
                  <p className="text-[11px] text-muted-foreground/60">
                    {card.label}
                  </p>
                </div>
              );
            })}
          </div>
          {/* <div className="mt-6 border-t border-border/40 pt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {stats.raagUnlockCount} / {TOTAL_UNLOCKABLE} raags
                unlocked
              </p>
              <span className="text-xs text-muted-foreground/60">
                {Math.round(
                  (stats.raagUnlockCount / TOTAL_UNLOCKABLE) * 100,
                )}
                %
              </span>
            </div>
            {stats.allRaagsUnlocked ? (
              <p className="mt-1 text-xs text-green-500">
                All raags unlocked!
              </p>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">
                Next unlock at {stats.referralsToNextUnlock} more
                referrals
              </p>
            )}
            <div className="mt-3 h-2.5 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
                style={{
                  width: `${Math.min(100, (stats.raagUnlockCount / TOTAL_UNLOCKABLE) * 100)}%`,
                }}
              />
            </div>
          </div> */}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-4 w-0.5 rounded-full bg-green-500/60" />
          <h2 className="text-sm font-semibold text-foreground">
            Referral History
          </h2>
        </div>
        {referrals.length === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/40 p-10 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted/50">
              <Users className="size-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm text-muted-foreground">
              No referrals yet. Share your referral code to earn
              coins!
            </p>
          </div>
        ) : (
          referrals.map((ref, i) => {
            const status = statusConfig[ref.status];
            return (
              <div
                key={i}
                className={`rounded-xl border border-border bg-background p-4 pl-5 border-l-2 ${status.border}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {ref.userName || ref.email || 'Unknown'}
                  </p>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${status.classes}`}
                  >
                    {status.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  {new Date(ref.createdAt).toLocaleDateString()}
                </p>
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-muted-foreground/60">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-8 px-3"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
              className="h-8 px-3"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
