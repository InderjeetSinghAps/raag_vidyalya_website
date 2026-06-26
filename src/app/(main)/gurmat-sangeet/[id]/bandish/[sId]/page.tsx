'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import {
  useGetRaagsQuery,
  useGetSingleRaagAccessQuery,
} from '@/store/api';
import { PdfViewer } from '@/components/player/PdfViewer';
import { BandishPlayer } from '@/components/player/BandishPlayer';

export default function BandishViewPage() {
  const params = useParams();
  const router = useRouter();
  const isAuthenticated = useAppSelector(
    (s) => s.auth.isAuthenticated,
  );

  const { data, isLoading } = useGetRaagsQuery(undefined);
  const raag = (data?.raags ?? []).find((r) => r._id === params.id);
  const bandish = raag?.listOfBandish.find(
    (b) => b.sId === Number(params.sId),
  );

  const { data: accessData, isLoading: accessLoading } =
    useGetSingleRaagAccessQuery(raag?.id ?? 0, {
      skip: !isAuthenticated,
    });

  useEffect(() => {
    if (accessData && !accessData.hasAccess && !accessData.isFree) {
      router.replace('/subscription');
    }
  }, [accessData, router]);

  if (isLoading || accessLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!bandish || !raag) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <Music2 className="size-12 text-muted-foreground/80" />
        <p className="text-lg text-muted-foreground">
          Bandish not found
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-14 items-center gap-3 border-b border-border px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground/80 transition-colors hover:text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <div className="h-4 w-px bg-border" />
        <h1 className="text-base font-semibold text-foreground">
          {bandish.bandishName}
        </h1>
      </header>

      <div className="flex-1 min-h-0 pb-20 bg-background">
        {bandish.pdfUrl && <PdfViewer url={bandish.pdfUrl} />}
      </div>

      <BandishPlayer audioUrl={bandish.audioUrl} />
    </div>
  );
}
