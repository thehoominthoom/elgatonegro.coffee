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
    "El Gato Negro is a mobile coffee cart in Nashville for weddings, brand activations, conventions, and private events. Book the cart or shop the beans we pour.",
  metadataBase: new URL("https://www.elgatonegro.coffee"),
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
