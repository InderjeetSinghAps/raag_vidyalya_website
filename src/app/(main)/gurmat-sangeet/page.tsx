'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Music2,
  Clock,
  Search,
  Loader2,
  Lock,
  Crown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { playTrack, showMiniPlayer } from '@/store/playerSlice';
import { useGetRaagsQuery, useGetRaagAccessQuery } from '@/store/api';
import type { RaagApiItem } from '@/types';

export default function GurmatSangeetPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const isAuthenticated = useAppSelector(
    (s) => s.auth.isAuthenticated,
  );

  const { data, isLoading } = useGetRaagsQuery();
  const { data: accessData } = useGetRaagAccessQuery(undefined, {
    skip: !isAuthenticated,
  });
  const unlockedSet = new Set(
    accessData?.raagAccess?.map((r) => r.raagNumber) ?? [],
  );

  const filtered = (data?.raags ?? []).filter((r) => {
    return (
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.thaat.toLowerCase().includes(search.toLowerCase()) ||
      r.jaati.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleListen = (raag: RaagApiItem) => {
    console.log('audioUrl', raag.audioUrl);
    dispatch(
      playTrack({
        id: raag._id,
        title: raag.name,
        artist: '',
        audioUrl: raag.audioUrl || '',
        image: '',
        duration: '',
      }),
    );
    dispatch(showMiniPlayer());
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-balance text-2xl font-bold text-foreground">
            Gurmat Sangeet
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore the sacred raags of Sikh music tradition
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search raags by name, thaat, or jaati..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border bg-background pl-10 text-muted-foreground placeholder:text-muted-foreground/80"
          />
        </div>
      </div>

      <div className="mt-8 mb-4">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((raag) => (
            <Card
              key={raag._id}
              className="flex cursor-pointer flex-col border-border bg-background transition-all hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
              onClick={() =>
                router.push(
                  raag.id > 2 && !unlockedSet.has(raag.id)
                    ? '/subscription'
                    : `/gurmat-sangeet/${raag._id}`,
                )
              }
            >
              <div className="flex h-32 items-center justify-center rounded-t-xl bg-background transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.06)]">
                {raag.id > 2 && !unlockedSet.has(raag.id) ? (
                  <div className="flex flex-col items-center gap-2.5">
                    <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500/80 shadow-[0_0_20px_rgba(212,175,55,0.15),inset_0_0_12px_rgba(212,175,55,0.06)]">
                      <Lock className="size-7 text-white" />
                    </div>
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em]">
                      <span className="size-1 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500" />
                      <span className="bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
                        Premium
                      </span>
                    </span>
                  </div>
                ) : (
                  <img
                    src="/logo2.svg"
                    alt="logo"
                    className="size-40 text-cyan-400/30"
                  />
                )}
              </div>
              <CardContent className="flex flex-1 flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground">
                    {raag.name}
                  </h3>
                  {raag.id <= 2 ? (
                    <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-medium text-cyan-400">
                      Free
                    </Badge>
                  ) : unlockedSet.has(raag.id) ? (
                    // <Badge className="border border-green-500/20 bg-green-500/10 text-[10px] font-medium text-green-400">
                    //   <Crown className="mr-1 size-3" />
                    //   Premium
                    // </Badge>
                    <></>
                  ) : (
                    <Badge className="border border-amber-400/30 bg-gradient-to-r from-amber-500/15 to-yellow-500/15">
                      <Crown className="size-3 text-amber-400" />
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-medium text-cyan-400">
                    {raag.thaat}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground/80">
                    <Clock className="size-3" />
                    <span>{raag.time}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground/80">
                  {raag.jaati}
                </p>
                <p className="font-mono text-xs text-cyan-400">
                  {raag.aroh}
                </p>
                <div className="mt-auto pt-2">
                  <Button
                    variant="outline"
                    className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 active:scale-[0.96]"
                  >
                    {raag.id > 2 && !unlockedSet.has(raag.id) ? (
                      <>
                        <Lock className="mr-1.5 size-3" /> Premium
                      </>
                    ) : (
                      'View Details'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Music2 className="mb-4 size-12 text-muted-foreground/80" />
            <p className="text-lg text-muted-foreground">
              No raags found
            </p>
            <p className="mt-1 text-sm text-muted-foreground/80">
              Try a different search or filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
