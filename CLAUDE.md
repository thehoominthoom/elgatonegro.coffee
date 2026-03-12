# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
| Auth             | Auth.js v5 (NextAuth) + Prisma Adapter      |
| Database         | Neon (serverless PostgreSQL) via Prisma ORM |
| Payments         | Stripe + Stripe Tax                         |
| CMS              | Sanity (hours, locations, events, blog)     |
| Email            | Resend + React Email                        |
| Digital delivery | Cloudflare R2 + pre-signed URLs             |
| Lead forms       | React Hook Form + Zod + Server Actions      |
| Image storage    | Cloudinary (next-cloudinary)                |
| Spam protection  | Cloudflare Turnstile                        |
| Deployment       | Vercel                                      |

## Commands

```bash
npm install               # Install dependencies
npm run dev               # Dev server at localhost:3000
npm run build             # Production build
npm run lint              # ESLint
npx tsc --noEmit          # Type check

npx prisma generate       # Regenerate Prisma client after schema changes
npx prisma db push        # Push schema to dev database
npx prisma migrate deploy # Run migrations in production
npx prisma studio         # Open database GUI

stripe listen --forward-to localhost:3000/api/webhooks/stripe  # Local webhook testing
```

## Route Architecture

Route groups (parentheses = no URL impact):

```
app/
├── (marketing)/       → /, /about, /menu, /locations, /events
│   ├── services/      → /services + 6 service sub-pages
│   ├── inquiry/[service]/ → multi-step lead capture flow
│   ├── resources/     → /resources, /blog/[slug], /build-guides/[slug], /product-lists, /youtube
│   └── legal/         → /privacy, /terms, /refund-policy
├── (store)/           → /shop, /shop/[category], /shop/product/[slug], /cart, /checkout
├── (auth)/            → /login, /register, /forgot-password, /reset-password
├── (account)/         → /account, /orders, /downloads, /profile, /inquiries
├── (admin)/           → /admin + orders, products, inventory, inquiries, customers, settings
└── api/               → /api/webhooks/stripe, /api/inquiry, /api/revalidate
```

## Key Architecture Decisions

**Server Components by default.** Add `"use client"` only for interactivity, browser APIs, Stripe Elements, or context consumers (cart, auth).

**Admin route protection** is enforced in `middleware.ts` via session role check — never rely on client-side role checks alone.

**Sanity manages:** hours, locations, events, blog posts, service page copy.
**Postgres (Prisma) manages:** users, orders, cart, inventory, leads, digital download tokens, discount codes.
These are two separate data sources deliberately — don't conflate them.

**Checkout flow:** Stripe Checkout → webhook at `/api/webhooks/stripe` is the authoritative trigger for all order status transitions. Never trust client-side confirmation.

**Digital product delivery:** Cloudflare R2 stores files privately. On `payment_intent.succeeded`, generate `DownloadToken` rows, create pre-signed R2 URLs (15-min TTL), and send via Resend. Customer can re-request from `/account/downloads`.

**Inventory:** Physical only — digital products skip stock checks entirely. Two-phase reservation: reserve on payment confirmed, deduct on shipped. All mutations inside Prisma transactions.

**Lead inquiry routing:** `/inquiry/[service]` uses a `SERVICE_CONFIGS` map in `lib/inquiry/config.ts` to drive dynamic fields, email templates, and success copy per service type (weddings, corporate, conventions, production-sets, apartment-popups, partnerships).

## Brand Design System

**Colors (Tailwind tokens):**

- `brand-orange` `#B43620` — primary CTAs, active states, prices
- `brand-yellow` `#D09324` — hover states, highlights, sale badges
- `brand-black` `#2A201D` — text, card borders, admin sidebar background
- `brand-grey` `#FAF5F4` — page background, card fill, button text
- `brand-green` `#7B6838` — secondary accents, free badges, captions

**Visual identity:** 1980s/90s skateboard + Mexican Cowboy culture. Polaroid patina, grain texture, hard offset box shadows (`shadow-polaroid`), slight card rotation on rest with `hover:rotate-0`. Uppercase wide-tracked eyebrow labels. Physical-object tactile feel throughout.

## Environment Variables

```
DATABASE_URL=                           # Neon pooled URL
DIRECT_URL=                             # Neon direct URL (migrations only)
AUTH_SECRET=                            # Auth.js secret
NEXTAUTH_URL=                           # https://elgatonegro.coffee
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
CLOUDINARY_URL=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

## Build Order

Recommended implementation sequence:

1. Tailwind config + globals + fonts + shadcn/ui setup
2. Root layout, SiteHeader, SiteFooter, shared UI primitives (Button, Card, PolaroidCard)
3. Homepage (establishes all visual patterns)
4. `/services/*` + inquiry flow (primary revenue driver)
5. `/shop/*` + cart + Stripe checkout
6. Auth + `/account/*`
7. `/admin/*` dashboard
8. `/resources/*` content hub
9. Sanity CMS integration for hours/locations/events/blog
10. Webhook handlers, email templates, digital delivery
