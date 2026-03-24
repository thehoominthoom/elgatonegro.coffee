"use client";

import { useRef, useState, useCallback } from "react";
import { type ObjectInputProps, set, useClient } from "sanity";
import { Stack, Button, Card, Text, Spinner, Badge } from "@sanity/ui";
import { UploadIcon } from "@sanity/icons";
import heic2any from "heic2any";
import { apiVersion } from "../env";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isHeicFile(file: File): boolean {
  const ext = file.name.toLowerCase();
  if (ext.endsWith(".heic") || ext.endsWith(".heif")) return true;
  if (file.type === "image/heic" || file.type === "image/heif") return true;
  return false;
}

function deriveJpegName(originalName: string): string {
  return originalName.replace(/\.heic$/i, ".jpg").replace(/\.heif$/i, ".jpg");
}

// ─── Component ───────────────────────────────────────────────────────────────

export function HeicImageInput(props: ObjectInputProps) {
  const { renderDefault, onChange } = props;
  const client = useClient({ apiVersion });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "converting" | "uploading">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Reset input so the same file can be re-selected
      e.target.value = "";

      if (!isHeicFile(file)) {
        setError("Selected file is not a HEIC/HEIF image.");
        return;
      }

      setError(null);

      try {
        // Convert HEIC to JPEG
        setStatus("converting");
        const result = await heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 0.85,
        });

        const jpegBlob = Array.isArray(result) ? result[0] : result;

        // Upload to Sanity
        setStatus("uploading");
        const asset = await client.assets.upload("image", jpegBlob, {
          filename: deriveJpegName(file.name),
          contentType: "image/jpeg",
        });

        // Patch the field value with the uploaded asset reference
        onChange(
          set({
            _type: "image",
            asset: {
              _type: "reference",
              _ref: asset._id,
            },
          }),
        );

        setStatus("idle");
      } catch (err) {
        setStatus("idle");
        setError(
          err instanceof Error ? err.message : "Failed to convert HEIC image.",
        );
      }
    },
    [client, onChange],
  );

  return (
    <Stack space={3}>
      {renderDefault(props)}

      <Card padding={3} border radius={2}>
        <Stack space={3}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Badge tone="primary" fontSize={0}>
              HEIC supported
            </Badge>
            <Text size={1} muted>
              Upload .heic or .heif files — they are converted to JPEG
              automatically.
            </Text>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".heic,.heif,image/heic,image/heif"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          {status === "idle" && (
            <Button
              text="Upload HEIC / HEIF"
              icon={UploadIcon}
              mode="ghost"
              tone="primary"
              onClick={() => fileInputRef.current?.click()}
            />
          )}

          {status === "converting" && (
            <div
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Spinner muted />
              <Text size={1} muted>
                Converting HEIC to JPEG...
              </Text>
            </div>
          )}

          {status === "uploading" && (
            <div
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Spinner muted />
              <Text size={1} muted>
                Uploading to Sanity...
              </Text>
            </div>
          )}

          {error && (
            <Card padding={2} tone="critical" radius={2}>
              <Text size={1}>{error}</Text>
            </Card>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
