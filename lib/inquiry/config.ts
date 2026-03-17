export type ServiceSlug =
  | "brand-activations"
  | "community-conventions"
  | "weddings-celebrations"
  | "private-events";

export interface ServiceConfig {
  slug: ServiceSlug;
  label: string;
  eyebrow: string;
  tagline: string;
  description: string;
  features: string[];
  formFields: {
    eventDate?: boolean;
    guestCount?: boolean;
    venue?: boolean;
    company?: boolean;
    industry?: boolean;
    attendeeCount?: boolean;
    duration?: boolean;
    productionType?: boolean;
    propertyName?: boolean;
    unitCount?: boolean;
    partnershipType?: boolean;
  };
  successHeading: string;
  successBody: string;
}

export const SERVICE_CONFIGS: Record<ServiceSlug, ServiceConfig> = {
  "brand-activations": {
    slug: "brand-activations",
    label: "Brand Activations",
    eyebrow: "Corporate & Brand",
    tagline: "Coffee that earns a second look.",
    description:
      "Shoe releases, apartment pop-ups, corporate all-hands, production sets, and everything in between. If you're activating a space, we make sure the coffee is part of the story.",
    features: [
      "Fully branded setup — your colors, your logo",
      "Flexible footprint — lobby, courtyard, trade floor",
      "High-volume capability with trained crew",
      "On-set and production-friendly scheduling",
      "Recurring and contract pricing available",
      "Setup in under 30 minutes",
    ],
    formFields: {
      eventDate: true,
      attendeeCount: true,
      company: true,
      industry: true,
      duration: true,
    },
    successHeading: "We'll reach out within 1 business day.",
    successBody:
      "We'll review your activation details and follow up with availability, pricing, and next steps.",
  },

  "community-conventions": {
    slug: "community-conventions",
    label: "Community & Conventions",
    eyebrow: "Large Scale",
    tagline: "Built for volume. Built for community.",
    description:
      "Multi-day conventions, fan gatherings, club meetups, and large-scale community events. We're built for throughput — multiple stations, trained crew, no line that doesn't move.",
    features: [
      "Multi-station setup for high-volume service",
      "Event-long coverage — up to 3 days",
      "Sponsor branding on cups and signage",
      "Customizable menu including non-coffee options",
      "Trained crew for fast-paced environments",
      "Pre-event logistics coordination",
    ],
    formFields: {
      eventDate: true,
      attendeeCount: true,
      venue: true,
      duration: true,
    },
    successHeading: "We'll be in touch within 48 hours.",
    successBody:
      "Convention-scale events require coordination. We'll reach out to discuss logistics, crew, and custom pricing.",
  },

  "weddings-celebrations": {
    slug: "weddings-celebrations",
    label: "Weddings & Celebrations",
    eyebrow: "Private Milestones",
    tagline: "Craft coffee for the most important days.",
    description:
      "Full-service espresso for ceremonies, receptions, rehearsal dinners, anniversaries, and milestone celebrations. We handle setup and breakdown so you can be present.",
    features: [
      "Full espresso bar setup + breakdown",
      "Up to 4 hours of service",
      "Signature drink menu with your name on it",
      "Barista uniforms to match your palette",
      "Custom cups & branded packaging available",
      "Drip, cold brew, and non-coffee options",
    ],
    formFields: {
      eventDate: true,
      guestCount: true,
      venue: true,
    },
    successHeading: "We'll be in touch within 24 hours.",
    successBody:
      "We review every inquiry personally. Expect a response with availability and a custom quote shortly.",
  },

  "private-events": {
    slug: "private-events",
    label: "Private Events",
    eyebrow: "Intimate Gatherings",
    tagline: "Small group. Big impression.",
    description:
      "Bachelorette parties, birthday dinners, house parties, and intimate gatherings. We bring the full espresso bar experience to any space, any size.",
    features: [
      "Compact setup for homes, rooftops, and venues",
      "2–3 hour service windows",
      "Custom drink menus and signature shots",
      "Flexible guest counts — no minimums",
      "Available on short notice (subject to availability)",
      "Non-coffee and seasonal options included",
    ],
    formFields: {
      eventDate: true,
      guestCount: true,
      venue: true,
    },
    successHeading: "We'll be in touch within 24 hours.",
    successBody:
      "We keep private event bookings personal. Expect a reply with availability and a quote within a day.",
  },
};

export const ALL_SERVICES = Object.values(SERVICE_CONFIGS);

export function getServiceConfig(slug: string): ServiceConfig | null {
  return SERVICE_CONFIGS[slug as ServiceSlug] ?? null;
}
