export type ServiceSlug =
  | "weddings"
  | "corporate"
  | "conventions"
  | "production-sets"
  | "apartment-popups"
  | "partnerships";

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
  weddings: {
    slug: "weddings",
    label: "Weddings & Celebrations",
    eyebrow: "Private Events",
    tagline: "Craft coffee for the most important day.",
    description:
      "Full-service espresso bar for ceremonies, receptions, and rehearsal dinners. We handle setup, breakdown, and everything in between so you can be present.",
    features: [
      "Full espresso bar setup + breakdown",
      "Up to 4 hours of service",
      "Signature drink menu with your name on it",
      "Barista uniforms match your palette",
      "Custom cups & branded packaging available",
      "Drip, cold brew, and non-coffee options",
    ],
    formFields: { eventDate: true, guestCount: true, venue: true },
    successHeading: "We'll be in touch within 24 hours.",
    successBody:
      "We review every inquiry personally. Expect a response with availability and a custom quote shortly.",
  },

  corporate: {
    slug: "corporate",
    label: "Corporate & Office",
    eyebrow: "Professional",
    tagline: "The best meeting perk you've ever had.",
    description:
      "Pop-up espresso service for team meetings, all-hands, offsites, and company retreats. Gives your team something to look forward to.",
    features: [
      "Flexible scheduling — half day or full day",
      "Drip stations, espresso, and cold brew",
      "Fully self-contained — no kitchen required",
      "Company branding on cups available",
      "Recurring contract pricing available",
      "Setup in under 30 minutes",
    ],
    formFields: { eventDate: true, attendeeCount: true, company: true, industry: true },
    successHeading: "We'll reach out within 1 business day.",
    successBody:
      "We'll review your inquiry and follow up with availability, pricing, and next steps.",
  },

  conventions: {
    slug: "conventions",
    label: "Conventions & Production",
    eyebrow: "Large Scale",
    tagline: "High-volume service at convention scale.",
    description:
      "Trade floors, fan conventions, industry events. We're built for volume — multiple stations, high throughput, no line that doesn't move.",
    features: [
      "Multi-station setup for high volume",
      "Trained crew for fast-paced environments",
      "Sponsor branding on cups and signage",
      "Event-long service (up to 3 days)",
      "Customizable menu for dietary needs",
      "Pre-event logistics coordination",
    ],
    formFields: { eventDate: true, attendeeCount: true, venue: true, duration: true },
    successHeading: "We'll be in touch within 48 hours.",
    successBody:
      "Convention-scale events require coordination. We'll reach out to discuss logistics, crew, and custom pricing.",
  },

  "production-sets": {
    slug: "production-sets",
    label: "Production Sets",
    eyebrow: "Film & TV",
    tagline: "Craft services, elevated.",
    description:
      "On-set espresso and drip service for film, TV, commercial, and music video productions. We know call times. We know how sets run.",
    features: [
      "Pre-dawn and overnight availability",
      "Quiet equipment — set-friendly",
      "Crew and cast pricing available",
      "Consistent quality across long shoot days",
      "Weekly + multi-week contracts",
      "Coordinated with AD and production office",
    ],
    formFields: { eventDate: true, attendeeCount: true, productionType: true, duration: true },
    successHeading: "We'll follow up within 24 hours.",
    successBody:
      "We'll review your production details and reach out with availability and a custom quote.",
  },

  "apartment-popups": {
    slug: "apartment-popups",
    label: "Apartment Pop-ups",
    eyebrow: "Residential",
    tagline: "Turn move-in weekend into a moment.",
    description:
      "Pop-up coffee service for apartment communities — resident events, move-in weekends, lease renewals, open houses, and property launches.",
    features: [
      "Compact setup for lobbies and courtyards",
      "2–4 hour service windows",
      "Resident-friendly pricing tiers",
      "Great for retention and referral events",
      "Property branding available",
      "Available on recurring schedule",
    ],
    formFields: { eventDate: true, attendeeCount: true, propertyName: true, unitCount: true },
    successHeading: "We'll reach out within 24 hours.",
    successBody:
      "We'll confirm availability for your property and follow up with pricing and logistics.",
  },

  partnerships: {
    slug: "partnerships",
    label: "Partnerships",
    eyebrow: "Collaborate",
    tagline: "Built for people who build things.",
    description:
      "Brand collaborations, wholesale accounts, co-branded merchandise, content partnerships, and sponsorship opportunities. We're open to interesting conversations.",
    features: [
      "Co-branded merchandise",
      "Wholesale coffee and merch accounts",
      "Content and media partnerships",
      "Sponsorship of events and resources",
      "Affiliate and referral programs",
      "Custom engagements — just ask",
    ],
    formFields: { company: true, industry: true, partnershipType: true },
    successHeading: "We'll be in touch.",
    successBody:
      "We review partnership inquiries personally. If it's a fit, you'll hear from us within a few days.",
  },
};

export const ALL_SERVICES = Object.values(SERVICE_CONFIGS);

export function getServiceConfig(slug: string): ServiceConfig | null {
  return SERVICE_CONFIGS[slug as ServiceSlug] ?? null;
}
