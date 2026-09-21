'use client';

import React from 'react';
import { Octave, getOctaveColor } from '@/lib/swarUtils';

export interface SwarPart {
  text: string;
  isKomal: boolean;
  isTeevra: boolean;
  octave: Octave;
  isKan: boolean;
  isSustain: boolean;
}

/**
 * Tokenizes and parses a Swar string (handles single swar, compound swars, grace notes, etc.)
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

  // Tokenize swar components (grace note e.g. (P), or note token like D_, M', S., S', R, etc.)
  const tokenRegex =
    /(\([A-Za-z0-9_.'#]+\)|[A-Za-z](?:_)?(?:['#*.\u0307\u0323\u0331])?|[-—–])/g;
  const matches = trimmed.match(tokenRegex);

  if (!matches || matches.length === 0) {
    return [parseIndividualSwar(trimmed)];
  }

  return matches.map((m) => parseIndividualSwar(m));
}

function parseIndividualSwar(rawToken: string): SwarPart {
  let text = rawToken.trim();
  let isKan = false;
  let octave: Octave = 'mid';
  let isKomal = false;
  let isTeevra = false;

  if (text === '-' || text === '—' || text === '–') {
    return {
      text: '—',
      isKomal: false,
      isTeevra: false,
      octave: 'mid',
      isKan: false,
      isSustain: true,
    };
  }

  // Check grace note e.g. (P)
  if (text.startsWith('(') && text.endsWith(')')) {
    isKan = true;
    text = text.slice(1, -1);
  }

  // Check octave marks
  if (text.includes('.') || text.includes('\u0323') || text.toLowerCase().startsWith('l:')) {
    octave = 'low';
    text = text.replace(/l:/gi, '').replace(/\./g, '').replace(/\u0323/g, '');
  } else if (
    (text.endsWith("'") && !text.toUpperCase().startsWith('M')) ||
    text.endsWith('"') ||
    text.includes('*') ||
    text.includes('^') ||
    text.includes('\u0307') ||
    text.toLowerCase().startsWith('h:')
  ) {
    octave = 'high';
    text = text.replace(/h:/gi, '').replace(/[*^"'\u0307]/g, '');
  }

  // Komal & Teevra detection
  if (text.toUpperCase() === "M'" || text === "M#" || text === "m'" || text === "M\u0301") {
    isTeevra = true;
    text = 'M';
  } else if (text.includes('_') || text.includes('\u0331')) {
    isKomal = true;
    text = text.replace(/[_|\u0331]/g, '').toUpperCase();
  } else if (['r', 'g', 'd', 'n'].includes(text)) {
    // Lowercase notation convention for komal notes
    isKomal = true;
    text = text.toUpperCase();
  } else {
    text = text.toUpperCase();
  }

  return {
    text,
    isKomal,
    isTeevra,
    octave,
    isKan,
    isSustain: false,
  };
}

interface SwarDisplayProps {
  value: string;
  isDarkMode?: boolean;
  className?: string;
  emptyPlaceholder?: React.ReactNode;
}

/**
 * High-precision Indian Classical / Bhatkhande Swar visual renderer.
 * Formats Komal notes with exact horizontal underline directly beneath the letter (NO underscore character).
 * Formats Teevra Ma as M'.
 * Formats Mandra (Low) in Cyan and Taar (High) in Red.
 */
export const SwarDisplay: React.FC<SwarDisplayProps> = ({
  value,
  isDarkMode = false,
  className = '',
  emptyPlaceholder = '—',
}) => {
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
        const color = getOctaveColor(p.octave, isDarkMode);

        if (p.isSustain) {
          return (
            <span key={idx} style={{ color }}>
              —
            </span>
          );
        }

        if (p.isKan) {
          return (
            <span
              key={idx}
              className="text-[10px] font-bold opacity-80 align-super"
              style={{ color }}
            >
              ({p.text})
            </span>
          );
        }

        const isHigh = p.octave === 'high';
        const displayLetter = p.isTeevra ? "M'" : p.text;

        return (
          <span
            key={idx}
            className="inline-flex items-baseline relative"
            style={{ color }}
          >
            {p.isKomal ? (
              <span className="inline-block border-b-2 border-current pb-[1.5px] leading-none font-black">
                {displayLetter}
              </span>
            ) : (
              <span className="leading-none font-black">{displayLetter}</span>
            )}

            {isHigh && !p.isTeevra && (
              <span className="text-[10px] leading-none align-super font-black ml-0.5">
                &apos;
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
};
