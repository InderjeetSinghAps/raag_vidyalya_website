'use client';

import React, { useState } from 'react';
import { Octave } from '@/lib/swarUtils';
import { playSwarSound } from '@/lib/audioTone';
import {
  ChevronUp,
  ChevronDown,
  Delete,
  ArrowRight,
  Volume2,
  VolumeX,
  Music2,
  Sparkles,
} from 'lucide-react';

interface SwarKeyboardProps {
  onInsertSwar: (swar: string) => void;
  onBackspace?: () => void;
  onNextCell?: () => void;
  onPrevCell?: () => void;
  activeCellLabel?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const SwarKeyboard: React.FC<SwarKeyboardProps> = ({
  onInsertSwar,
  onBackspace,
  onNextCell,
  onPrevCell,
  activeCellLabel,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [octave, setOctave] = useState<Octave>('mid');
  const [isGraceNote, setIsGraceNote] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const handleSwarClick = (swarBase: string, isKomal = false, isTeevra = false) => {
    let formatted = swarBase;

    if (isTeevra) {
      formatted = "M'";
    } else if (isKomal) {
      formatted = `${swarBase}_`;
    }

    if (octave === 'low') {
      formatted = `${formatted}.`;
    } else if (octave === 'high') {
      formatted = `${formatted}'`;
    }

    if (isGraceNote) {
      formatted = `(${formatted})`;
      setIsGraceNote(false);
    }

    if (soundEnabled) {
      playSwarSound(formatted, octave);
    }

    onInsertSwar(formatted);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Top glowing gradient border accent */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-cyan-500 via-amber-500 to-rose-500 shadow-md" />

      {/* Frosted glass backdrop */}
      <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-10px_35px_-5px_rgba(0,0,0,0.15)]">
        {/* Dock Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between text-xs border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 tracking-wide">
              <span className="p-1 rounded-md bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
                <Music2 size={13} />
              </span>
              <span>Swar Keyboard</span>
            </div>

            {activeCellLabel && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-mono text-[11px] font-medium animate-pulse">
                <Sparkles size={11} className="text-amber-500" />
                {activeCellLabel}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-lg border transition-all ${
                soundEnabled
                  ? 'border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title={soundEnabled ? 'Mute Swar Audio' : 'Enable Swar Audio'}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Collapse toggle */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                title={isCollapsed ? 'Expand Swar Keyboard' : 'Collapse Swar Keyboard'}
              >
                {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Keyboard Body */}
        {!isCollapsed && (
          <div className="max-w-7xl mx-auto p-3 sm:p-4 flex flex-col gap-3">
            {/* Top Toolbar: Octaves & Modifiers */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              {/* Octave switcher with vibrant luminous badges */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-800/60 shadow-inner">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
                  Octave:
                </span>
                <button
                  type="button"
                  onClick={() => setOctave('low')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                    octave === 'low'
                      ? 'bg-cyan-500 text-white shadow-[0_0_14px_rgba(6,182,212,0.5)] scale-[1.03]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  🔵 Mandra (Low)
                </button>

                <button
                  type="button"
                  onClick={() => setOctave('mid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                    octave === 'mid'
                      ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-[0_0_14px_rgba(245,158,11,0.4)] scale-[1.03]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  ⚫ Madhya (Mid)
                </button>

                <button
                  type="button"
                  onClick={() => setOctave('high')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all ${
                    octave === 'high'
                      ? 'bg-rose-500 text-white shadow-[0_0_14px_rgba(244,63,94,0.5)] scale-[1.03]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  🔴 Taar (High)
                </button>
              </div>

              {/* Action Modifiers */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsGraceNote(!isGraceNote)}
                  className={`px-3 py-1.5 text-xs rounded-xl font-bold border transition-all ${
                    isGraceNote
                      ? 'border-purple-500 bg-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-400'
                  }`}
                  title="Grace note (Kan Swar e.g. (P))"
                >
                  (Kan / Grace)
                </button>

                <button
                  type="button"
                  onClick={() => onInsertSwar('-')}
                  className="px-3.5 py-1.5 text-xs font-mono font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs active:scale-95 transition-all"
                  title="Sustain / Rest (—)"
                >
                  — Sustain
                </button>

                {onBackspace && (
                  <button
                    type="button"
                    onClick={onBackspace}
                    className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition-colors shadow-xs active:scale-95"
                    title="Backspace"
                  >
                    <Delete size={16} />
                  </button>
                )}

                {onNextCell && (
                  <button
                    type="button"
                    onClick={onNextCell}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-md active:scale-95 transition-all"
                    title="Next Matra Box"
                  >
                    <span>Next</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* 3D Tactile Piano/Harmonium Swar Keys */}
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 sm:gap-2">
              {/* Suddha Sa */}
              <button
                type="button"
                onClick={() => handleSwarClick('S')}
                className={`group py-2.5 sm:py-3 px-1 rounded-xl border-2 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(0,0,0,0.12)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center ${
                  octave === 'low'
                    ? 'border-cyan-400 text-cyan-600 dark:text-cyan-300 bg-gradient-to-b from-cyan-50 to-cyan-100/50 dark:from-cyan-950/40 dark:to-cyan-900/30'
                    : octave === 'high'
                    ? 'border-rose-400 text-rose-600 dark:text-rose-300 bg-gradient-to-b from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-900/30'
                    : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-gradient-to-b from-white to-slate-100/80 dark:from-slate-800 dark:to-slate-900 hover:border-amber-400'
                }`}
              >
                <span>{octave === 'high' ? "S'" : octave === 'low' ? 'S.' : 'S'}</span>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-amber-500">
                  Sa • ਸਾ
                </span>
              </button>

              {/* Komal Re */}
              <button
                type="button"
                onClick={() => handleSwarClick('R', true)}
                className="group py-2.5 sm:py-3 px-1 rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-500 text-amber-800 dark:text-amber-300 bg-gradient-to-b from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/30 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(245,158,11,0.2)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center hover:border-amber-500"
              >
                <span className="underline decoration-2 underline-offset-4">
                  {octave === 'high' ? "R'" : octave === 'low' ? 'R.' : 'R'}
                </span>
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  Komal Re
                </span>
              </button>

              {/* Suddha Re */}
              <button
                type="button"
                onClick={() => handleSwarClick('R')}
                className={`group py-2.5 sm:py-3 px-1 rounded-xl border-2 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(0,0,0,0.12)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center ${
                  octave === 'low'
                    ? 'border-cyan-400 text-cyan-600 dark:text-cyan-300 bg-gradient-to-b from-cyan-50 to-cyan-100/50 dark:from-cyan-950/40 dark:to-cyan-900/30'
                    : octave === 'high'
                    ? 'border-rose-400 text-rose-600 dark:text-rose-300 bg-gradient-to-b from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-900/30'
                    : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-gradient-to-b from-white to-slate-100/80 dark:from-slate-800 dark:to-slate-900 hover:border-amber-400'
                }`}
              >
                <span>{octave === 'high' ? "R'" : octave === 'low' ? 'R.' : 'R'}</span>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-amber-500">
                  Re • ਰੇ
                </span>
              </button>

              {/* Komal Ga */}
              <button
                type="button"
                onClick={() => handleSwarClick('G', true)}
                className="group py-2.5 sm:py-3 px-1 rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-500 text-amber-800 dark:text-amber-300 bg-gradient-to-b from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/30 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(245,158,11,0.2)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center hover:border-amber-500"
              >
                <span className="underline decoration-2 underline-offset-4">
                  {octave === 'high' ? "G'" : octave === 'low' ? 'G.' : 'G'}
                </span>
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  Komal Ga
                </span>
              </button>

              {/* Suddha Ga */}
              <button
                type="button"
                onClick={() => handleSwarClick('G')}
                className={`group py-2.5 sm:py-3 px-1 rounded-xl border-2 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(0,0,0,0.12)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center ${
                  octave === 'low'
                    ? 'border-cyan-400 text-cyan-600 dark:text-cyan-300 bg-gradient-to-b from-cyan-50 to-cyan-100/50 dark:from-cyan-950/40 dark:to-cyan-900/30'
                    : octave === 'high'
                    ? 'border-rose-400 text-rose-600 dark:text-rose-300 bg-gradient-to-b from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-900/30'
                    : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-gradient-to-b from-white to-slate-100/80 dark:from-slate-800 dark:to-slate-900 hover:border-amber-400'
                }`}
              >
                <span>{octave === 'high' ? "G'" : octave === 'low' ? 'G.' : 'G'}</span>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-amber-500">
                  Ga • ਗਾ
                </span>
              </button>

              {/* Suddha Ma */}
              <button
                type="button"
                onClick={() => handleSwarClick('M')}
                className={`group py-2.5 sm:py-3 px-1 rounded-xl border-2 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(0,0,0,0.12)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center ${
                  octave === 'low'
                    ? 'border-cyan-400 text-cyan-600 dark:text-cyan-300 bg-gradient-to-b from-cyan-50 to-cyan-100/50 dark:from-cyan-950/40 dark:to-cyan-900/30'
                    : octave === 'high'
                    ? 'border-rose-400 text-rose-600 dark:text-rose-300 bg-gradient-to-b from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-900/30'
                    : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-gradient-to-b from-white to-slate-100/80 dark:from-slate-800 dark:to-slate-900 hover:border-amber-400'
                }`}
              >
                <span>{octave === 'high' ? "M'" : octave === 'low' ? 'M.' : 'M'}</span>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-amber-500">
                  Ma • ਮਾ
                </span>
              </button>

              {/* Teevra Ma */}
              <button
                type="button"
                onClick={() => handleSwarClick('M', false, true)}
                className="group py-2.5 sm:py-3 px-1 rounded-xl border-2 border-purple-400 dark:border-purple-500 text-purple-800 dark:text-purple-300 bg-gradient-to-b from-purple-50 to-purple-100/60 dark:from-purple-950/40 dark:to-purple-900/30 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(168,85,247,0.2)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center hover:border-purple-500"
              >
                <span>M&apos;</span>
                <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                  Teevra Ma
                </span>
              </button>

              {/* Suddha Pa */}
              <button
                type="button"
                onClick={() => handleSwarClick('P')}
                className={`group py-2.5 sm:py-3 px-1 rounded-xl border-2 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(0,0,0,0.12)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center ${
                  octave === 'low'
                    ? 'border-cyan-400 text-cyan-600 dark:text-cyan-300 bg-gradient-to-b from-cyan-50 to-cyan-100/50 dark:from-cyan-950/40 dark:to-cyan-900/30'
                    : octave === 'high'
                    ? 'border-rose-400 text-rose-600 dark:text-rose-300 bg-gradient-to-b from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-900/30'
                    : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-gradient-to-b from-white to-slate-100/80 dark:from-slate-800 dark:to-slate-900 hover:border-amber-400'
                }`}
              >
                <span>{octave === 'high' ? "P'" : octave === 'low' ? 'P.' : 'P'}</span>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-amber-500">
                  Pa • ਪਾ
                </span>
              </button>

              {/* Komal Dha */}
              <button
                type="button"
                onClick={() => handleSwarClick('D', true)}
                className="group py-2.5 sm:py-3 px-1 rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-500 text-amber-800 dark:text-amber-300 bg-gradient-to-b from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/30 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(245,158,11,0.2)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center hover:border-amber-500"
              >
                <span className="underline decoration-2 underline-offset-4">
                  {octave === 'high' ? "D'" : octave === 'low' ? 'D.' : 'D'}
                </span>
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  Komal Dha
                </span>
              </button>

              {/* Suddha Dha */}
              <button
                type="button"
                onClick={() => handleSwarClick('D')}
                className={`group py-2.5 sm:py-3 px-1 rounded-xl border-2 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(0,0,0,0.12)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center ${
                  octave === 'low'
                    ? 'border-cyan-400 text-cyan-600 dark:text-cyan-300 bg-gradient-to-b from-cyan-50 to-cyan-100/50 dark:from-cyan-950/40 dark:to-cyan-900/30'
                    : octave === 'high'
                    ? 'border-rose-400 text-rose-600 dark:text-rose-300 bg-gradient-to-b from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-900/30'
                    : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-gradient-to-b from-white to-slate-100/80 dark:from-slate-800 dark:to-slate-900 hover:border-amber-400'
                }`}
              >
                <span>{octave === 'high' ? "D'" : octave === 'low' ? 'D.' : 'D'}</span>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-amber-500">
                  Dha • ਧਾ
                </span>
              </button>

              {/* Komal Ni */}
              <button
                type="button"
                onClick={() => handleSwarClick('N', true)}
                className="group py-2.5 sm:py-3 px-1 rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-500 text-amber-800 dark:text-amber-300 bg-gradient-to-b from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/30 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(245,158,11,0.2)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center hover:border-amber-500"
              >
                <span className="underline decoration-2 underline-offset-4">
                  {octave === 'high' ? "N'" : octave === 'low' ? 'N.' : 'N'}
                </span>
                <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                  Komal Ni
                </span>
              </button>

              {/* Suddha Ni */}
              <button
                type="button"
                onClick={() => handleSwarClick('N')}
                className={`group py-2.5 sm:py-3 px-1 rounded-xl border-2 font-black text-base sm:text-lg shadow-[0_3px_0_rgba(0,0,0,0.12)] active:shadow-none active:translate-y-[3px] transition-all flex flex-col items-center justify-center ${
                  octave === 'low'
                    ? 'border-cyan-400 text-cyan-600 dark:text-cyan-300 bg-gradient-to-b from-cyan-50 to-cyan-100/50 dark:from-cyan-950/40 dark:to-cyan-900/30'
                    : octave === 'high'
                    ? 'border-rose-400 text-rose-600 dark:text-rose-300 bg-gradient-to-b from-rose-50 to-rose-100/50 dark:from-rose-950/40 dark:to-rose-900/30'
                    : 'border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 bg-gradient-to-b from-white to-slate-100/80 dark:from-slate-800 dark:to-slate-900 hover:border-amber-400'
                }`}
              >
                <span>{octave === 'high' ? "N'" : octave === 'low' ? 'N.' : 'N'}</span>
                <span className="text-[10px] font-semibold text-slate-400 group-hover:text-amber-500">
                  Ni • ਨੀ
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
