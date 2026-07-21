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
    tagline: "Different room. Same bar.",
    description:
      "We've set up in lobbies, on production sets, behind shoe drops, and in the leasing office at 1111 Church — enough times now that we've served hundreds of residents through those doors. The brief is always different. What we put behind the bar isn't. You get the cart, the menu built around your event, and a barista who's actually ours — not a contractor we found that morning.",
    features: [
      "A drink menu built around your event, not pulled off a shelf",
      "Custom banners and POP signage in your colors — cups too if you plan ahead",
      "Lobby, courtyard, trade floor, parking garage — Nashville and out, we'll make it work",
      "A barista who works for us, not a staffing agency",
      "Setup in under 30 minutes",
      "Recurring and contract pricing if you want us back",
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
    tagline: "Three days. One line. Keeps moving.",
    description:
      "Over seventy drinks pulled in an hour when the line demands it. Hundreds served across a day when the day runs long. Conventions, club meetups, multi-day community gatherings, Nashville and out — we build our schedule around yours, restock without being asked, and stay running as long as you do.",
    features: [
      "Multi-station setup so the line never becomes the story",
      "Multi-day coverage — we've run longer than three",
      "A menu shaped to your crowd — non-coffee options included",
      "Sponsor branding on cups and signage if you need it",
      "A crew that's done fast rooms before",
      "Pre-event logistics call so day one isn't a guess",
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
    tagline: "We do the coffee. You do the day.",
    description:
      "Ceremonies, receptions, rehearsal dinners, anniversaries. Nashville venues and anywhere within a reasonable drive. You've thought about every other detail. We'll match that energy on the coffee side — signature drinks named after the two of you, the bar set where it looks right in the photos, and nobody asking you a question during the toasts.",
    features: [
      "A signature drink menu we'll build with you — your names on it if you want",
      "Full setup and breakdown, timed to your venue's schedule",
      "Service that stretches to fit the day — no hard cap on hours",
      "Drip and cold brew alongside espresso — for the guests who aren't here for the latte art",
      "Custom cups and packaging in your palette — yours to spec",
      "A barista who works for us, in whatever dress code you set",
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
    tagline: "The small ones count too.",
    description:
      "Bachelorettes, birthdays, the dinner party where you don't want to be the one making drinks. Nashville homes, rooftops, backyards. Twenty people who actually know each other, somewhere nobody's on their phone. We bring the cart, build a short menu around what the group likes, and let the night do what it does.",
    features: [
      "A compact setup that fits a kitchen, a rooftop, a backyard",
      "A drink menu shaped around the group — no minimum headcount",
      "We stay as long as the night runs — no fixed window",
      "Short-notice availability when we can swing it",
      "Straightforward pricing — no service fees buried in the quote",
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
