import type { ServiceSlug } from "@/lib/inquiry/config";

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

export interface InclusionsBlock {
  eyebrow: string;
  heading: string;
}

export interface ServiceLandingContent {
  inclusions: InclusionsBlock;
  processEyebrow: string;
  processHeading: string;
  steps: ProcessStep[];
  cta: ServiceCTA;
}

export const SERVICE_LANDING_CONTENT: Record<ServiceSlug, ServiceLandingContent> = {
  "brand-activations": {
    inclusions: {
      eyebrow: "WHAT'S INCLUDED",
      heading: "Your brand. Our bar.",
    },
    processEyebrow: "THE PROCESS",
    processHeading: "How booking works.",
    steps: [
      {
        number: "01",
        title: "You reach out.",
        body: "Brand, venue, dates, headcount. As much or as little as you have.",
      },
      {
        number: "02",
        title: "We quote.",
        body: "24 hours. No drip funnel.",
      },
      {
        number: "03",
        title: "We show up.",
        body: "Cart in your colors. Crew already briefed. You go run your event.",
      },
    ],
    cta: {
      eyebrow: "YOUR ACTIVATION",
      heading: "Let's build the setup.",
      subtext: "Tell us what the room is. We'll tell you what we can do with it.",
    },
  },

  "community-conventions": {
    inclusions: {
      eyebrow: "WHAT'S INCLUDED",
      heading: "Built for the long days.",
    },
    processEyebrow: "THE PROCESS",
    processHeading: "How booking works.",
    steps: [
      {
        number: "01",
        title: "You reach out.",
        body: "Dates, venue, expected attendance. Even a rough guess helps.",
      },
      {
        number: "02",
        title: "We quote.",
        body: "Within 48 hours. Multi-day events take a minute to map.",
      },
      {
        number: "03",
        title: "We show up.",
        body: "Stations up before doors. Crew in position. Line moves.",
      },
    ],
    cta: {
      eyebrow: "YOUR EVENT",
      heading: "Let's map the days.",
      subtext: "Send us the schedule. We'll send back a plan that survives day three.",
    },
  },

  "weddings-celebrations": {
    inclusions: {
      eyebrow: "WHAT'S INCLUDED",
      heading: "Built around your day.",
    },
    processEyebrow: "THE PROCESS",
    processHeading: "How booking works.",
    steps: [
      {
        number: "01",
        title: "You reach out.",
        body: "Date, venue, guest count. We'll take it from there.",
      },
      {
        number: "02",
        title: "We quote.",
        body: "24 hours. We read every wedding inquiry ourselves.",
      },
      {
        number: "03",
        title: "We show up.",
        body: "Bar set before guests arrive. Broken down before you notice. You stay in your day.",
      },
    ],
    cta: {
      eyebrow: "YOUR DAY",
      heading: "Tell us about the two of you.",
      subtext: "We'll build a menu around it and stay out of the way of everything else.",
    },
  },

  "private-events": {
    inclusions: {
      eyebrow: "WHAT'S INCLUDED",
      heading: "Show up. We handle the rest.",
    },
    processEyebrow: "THE PROCESS",
    processHeading: "How booking works.",
    steps: [
      {
        number: "01",
        title: "You reach out.",
        body: "Date, where, rough headcount. That's plenty to start.",
      },
      {
        number: "02",
        title: "We quote.",
        body: "24 hours. We keep this one personal.",
      },
      {
        number: "03",
        title: "We show up.",
        body: "Cart in. Drinks out. Cleaned up before anyone's looking for the host.",
      },
    ],
    cta: {
      eyebrow: "YOUR NIGHT",
      heading: "Tell us what you're throwing.",
      subtext: "We'll show up, run the bar, and let you actually be at your own party.",
    },
  },
};
