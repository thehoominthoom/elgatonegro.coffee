import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
