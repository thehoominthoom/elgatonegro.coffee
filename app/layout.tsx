import type { Metadata } from "next";
import {
  Barlow_Semi_Condensed,
  Outfit,
  Permanent_Marker,
} from "next/font/google";
import "./globals.css";

const barlowSemiCondensed = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-barlow",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-marker",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | El Gato Negro Coffee",
    default: "El Gato Negro Coffee",
  },
  description:
    "Coffee cart service for weddings, corporate events, conventions, and production sets. Shop coffee, merch, and digital products.",
  metadataBase: new URL("https://elgatonegro.coffee"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${barlowSemiCondensed.variable} ${outfit.variable} ${permanentMarker.variable}`}>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
