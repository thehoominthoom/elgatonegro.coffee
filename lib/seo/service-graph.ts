import type { FAQItem } from "@/lib/services/faqs";

const BASE_URL = "https://www.elgatonegro.coffee";

interface ServiceGraphInput {
  slug: string;
  name: string;
  serviceType: string;
  description: string;
  breadcrumbName: string;
  faqs: FAQItem[];
}

/**
 * Returns a JSON-LD `@graph` payload combining `Service`, `BreadcrumbList`,
 * and `FAQPage` for a service subpage. Payload structure per
 * `copy/services-pages-seo-audit.md` Round 1 + Round 2. No `Review` schema
 * per Phil (2026-07-20 — plain content only until Google Reviews integration).
 */
export function buildServiceGraph({
  slug,
  name,
  serviceType,
  description,
  breadcrumbName,
  faqs,
}: ServiceGraphInput) {
  const url = `${BASE_URL}/services/${slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        serviceType,
        description,
        provider: {
          "@type": "LocalBusiness",
          "@id": `${BASE_URL}/#business`,
          name: "El Gato Negro",
          url: BASE_URL,
          areaServed: {
            "@type": "City",
            name: "Nashville",
            containedInPlace: { "@type": "State", name: "Tennessee" },
          },
        },
        areaServed: { "@type": "City", name: "Nashville" },
        url,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "USD",
          url: `${BASE_URL}/inquiry?service=${slug}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `${BASE_URL}/services`,
          },
          { "@type": "ListItem", position: 3, name: breadcrumbName, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}

/**
 * `/services` index page graph — `BreadcrumbList` + `ItemList` + `FAQPage`.
 * No `Service` schema on the index (Round 1 audit).
 */
export function buildServicesIndexGraph(faqs: FAQItem[]) {
  const url = `${BASE_URL}/services`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Services", item: url },
        ],
      },
      {
        "@type": "ItemList",
        "@id": `${url}#itemlist`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            url: `${url}/brand-activations`,
            name: "Brand Activations",
          },
          {
            "@type": "ListItem",
            position: 2,
            url: `${url}/community-conventions`,
            name: "Community & Conventions",
          },
          {
            "@type": "ListItem",
            position: 3,
            url: `${url}/weddings-celebrations`,
            name: "Weddings & Celebrations",
          },
          {
            "@type": "ListItem",
            position: 4,
            url: `${url}/private-events`,
            name: "Private Events",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };
}
