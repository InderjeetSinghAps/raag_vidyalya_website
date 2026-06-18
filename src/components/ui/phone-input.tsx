'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { COUNTRY_CODES } from '@/lib/country-codes';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { getPhoneLimits } from '@/lib/phone-validation';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  error?: string;
  placeholder?: string;
  disabledCountryCode?: boolean;
  onValidate?: (error: string | undefined) => void;
}

export function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  error,
  placeholder = 'Enter phone number',
  disabledCountryCode = false,
  onValidate,
}: PhoneInputProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const ref = useRef<HTMLDivElement>(null);

  const selected =
    COUNTRY_CODES.find((c) => c.code === countryCode) ??
    COUNTRY_CODES.find((c) => c.code === '+91')!;

  const filtered = search
    ? COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.includes(search) ||
          c.isoCode.toLowerCase().includes(search.toLowerCase()),
      )
    : COUNTRY_CODES;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const dropdownHeight = 320;
    setDropdownPosition(spaceBelow >= dropdownHeight ? 'bottom' : 'top');
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <div className="flex h-11 items-center rounded-lg border border-border bg-background px-3 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
        <button
          type="button"
          onClick={() => !disabledCountryCode && setOpen(!open)}
          disabled={disabledCountryCode}
          className={cn(
            'flex items-center gap-1.5 shrink-0 pr-3',
            disabledCountryCode && 'opacity-50',
          )}
        >
          <span className="text-base leading-none">{selected.flag}</span>
          <span className="text-sm font-medium text-foreground">
            {selected.code}
          </span>
          <ChevronDown className="size-4 text-muted-foreground shrink-0" />
        </button>

        <div className="h-5 w-px bg-border" />

        <input
          type="tel"
          value={value}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, '');
            if (digits.length <= selected.maxLength) {
              onChange(digits);
              const limits = getPhoneLimits(countryCode);
              if (limits) {
                if (digits.length === 0) {
                  onValidate?.('Phone number is required');
                } else if (digits.length < limits.minLength) {
                  onValidate?.(`Phone number must be at least ${limits.minLength} digits`);
                } else {
                  onValidate?.(undefined);
                }
              }
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground ml-3"
        />
      </div>

      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}

      {open && (
        <div className={`absolute left-0 z-50 w-72 rounded-xl border border-border bg-card shadow-xl max-h-80 overflow-hidden ${
          dropdownPosition === 'bottom' ? 'top-full mt-1' : 'bottom-full mb-1'
        }`}>
          <div className="p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-10 rounded-lg border border-border bg-background"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filtered.map((country) => (
              <button
                key={country.isoCode + country.code}
                type="button"
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => {
                  const newLimits = getPhoneLimits(country.code);
                  if (newLimits && value.length > newLimits.maxLength) {
                    onChange(value.slice(0, newLimits.maxLength));
                  }
                  onCountryCodeChange(country.code);
                  setOpen(false);
                  setSearch('');
                }}
              >
                <span className="text-base leading-none">{country.flag}</span>
                <span className="flex-1 text-left">{country.name}</span>
                <span className="text-muted-foreground text-xs">
                  {country.code}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="px-3 py-4 text-sm text-muted-foreground text-center">
                No results
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
