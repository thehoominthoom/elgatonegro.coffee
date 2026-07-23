"use client";

import { useRef, useCallback } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip everything except digits from a string. */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Format a digit string as (XXX) XXX-XXXX for display. */
function formatUS(digits: string): string {
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

/**
 * Convert a display-formatted US phone to E.164 (+1XXXXXXXXXX).
 * Returns empty string if fewer than 10 digits.
 */
function toE164(digits: string): string {
  if (digits.length < 10) return "";
  return `+1${digits.slice(0, 10)}`;
}

/**
 * Parse an incoming value (E.164, formatted, or raw digits) into a
 * 10-digit-max digit string for internal use.
 */
function parseIncoming(value: string): string {
  const raw = digitsOnly(value);
  // If it starts with country code "1" and has 11 digits, strip the leading 1
  if (raw.length === 11 && raw.startsWith("1")) return raw.slice(1);
  return raw.slice(0, 10);
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface PhoneInputProps {
  /** Form field name — the hidden input submits E.164 format under this name. */
  name: string;
  /** Initial value — accepts E.164, formatted, or raw digits. */
  defaultValue?: string;
  /** HTML id for label association. Defaults to `name`. */
  id?: string;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PhoneInput({
  name,
  defaultValue = "",
  id,
  disabled,
}: PhoneInputProps) {
  const initialDigits = parseIncoming(defaultValue);
  const hiddenRef = useRef<HTMLInputElement>(null);

  const handleInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const raw = digitsOnly(input.value).slice(0, 10);
      const formatted = formatUS(raw);

      input.value = formatted;
      // Always place cursor at end — simplest reliable behavior for masked input
      input.setSelectionRange(formatted.length, formatted.length);

      // Sync hidden input with E.164 value
      if (hiddenRef.current) {
        hiddenRef.current.value = toE164(raw);
      }
    },
    []
  );

  return (
    <>
      <input
        type="tel"
        id={id ?? name}
        defaultValue={formatUS(initialDigits)}
        onInput={handleInput}
        disabled={disabled}
        placeholder="(615) 555-1234"
        autoComplete="tel-national"
        className="w-full px-3 py-2 bg-brand-grey border border-brand-black/15 rounded-sm font-sans text-sm text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-grey transition-colors"
      />
      <input
        ref={hiddenRef}
        type="hidden"
        name={name}
        defaultValue={toE164(initialDigits)}
      />
    </>
  );
}
