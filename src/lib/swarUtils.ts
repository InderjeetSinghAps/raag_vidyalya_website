export type Octave = 'low' | 'mid' | 'high';
export type Language = 'english' | 'hindi' | 'punjabi';

export interface SwarToken {
  raw: string;
  note: string;
  octave: Octave;
  isKomal: boolean;
  isTeevra: boolean;
  isKan: boolean; // grace note
  isSustain: boolean;
  sur?: Sur;
}

/**
 * Classical Sur enumeration matching Gurmat Sangeet / Hindustani 12-swar standard
 */
export enum Sur {
  sa = 'sa',
  reKomal = 'reKomal',
  re = 're',
  gaKomal = 'gaKomal',
  ga = 'ga',
  ma = 'ma',
  maTeevra = 'maTeevra',
  pa = 'pa',
  dhaKomal = 'dhaKomal',
  dha = 'dha',
  niKomal = 'niKomal',
  ni = 'ni',
}

/**
 * Authentic Gurmat Sangeet Punjabi (Gurmukhi) Swar symbols
 */
export const PUNJABI_SUR_MAP: Record<Sur, string> = {
  [Sur.sa]: 'ਸ',
  [Sur.reKomal]: 'ਰੁ',
  [Sur.re]: 'ਰ',
  [Sur.gaKomal]: 'ਗੁ',
  [Sur.ga]: 'ਗ',
  [Sur.ma]: 'ਮ',
  [Sur.maTeevra]: 'ਮੇ',
  [Sur.pa]: 'ਪ',
  [Sur.dhaKomal]: 'ਧੁ',
  [Sur.dha]: 'ਧ',
  [Sur.niKomal]: 'ਨੁ',
  [Sur.ni]: 'ਨ',
};

/**
 * Authentic Classical Hindi (Devanagari) Swar symbols with Vedic Komal/Teevra marks
 */
export const HINDI_SUR_MAP: Record<Sur, string> = {
  [Sur.sa]: 'स',
  [Sur.reKomal]: 'रे॒',
  [Sur.re]: 'रे',
  [Sur.gaKomal]: 'ग॒',
  [Sur.ga]: 'ग',
  [Sur.ma]: 'म',
  [Sur.maTeevra]: 'म॑',
  [Sur.pa]: 'प',
  [Sur.dhaKomal]: 'ध॒',
  [Sur.dha]: 'ध',
  [Sur.niKomal]: 'नि॒',
  [Sur.ni]: 'नि',
};

/**
 * Standard English Bhatkhande Swar symbols
 */
export const ENGLISH_SUR_MAP: Record<Sur, string> = {
  [Sur.sa]: 'Sa',
  [Sur.reKomal]: 're',
  [Sur.re]: 'Re',
  [Sur.gaKomal]: 'ga',
  [Sur.ga]: 'Ga',
  [Sur.ma]: 'Ma',
  [Sur.maTeevra]: "Ma'",
  [Sur.pa]: 'Pa',
  [Sur.dhaKomal]: 'dha',
  [Sur.dha]: 'Dha',
  [Sur.niKomal]: 'ni',
  [Sur.ni]: 'Ni',
};

/**
 * Maps any note string and komal/teevra flags to the canonical Sur enum.
 */
