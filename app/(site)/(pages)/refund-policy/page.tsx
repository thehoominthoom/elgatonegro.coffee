import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy — El Gato Negro Coffee",
  description:
    "How returns, refunds, and replacements work for everything sold by El Gato Negro Coffee.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-brand-grey grain-overlay">
      {/* ── Header ──────────────────────────────────────────────── */}
      <section className="relative z-10 bg-brand-grey px-4 md:px-6 pt-4 pb-10 md:pt-8 md:pb-16">
        <div className="mx-auto max-w-7xl border-b-2 border-brand-black pb-10 md:pb-16">
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/50 mb-2">
            LEGAL
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight text-brand-black">
            Refund Policy
          </h1>
          <p className="font-sans text-sm text-brand-black/50 mt-4">
            Last Updated: March 2026
          </p>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────── */}
      <section className="relative z-10 px-4 md:px-6 pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Introduction */}
          <div>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              We want you to be happy with what you bought. If something is not
              right, we will work with you to fix it. Here is how returns,
              refunds, and replacements work for everything we sell.
            </p>
          </div>

          {/* Coffee Beans */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              Coffee Beans
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              Coffee is perishable. It is roasted fresh, and we cannot resell it
              once it leaves our hands. Because of that,{" "}
              <strong className="text-brand-black/90">
                all coffee bean sales are final
              </strong>
              .
            </p>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              If your beans arrive damaged, you received the wrong order, or
              something is off with the quality, reach out within{" "}
              <strong className="text-brand-black/90">
                7 days of delivery
              </strong>
              . We will send a replacement or issue store credit.
            </p>
          </div>

          {/* Merchandise and Apparel */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              Merchandise and Apparel
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              You have{" "}
              <strong className="text-brand-black/90">
                30 days from delivery
              </strong>{" "}
              to return merchandise and apparel. Items must be unworn, unwashed,
              and unused with all original tags attached.
            </p>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              Returns are refunded to your original payment method within 5-10
              business days after we receive the item. You are responsible for
              return shipping costs.
            </p>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              If your item arrived damaged or defective, contact us and we will
              cover return shipping and send a replacement.
            </p>
          </div>

          {/* Coffee Accessories */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              Coffee Accessories
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              Same rules as merchandise.{" "}
              <strong className="text-brand-black/90">
                30 days from delivery
              </strong>
              , unused, in original packaging. Customer covers return shipping.
            </p>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              Defective items get replaced at no cost to you.
            </p>
          </div>

          {/* Digital Goods */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              Digital Goods
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              <strong className="text-brand-black/90">
                All digital product sales are final.
              </strong>{" "}
              No refunds once a file has been delivered or downloaded.
            </p>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              If your file is corrupted or you cannot access your download,
              contact us and we will get you a working copy.
            </p>
          </div>

          {/* Mobile Cart Purchases */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              Mobile Cart Purchases
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              Everything purchased at the cart — drinks, food, anything handed to
              you in person — is{" "}
              <strong className="text-brand-black/90">final sale</strong>. No
              refunds on cart purchases.
            </p>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              Not happy with your drink? Tell the barista before you leave. They
              will remake it on the spot.
            </p>
          </div>

          {/* Damaged or Lost Shipments */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              Damaged or Lost Shipments
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              <strong className="text-brand-black/90">
                Damaged in transit:
              </strong>{" "}
              Contact us within 7 days of delivery with photos of the damage. We
              will replace the item or issue a refund.
            </p>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              <strong className="text-brand-black/90">Lost packages:</strong> If
              your order never arrives, let us know. We will file a claim with
              the carrier and either reship your order or refund you.
            </p>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              <strong className="text-brand-black/90">Wrong item:</strong> If we
              shipped the wrong thing, we cover return shipping and send the
              correct item.
            </p>
          </div>

          {/* How to Request a Return */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              How to Request a Return
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              Email{" "}
              <Link
                href="mailto:returns@elgatonegro.coffee"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                returns@elgatonegro.coffee
              </Link>{" "}
              with:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>Your order number</li>
              <li>The item(s) you want to return</li>
              <li>The reason for the return</li>
            </ul>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              We will respond within 2 business days with instructions.
            </p>
          </div>

          {/* Return Shipping */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              Return Shipping
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              You pay return shipping on all standard returns. We recommend using
              a trackable shipping method — we are not responsible for returns
              lost in transit.
            </p>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              We cover shipping costs when the issue is on our end: wrong item,
              defective product, or damage that happened before it reached you.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
