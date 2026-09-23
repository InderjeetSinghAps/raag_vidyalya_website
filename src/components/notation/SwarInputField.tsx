'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Language, mapPhysicalKeyToSwar, normalizeSwarInput } from '@/lib/swarUtils';

export interface SwarInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isActive?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  language?: Language;
  isDarkMode?: boolean;
  singleNote?: boolean;
  autoFocus?: boolean;
  id?: string;
  name?: string;
}

/**
 * Rich Classical Swar Input Field.
 * Renders authentic Indian classical & Gurmat Sangeet swars where:
 * - Komal swars (R̲, G̲, D̲, N̲) display with a crisp, authentic horizontal line directly UNDER the letter
 * - Never shows a separate underscore '_' character
 * - Supports physical keyboard shortcuts, SwarKeyboard clicks, and normal typing
 * - Full native cursor placement, selection, and editing
 */
export const SwarInputField = forwardRef<HTMLInputElement, SwarInputFieldProps>(
  (
    {
      value,
      onChange,
      placeholder = '',
      isActive = false,
      onFocus,
      onBlur,
      onClick,
      onKeyDown,
      className = '',
      singleNote = false,
      autoFocus = false,
      id,
      name,
    },
    ref
  ) => {
    const internalInputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => internalInputRef.current as HTMLInputElement);

    const handleInternalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Let parent custom keydown execute first
      if (onKeyDown) {
        onKeyDown(e);
        if (e.defaultPrevented) return;
      }

      // Allow navigation keys
      if (['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        return;
      }

      // Backspace / Delete
      if (e.key === 'Backspace' || e.key === 'Delete') {
        if (singleNote) {
          e.preventDefault();
          onChange('');
          return;
        }
      }

      // Check physical keyboard mapping for Swar (e.g. s -> Sa, Shift+r -> Komal Re, etc.)
      const mapped = mapPhysicalKeyToSwar(e.key, e.shiftKey);
      if (mapped) {
        e.preventDefault();
        if (singleNote) {
          onChange(mapped);
        } else {
          const input = internalInputRef.current;
          const start = input?.selectionStart ?? value.length;
          const end = input?.selectionEnd ?? value.length;
          const before = value.substring(0, start);
          const after = value.substring(end);
          const needsSpace = before.length > 0 && !before.endsWith(' ') && !before.endsWith(',');
          const inserted = (needsSpace ? ' ' : '') + mapped + ' ';
          const nextVal = normalizeSwarInput(before + inserted + after);
          onChange(nextVal);
          const newPos = start + inserted.length;
          setTimeout(() => {
            input?.setSelectionRange(newPos, newPos);
          }, 0);
        }
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const normalized = normalizeSwarInput(e.target.value);
      onChange(normalized);
    };

    return (
      <input
        ref={internalInputRef}
        id={id}
        name={name}
        type="text"
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}
        onClick={onClick}
        onKeyDown={handleInternalKeyDown}
        onChange={handleChange}
        className={className}
      />
    );
  }
);

SwarInputField.displayName = 'SwarInputField';
