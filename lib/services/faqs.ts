import type { ServiceSlug } from "@/lib/inquiry/config";

export interface FAQItem {
  question: string;
  answer: string;
  /**
   * Optional inline link injected into the answer. The renderer will find the
   * first occurrence of `phrase` in `answer` and wrap it in a `Link` to `href`.
   * If the phrase is not present the link is skipped silently.
   */
  inlineLink?: {
    phrase: string;
    href: string;
  };
}

export interface FAQBlock {
  eyebrow: string;
  heading: string;
  items: FAQItem[];
}

export const SERVICES_INDEX_FAQ: FAQBlock = {
  eyebrow: "BEFORE YOU ASK",
  heading: "Questions we get.",
  items: [
    {
      question: "How far in advance should we book?",
      answer:
        "The further out, the better. Weddings and multi-day conventions we like to lock in months ahead. Brand activations and smaller private events we can turn around faster. If you're already thinking about it, reach out. We'd rather know now.",
    },
    {
      question: "Do you travel outside Nashville?",
      answer:
        "Yes. Anywhere within a reasonable drive is on the table. Farther than that, ask us — we've done it before and we'll tell you honestly what the logistics look like.",
    },
    {
      question: "Is there a minimum headcount?",
      answer:
        "No. We've run twenty-person dinner parties and three-day conventions with the same cart. What we quote scales to what you're throwing.",
    },
  ],
};

export const SERVICE_FAQS: Record<ServiceSlug, FAQBlock> = {
  "brand-activations": {
    eyebrow: "THINGS PEOPLE ASK FIRST",
    heading: "Before you brief us in.",
    items: [
      {
        question: "How much lead time do you need for custom branding on the cart?",
        answer:
          "Give us four to six weeks if you want your logo on the cup or custom packaging in your palette. Signage and cart-wrap work sit in the same window. Shorter than that, ask — sometimes we can pull it off, sometimes we can't, and we'll tell you which one it is.",
      },
      {
        question: "You said setup in under thirty minutes. Is that real?",
        answer:
          "Real. The cart rolls in, we plug in, we're pulling shots. It's why we can do a leasing office at 1111 Church on a weekday morning without the mailroom noticing.",
      },
      {
        question: "Do you bring your own power and water?",
        answer:
          "The cart carries its own water and runs on a standard outlet. If your venue is weirder than that, like a parking garage or a rooftop with no plug, tell us upfront and we'll show up ready.",
      },
      {
        question:
          "Can you handle apartment or office logistics — freight elevators, loading docks, security check-in?",
        answer:
          "Yes. We've done it enough times that we ask about it in the pre-event call. Send us the building rules and we'll work around them.",
      },
    ],
  },

  "community-conventions": {
    eyebrow: "LOGISTICS WE GET ASKED",
    heading: "The long-day questions.",
    items: [
      {
        question: "How does pricing work for multi-day events?",
        answer:
          "Day-rate structure. We quote per day based on hours, stations, and headcount, then bundle it. Three days is normal for us. Longer than that we've done. We'll price it honestly.",
      },
      {
        question: "What if we go over our estimated headcount?",
        answer:
          "We build in a buffer. Seventy drinks an hour is what one station holds when the line is on us. If the crowd's outgrowing the line, we've run a second station before and can pull it together again — it's not our default setup, but it's on the table. Tell us your realistic upper bound and we'll plan for it.",
        inlineLink: {
          phrase: "we've run a second station before",
          href: "/services/brand-activations",
        },
      },
      {
        question: "Can you handle guests who aren't drinking coffee?",
        answer:
          "Yes. Every menu we build includes non-coffee options: matcha, chocolate, seasonal drinks, something for the kids. Nobody stands in line for forty minutes to leave with nothing.",
      },
      {
        question: "How big can the crew get for a large convention?",
        answer:
          "Multi-station means multi-barista. We scale the crew to the room. Everyone on the cart works for us — no day-of contractors who don't know the menu.",
      },
    ],
  },

  "weddings-celebrations": {
    eyebrow: "WHAT COUPLES ACTUALLY ASK",
    heading: "The wedding questions.",
    items: [
      {
        question: "How far out should we book?",
        answer:
          "Anywhere from a month out to a year. Most of our weddings land somewhere in the middle. Short notice happens more than you'd think — if your date is a few weeks away and the cart isn't already spoken for, we'll take it. Ask either way.",
        inlineLink: {
          phrase: "Short notice happens more than you'd think",
          href: "/services/private-events",
        },
      },
      {
        question: "How does the signature drink naming actually work?",
        answer:
          "We build the menu with you. You tell us what you drink, what your people drink, whatever inside joke you want on the board. One or two signature drinks with your names on them, or more if you want it. Your call.",
      },
      {
        question: "What happens if it rains?",
        answer:
          "The cart moves. We've set up in tents, garages, and covered patios when the sky opened. Talk to us about the rain plan when we talk about setup. We'll be part of it.",
      },
      {
        question: "Can you cover ceremony, cocktail hour, and reception?",
        answer:
          "Yes. Service stretches to fit the day — no hard cap on hours. We stay set up through the transitions and pour whatever the moment calls for, from ceremony coffee to a late-night espresso martini.",
      },
    ],
  },

  "private-events": {
    eyebrow: "THE USUAL QUESTIONS",
    heading: "Things hosts ask.",
    items: [
      {
        question: "How last-minute can we book?",
        answer:
          "Sometimes a week. Sometimes the day before. Depends on the calendar. Ask — the worst we say is no, and if we can swing it we will.",
      },
      {
        question: "Is there a minimum headcount?",
        answer:
          "No. Twenty people, ten people, six people at a dinner party. If it's worth throwing, it's worth having the cart there.",
      },
      {
        question: "How much space does the cart actually need?",
        answer:
          "A kitchen island's worth. Rooftops, backyards, garages we've converted for the night. The setup is compact on purpose. Tell us where you want it and we'll tell you if it fits.",
      },
      {
        question: "What does the deposit look like?",
        answer:
          "Twenty-five percent holds the date. The balance settles after the event, not before — we often adjust billing after the fact to account for extra drinks poured, hours worked, whatever the night actually turned into. Whatever the number is, it's on the quote we send. No service fees buried underneath.",
      },
    ],
  },
};
