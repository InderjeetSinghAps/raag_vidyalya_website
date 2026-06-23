'use client';

import { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import {
  TANPURA_NOTES,
  SWARA_NAMES,
  TANPURA_NOTES_GRID,
} from '@/lib/tanpura';

export default function TanpuraPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-[500px] md:max-w-[660px] items-center justify-center px-6 py-20">
          <div className="size-8 animate-spin rounded-full border-2 border-[#D4A017] border-t-transparent" />
        </div>
      }
    >
      <TanpuraContent />
    </Suspense>
  );
}

function TanpuraContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedNote, setSelectedNote] = useState('C#');
  const [playing, setPlaying] = useState(false);

  const current = TANPURA_NOTES[selectedNote];

  useEffect(() => {
    const urlNote = searchParams.get('note');
    const saved = localStorage.getItem('tanpura_note');
    setSelectedNote(urlNote || saved || 'C#');
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    stop();
    const audio = new Audio(current.file);
    audio.loop = true;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => setPlaying(false));
    audioRef.current = audio;
  }, [current.file, stop]);

  const togglePlay = () => {
    if (playing) stop();
    else play();
  };

  const handleNoteChange = (note: string) => {
    setSelectedNote(note);
    localStorage.setItem('tanpura_note', note);
    if (playing) {
      const next = TANPURA_NOTES[note];
      const nextAudio = new Audio(next.file);
      nextAudio.loop = true;
      nextAudio.play();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      audioRef.current = nextAudio;
    }
  };

  return (
    <>
      <style>{`
        @keyframes tanpura-ring {
          0% { transform: scale(1); opacity: 0.35; }
          100% { transform: scale(1.15); opacity: 0; }
        }
      `}</style>
      <div className="mx-auto flex min-h-[calc(100vh-72px)] max-w-[500px] md:max-w-[660px] flex-col items-center px-6 py-8">
        <button
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2 self-start text-sm text-muted-foreground/80 transition-colors hover:text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <div className="flex flex-1 flex-col items-center justify-center gap-8 w-full">
          <button
            onClick={togglePlay}
            className="relative flex size-[180px] items-center justify-center cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full bg-[rgba(212,160,23,.06)] blur-[50px]" />
            {playing && (
              <>
                <div className="absolute inset-0 rounded-full border border-[rgba(212,160,23,.12)] animate-[tanpura-ring_3s_ease-in-out_infinite]" />
                <div className="absolute inset-0 rounded-full border border-[rgba(212,160,23,.15)] animate-[tanpura-ring_3s_ease-in-out_0.4s_infinite]" />
                <div className="absolute inset-0 rounded-full border border-[rgba(212,160,23,.18)] animate-[tanpura-ring_3s_ease-in-out_0.8s_infinite]" />
                <div className="absolute inset-0 rounded-full border border-[rgba(212,160,23,.2)] animate-[tanpura-ring_3s_ease-in-out_1.2s_infinite]" />
              </>
            )}
            {!playing && (
              <>
                <div className="absolute size-[168px] rounded-full border border-[rgba(212,160,23,.08)]" />
                <div className="absolute size-[144px] rounded-full border border-[rgba(212,160,23,.12)]" />
                <div className="absolute size-[120px] rounded-full border border-[rgba(212,160,23,.18)]" />
              </>
            )}
            <div
              className="relative flex size-[100px] items-center justify-center rounded-full shadow-[0_0_40px_rgba(212,160,23,.15)]"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,160,23,.2), rgba(212,160,23,.05))',
              }}
            >
              {playing ? (
                <Pause className="size-10 text-amber-400" />
              ) : (
                <Play className="size-10 text-amber-400/60 ml-0.5" />
              )}
            </div>
          </button>

          <div className="text-center">
            <h1 className="text-7xl font-bold text-white">
              {selectedNote}
            </h1>
            <p className="mt-2 text-2xl text-white/80">
              {SWARA_NAMES[selectedNote]}
            </p>
            <p className="mt-1 text-lg text-white/60">
              {current.frequency}
            </p>
            <button
              onClick={togglePlay}
              className="mx-auto mt-4 flex h-12 w-48 items-center justify-center gap-2 rounded-full bg-[#D4A017] text-base font-semibold text-black transition-all duration-200 hover:translate-y-[-1px] hover:shadow-[0_8px_20px_rgba(212,160,23,.35)] active:scale-[0.97]"
            >
              {playing ? (
                <Pause className="size-5" />
              ) : (
                <Play className="size-5" />
              )}
              {playing ? 'Pause' : 'Play'}
            </button>
          </div>

          <div className="grid w-full grid-cols-4 gap-2.5 md:grid-cols-12">
            {TANPURA_NOTES_GRID.flat().map((note) => (
              <button
                key={note}
                onClick={() => handleNoteChange(note)}
                className={`flex h-10 w-full items-center justify-center rounded-full text-sm font-semibold transition-all duration-200 active:scale-90 ${
                  note === selectedNote
                    ? 'bg-[#D4A017] text-black shadow-[0_0_20px_rgba(212,160,23,.5)]'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80'
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
