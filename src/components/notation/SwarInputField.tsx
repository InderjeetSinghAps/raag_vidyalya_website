'use client';

import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { SwarDisplay } from './SwarDisplay';
import { Language, mapPhysicalKeyToSwar } from '@/lib/swarUtils';

export interface SwarInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isActive?: boolean;
  onFocus?: () => void;
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
 * - Komal swars (R_, G_, D_, N_) display with a crisp, authentic horizontal line directly UNDER the letter
 * - Never shows a separate underscore '_' character
 * - Supports physical keyboard shortcuts, SwarKeyboard clicks, and normal typing
 * - Includes animated blinking caret when active/focused
 */
export const SwarInputField = forwardRef<HTMLInputElement, SwarInputFieldProps>(
  (
    {
      value,
      onChange,
      placeholder = '',
      isActive = false,
      onFocus,
      onClick,
      onKeyDown,
      className = '',
      language,
      isDarkMode = false,
      singleNote = false,
      autoFocus = false,
      id,
      name,
    },
    ref
  ) => {
    const internalInputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    useImperativeHandle(ref, () => internalInputRef.current as HTMLInputElement);

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const handleClick = () => {
      internalInputRef.current?.focus();
      onClick?.();
    };

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
        } else {
          // In phrase mode, if at the end of phrase, smartly backspace the last swar token
          const input = internalInputRef.current;
          if (input && input.selectionStart === value.length && input.selectionEnd === value.length) {
            e.preventDefault();
            const trimmed = value.trimEnd();
            const lastSpaceIdx = trimmed.lastIndexOf(' ');
            const nextVal = lastSpaceIdx >= 0 ? trimmed.substring(0, lastSpaceIdx + 1) : '';
            onChange(nextVal);
            return;
          }
        }
      }

      // Check physical keyboard mapping for Swar (e.g. s -> S, Shift+r -> R_, etc.)
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
          onChange(before + inserted + after);
          const newPos = start + inserted.length;
          setTimeout(() => {
            input?.setSelectionRange(newPos, newPos);
          }, 0);
        }
      }
    };

    const isFieldActive = isActive || isFocused;
    const hasValue = Boolean(value && value.trim().length > 0);

    return (
      <div
        onClick={handleClick}
        className={`relative flex items-center min-h-[38px] cursor-text select-none overflow-hidden transition-all duration-150 ${className}`}
      >
        {/* Invisible real HTML input to capture focus, cursor, paste, and physical typing */}
        <input
          ref={internalInputRef}
          id={id}
          name={name}
          type="text"
          value={value}
          autoFocus={autoFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleInternalKeyDown}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10 p-0 m-0 border-0 focus:outline-none"
          tabIndex={0}
        />

        {/* Visual Layer: Renders true classical Hindustani notation */}
        <div className="w-full flex items-center justify-start pointer-events-none overflow-x-auto no-scrollbar">
          {hasValue ? (
            <div className="flex items-center">
              <SwarDisplay
                value={value}
                language={language}
                isDarkMode={isDarkMode}
                className="leading-none text-current"
              />
              {/* Blinking caret cursor when active */}
              {isFieldActive && (
                <span className="inline-block w-[2px] h-[1.15em] bg-amber-500 dark:bg-amber-400 animate-pulse ml-0.5 align-middle rounded-full shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              )}
            </div>
          ) : (
            <div className="flex items-center text-slate-400 dark:text-slate-500 font-normal text-xs">
              <span>{placeholder}</span>
              {isFieldActive && (
                <span className="inline-block w-[2px] h-[1.15em] bg-amber-500 dark:bg-amber-400 animate-pulse ml-1 align-middle rounded-full shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SwarInputField.displayName = 'SwarInputField';
