import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartStatusBar } from "@/components/home/CartStatusBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <SiteHeader />
        <Suspense fallback={null}>
          <CartStatusBar />
        </Suspense>
      </div>
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
