import type { ServiceSlug } from "@/lib/inquiry/config";

export type SocialProofType = "logos" | "testimonial";

export interface Testimonial {
  quote: string;
  attribution: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  body: string;
}

export interface ServiceCTA {
  eyebrow: string;
  heading: string;
  subtext: string;
}

export interface ServiceLandingContent {
  featuresHeading: string;
  socialProofType: SocialProofType;
  testimonial: Testimonial | null;
  steps: ProcessStep[];
  cta: ServiceCTA;
}

export const SERVICE_LANDING_CONTENT: Record<ServiceSlug, ServiceLandingContent> = {
  "brand-activations": {
    featuresHeading: "Your brand, our bar.",
    socialProofType: "logos",
    testimonial: null,
    steps: [
      {
        number: "01",
        title: "You reach out.",
        body: "Tell us about your activation — brand, venue, dates, and headcount.",
      },
      {
        number: "02",
        title: "We plan.",
        body: "Custom quote within 1 business day. We coordinate branding, setup logistics, and crew.",
      },
      {
        number: "03",
        title: "We show up.",
        body: "Setup in under 30 minutes. Branded bar, trained crew, coffee that matches the moment.",
      },
    ],
    cta: {
      eyebrow: "YOUR ACTIVATION",
      heading: "Let's build the setup.",
      subtext:
        "Share your event details and we'll get back within 1 business day with availability and a custom quote.",
    },
  },

  "community-conventions": {
    featuresHeading: "Scale without compromise.",
    socialProofType: "logos",
    testimonial: null,
    steps: [
      {
        number: "01",
        title: "You reach out.",
        body: "Share your event details — dates, venue, expected attendance.",
      },
      {
        number: "02",
        title: "We plan.",
        body: "We send a custom proposal within 48 hours. Multi-station layout, crew assignments, logistics.",
      },
      {
        number: "03",
        title: "We show up.",
        body: "Stations built, crew in position, lines moving. Multi-day coverage, consistent quality.",
      },
    ],
    cta: {
      eyebrow: "YOUR EVENT",
      heading: "Let's talk logistics.",
      subtext:
        "Convention-scale events need coordination. Tell us about yours and we'll reach out within 48 hours.",
    },
  },

  "weddings-celebrations": {
    featuresHeading: "Every detail, handled.",
    socialProofType: "testimonial",
    testimonial: {
      quote:
        "They handled everything. We just showed up and enjoyed the party.",
      attribution: "Sarah & James, Oct 2025",
    },
    steps: [
      {
        number: "01",
        title: "You reach out.",
        body: "Tell us about your celebration — date, venue, guest count.",
      },
      {
        number: "02",
        title: "We plan.",
        body: "Custom quote within 24 hours. Signature drink menu, setup plan, and timeline coordination with your venue.",
      },
      {
        number: "03",
        title: "We show up.",
        body: "Full bar setup and breakdown. You stay present. We handle the coffee.",
      },
    ],
    cta: {
      eyebrow: "YOUR DAY",
      heading: "Let's make it yours.",
      subtext:
        "Every inquiry is reviewed personally. Share your details and expect a response with availability and a custom quote within 24 hours.",
    },
  },

  "private-events": {
    featuresHeading: "Show up. We handle the rest.",
    socialProofType: "testimonial",
    testimonial: {
      quote:
        "Set up was quick, drinks were incredible, cleanup was done before we even noticed.",
      attribution: "Rachel M., Dec 2025",
    },
    steps: [
      {
        number: "01",
        title: "You reach out.",
        body: "Give us the basics — date, location, rough headcount.",
      },
      {
        number: "02",
        title: "We plan.",
        body: "Quote within 24 hours. We work out the drink menu, setup, and timing.",
      },
      {
        number: "03",
        title: "We show up.",
        body: "Compact setup, great drinks, no stress. We arrive, serve, and clean up.",
      },
    ],
    cta: {
      eyebrow: "YOUR GATHERING",
      heading: "Let's set the bar.",
      subtext:
        "Tell us about your event and we'll get back within 24 hours with availability and a quote.",
    },
  },
};
