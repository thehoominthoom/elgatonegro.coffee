import type { NextConfig } from "next";

// ─── Security headers ──────────────────────────────────────────────────────
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Clerk (dev + prod) + Turnstile + Google Maps + Vercel preview
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.elgatonegro.coffee https://accounts.elgatonegro.coffee https://*.clerk.com https://challenges.cloudflare.com https://maps.googleapis.com https://vercel.live",
      // Styles: self + unsafe-inline (Tailwind + Clerk inject styles)
      "style-src 'self' 'unsafe-inline' https://*.clerk.accounts.dev https://clerk.elgatonegro.coffee https://accounts.elgatonegro.coffee",
      // Images: self + data URIs + all CDNs used
      "img-src 'self' data: blob: https://cdn.sanity.io https://cdn.shopify.com https://res.cloudinary.com https://*.clerk.accounts.dev https://clerk.elgatonegro.coffee https://accounts.elgatonegro.coffee https://img.clerk.com https://maps.googleapis.com https://maps.gstatic.com",
      // Fonts: self + Google Fonts (if used) + Clerk
      "font-src 'self' data: https://*.clerk.accounts.dev https://clerk.elgatonegro.coffee",
      // Connect: self + APIs
      "connect-src 'self' https://*.clerk.accounts.dev https://clerk.elgatonegro.coffee https://accounts.elgatonegro.coffee https://*.clerk.com https://challenges.cloudflare.com https://maps.googleapis.com https://*.shopify.com https://cdn.sanity.io https://vercel.live",
      // Frames: Turnstile + Clerk
      "frame-src https://challenges.cloudflare.com https://*.clerk.accounts.dev https://clerk.elgatonegro.coffee https://accounts.elgatonegro.coffee",
      // Workers: Clerk uses blob workers
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/coming-soon',
        permanent: false,
        has: [
          {
            type: 'host',
            value: '(elgatonegro\\.coffee|www\\.elgatonegro\\.coffee)',
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/elgatonegro/**" },
      // Shopify product images
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
};

export default nextConfig;
