"use server";

import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import {
  generalInquirySchema,
  SERVICE_LABELS,
  HEADCOUNT_LABELS,
  type GeneralInquiryValues,
} from "@/lib/inquiry/general-schema";
import { InquiryNotification } from "@/emails/InquiryNotification";
import { InquiryConfirmation } from "@/emails/InquiryConfirmation";

// ─── Result type ──────────────────────────────────────────────────────────────

export type InquiryActionResult =
  | { success: true }
  | { success: false; error: string };

// ─── Rate limiter — 3 submissions per IP per hour ─────────────────────────────

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "inquiry",
});

// ─── Action ───────────────────────────────────────────────────────────────────

export async function submitGeneralInquiry(
  data: GeneralInquiryValues
): Promise<InquiryActionResult> {
  // ── 1. Rate limit (fail fast before any verification or DB work) ────────────
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const { success: rateLimitPassed } = await ratelimit.limit(ip);
  if (!rateLimitPassed) {
    console.warn("[inquiry] Rate limit exceeded for IP:", ip);
    return {
      success: false,
      error: "Too many submissions. Please try again later.",
    };
  }

  // ── 2. Validate form data ───────────────────────────────────────────────────
  const parsed = generalInquirySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data. Please check your entries." };
  }

  const {
    name,
    email,
    phone,
    serviceType,
    eventDate,
    venue,
    headcount,
    message,
    turnstileToken,
  } = parsed.data;

  // ── 3. Verify Turnstile token ───────────────────────────────────────────────
  const turnstileRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: turnstileToken,
        remoteip: ip !== "unknown" ? ip : "",
      }),
    }
  );
  const turnstileData = (await turnstileRes.json()) as { success: boolean };
  if (!turnstileData.success) {
    console.warn("[inquiry] Turnstile verification failed for IP:", ip);
    return {
      success: false,
      error: "Security check failed. Please refresh and try again.",
    };
  }

  const serviceLabel = SERVICE_LABELS[serviceType] ?? serviceType;
  const headcountLabel = HEADCOUNT_LABELS[headcount] ?? headcount;
  const firstName = name.split(" ")[0];

  const resend = new Resend(process.env.RESEND_API_KEY);

  const [notification, confirmation] = await Promise.all([
    resend.emails.send({
      from: "EGN Website <sales@elgatonegro.coffee>",
      to: ["sales@elgatonegro.coffee"],
      subject: `New Inquiry — ${name} · ${serviceLabel}`,
      react: InquiryNotification({
        name,
        email,
        phone,
        serviceType,
        serviceLabel,
        eventDate,
        venue,
        headcount,
        headcountLabel,
        message,
      }),
    }),
    resend.emails.send({
      from: "EGN Website <sales@elgatonegro.coffee>",
      to: [email],
      subject: `We got your inquiry, ${firstName}.`,
      react: InquiryConfirmation({
        firstName,
        serviceLabel,
        eventDate,
        venue,
      }),
    }),
  ]);

  if (notification.error || confirmation.error) {
    const detail = notification.error?.message ?? confirmation.error?.message;
    console.error("[inquiry] Resend error:", detail);
    return {
      success: false,
      error: "Something went wrong sending your inquiry. Please try again.",
    };
  }

  return { success: true };
}
