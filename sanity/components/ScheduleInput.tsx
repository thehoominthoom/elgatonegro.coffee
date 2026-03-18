"use client";

import { useState } from "react";
import { set, unset, PatchEvent, useDocumentOperation, useFormValue, type ArrayOfObjectsInputProps } from "sanity";
import { Stack, Text, Card, Button, Label } from "@sanity/ui";
import { generateTimeOptions } from "../schemaTypes/event";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduleDay {
  _key: string;
  date: string;
  openTime: string;
  closeTime: string;
}

type Mode = "single" | "multiday" | "recurring";

type WeekdayName = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
type RecurringPattern = "every" | "first" | "everyother";

const WEEKDAYS: WeekdayName[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeOptions = generateTimeOptions();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nanoid(): string {
  return Math.random().toString(36).slice(2, 10);
}

function toYMD(d: Date): string {
  return d.toLocaleDateString("en-CA", { timeZone: "UTC" });
}

function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d + n));
  return toYMD(date);
}

function daysBetween(start: string, end: string): number {
  const [sy, sm, sd] = start.split("-").map(Number);
  const [ey, em, ed] = end.split("-").map(Number);
  const a = Date.UTC(sy, sm - 1, sd);
  const b = Date.UTC(ey, em - 1, ed);
  return Math.round((b - a) / 86400000);
}

function weekdayIndex(name: WeekdayName): number {
  return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].indexOf(name);
}

