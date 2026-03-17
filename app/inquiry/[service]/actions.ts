"use server";

import { inquirySchema, type InquiryFormData } from "@/lib/inquiry/schema";
import { getServiceConfig } from "@/lib/inquiry/config";

export type InquiryResult =
  | { success: true }
  | { success: false; error: string };

export async function submitInquiry(data: InquiryFormData): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data." };
  }

  const config = getServiceConfig(parsed.data.service);
  if (!config) {
    return { success: false, error: "Unknown service." };
  }

  try {
    // TODO: Save lead to Prisma
    // await prisma.lead.create({ data: { ...parsed.data, status: "NEW" } });

    // TODO: Send notification email via Resend
    // await resend.emails.send({ ... });

    return { success: true };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
