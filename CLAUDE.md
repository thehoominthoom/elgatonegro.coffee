# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Always Do First

- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images

- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server

- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `npm run dev` (serves at `http://localhost:3000`)
- Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow

Uses `puppeteer-core` + system Chrome. Dev server must be running first.

```bash
npm run screenshot                                        # localhost:3000, auto-named
npm run screenshot http://localhost:3000/shop shop        # specific route + name
npm run screenshot http://localhost:3000/about about
```

- Output lands in `.screenshots/` (gitignored), auto-incremented, never overwritten
- Full-page, 1440×900 viewport
- Script lives at `scripts/screenshot.mjs`
- Chrome path: `C:\Program Files\Google\Chrome\Application\chrome.exe` — update if user-installed
- After capturing a screenshot of, read the PNG with the Read tool — Claude can see and analyze the image directly
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults

- Next.js App Router pages with Tailwind CSS + shadcn/ui, unless user says otherwise
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets

- Always check the `brand-kit/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails

- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Use the brand tokens defined in Brand Design System.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules

- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

## Project Overview

**El Gato Negro** — ElGatoNegro.Coffee
Full-stack ecommerce + lead generation + resource hub website for a coffee cart company.

**Four site purposes:**

1. Informational hub (hours, locations, events)
2. Lead generation (weddings, corporate, conventions, production sets, apartment pop-ups, partnerships)
3. Ecommerce (merchandise, coffee beans, digital products: 3D models + paid resources)
4. Resource hub for coffee cart business owners (blog, build guides, product lists, YouTube)

**Two user roles:** `CUSTOMER` (storefront + account) and `ADMIN` (full dashboard access)

## Confirmed Tech Stack

| Concern          | Tool                                        |
| ---------------- | ------------------------------------------- |
| Framework        | Next.js 14+ App Router, React, TypeScript   |
| Styling          | Tailwind CSS + shadcn/ui                    |
| Auth             | Clerk (admin) + Shopify Customer Account API (customers) |
| Database         | None. Shopify holds customers, orders, carts and inventory; leads are email only |
| Key-value store  | Upstash Redis: form rate-limit keys and POS webhook dedupe keys only |
| Payments         | Shopify Payments (online) + Helcim (in-person POS) |
| CMS              | Sanity (hours, locations, events, blog)     |
| Email            | Resend + React Email                        |
| Digital delivery | Not built (Cloudflare R2 was planned; no code) |
| Lead forms       | React Hook Form + Zod + Server Actions      |
| Image storage    | Local files in `public/`, plus Sanity and Shopify CDN images through `next/image`. Not Cloudinary (unused) |
| Spam protection  | Cloudflare Turnstile                        |
| Deployment       | Vercel                                      |

## Commands

```bash
npm install               # Install dependencies
npm run dev               # Dev server at localhost:3000
npm run build             # Production build
npm run lint              # ESLint
npx tsc --noEmit          # Type check
```

## Screenshot Workflow

Uses `puppeteer-core` + system Chrome. Dev server must be running first.

```bash
npm run screenshot                                        # localhost:3000, auto-named
npm run screenshot http://localhost:3000/shop shop        # specific route + name
npm run screenshot http://localhost:3000/about about
```

- Output lands in `.screenshots/` (gitignored) with a timestamp suffix
- Full-page, 1440×900 viewport
- Script lives at `scripts/screenshot.mjs`
- Chrome path: `C:\Program Files\Google\Chrome\Application\chrome.exe` — update if user-installed

## Route Architecture

Route groups (parentheses = no URL impact):

```
app/
├── (marketing)/       → /, /about, /menu, /locations, /events
│   ├── services/      → /services + 6 service sub-pages
│   ├── inquiry/       → single-step lead capture form (service pre-select via ?service=slug)
│   ├── resources/     → /resources, /blog/[slug], /build-guides/[slug], /product-lists, /youtube
│   └── legal/         → /privacy, /terms, /refund-policy
├── (store)/           → /shop, /shop/[category], /shop/product/[slug], /cart, /checkout
├── (auth)/            → /login, /register, /forgot-password, /reset-password
├── (account)/         → /account, /orders, /downloads, /profile, /inquiries
├── (admin)/           → /admin + orders, products, inventory, inquiries, customers, settings
└── api/               → /api/webhooks/helcim, /api/inquiry, /api/revalidate
```

## Key Architecture Decisions

**Server Components by default.** Add `"use client"` only for interactivity, browser APIs, Shopify cart hooks, or context consumers.

**Admin route protection** is enforced in `middleware.ts` via session role check — never rely on client-side role checks alone.

**Sanity manages:** hours, locations, events, blog posts, service page copy.
**Shopify manages:** customers, addresses, orders, cart, inventory, discount codes.
These are two separate data sources deliberately — don't conflate them.

**There is no database.** Neon/Prisma was planned and never built. Leads (inquiries, job applications) are not stored: `app/inquiry/actions.ts` and `app/opportunities/actions.ts` send them by email through Resend, to sales@ and gato@. **Upstash Redis** holds only the forms' rate-limit keys (3 per IP per hour) and the POS webhook's dedupe keys (10-minute TTL).

**Checkout flow:** Shopify hosted checkout handles all payment processing and holds the orders.

**Digital product delivery:** not built. The plan was private files in Cloudflare R2, sent as pre-signed URLs through Resend. No code exists.

**Inventory:** Shopify holds stock. In-person Helcim sales reach `app/api/webhooks/pos-sync/route.ts`, which deducts the sold SKUs from Shopify inventory through the Admin API.

**Lead inquiry routing:** `/inquiry` is a single-step unified form. Service pages deep-link with `/inquiry?service=[slug]` to pre-select the service dropdown. Valid slugs (`brand-activations`, `community-conventions`, `weddings-celebrations`, `private-events`) come from the `SERVICE_CONFIGS` map in `lib/inquiry/config.ts`, which also drives service page copy (labels, features, tagline, description).

## Brand Design System

**Colors (Tailwind tokens):**

- `brand-orange` `#B43620` — primary CTAs, active states, prices
- `brand-yellow` `#D09324` — hover states, highlights, sale badges
- `brand-black` `#2A201D` — text, card borders, admin sidebar background
- `brand-grey` `#FAF5F4` — page background, card fill, button text
- `brand-green` `#7B6838` — secondary accents, free badges, captions