function getDayOfWeek(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function isFirstWeekdayOfMonth(dateStr: string): boolean {
  const [, , d] = dateStr.split("-").map(Number);
  return d <= 7;
}

function generateDatesForRange(start: string, end: string): string[] {
  const count = daysBetween(start, end);
  if (count < 0) return [];
  const dates: string[] = [];
  for (let i = 0; i <= count; i++) {
    dates.push(addDays(start, i));
  }
  return dates;
}

function generateRecurringDates(
  pattern: RecurringPattern,
  weekday: WeekdayName,
  endDate: string
): string[] {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/Chicago" });
  const targetDow = weekdayIndex(weekday);
  const dates: string[] = [];

  const count = daysBetween(today, endDate);
  if (count < 0) return [];

  for (let i = 0; i <= count; i++) {
    const dateStr = addDays(today, i);
    const dow = getDayOfWeek(dateStr);

    if (dow !== targetDow) continue;

    if (pattern === "every") {
      dates.push(dateStr);
    } else if (pattern === "first") {
      if (isFirstWeekdayOfMonth(dateStr)) dates.push(dateStr);
    } else if (pattern === "everyother") {
      if (dates.length === 0) {
        dates.push(dateStr);
      } else {
        const last = dates[dates.length - 1];
        if (daysBetween(last, dateStr) >= 14) dates.push(dateStr);
      }
    }
  }

  return dates;
}

function deriveRecurrenceLabel(pattern: RecurringPattern, weekday: WeekdayName): string {
  if (pattern === "every") return `Select ${weekday}s`;
  if (pattern === "first") return `First ${weekday}s`;
  return `Every Other ${weekday}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimeSelect({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.stopPropagation()}
      style={{
        padding: "6px 8px",
        fontSize: "13px",
        fontFamily: "inherit",
        border: "1px solid var(--card-border-color)",
        borderRadius: "3px",
        background: "var(--card-bg-color)",
        color: value ? "var(--card-fg-color)" : "var(--card-muted-fg-color)",
        minWidth: "130px",
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {timeOptions.map((o) => (
        <option key={o.value} value={o.value}>
          {o.title}
        </option>
      ))}
    </select>
  );
}

function DateInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {label && (
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--card-fg-color)", fontFamily: "inherit" }}>
          {label}
        </span>
      )}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
        style={{
          padding: "6px 8px",
          fontSize: "13px",
          fontFamily: "inherit",
          border: "1px solid var(--card-border-color)",
          borderRadius: "3px",
          background: "var(--card-bg-color)",
          color: "var(--card-fg-color)",
        }}
      />
    </div>
  );
}

function ScheduleRow({
  row,
  onUpdate,
  onRemove,
}: {
  row: ScheduleDay;
  onUpdate: (updated: ScheduleDay) => void;
  onRemove: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        flexWrap: "wrap",
        padding: "8px",
        border: "1px solid var(--card-border-color)",
        borderRadius: "3px",
        background: "var(--card-bg-color)",
      }}
    >
      <input
        type="date"
        value={row.date}
        onChange={(e) => onUpdate({ ...row, date: e.target.value })}
        onKeyDown={(e) => e.stopPropagation()}
        style={{
          padding: "5px 8px",
          fontSize: "13px",
          fontFamily: "inherit",
          border: "1px solid var(--card-border-color)",
          borderRadius: "3px",
          background: "var(--card-bg-color)",
          color: "var(--card-fg-color)",
        }}
      />
      <TimeSelect
        value={row.openTime}
        onChange={(v) => onUpdate({ ...row, openTime: v })}
        placeholder="Opens"
      />
      <span style={{ fontSize: "12px", color: "var(--card-muted-fg-color)" }}>–</span>
      <TimeSelect
        value={row.closeTime}
        onChange={(v) => onUpdate({ ...row, closeTime: v })}
        placeholder="Closes"
      />
      <button
        type="button"
        onClick={onRemove}
        onKeyDown={(e) => e.stopPropagation()}
        style={{
          marginLeft: "auto",
          padding: "4px 10px",
          fontSize: "12px",
          fontFamily: "inherit",
          border: "1px solid var(--card-border-color)",
          borderRadius: "3px",
          background: "transparent",
          color: "var(--card-muted-fg-color)",
          cursor: "pointer",
        }}
      >
        Remove
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ScheduleInput(props: ArrayOfObjectsInputProps) {
  const { value = [], onChange } = props;
  const rows = value as unknown as ScheduleDay[];

  const documentId = useFormValue(["_id"]) as string | undefined;
  const documentType = useFormValue(["_type"]) as string | undefined;
  // useDocumentOperation requires a stable non-undefined id + type.
  // Fall back to empty strings — the patch calls below are guarded by the documentId check.
  const { patch } = useDocumentOperation(documentId ?? "", documentType ?? "event");

  const [mode, setMode] = useState<Mode>("single");

  // Single day state
  const [singleDate, setSingleDate] = useState("");
  const [singleOpen, setSingleOpen] = useState("");
  const [singleClose, setSingleClose] = useState("");

  // Multi-day state
  const [multiStart, setMultiStart] = useState("");
  const [multiEnd, setMultiEnd] = useState("");
  const [multiDefaultOpen, setMultiDefaultOpen] = useState("");
  const [multiDefaultClose, setMultiDefaultClose] = useState("");

  // Recurring state
  const [recurPattern, setRecurPattern] = useState<RecurringPattern>("every");
  const [recurWeekday, setRecurWeekday] = useState<WeekdayName>("Saturday");
  const [recurDefaultOpen, setRecurDefaultOpen] = useState("");
  const [recurDefaultClose, setRecurDefaultClose] = useState("");
  const [recurEndDate, setRecurEndDate] = useState("");

  // ── Patch helpers ────────────────────────────────────────────────────────

  function patchRows(updated: ScheduleDay[]) {
    if (updated.length === 0) {
      onChange(PatchEvent.from([unset()]));
    } else {
      onChange(PatchEvent.from([set(updated)]));
    }
  }

  function updateRow(index: number, updated: ScheduleDay) {
    const next = rows.map((r, i) => (i === index ? updated : r));
    patchRows(next);
  }

  function removeRow(index: number) {
    patchRows(rows.filter((_, i) => i !== index));
  }

  // ── Mode A — single day ──────────────────────────────────────────────────

  function applySingle() {
    if (!singleDate || !singleOpen || !singleClose) return;
    patchRows([{ _key: nanoid(), date: singleDate, openTime: singleOpen, closeTime: singleClose }]);
    setSingleDate("");
    setSingleOpen("");
    setSingleClose("");
  }

  // ── Mode B — multi-day ───────────────────────────────────────────────────

  function applyMultiDay() {
    if (!multiStart || !multiEnd || !multiDefaultOpen || !multiDefaultClose) return;
    const dates = generateDatesForRange(multiStart, multiEnd);
    if (!dates.length) return;
    patchRows(
      dates.map((d) => ({
        _key: nanoid(),
        date: d,
        openTime: multiDefaultOpen,
        closeTime: multiDefaultClose,
      }))
    );
  }

  // ── Mode C — recurring ───────────────────────────────────────────────────

  function applyRecurring() {
    if (!recurEndDate || !recurDefaultOpen || !recurDefaultClose) return;
    const dates = generateRecurringDates(recurPattern, recurWeekday, recurEndDate);
    if (!dates.length) return;
    patchRows(
      dates.map((d) => ({
        _key: nanoid(),
        date: d,
        openTime: recurDefaultOpen,
        closeTime: recurDefaultClose,
      }))
    );
    if (documentId) {
      const label = deriveRecurrenceLabel(recurPattern, recurWeekday);
      patch.execute([{ set: { recurrenceLabel: label } }]);
    }
  }

  function clearRecurrenceLabel() {
    if (documentId) {
      patch.execute([{ unset: ["recurrenceLabel"] }]);
    }
  }

  const inputStyle = {
    padding: "6px 8px",
    fontSize: "13px",
    fontFamily: "inherit",
    border: "1px solid var(--card-border-color)",
    borderRadius: "3px",
    background: "var(--card-bg-color)",
    color: "var(--card-fg-color)",
    minWidth: "130px",
  };

  return (
    <Stack space={4}>
      {/* Mode tabs */}
      <div style={{ display: "flex", gap: "0", borderRadius: "4px", overflow: "hidden", border: "1px solid var(--card-border-color)", alignSelf: "flex-start" }}>
        {(["single", "multiday", "recurring"] as Mode[]).map((m) => {
          const labels: Record<Mode, string> = { single: "Single Day", multiday: "Multi-Day", recurring: "Recurring" };
          return (
            <button
              key={m}
              type="button"
              onClick={() => {
                if (mode === "recurring" && m !== "recurring") clearRecurrenceLabel();
                setMode(m);
              }}
              onKeyDown={(e) => e.stopPropagation()}
              style={{
                padding: "6px 14px",
                fontSize: "12px",
                fontFamily: "inherit",
                fontWeight: mode === m ? 600 : 400,
                border: "none",
                borderRight: m !== "recurring" ? "1px solid var(--card-border-color)" : "none",
                background: mode === m ? "var(--card-fg-color)" : "var(--card-bg-color)",
                color: mode === m ? "var(--card-bg-color)" : "var(--card-fg-color)",
                cursor: "pointer",
              }}
            >
              {labels[m]}
            </button>
          );
        })}
      </div>

      {/* ── Mode A ── */}
      {mode === "single" && (
        <Card padding={3} border radius={2}>
          <Stack space={3}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", flexWrap: "wrap" }}>
              <DateInput value={singleDate} onChange={setSingleDate} label="Date" />
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--card-fg-color)", fontFamily: "inherit" }}>Opens</span>
                <TimeSelect value={singleOpen} onChange={setSingleOpen} placeholder="Opens" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--card-fg-color)", fontFamily: "inherit" }}>Closes</span>
                <TimeSelect value={singleClose} onChange={setSingleClose} placeholder="Closes" />
              </div>
            </div>
            <div>
              <Button
                text="Set Day"
                tone="primary"
                onClick={applySingle}
                disabled={!singleDate || !singleOpen || !singleClose}
              />
            </div>
          </Stack>
        </Card>
      )}

      {/* ── Mode B ── */}
      {mode === "multiday" && (
        <Card padding={3} border radius={2}>
          <Stack space={3}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <DateInput value={multiStart} onChange={setMultiStart} label="Start Date" />
              <DateInput value={multiEnd} onChange={setMultiEnd} label="End Date" />
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--card-fg-color)", fontFamily: "inherit" }}>Default Opens</span>
                <TimeSelect value={multiDefaultOpen} onChange={setMultiDefaultOpen} placeholder="Opens" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--card-fg-color)", fontFamily: "inherit" }}>Default Closes</span>
                <TimeSelect value={multiDefaultClose} onChange={setMultiDefaultClose} placeholder="Closes" />
              </div>
            </div>
            <div>
              <Button
                text="Apply to All Days"
                tone="primary"
                onClick={applyMultiDay}
                disabled={!multiStart || !multiEnd || !multiDefaultOpen || !multiDefaultClose}
              />
            </div>
          </Stack>
        </Card>
      )}

      {/* ── Mode C ── */}
      {mode === "recurring" && (
        <Card padding={3} border radius={2}>
          <Stack space={3}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--card-fg-color)", fontFamily: "inherit" }}>Pattern</span>
                <select
                  value={recurPattern}
                  onChange={(e) => setRecurPattern(e.target.value as RecurringPattern)}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={inputStyle}
                >
                  <option value="every">Every [weekday]</option>
                  <option value="first">Every first [weekday] of month</option>
                  <option value="everyother">Every other [weekday]</option>
                </select>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--card-fg-color)", fontFamily: "inherit" }}>Weekday</span>
                <select
                  value={recurWeekday}
                  onChange={(e) => setRecurWeekday(e.target.value as WeekdayName)}
                  onKeyDown={(e) => e.stopPropagation()}
                  style={inputStyle}
                >
                  {WEEKDAYS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <DateInput value={recurEndDate} onChange={setRecurEndDate} label="End Date" />
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--card-fg-color)", fontFamily: "inherit" }}>Default Opens</span>
                <TimeSelect value={recurDefaultOpen} onChange={setRecurDefaultOpen} placeholder="Opens" />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--card-fg-color)", fontFamily: "inherit" }}>Default Closes</span>
                <TimeSelect value={recurDefaultClose} onChange={setRecurDefaultClose} placeholder="Closes" />
              </div>
            </div>
            <div>
              <Button
                text="Generate Dates"
                tone="primary"
                onClick={applyRecurring}
                disabled={!recurEndDate || !recurDefaultOpen || !recurDefaultClose}
              />
            </div>
          </Stack>
        </Card>
      )}

      {/* Generated/current rows */}
      {rows.length > 0 && (
        <Stack space={2}>
          <Label size={1} muted>
            Schedule ({rows.length} {rows.length === 1 ? "day" : "days"})
          </Label>
          {rows.map((row, i) => (
            <ScheduleRow
              key={row._key || i}
              row={row}
              onUpdate={(updated) => updateRow(i, updated)}
              onRemove={() => removeRow(i)}
            />
          ))}
        </Stack>
      )}

      {rows.length === 0 && (
        <Text size={1} muted>
          No days added yet. Use the controls above to add schedule entries.
        </Text>
      )}
    </Stack>
  );
}
