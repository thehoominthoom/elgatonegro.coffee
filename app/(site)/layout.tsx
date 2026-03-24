import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NavDrawerProvider, NavDrawer } from "@/components/layout/NavDrawer";
import { CartStatusBar } from "@/components/home/CartStatusBar";
import { CartProvider } from "@/components/shop/CartProvider";
import { CartDrawer } from "@/components/shop/CartDrawer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <NavDrawerProvider>
        <div className="flex flex-col min-h-screen">
          <div data-site-header-wrapper className="fixed top-0 left-0 right-0 z-50 [filter:blur(0.4px)]">
            <SiteHeader />
            <Suspense fallback={null}>
              <CartStatusBar />
            </Suspense>
          </div>
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
        <NavDrawer />
        <CartDrawer />
      </NavDrawerProvider>
    </CartProvider>
  );
}