export function getSurFromNote(
  note: string,
  isKomal = false,
  isTeevra = false
): Sur | null {
  const clean = note.trim();
  if (!clean) return null;

  // Direct Punjabi matches
  if (clean === 'ਸ') return Sur.sa;
  if (clean === 'ਰੁ') return Sur.reKomal;
  if (clean === 'ਰ') return isKomal ? Sur.reKomal : Sur.re;
  if (clean === 'ਗੁ') return Sur.gaKomal;
  if (clean === 'ਗ') return isKomal ? Sur.gaKomal : Sur.ga;
  if (clean === 'ਮ') return isTeevra ? Sur.maTeevra : Sur.ma;
  if (clean === 'ਮੇ') return Sur.maTeevra;
  if (clean === 'ਪ') return Sur.pa;
  if (clean === 'ਧੁ') return Sur.dhaKomal;
  if (clean === 'ਧ') return isKomal ? Sur.dhaKomal : Sur.dha;
  if (clean === 'ਨੁ') return Sur.niKomal;
  if (clean === 'ਨ') return isKomal ? Sur.niKomal : Sur.ni;

  // Direct Hindi matches
  if (clean === 'स') return Sur.sa;
  if (clean === 'रे॒' || (clean === 'रे' && isKomal)) return Sur.reKomal;
  if (clean === 'रे') return Sur.re;
  if (clean === 'ग॒' || (clean === 'ग' && isKomal)) return Sur.gaKomal;
  if (clean === 'ग') return Sur.ga;
  if (clean === 'म॑' || (clean === 'म' && isTeevra)) return Sur.maTeevra;
  if (clean === 'म') return Sur.ma;
  if (clean === 'प') return Sur.pa;
  if (clean === 'ध॒' || (clean === 'ध' && isKomal)) return Sur.dhaKomal;
  if (clean === 'ध') return Sur.dha;
  if (clean === 'नि॒' || (clean === 'नि' && isKomal)) return Sur.niKomal;
  if (clean === 'नि') return Sur.ni;

  // Exact English notation matches
  if (clean === 'Sa' || clean.toUpperCase() === 'S') return Sur.sa;
  if (clean === 're') return Sur.reKomal;
  if (clean === 'Re') return isKomal ? Sur.reKomal : Sur.re;
  if (clean === 'ga') return Sur.gaKomal;
  if (clean === 'Ga') return isKomal ? Sur.gaKomal : Sur.ga;
  if (clean === "Ma'" || clean === 'maTeevra') return Sur.maTeevra;
  if (clean === 'Ma') return isTeevra ? Sur.maTeevra : Sur.ma;
  if (clean === 'Pa' || clean.toUpperCase() === 'P') return Sur.pa;
  if (clean === 'dha') return Sur.dhaKomal;
  if (clean === 'Dha') return isKomal ? Sur.dhaKomal : Sur.dha;
  if (clean === 'ni') return Sur.niKomal;
  if (clean === 'Ni') return isKomal ? Sur.niKomal : Sur.ni;

  // Single-letter Bhatkhande notes: S, R, G, M, P, D, N
  const upper = clean.toUpperCase();
  if (upper === 'S') return Sur.sa;
  if (upper === 'R') return isKomal ? Sur.reKomal : Sur.re;
  if (upper === 'G') return isKomal ? Sur.gaKomal : Sur.ga;
  if (upper === 'M') return isTeevra ? Sur.maTeevra : Sur.ma;
  if (upper === 'P') return Sur.pa;
  if (upper === 'D') return isKomal ? Sur.dhaKomal : Sur.dha;
  if (upper === 'N') return isKomal ? Sur.niKomal : Sur.ni;

  return null;
}

/**
 * Returns symbol for given Sur in selected language.
 */
export function getSurSymbol(sur: Sur, lang: Language): string {
  switch (lang) {
    case 'punjabi':
      return PUNJABI_SUR_MAP[sur];
    case 'hindi':
      return HINDI_SUR_MAP[sur];
    case 'english':
    default:
      return ENGLISH_SUR_MAP[sur];
  }
}

/**
 * Physical keyboard shortcut mapping for Windows and Mac:
 * s -> Sa
 * r -> Re (Shuddh) | Shift + r -> Komal Re (R_)
 * g -> Ga (Shuddh) | Shift + g -> Komal Ga (G_)
 * m -> Ma (Shuddh) | Shift + m -> Teevra Ma (M')
 * p -> Pa
 * d -> Dha (Shuddh) | Shift + d -> Komal Dha (D_)
 * n -> Ni (Shuddh) | Shift + n -> Komal Ni (N_)
 * - -> Sustain
 */
