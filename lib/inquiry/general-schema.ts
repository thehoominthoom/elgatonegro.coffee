import { z } from "zod";

export const SERVICE_LABELS: Record<string, string> = {
  "brand-activations": "Brand Activations",
  "community-conventions": "Community & Conventions",
  "weddings-celebrations": "Weddings & Celebrations",
  "private-events": "Private Events",
};

export const HEADCOUNT_LABELS: Record<string, string> = {
  "under-50": "Under 50",
  "50-150": "50–150",
  "150-300": "150–300",
  "300-plus": "300+",
};

export const generalInquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email address required"),
  phone: z.string().optional(),
  serviceType: z.enum(
    ["brand-activations", "community-conventions", "weddings-celebrations", "private-events"],
    { message: "Please select a service type" }
  ),
  eventDate: z.string().min(1, "Event date is required"),
  venue: z.string().min(2, "Venue or location is required"),
  headcount: z.enum(["under-50", "50-150", "150-300", "300-plus"], {
    message: "Please select a headcount range",
  }),
  message: z.string().optional(),
  turnstileToken: z.string().min(1, "Please complete the security check"),
});

export type GeneralInquiryValues = z.infer<typeof generalInquirySchema>;
