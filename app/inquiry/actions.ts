"use server";

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

// ─── Action ───────────────────────────────────────────────────────────────────

export async function submitGeneralInquiry(
  data: GeneralInquiryValues
): Promise<InquiryActionResult> {
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
  } = parsed.data;

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