export function mapPhysicalKeyToSwar(key: string, shiftKey: boolean): string | null {
  const k = key.toLowerCase();
  if (k === 's') return 'S';
  if (k === 'p') return 'P';
  if (k === 'r') return shiftKey ? 'R_' : 'R';
  if (k === 'g') return shiftKey ? 'G_' : 'G';
  if (k === 'm') return shiftKey ? "M'" : 'M';
  if (k === 'd') return shiftKey ? 'D_' : 'D';
  if (k === 'n') return shiftKey ? 'N_' : 'N';
  if (key === '-' || key === '—') return '-';
  return null;
}

/**
 * Parses an individual swar string (e.g. "S", "R", "R_", "M'", "S.", "S'", "(P)M", "ਸ", "ਰੁ", "रे॒")
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
  // Low (Mandra): ends with . or contains dot below \u0323 or starts with l:
  if (text.includes('.') || text.includes('\u0323') || text.toLowerCase().startsWith('l:')) {
    octave = 'low';
    text = text.replace(/l:/gi, '').replace(/\./g, '').replace(/\u0323/g, '');
  }
  // High (Taar): ends with ' (on S/R/G/P/D/N) or * or contains dot above \u0307 or starts with h:
  else if (
    (text.endsWith("'") && !text.toUpperCase().startsWith('M') && text !== "ਮੇ" && text !== "म॑") ||
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

  // Check Punjabi specific symbols
  if (['ਰੁ', 'ਗੁ', 'ਧੁ', 'ਨੁ'].includes(text)) {
    isKomal = true;
  } else if (text === 'ਮੇ') {
    isTeevra = true;
  }
  // Check Hindi specific symbols with anudatta or udatta
  else if (text.includes('\u0952') || ['रे॒', 'ग॒', 'ध॒', 'नि॒'].includes(text)) {
    isKomal = true;
    text = text.replace(/\u0952/g, '');
  } else if (text.includes('\u0951') || text === 'म॑') {
    isTeevra = true;
    text = text.replace(/\u0951/g, '');
  }
  // Check English / Bhatkhande symbols
  else if (text.toUpperCase() === "M'" || text === "M#" || text === "m'" || text === "M\u0301") {
    isTeevra = true;
    text = 'M';
  } else if (text.includes('_') || text.includes('\u0331')) {
    isKomal = true;
    text = text.replace(/[_|\u0331]/g, '').toUpperCase();
  } else if (['re', 'ga', 'dha', 'ni'].includes(text)) {
    // English lowercase words from enum definition denote komal
    isKomal = true;
    text = text.toUpperCase();
  } else {
    // Shuddh default (r -> R, g -> G, etc.)
    text = text.toUpperCase();
  }

  const sur = getSurFromNote(text, isKomal, isTeevra) || undefined;

  return {
    raw: trimmed,
    note: text,
    octave,
    isKomal,
    isTeevra,
    isKan,
    isSustain: false,
    sur,
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

/**
 * Converts a raw swar string (e.g. "S", "R_", "M'", "S.", "S'") into the target language script.
 */
export function formatSwarToLanguage(rawSwar: string, lang: Language): string {
  const trimmed = (rawSwar || '').trim();
  if (!trimmed || trimmed === '-' || trimmed === '—' || trimmed === '–') return '—';

  const token = parseSwar(trimmed);
  if (token.isSustain || !token.note) return '—';

  const sur = token.sur || getSurFromNote(token.note, token.isKomal, token.isTeevra);
  if (!sur) return rawSwar;

  let symbol = getSurSymbol(sur, lang);

  // Octave indicators
  if (token.octave === 'low') {
    symbol = `${symbol}.`;
  } else if (token.octave === 'high') {
    symbol = `${symbol}'`;
  }

  if (token.isKan) {
    symbol = `(${symbol})`;
  }

  return symbol;
}

/**
 * Converts an entire phrase or sentence of Swars (e.g. "S R G_ M' P D_ N S'") to target language script.
 */
export function formatPhraseToLanguage(phrase: string, lang: Language): string {
  if (!phrase) return '';
  return phrase
    .split(/([,\s]+)/)
    .map((seg) => {
      if (!seg.trim() || seg === ',') return seg;
      return formatSwarToLanguage(seg, lang);
    })
    .join('');
}

