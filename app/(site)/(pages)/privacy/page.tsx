import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — El Gato Negro Coffee",
  description:
    "How El Gato Negro Coffee collects, uses, and protects your personal information.",
  robots: { index: false },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-brand-grey grain-overlay">
      {/* ── Header ──────────────────────────────────────────────── */}
      <section className="relative z-10 bg-brand-grey px-4 md:px-6 pt-4 pb-10 md:pt-8 md:pb-16">
        <div className="mx-auto max-w-7xl border-b-2 border-brand-black pb-10 md:pb-16">
          <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/50 mb-2">
            LEGAL
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight text-brand-black">
            Privacy Policy
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
              El Gato Negro Coffee (&quot;we,&quot; &quot;us,&quot; or
              &quot;our&quot;) operates the website{" "}
              <Link
                href="https://elgatonegro.coffee"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                elgatonegro.coffee
              </Link>{" "}
              and provides mobile espresso bar services. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you visit our website, make a purchase, create an
              account, or interact with us in any way.
            </p>
          </div>

          {/* 1. Information We Collect */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              1. Information We Collect
            </h2>

            <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-2">
              Information You Provide
            </h3>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1 mb-6">
              <li>
                <strong className="text-brand-black/90">Account information:</strong>{" "}
                Name, email address, and phone number when you create an account
                or check out as a guest.
              </li>
              <li>
                <strong className="text-brand-black/90">Billing and shipping details:</strong>{" "}
                Shipping address and billing information required to process your
                orders.
              </li>
              <li>
                <strong className="text-brand-black/90">Birthday:</strong>{" "}
                Optionally provided and stored as a customer profile field for
                marketing purposes (e.g., birthday offers).
              </li>
              <li>
                <strong className="text-brand-black/90">Marketing preferences:</strong>{" "}
                Whether you opt in to receive promotional emails from us.
              </li>
              <li>
                <strong className="text-brand-black/90">Inquiry and contact form data:</strong>{" "}
                Event details, venue information, guest counts, and any other
                details you submit through our booking inquiry forms.
              </li>
              <li>
                <strong className="text-brand-black/90">Order history:</strong>{" "}
                Records of purchases you make through our online shop or
                in-person point of sale.
              </li>
            </ul>

            <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-2">
              Information Collected Automatically
            </h3>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-brand-black/90">Device and browser data:</strong>{" "}
                IP address, browser type, operating system, and device
                identifiers collected through standard web server logs and
                analytics.
              </li>
              <li>
                <strong className="text-brand-black/90">Usage data:</strong>{" "}
                Pages visited, time spent on pages, and navigation patterns.
              </li>
              <li>
                <strong className="text-brand-black/90">Cookies:</strong>{" "}
                Session and authentication cookies as described in the Cookies
                section below.
              </li>
            </ul>
          </div>

          {/* 2. How We Use Your Information */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              2. How We Use Your Information
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              We use your information for the following purposes:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-brand-black/90">Order fulfillment:</strong>{" "}
                Processing and shipping your purchases, sending order
                confirmations, and delivering digital products.
              </li>
              <li>
                <strong className="text-brand-black/90">Account management:</strong>{" "}
                Creating and maintaining your customer account, authenticating
                your identity, and managing your preferences.
              </li>
              <li>
                <strong className="text-brand-black/90">Marketing:</strong>{" "}
                Sending promotional emails and offers only when you have
                explicitly opted in. You can unsubscribe at any time via the link
                in every marketing email.
              </li>
              <li>
                <strong className="text-brand-black/90">Inquiry response:</strong>{" "}
                Responding to your booking inquiries and event requests.
              </li>
              <li>
                <strong className="text-brand-black/90">Site improvement:</strong>{" "}
                Analyzing usage patterns to improve website performance,
                navigation, and content.
              </li>
              <li>
                <strong className="text-brand-black/90">Fraud prevention and security:</strong>{" "}
                Protecting against unauthorized access, spam, and fraudulent
                transactions.
              </li>
            </ul>
          </div>

          {/* 3. Third-Party Services */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              3. Third-Party Services
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-4">
              We share data with the following third-party services as necessary
              to operate our business. Each service processes only the data
              required for its function:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Payments
                </h3>
                <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-brand-black/90">Shopify Payments</strong>{" "}
                    processes online transactions. Shopify receives your name,
                    email, billing address, shipping address, and payment card
                    details to complete purchases.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Helcim</strong>{" "}
                    processes in-person point-of-sale transactions when you
                    purchase from our cart at events.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Authentication
                </h3>
                <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-brand-black/90">Shopify Customer Account API</strong>{" "}
                    handles customer login using OAuth 2.0 with PKCE. Your email
                    and profile information are exchanged during authentication.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Google Sign-In</strong>{" "}
                    is available as an optional login method. If you choose
                    Google Sign-In, Google shares your name, email, and profile
                    picture with us via OAuth.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Site Functionality
                </h3>
                <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-brand-black/90">Google Places API</strong>{" "}
                    provides address autocomplete. Partial address text you type
                    is sent to Google to return matching suggestions.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Cloudflare Turnstile</strong>{" "}
                    protects our forms from spam and abuse. It processes browser
                    signals (not personal data) to verify you are a real visitor.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Vercel</strong>{" "}
                    hosts our website and may collect basic analytics data such
                    as page views, geographic region, and referral source.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Content and Media
                </h3>
                <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-brand-black/90">Sanity CMS</strong>{" "}
                    manages our website content (events, blog posts, service
                    descriptions). Sanity does not receive or store any user
                    personal information.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Cloudinary</strong>{" "}
                    hosts and optimizes images displayed on our website. No user
                    personal data is sent to Cloudinary.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Communications
                </h3>
                <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-brand-black/90">Resend</strong>{" "}
                    delivers transactional emails (order confirmations, shipping
                    updates, password resets, inquiry responses). Your name and
                    email address are shared with Resend for delivery purposes.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Data Storage
                </h3>
                <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-brand-black/90">Neon (PostgreSQL)</strong>{" "}
                    is our database provider. Your account data, order history,
                    and inquiry records are stored in a Neon-hosted database.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4. Cookies and Tracking */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              4. Cookies and Tracking
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-4">
              Our website uses the following cookies:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full font-sans text-sm text-brand-black/70 border border-brand-black/10">
                <thead>
                  <tr className="bg-brand-black/[0.04] text-left">
                    <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black">
                      Cookie
                    </th>
                    <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black">
                      Purpose
                    </th>
                    <th className="px-4 py-3 font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-brand-black/10">
                    <td className="px-4 py-3 font-mono text-xs">
                      egn-customer-session
                    </td>
                    <td className="px-4 py-3">
                      Encrypted session cookie that keeps you logged in. Contains
                      no readable personal data. HTTP-only and secure.
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">90 days</td>
                  </tr>
                  <tr className="border-t border-brand-black/10">
                    <td className="px-4 py-3 font-mono text-xs">
                      egn-auth-state
                    </td>
                    <td className="px-4 py-3">
                      Temporary cookie used during the login process to prevent
                      cross-site request forgery. Automatically deleted after use.
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">10 minutes</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-4">
              Third-party services (Shopify, Google, Cloudflare) may set their
              own cookies when you interact with features that rely on them. We
              do not control third-party cookies. You can manage cookies through
              your browser settings. Disabling cookies may affect login and
              checkout functionality.
            </p>
          </div>

          {/* 5. Data Retention */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              5. Data Retention
            </h2>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-brand-black/90">Account data</strong> is
                retained for as long as your account remains active.
              </li>
              <li>
                <strong className="text-brand-black/90">Order records</strong>{" "}
                are retained for at least 7 years to comply with tax and
                accounting obligations.
              </li>
              <li>
                <strong className="text-brand-black/90">Inquiry data</strong> is
                retained for 2 years after the inquiry is resolved, then deleted.
              </li>
              <li>
                <strong className="text-brand-black/90">Marketing data</strong>{" "}
                is retained until you unsubscribe or request deletion.
              </li>
              <li>
                <strong className="text-brand-black/90">Session cookies</strong>{" "}
                expire automatically as described above.
              </li>
            </ul>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              When you request account deletion, we remove your personal
              information within 30 days, except where retention is required by
              law.
            </p>
          </div>

          {/* 6. Your Rights */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              6. Your Rights
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              You have the right to:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-brand-black/90">Access</strong> the
                personal information we hold about you.
              </li>
              <li>
                <strong className="text-brand-black/90">Correct</strong>{" "}
                inaccurate or incomplete personal information.
              </li>
              <li>
                <strong className="text-brand-black/90">Delete</strong> your
                personal information, subject to legal retention requirements.
              </li>
              <li>
                <strong className="text-brand-black/90">Withdraw consent</strong>{" "}
                for marketing communications at any time.
              </li>
              <li>
                <strong className="text-brand-black/90">Request a copy</strong>{" "}
                of your data in a portable format.
              </li>
            </ul>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              To exercise any of these rights, email us at{" "}
              <Link
                href="mailto:hello@elgatonegro.coffee"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                hello@elgatonegro.coffee
              </Link>
              . We will respond within 30 days.
            </p>
          </div>

          {/* 7. Children's Privacy */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              7. Children&apos;s Privacy
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              Our website and services are not directed at children under 13
              years of age. We do not knowingly collect personal information from
              children under 13. If you believe a child has provided us with
              personal information, please contact us at{" "}
              <Link
                href="mailto:hello@elgatonegro.coffee"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                hello@elgatonegro.coffee
              </Link>{" "}
              and we will promptly delete it.
            </p>
          </div>

          {/* 8. California Privacy Rights */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              8. California Privacy Rights
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              If you are a California resident, the California Consumer Privacy
              Act (CCPA) provides you with additional rights:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-brand-black/90">Right to know</strong>{" "}
                what personal information we collect, use, and disclose.
              </li>
              <li>
                <strong className="text-brand-black/90">Right to delete</strong>{" "}
                your personal information, subject to certain exceptions.
              </li>
              <li>
                <strong className="text-brand-black/90">Right to opt out</strong>{" "}
                of the sale of your personal information. We do not sell your
                personal information.
              </li>
              <li>
                <strong className="text-brand-black/90">
                  Right to non-discrimination
                </strong>{" "}
                for exercising your privacy rights.
              </li>
            </ul>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              To exercise your CCPA rights, contact us at{" "}
              <Link
                href="mailto:hello@elgatonegro.coffee"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                hello@elgatonegro.coffee
              </Link>
              . We will verify your identity before processing any request.
            </p>
          </div>

          {/* 9. Data Security */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              9. Data Security
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              We implement industry-standard security measures to protect your
              personal information, including encrypted data transmission
              (HTTPS/TLS), encrypted session cookies (JWE), secure database
              hosting, and access controls. However, no method of electronic
              transmission or storage is 100% secure. While we strive to protect
              your information, we cannot guarantee absolute security.
            </p>
          </div>

          {/* 10. Changes to This Policy */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              10. Changes to This Policy
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              We may update this Privacy Policy from time to time. When we make
              changes, we will update the &quot;Last Updated&quot; date at the
              top of this page. We encourage you to review this policy
              periodically. Continued use of our website after changes are posted
              constitutes your acceptance of the updated policy.
            </p>
          </div>

          {/* 11. Contact Us */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              11. Contact Us
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              If you have questions or concerns about this Privacy Policy or our
              data practices, contact us at:
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
