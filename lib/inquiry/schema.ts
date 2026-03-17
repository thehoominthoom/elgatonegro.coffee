import { z } from "zod";

export const inquirySchema = z.object({
  // Always required
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  message: z.string().optional(),
  service: z.string(),

  // Event-specific optional fields
  eventDate: z.string().optional(),
  guestCount: z.string().optional(),
  attendeeCount: z.string().optional(),
  venue: z.string().optional(),
  company: z.string().optional(),
  industry: z.string().optional(),
  duration: z.string().optional(),
  productionType: z.string().optional(),
  propertyName: z.string().optional(),
  unitCount: z.string().optional(),
  partnershipType: z.string().optional(),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;
