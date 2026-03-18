"use client";

import { useEffect, useRef } from "react";
import { set, unset, PatchEvent, type ObjectInputProps } from "sanity";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { Stack, Text, Card } from "@sanity/ui";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LocationValue {
  locationName?: string;
  displayAddress?: string;
  mapLink?: string;
  placeId?: string;
}

type GooglePlacesInputProps = ObjectInputProps<LocationValue>;

// ─── Component ────────────────────────────────────────────────────────────────

export function GooglePlacesInput(props: GooglePlacesInputProps) {
  const { value, onChange, readOnly } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      // Use a microtask to avoid calling setState synchronously inside the effect body
      Promise.resolve().then(() =>
        setApiError("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set.")
      );
      return;
    }

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
          if (!place.place_id) return;

          const displayAddress = place.formatted_address ?? "";
          const mapLink = `https://www.google.com/maps/place/?q=place_id:${place.place_id}`;
          const placeId = place.place_id;

          onChange(
            PatchEvent.from([
              set(displayAddress, ["displayAddress"]),
              set(mapLink, ["mapLink"]),
              set(placeId, ["placeId"]),
            ])
          );
        });
      })
      .catch(() => {
        setApiError("Failed to load Google Maps API.");
      });

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [onChange]);

  const handleLocationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(
      PatchEvent.from([
        e.target.value ? set(e.target.value, ["locationName"]) : unset(["locationName"]),
      ])
    );
  };

  const handleClear = () => {
    onChange(
      PatchEvent.from([
        unset(["displayAddress"]),
        unset(["mapLink"]),
        unset(["placeId"]),
      ])
    );
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <Stack space={3}>
      {/* Location Name override */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--card-fg-color)",
            fontFamily: "inherit",
          }}
        >
          Location Name
        </label>
        <span
          style={{
            fontSize: "11px",
            color: "var(--card-muted-fg-color, var(--card-fg-color))",
            opacity: 0.7,
            fontFamily: "inherit",
          }}
        >
          Optional display name (e.g. &quot;The Exchange Running Collective&quot;). If blank, the Google address is shown.
        </span>
        <input
          value={value?.locationName ?? ""}
          onChange={handleLocationNameChange}
          placeholder="Optional venue or location name…"
          readOnly={readOnly ?? false}
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "13px",
            fontFamily: "inherit",
            border: "1px solid var(--card-border-color)",
            borderRadius: "3px",
            background: "var(--card-bg-color)",
            color: "var(--card-fg-color)",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Address search — plain uncontrolled input. Autocomplete widget owns the DOM node
          directly. Using @sanity/ui TextInput causes the controlled value to block keystrokes
          because Studio intercepts synthetic events on its custom input component. */}
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <label
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color: "var(--card-fg-color)",
            fontFamily: "inherit",
          }}
        >
          Address (Google Places)
        </label>
        <input
          ref={inputRef}
          defaultValue={value?.displayAddress ?? ""}
          placeholder="Search for an address or venue…"
          readOnly={readOnly ?? false}
          onBlur={(e) => {
            if (!e.currentTarget.value.trim()) handleClear();
          }}
          autoComplete="off"
          onKeyDown={(e) => e.stopPropagation()}
          onKeyUp={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            padding: "8px",
            fontSize: "13px",
            fontFamily: "inherit",
            border: "1px solid var(--card-border-color)",
            borderRadius: "3px",
            background: "var(--card-bg-color)",
            color: "var(--card-fg-color)",
            boxSizing: "border-box",
          }}
        />
      </div>

      {apiError && (
        <Card padding={3} tone="critical" radius={2}>
          <Text size={1}>{apiError}</Text>
        </Card>
      )}

      {value?.mapLink && (
        <Text size={1} muted>
          <a
            href={value.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit" }}
          >
            View on Google Maps →
          </a>
        </Text>
      )}
    </Stack>
  );
}
