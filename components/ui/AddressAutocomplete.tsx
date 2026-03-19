"use client";

import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AddressFields {
  address1: string;
  city: string;
  zoneCode: string;
  zip: string;
  territoryCode: string;
}

interface AddressAutocompleteProps {
  /** Called when the user selects a place from the dropdown. */
  onPlaceSelect: (fields: AddressFields) => void;
  /** Initial value for the address1 input. */
  defaultValue?: string;
  disabled?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string,
  variant: "long_name" | "short_name" = "long_name"
): string {
  const match = components.find((c) => c.types.includes(type));
  return match ? match[variant] : "";
}

function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[]
): AddressFields {
  const streetNumber = getComponent(components, "street_number");
  const route = getComponent(components, "route");
  const address1 = [streetNumber, route].filter(Boolean).join(" ");

  const city =
    getComponent(components, "locality") ||
    getComponent(components, "sublocality") ||
    getComponent(components, "sublocality_level_1");

  const zoneCode = getComponent(
    components,
    "administrative_area_level_1",
    "short_name"
  );

  const zip = getComponent(components, "postal_code");
  const territoryCode = getComponent(components, "country", "short_name");

  return { address1, city, zoneCode, zip, territoryCode };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AddressAutocomplete({
  onPlaceSelect,
  defaultValue = "",
  disabled,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !inputRef.current) return;

    setOptions({ key: apiKey, v: "weekly" });

    importLibrary("places")
      .then(() => {
        if (!inputRef.current) return;

        autocompleteRef.current = new google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["address"], componentRestrictions: { country: "us" } }
        );

        // Request only the fields we need
        autocompleteRef.current.setFields([
          "address_components",
          "formatted_address",
        ]);

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current!.getPlace();
          if (!place.address_components) return;

          const fields = parseAddressComponents(place.address_components);

          // Update the visible input with the street address
          if (inputRef.current) {
            inputRef.current.value = fields.address1;
          }

          onPlaceSelect(fields);
        });
      })
      .catch(() => {
        // API failed — the plain input remains functional
      });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
    // onPlaceSelect identity is stable (defined inline in parent with useCallback), safe to omit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  return (
    <input
      ref={inputRef}
      id="address1"
      name="address1"
      type="text"
      required
      defaultValue={defaultValue}
      disabled={disabled}
      placeholder="Start typing an address..."
      autoComplete="off"
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
      className="w-full px-3 py-2 bg-brand-grey border border-brand-black/15 rounded-sm font-sans text-sm text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-orange transition-colors"
    />
  );
}
