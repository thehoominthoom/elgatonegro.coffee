import { z } from "zod";

export const EXPERIENCE_OPTIONS = [
  { value: "less-than-1", label: "Less than 1 year" },
  { value: "1-2", label: "1-2 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5-plus", label: "5+" },
] as const;

export const AVAILABILITY_OPTIONS = [
  { value: "weekday-mornings", label: "Weekday mornings" },
  { value: "weekday-afternoons", label: "Weekday afternoons" },
  { value: "weekday-evenings", label: "Weekday evenings" },
  { value: "weekends", label: "Weekends" },
  { value: "flexible", label: "Flexible" },
] as const;

export const EXPERIENCE_LABELS: Record<string, string> = Object.fromEntries(
  EXPERIENCE_OPTIONS.map((o) => [o.value, o.label])
);

export const opportunitySchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email address required"),
  phone: z.string().min(7, "Phone number is required"),
  currentShop: z.string().min(1, "Current or most recent coffee shop is required"),
  experience: z.enum(["less-than-1", "1-2", "3-5", "5-plus"], {
    message: "Please select your experience level",
  }),
  availability: z
    .array(z.string())
    .min(1, "Select at least one availability option"),
  nashvilleArea: z.enum(["yes", "no"], {
    message: "Please select yes or no",
  }),
  additionalInfo: z.string().optional(),
  turnstileToken: z.string().min(1, "Please complete the security check"),
});

export type OpportunityValues = z.infer<typeof opportunitySchema>;
