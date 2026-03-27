"use server";

import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import {
  opportunitySchema,
  EXPERIENCE_LABELS,
  type OpportunityValues,
} from "@/lib/opportunities/schema";
import { OpportunityNotification } from "@/emails/OpportunityNotification";

// ── Result type ──────────────────────────────────────────────────────────────

export type OpportunityActionResult =
  | { success: true }
  | { success: false; error: string };

// ── Rate limiter — 3 submissions per IP per hour ─────────────────────────────

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "opportunity",
});

// ── Action ───────────────────────────────────────────────────────────────────

export async function submitOpportunity(
  data: OpportunityValues
): Promise<OpportunityActionResult> {
  // ── 1. Rate limit ─────────────────────────────────────────────────────────
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const { success: rateLimitPassed } = await ratelimit.limit(ip);
  if (!rateLimitPassed) {
    console.warn("[opportunities] Rate limit exceeded for IP:", ip);
    return {
      success: false,
      error: "Too many submissions. Please try again later.",
    };
  }

  // ── 2. Validate form data ─────────────────────────────────────────────────
  const parsed = opportunitySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data. Please check your entries." };
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    currentShop,
    experience,
    availability,
    nashvilleArea,
    additionalInfo,
    turnstileToken,
  } = parsed.data;

  // ── 3. Verify Turnstile token ─────────────────────────────────────────────
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
    console.warn("[opportunities] Turnstile verification failed for IP:", ip);
    return {
      success: false,
      error: "Security check failed. Please refresh and try again.",
    };
  }

  // ── 4. Send notification email ────────────────────────────────────────────
  const experienceLabel = EXPERIENCE_LABELS[experience] ?? experience;

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error: sendError } = await resend.emails.send({
    from: "EGN Website <no-reply@elgatonegro.coffee>",
    to: ["gato@elgatonegro.coffee"],
    subject: `New Application — ${firstName} ${lastName}`,
    react: OpportunityNotification({
      firstName,
      lastName,
      email,
      phone,
      currentShop,
      experience,
      experienceLabel,
      availability,
      nashvilleArea,
      additionalInfo,
    }),
  });

  if (sendError) {
    console.error("[opportunities] Resend error:", sendError.message);
    return {
      success: false,
      error: "Something went wrong sending your application. Please try again.",
    };
  }

  return { success: true };
}