**Visual identity:** 1980s/90s skateboard + Mexican Cowboy culture. Grain texture, uppercase wide-tracked eyebrow labels. Physical-object tactile feel throughout.

**Aesthetic implementation rules:**

- Grain overlay — CSS only, applied to hero sections and image containers. Gate behind `NEXT_PUBLIC_GRAIN_OVERLAY` env var (default `true`).
- Color/patina — image editing only, not CSS.
- Polaroid border/frame — image editing only, not coded UI.
- `shadow-polaroid` — removed. Do not use.
- Card rotation/tilt — removed. No `rotate-[-1deg]` or `hover:rotate-0` effects.

**Feature flags** (both default `true`, baked in at build time):

```
NEXT_PUBLIC_GRAIN_OVERLAY=true
NEXT_PUBLIC_POLAROID_STYLE=true
```

## Environment Variables

The full list, grouped by service, is in `.env.example`. `DATABASE_URL`, `DIRECT_URL`, `CLOUDINARY_URL`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and the four `R2_*` entries are there but unused: no code reads them.

## Build Order

Recommended implementation sequence:

1. Tailwind config + globals + fonts + shadcn/ui setup
2. Root layout, SiteHeader, SiteFooter, shared UI primitives (Button, Card)
3. Homepage (establishes all visual patterns)
4. `/services/*` + inquiry flow (primary revenue driver)
5. `/shop/*` + cart + Shopify hosted checkout
6. Auth + `/account/*`
7. `/admin/*` dashboard
8. `/resources/*` content hub
9. Sanity CMS integration for hours/locations/events/blog
10. Webhook handlers, email templates, digital delivery
