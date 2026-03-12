import type { Metadata } from "next";
import { Arya, Open_Sans } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

const arya = Arya({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-arya",
  display: "swap",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-open-sans",
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
    <html lang="en" className={`${arya.variable} ${openSans.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
