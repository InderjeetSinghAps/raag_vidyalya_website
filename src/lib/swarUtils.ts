export type Octave = 'low' | 'mid' | 'high';

export interface SwarToken {
  raw: string;
  note: string;
  octave: Octave;
  isKomal: boolean;
  isTeevra: boolean;
  isKan: boolean; // grace note
  isSustain: boolean;
}

/**
 * Parses an individual swar string (e.g. "S", "r", "R_", "M'", "S.", "S'", "(P)M")
 */
export function parseSwar(input: string): SwarToken {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      raw: '',
      note: '',
      octave: 'mid',
      isKomal: false,
      isTeevra: false,
      isKan: false,
      isSustain: false,
    };
  }

  if (trimmed === '-' || trimmed === '—' || trimmed === '–') {
    return {
      raw: trimmed,
      note: '—',
      octave: 'mid',
      isKomal: false,
      isTeevra: false,
      isKan: false,
      isSustain: true,
    };
  }

  let octave: Octave = 'mid';
  let isKan = false;
  let text = trimmed;

  // Check grace note
  if (text.startsWith('(') && text.endsWith(')')) {
    isKan = true;
    text = text.slice(1, -1);
  }

  // Check octave indicators
  // Low (Mandra): ends with . or contains dot below \u0323 or starts with .
  if (text.includes('.') || text.includes('\u0323') || text.toLowerCase().startsWith('l:')) {
    octave = 'low';
    text = text.replace(/l:/gi, '').replace(/\./g, '').replace(/\u0323/g, '');
  }
  // High (Taar): ends with ' (on S/R/G/P/D/N) or * or contains dot above \u0307 or starts with h:
  else if (
    text.endsWith("'") && !text.toUpperCase().startsWith('M') ||
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
  let isKomal = false;
  let isTeevra = false;

  if (text.toUpperCase() === "M'" || text === "M#" || text === "m'" || text === "M\u0301") {
    isTeevra = true;
    text = 'M';
  } else if (text.includes('_') || text.includes('\u0331')) {
    isKomal = true;
    text = text.replace(/[_|\u0331]/g, '').toUpperCase();
  } else if (['r', 'g', 'd', 'n'].includes(text)) {
    // lowercase commonly denotes komal
    isKomal = true;
    text = text.toUpperCase();
  } else {
    text = text.toUpperCase();
  }

  return {
    raw: trimmed,
    note: text,
    octave,
    isKomal,
    isTeevra,
    isKan,
    isSustain: false,
  };
}

/**
 * Returns color according to user's Gurmat Sangeet sheet specification:
 * Low / Mandra -> Cyan / Sky Blue
 * Mid / Madhya -> Black / Slate in Light Mode, White / Slate-50 in Dark Mode
 * High / Taar -> Crimson / Red
 */
export function getOctaveColor(octave: Octave, isDarkMode = false): string {
  switch (octave) {
    case 'low':
      return isDarkMode ? '#38bdf8' : '#0284c7'; // Cyan / Sky Blue
    case 'high':
      return isDarkMode ? '#fb7185' : '#dc2626'; // Red
    case 'mid':
    default:
      return isDarkMode ? '#f8fafc' : '#0f172a'; // Crisp White in dark mode, Deep Slate in light mode
  }
}

/**
 * Returns Tailwind CSS utility classes for theme-adaptive Swar note colors.
 * Automatically adapts between Light and Dark mode without inline overrides.
 */
export function getOctaveColorClass(octave: Octave): string {
  switch (octave) {
    case 'low':
      return 'text-sky-600 dark:text-sky-400';
    case 'high':
      return 'text-rose-600 dark:text-rose-400';
    case 'mid':
    default:
      return 'text-slate-900 dark:text-slate-50';
  }
}

