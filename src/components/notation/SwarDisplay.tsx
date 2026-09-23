'use client';

import React from 'react';
import {
  Octave,
  Language,
  Sur,
  getOctaveColor,
  parseSwar,
  getSurFromNote,
  getSurSymbol,
  PUNJABI_SUR_MAP,
  HINDI_SUR_MAP,
  ENGLISH_SUR_MAP,
} from '@/lib/swarUtils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export interface SwarPart {
  text: string;
  isKomal: boolean;
  isTeevra: boolean;
  octave: Octave;
  isKan: boolean;
  isSustain: boolean;
  isSeparator?: boolean;
  sur?: Sur;
}

/**
 * Tokenizes and parses a Swar string (handles English, Hindi, Punjabi, compound swars, grace notes, etc.)
 */
export function parseSwarPhrase(input: string): SwarPart[] {
  const trimmed = (input || '').trim();
  if (!trimmed) return [];

  if (trimmed === '-' || trimmed === '—' || trimmed === '–') {
    return [
      {
        text: '—',
        isKomal: false,
        isTeevra: false,
        octave: 'mid',
        isKan: false,
        isSustain: true,
      },
    ];
  }

  // Tokenize swar components (grace note e.g. (P), or note token like D_, M', S., S', R, ਰੁ, रे॒, separators like commas, bars)
  const tokenRegex =
    /(\([A-Za-z0-9_.'#\u0900-\u097F\u0A00-\u0A7F\u0300-\u036F]+\)|(?:[A-Za-z\u0900-\u097F\u0A00-\u0A7F]+[\u0300-\u036F]*)(?:_)?(?:['#*.\u0307\u0323\u0331\u0332\u0951\u0952])?|[-—–]|[,|/])/g;
  const matches = trimmed.match(tokenRegex);

  if (!matches || matches.length === 0) {
    const single = parseSwar(trimmed);
    return [
      {
        text: single.note,
        isKomal: single.isKomal,
        isTeevra: single.isTeevra,
        octave: single.octave,
        isKan: single.isKan,
        isSustain: single.isSustain,
        sur: single.sur,
      },
    ];
  }

  return matches.map((m) => {
    if (m === ',' || m === '|' || m === '/') {
      return {
        text: m,
        isKomal: false,
        isTeevra: false,
        octave: 'mid' as Octave,
        isKan: false,
        isSustain: false,
        isSeparator: true,
      };
    }
    const single = parseSwar(m);
    return {
      text: single.note,
      isKomal: single.isKomal,
      isTeevra: single.isTeevra,
      octave: single.octave,
      isKan: single.isKan,
      isSustain: single.isSustain,
      sur: single.sur,
    };
  });
}

interface SwarDisplayProps {
  value: string;
  isDarkMode?: boolean;
  className?: string;
  emptyPlaceholder?: React.ReactNode;
  language?: Language;
}

/**
 * High-precision Indian Classical & Gurmat Sangeet Swar visual renderer.
 * Supports:
 * - English (Bhatkhande: Sa, Re, Ga, Ma', Pa, Dha, Ni with underlines for komal)
 * - Hindi (Devanagari: स, रे॒, रे, ग॒, ग, म, म॑, प, ध॒, ध, नि॒, नि)
 * - Punjabi (Gurmukhi: ਸ, ਰੁ, ਰ, ਗੁ, ਗ, ਮ, ਮੇ, ਪ, ਧੁ, ਧ, ਨੁ, ਨ)
 * Formats Mandra (Low) in Cyan and Taar (High) in Red.
 */
export const SwarDisplay: React.FC<SwarDisplayProps> = ({
  value,
  isDarkMode = false,
  className = '',
  emptyPlaceholder = '—',
  language,
}) => {
  const reduxLang = useSelector((state: RootState) => state.language);
  const activeLang: Language = language || reduxLang || 'english';

  const trimmed = (value || '').trim();

  if (!trimmed) {
    return (
      <span className={`text-slate-300 dark:text-slate-700 font-normal select-none ${className}`}>
        {emptyPlaceholder}
      </span>
    );
  }

  const parts = parseSwarPhrase(trimmed);

  if (parts.length === 0) {
    return <span className={className}>{trimmed}</span>;
  }

  return (
    <span
      className={`inline-flex items-center justify-center gap-0.5 font-black font-mono tracking-wide ${className}`}
    >
      {parts.map((p, idx) => {
        if (p.isSeparator) {
          return (
            <span key={idx} className="text-slate-400 dark:text-slate-500 font-bold px-0.5 select-none">
              {p.text}
            </span>
          );
        }

        const color = getOctaveColor(p.octave, isDarkMode);

        if (p.isSustain) {
          return (
            <span key={idx} style={{ color }}>
              —
            </span>
          );
        }

        const sur = p.sur || getSurFromNote(p.text, p.isKomal, p.isTeevra);

        // Language-specific note rendering
        let displayContent: React.ReactNode = p.text;

        if (activeLang === 'punjabi' && sur) {
          displayContent = PUNJABI_SUR_MAP[sur];
        } else if (activeLang === 'hindi' && sur) {
          displayContent = HINDI_SUR_MAP[sur];
        } else if (activeLang === 'english') {
          // English Bhatkhande notation with underline for Komal
          const baseLetter = sur
            ? (p.isTeevra ? "M'" : p.isKomal ? ENGLISH_SUR_MAP[sur] : ENGLISH_SUR_MAP[sur])
            : p.isTeevra ? "M'" : p.text;

          displayContent = p.isKomal ? (
            <span className="inline-block border-b-2 border-current pb-[1.5px] leading-none font-black">
              {baseLetter}
            </span>
          ) : (
            <span className="leading-none font-black">{baseLetter}</span>
          );
        } else {
          // Fallback
          displayContent = p.isKomal ? (
            <span className="inline-block border-b-2 border-current pb-[1.5px] leading-none font-black">
              {p.text}
            </span>
          ) : (
            <span className="leading-none font-black">{p.text}</span>
          );
        }

        if (p.isKan) {
          return (
            <span
              key={idx}
              className="text-[10px] font-bold opacity-80 align-super"
              style={{ color }}
            >
              ({displayContent})
            </span>
          );
        }

        const isHigh = p.octave === 'high';
        const isLow = p.octave === 'low';

        return (
          <span
            key={idx}
            className="inline-flex items-baseline relative"
            style={{ color }}
          >
            {displayContent}

            {/* High Octave Acute/Dot mark */}
            {isHigh && (
              <span className="text-[10px] leading-none align-super font-black ml-0.5">
                &apos;
              </span>
            )}

            {/* Low Octave Dot mark */}
            {isLow && (
              <span className="text-[11px] leading-none align-sub font-black ml-0.5">
                .
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};
