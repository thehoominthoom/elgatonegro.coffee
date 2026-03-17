"use client";

import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlacesInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PlacesInput({
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: PlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Keep the DOM value in sync when the controlled value changes externally
  // (e.g. form reset). Skip if the autocomplete widget is mid-interaction.
  useEffect(() => {
    if (inputRef.current && document.activeElement !== inputRef.current) {
      inputRef.current.value = value;
    }
  }, [value]);

  useEffect(() => {
    if (!apiKey) return;

    setOptions({ key: apiKey, v: "weekly" });

    importLibrary("places")
      .then(() => {
        if (!inputRef.current) return;

        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["establishment", "geocode"] }
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current!.getPlace();
          onChange(place.formatted_address ?? "");
        });
      })
      .catch(() => {
        // API failed — the plain input remains functional, no user-visible error
      });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
    // onChange identity is stable (react-hook-form setValue), safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  // If no API key, render a plain text input — identical appearance, no Maps JS
  if (!apiKey) {
    return (
      <input
        ref={inputRef}
        type="text"
        defaultValue={value}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(className)}
        onBlur={(e) => onChange(e.currentTarget.value)}
        onChange={(e) => onChange(e.currentTarget.value)}
        autoComplete="off"
      />
    );
  }

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={value}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(className)}
      autoComplete="off"
      // Prevent Sanity Studio / any parent from intercepting keystrokes
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
      // onKeyPress is deprecated but kept for legacy browser compat (matches Sanity component)
      onKeyPress={(e) => e.stopPropagation()}
    />
  );
}
