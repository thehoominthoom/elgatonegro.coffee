"use server";

import { type InquiryFormData } from "@/lib/inquiry/schema";

export type InquiryResult =
  | { success: true }
  | { success: false; error: string };

export async function submitInquiry(data: InquiryFormData): Promise<InquiryResult> {
  // Disabled — this form has no backend (no email, no DB).
  // Use the general inquiry form at /inquiry instead.
  // Re-enable once Resend + Prisma integration is wired up.
  void data;
  return {
    success: false,
    error: "This form is temporarily unavailable. Please use our main inquiry form instead.",
  };
}
