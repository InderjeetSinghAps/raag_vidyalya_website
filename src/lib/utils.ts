import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const GURMUKHI_RE = /[\u0A00-\u0A7F]/;

export function stripEn(value: string): string {
  if (!GURMUKHI_RE.test(value)) return value;

  if (value.includes(' / ')) {
    return value.split(' / ').find((p) => GURMUKHI_RE.test(p))?.trim() ?? value;
  }

  let last = -1;
  for (let i = 0; i < value.length; i++) {
    if (GURMUKHI_RE.test(value[i])) last = i;
  }
  return last >= 0 ? value.slice(0, last + 1).trim() : value;
}
