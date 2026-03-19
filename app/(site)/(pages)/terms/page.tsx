import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — El Gato Negro Coffee",
  description:
    "Terms and conditions governing your use of the El Gato Negro Coffee website and services.",
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-brand-grey">
      {/* ── Header ──────────────────────────────────────────────── */}
      <section className="bg-brand-grey px-4 md:px-6 pt-4 pb-10 md:pt-8 md:pb-16">
        <div className="mx-auto max-w-7xl border-b-2 border-brand-black pb-10 md:pb-16">
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/50 mb-2">
            LEGAL
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight text-brand-black">
            Terms of Service
          </h1>
          <p className="font-sans text-sm text-brand-black/50 mt-4">
            Last Updated: March 2026
          </p>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────── */}
      <section className="px-4 md:px-6 pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Introduction */}
          <div>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              Welcome to El Gato Negro Coffee. These Terms of Service
              (&quot;Terms&quot;) govern your use of the website located at{" "}
              <Link
                href="https://elgatonegro.coffee"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                elgatonegro.coffee
              </Link>{" "}
              (&quot;Site&quot;) and all related services, including our online
              shop, customer accounts, booking inquiries, and mobile espresso bar
              services (collectively, the &quot;Services&quot;), operated by El
              Gato Negro Coffee (&quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;).
            </p>
          </div>

          {/* 1. Acceptance of Terms */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              By accessing or using our Site and Services, you agree to be bound
              by these Terms and our{" "}
              <Link
                href="/privacy"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                Privacy Policy
              </Link>
              . If you do not agree to these Terms, do not use our Site or
              Services. We reserve the right to update these Terms at any time.
              Continued use of the Site after changes are posted constitutes your
              acceptance of the revised Terms.
            </p>
          </div>

          {/* 2. Account Responsibilities */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              2. Account Responsibilities
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              When you create an account, you agree to:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                Provide accurate, current, and complete information during
                registration.
              </li>
              <li>
                Keep your account credentials secure and confidential. You are
                responsible for all activity that occurs under your account.
              </li>
              <li>
                Notify us immediately at{" "}
                <Link
                  href="mailto:hello@elgatonegro.coffee"
                  className="text-brand-orange hover:text-brand-yellow transition-colors"
                >
                  hello@elgatonegro.coffee
                </Link>{" "}
                if you suspect unauthorized access to your account.
              </li>
              <li>
                Maintain only one account per person. Creating multiple accounts
                to circumvent restrictions or abuse promotions is prohibited.
              </li>
            </ul>
          </div>

          {/* 3. Purchases, Pricing, and Refunds */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              3. Purchases, Pricing, and Refunds
            </h2>

            <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-2">
              Pricing
            </h3>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-4">
              All prices are listed in US dollars. We reserve the right to change
              prices at any time without prior notice. Prices in effect at the
              time of your order will be honored for that transaction. Applicable
              taxes and shipping costs are calculated and displayed at checkout.
            </p>

            <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-2">
              Payment Processing
            </h3>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-4">
              Online payments are processed securely through Shopify Payments. We
              do not store your full payment card details on our servers.
              In-person purchases at events are processed through Helcim.
            </p>

            <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-2">
              Refund Policy — Physical Products
            </h3>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-4">
              If you are unsatisfied with a physical product (merchandise, coffee
              beans, etc.), you may request a return within 30 days of delivery.
              Items must be unused and in their original condition. Once we
              receive and inspect the returned item, we will issue a refund to
              your original payment method. Shipping costs for returns are the
              responsibility of the buyer unless the item arrived damaged or
              defective.
            </p>

            <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-2">
              Refund Policy — Digital Products
            </h3>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-4">
              Digital products (3D models, downloadable resources, and other
              digital goods) are non-refundable. Due to the nature of digital
              delivery, all sales of digital products are final. If you
              experience a technical issue accessing a digital product, contact
              us and we will work to resolve it.
            </p>

            <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-2">
              Event and Catering Services
            </h3>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              Booking terms, deposits, cancellation policies, and refund
              conditions for event and catering services are provided in your
              individual service agreement at the time of booking. Those terms
              take precedence over general refund policies stated here.
            </p>
          </div>

          {/* 4. Intellectual Property */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              4. Intellectual Property
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              All content on this Site — including text, graphics, logos, images,
              photography, videos, product designs, 3D models, blog posts, build
              guides, and software — is the property of El Gato Negro Coffee or
              its content licensors and is protected by United States and
              international copyright, trademark, and intellectual property laws.
              You may not reproduce, distribute, modify, create derivative works
              from, publicly display, or commercially exploit any content without
              our prior written permission.
            </p>
          </div>

          {/* 5. User-Generated Content */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              5. User-Generated Content
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              If you submit content to our Site (such as product reviews, inquiry
              messages, or other communications), you grant us a non-exclusive,
              royalty-free, perpetual, and worldwide license to use, display,
              reproduce, and distribute that content in connection with our
              Services. You represent that:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>You own or have the necessary rights to the content.</li>
              <li>
                The content does not infringe any third party&apos;s rights.
              </li>
              <li>
                The content is not unlawful, defamatory, obscene, or otherwise
                objectionable.
              </li>
            </ul>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              We reserve the right to remove any user-generated content at our
              sole discretion.
            </p>
          </div>

          {/* 6. Prohibited Uses */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              6. Prohibited Uses
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              You agree not to:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                Use the Site or Services for any unlawful purpose or in violation
                of any applicable laws.
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the Site, other
                accounts, or any systems or networks connected to the Site.
              </li>
              <li>
                Use automated tools (bots, scrapers, crawlers) to access or
                collect data from the Site without our express written permission.
              </li>
              <li>
                Interfere with or disrupt the operation of the Site or the servers
                and networks that host it.
              </li>
              <li>
                Submit false or misleading information in accounts, orders, or
                inquiries.
              </li>
              <li>
                Impersonate any person or entity, or falsely represent your
                affiliation with any person or entity.
              </li>
              <li>
                Use the Site to transmit spam, chain letters, or unsolicited
                communications.
              </li>
              <li>
                Circumvent, disable, or interfere with any security features of
                the Site.
              </li>
            </ul>
          </div>

          {/* 7. Limitation of Liability */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              7. Limitation of Liability
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              To the fullest extent permitted by law, El Gato Negro Coffee, its
              owners, employees, and affiliates shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages
              arising from or related to your use of (or inability to use) the
              Site or Services, including but not limited to:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>Loss of profits, revenue, or data.</li>
              <li>
                Errors, interruptions, or delays in the operation of the Site.
              </li>
              <li>
                Unauthorized access to or alteration of your data or
                transmissions.
              </li>
              <li>Any third-party conduct on or related to the Site.</li>
            </ul>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              Our total liability for any claim arising from these Terms or your
              use of the Services shall not exceed the amount you paid to us in
              the 12 months preceding the claim.
            </p>
          </div>

          {/* 8. Disclaimer of Warranties */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              8. Disclaimer of Warranties
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              The Site and Services are provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of any kind, either express or
              implied, including but not limited to implied warranties of
              merchantability, fitness for a particular purpose, and
              non-infringement. We do not warrant that the Site will be
              uninterrupted, error-free, or free of viruses or other harmful
              components.
            </p>
          </div>

          {/* 9. Dispute Resolution */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              9. Dispute Resolution
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              Any dispute arising from these Terms or your use of the Site and
              Services shall be resolved as follows:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-brand-black/90">
                  Informal resolution first:
                </strong>{" "}
                Before filing any formal claim, you agree to contact us at{" "}
                <Link
                  href="mailto:hello@elgatonegro.coffee"
                  className="text-brand-orange hover:text-brand-yellow transition-colors"
                >
                  hello@elgatonegro.coffee
                </Link>{" "}
                and attempt to resolve the dispute informally for at least 30
                days.
              </li>
              <li>
                <strong className="text-brand-black/90">Binding arbitration:</strong>{" "}
                If informal resolution fails, any remaining dispute shall be
                resolved by binding arbitration in accordance with the rules of
                the American Arbitration Association. Arbitration shall take place
                in the State of Texas.
              </li>
              <li>
                <strong className="text-brand-black/90">Class action waiver:</strong>{" "}
                You agree to resolve disputes with us on an individual basis and
                waive any right to participate in a class action lawsuit or
                class-wide arbitration.
              </li>
            </ul>
          </div>

          {/* 10. Governing Law */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              10. Governing Law
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              These Terms shall be governed by and construed in accordance with
              the laws of the State of Texas, United States, without regard to
              its conflict of law provisions. Any legal action or proceeding not
              subject to arbitration shall be brought exclusively in the state or
              federal courts located in Texas.
            </p>
          </div>

          {/* 11. Termination */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              11. Termination
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              We reserve the right to suspend or terminate your account and
              access to the Site at our sole discretion, without prior notice, for
              any reason, including but not limited to violation of these Terms.
              You may also close your account at any time by contacting us at{" "}
              <Link
                href="mailto:hello@elgatonegro.coffee"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                hello@elgatonegro.coffee
              </Link>
              . Upon termination, your right to use the Site ceases immediately.
              Provisions that by their nature should survive termination
              (including intellectual property, limitation of liability, dispute
              resolution, and governing law) shall survive.
            </p>
          </div>

          {/* 12. Indemnification */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              12. Indemnification
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              You agree to indemnify, defend, and hold harmless El Gato Negro
              Coffee, its owners, employees, and affiliates from and against any
              claims, liabilities, damages, losses, and expenses (including
              reasonable attorney fees) arising from your use of the Site or
              Services, your violation of these Terms, or your violation of any
              third-party rights.
            </p>
          </div>

          {/* 13. Changes to These Terms */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              13. Changes to These Terms
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              We may revise these Terms at any time by updating this page. The
              &quot;Last Updated&quot; date at the top of this page reflects when
              the most recent changes were made. We encourage you to review these
              Terms periodically. Your continued use of the Site after any
              changes constitutes your acceptance of the revised Terms.
            </p>
          </div>

          {/* 14. Severability */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              14. Severability
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              If any provision of these Terms is found to be unenforceable or
              invalid by a court of competent jurisdiction, that provision shall
              be limited or eliminated to the minimum extent necessary, and the
              remaining provisions shall remain in full force and effect.
            </p>
          </div>

          {/* 15. Contact Us */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              15. Contact Us
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              If you have questions about these Terms, contact us at:
            </p>
            <div className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              <p>El Gato Negro Coffee</p>
              <p>
                Email:{" "}
                <Link
                  href="mailto:hello@elgatonegro.coffee"
                  className="text-brand-orange hover:text-brand-yellow transition-colors"
                >
                  hello@elgatonegro.coffee
                </Link>
              </p>
              <p>
                Website:{" "}
                <Link
                  href="https://elgatonegro.coffee"
                  className="text-brand-orange hover:text-brand-yellow transition-colors"
                >
                  elgatonegro.coffee
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
