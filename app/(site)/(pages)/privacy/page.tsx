import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
  description:
    "How El Gato Negro Coffee collects, uses, and protects your personal information.",
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
            Last Updated: November 17, 2026
          </p>
        </div>
      </section>

      {/* ── Content ─────────────────────────────────────────────── */}
      <section className="relative z-10 px-4 md:px-6 pb-16 md:pb-24">
        <div className="mx-auto max-w-3xl space-y-12">
          {/* Introduction */}
          <div>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              El Gato Negro Coffee (&quot;we,&quot; &quot;us&quot; or
              &quot;our&quot;) runs the website{" "}
              <Link
                href="https://elgatonegro.coffee"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                elgatonegro.coffee
              </Link>{" "}
              and a mobile espresso bar. This policy covers the website, our
              online shop, customer accounts, our booking and job application
              forms, and purchases at the cart. It explains what we collect,
              where it goes, how long we keep it and what you can do about it.
            </p>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              Our online shop runs on Shopify. When you shop, check out or use
              your customer account, Shopify collects your details and holds
              them for us. This policy treats that data as data we collect.
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
                <strong className="text-brand-black/90">Booking inquiries:</strong>{" "}
                your name, email address, phone number (optional), the service
                you want, the event date, the venue or location, the headcount
                and any message you add (optional).
              </li>
              <li>
                <strong className="text-brand-black/90">Job applications:</strong>{" "}
                your first and last name, email address, phone number, current
                or last coffee shop, years of experience, availability, whether
                you&apos;re based in the Nashville area and anything else you
                add (optional).
              </li>
              <li>
                <strong className="text-brand-black/90">Account and checkout details:</strong>{" "}
                your name, email address and phone number. Shopify collects
                these when you create an account or check out.
              </li>
              <li>
                <strong className="text-brand-black/90">Shipping and billing details:</strong>{" "}
                the addresses and payment details you enter at checkout, and the
                addresses you save in your account. A saved address can include
                a phone number (optional).
              </li>
              <li>
                <strong className="text-brand-black/90">Birthday:</strong>{" "}
                optional. Shopify keeps it in your customer profile. We&apos;ll
                use it only for marketing, such as a birthday offer.
              </li>
              <li>
                <strong className="text-brand-black/90">Marketing choice:</strong>{" "}
                whether you agree to get marketing emails. You can opt in or out
                in your account profile, and at checkout or sign-in where we
                offer the box.
              </li>
              <li>
                <strong className="text-brand-black/90">Order history:</strong>{" "}
                what you buy online, held by Shopify, and what you buy at the
                cart, held by Helcim.
              </li>
              <li>
                <strong className="text-brand-black/90">Cart contents:</strong>{" "}
                the products and quantities in your cart. Your cart isn&apos;t
                linked to your account.
              </li>
            </ul>

            <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-2">
              Information Collected Automatically
            </h3>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-brand-black/90">Request data:</strong>{" "}
                your IP address, your browser&apos;s user agent (it names your
                browser and operating system) and the pages you load. Our host
                receives these with every request.
              </li>
              <li>
                <strong className="text-brand-black/90">Form submissions:</strong>{" "}
                your IP address, which we use to stop spam and abuse on our
                forms.
              </li>
              <li>
                <strong className="text-brand-black/90">Cookies:</strong>{" "}
                three cookies that keep you signed in and keep your cart. See
                section 4.
              </li>
            </ul>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              This site runs no analytics and no advertising pixels.
            </p>
          </div>

          {/* 2. How We Use Your Information */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              2. How We Use Your Information
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              We use your information for these purposes:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-brand-black/90">Bookings:</strong>{" "}
                answering your inquiry, quoting and booking the cart, and
                sending you a confirmation of what you asked for.
              </li>
              <li>
                <strong className="text-brand-black/90">Hiring:</strong>{" "}
                reviewing your job application and contacting you about it.
              </li>
              <li>
                <strong className="text-brand-black/90">Orders:</strong>{" "}
                taking payment, shipping your order, sending order emails and
                keeping your order history.
              </li>
              <li>
                <strong className="text-brand-black/90">Your account:</strong>{" "}
                signing you in, showing your orders, profile and addresses, and
                saving your changes.
              </li>
              <li>
                <strong className="text-brand-black/90">Marketing:</strong>{" "}
                sending marketing email, only if you&apos;ve opted in. You can
                opt out at any time in your account profile. Any marketing email
                we send will include an unsubscribe link.
              </li>
              <li>
                <strong className="text-brand-black/90">Store admin:</strong>{" "}
                helping our staff look up customers and orders with an AI
                assistant. See Staff Tools in section 3.
              </li>
              <li>
                <strong className="text-brand-black/90">Fraud prevention and security:</strong>{" "}
                blocking spam and abuse on our forms, and protecting sign-in.
              </li>
            </ul>
          </div>

          {/* 3. Third-Party Services */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              3. Third-Party Services
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-4">
              These are the services behind our website and shop, and the
              personal data each one gets, if any.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Shop and Payments
                </h3>
                <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-brand-black/90">Shopify</strong>{" "}
                    runs our online store: the cart, customer sign-in and the
                    checkout at checkout.elgatonegro.coffee. It holds your cart,
                    your order history and everything you enter at checkout and
                    in your account. Your card details go straight to Shopify.
                    Our website&apos;s code never sees them.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Helcim</strong>{" "}
                    processes card payments at the cart. Your card details go
                    from the card terminal to Helcim. Our site reads only the
                    items sold and their quantities, so we can update shop
                    stock. It reads no customer data.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Sign-In
                </h3>
                <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-brand-black/90">Shopify customer accounts:</strong>{" "}
                    &quot;Sign In&quot; and &quot;Create an account&quot; both
                    take you to Shopify&apos;s own sign-in page. Our site then
                    receives your Shopify customer ID, email address, and first
                    and last name. If you use another sign-in service on
                    Shopify&apos;s page, that service shares your details with
                    Shopify, not with us. We never receive your profile picture.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Site Functionality
                </h3>
                <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-brand-black/90">Google Maps and Places</strong>{" "}
                    load when you open the booking inquiry page or the address
                    page in your account. Loading them sends Google your IP
                    address, browser details and the address of the page. When
                    you type a venue or address, Google receives that text and
                    returns suggestions. Other Google Maps links on our site are
                    plain links. Google gets nothing from them unless you click
                    one.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Cloudflare Turnstile</strong>{" "}
                    checks that a real person is sending our booking and job
                    application forms. The check runs in your browser. When you
                    submit a form, our server sends Cloudflare the result of
                    that check and your IP address.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Upstash</strong>{" "}
                    stores your IP address each time you submit a form. We use
                    it to limit how often one address can send a form.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Vercel</strong>{" "}
                    hosts our website. It receives every request, including your
                    IP address, your browser&apos;s user agent and the page
                    address. When we block a form submission, our code also
                    writes your IP address to Vercel&apos;s logs.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Content and Media
                </h3>
                <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-brand-black/90">Sanity</strong>{" "}
                    stores our site content: events, blog posts and service
                    pages. Our server fetches it. Sanity receives no visitor
                    data.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Images</strong>{" "}
                    load through Vercel&apos;s image service, so your browser
                    doesn&apos;t contact Sanity or Shopify to show them.
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
                    sends the emails from our forms. For a booking inquiry,
                    Resend sends every field you enter to our
                    sales@elgatonegro.coffee inbox, and sends you a confirmation
                    with your first name, service, event date and venue. For a
                    job application, Resend sends every field you enter to our
                    gato@elgatonegro.coffee inbox. Resend keeps a log of the
                    emails it sends for us.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Shopify</strong>{" "}
                    sends your order emails, such as order and shipping
                    confirmations. Our store address is shop@elgatonegro.coffee.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Data Storage
                </h3>
                <p className="font-sans text-sm leading-relaxed text-brand-black/70">
                  We don&apos;t run a database of our own. Shopify holds your
                  account, profile, saved addresses and online orders. Helcim
                  holds in-person sales. Booking inquiries and job applications
                  exist only as emails: in our inboxes, in Resend&apos;s log
                  and, for your booking confirmation, in your own inbox.
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-1">
                  Staff Tools
                </h3>
                <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
                  <li>
                    <strong className="text-brand-black/90">Clerk</strong>{" "}
                    handles staff sign-in to our admin site,
                    admin.elgatonegro.coffee. It holds staff data only. Visitors
                    and customers never use it.
                  </li>
                  <li>
                    <strong className="text-brand-black/90">Admin assistant:</strong>{" "}
                    our admin has an AI assistant that runs on a model from
                    Anthropic, reached through Vercel AI Gateway. When staff use
                    it to look up customers or orders, it sends Shopify customer
                    data to Anthropic through Vercel: names, email addresses,
                    order details, shipping addresses and spend totals.
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
              Our website sets three cookies. None of them track you or serve
              ads.
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
                      Keeps you signed in. Encrypted. Holds your Shopify
                      customer ID, email address, first and last name, and the
                      sign-in tokens Shopify issues.
                    </td>
                    <td className="px-4 py-3">
                      90 days, restarted each time your sign-in refreshes.
                      Deleted when you sign out.
                    </td>
                  </tr>
                  <tr className="border-t border-brand-black/10">
                    <td className="px-4 py-3 font-mono text-xs">
                      egn-auth-state
                    </td>
                    <td className="px-4 py-3">
                      Protects sign-in against cross-site request forgery. Holds
                      encrypted one-time sign-in codes.
                    </td>
                    <td className="px-4 py-3">
                      10 minutes. Deleted as soon as you sign in.
                    </td>
                  </tr>
                  <tr className="border-t border-brand-black/10">
                    <td className="px-4 py-3 font-mono text-xs">
                      egn-cart-id
                    </td>
                    <td className="px-4 py-3">
                      Keeps your cart. Encrypted. Holds your Shopify cart ID
                      only.
                    </td>
                    <td className="px-4 py-3">
                      30 days from when you start the cart.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-4">
              All three are HttpOnly and Secure. Scripts on the page can&apos;t
              read them, and your browser sends them only over HTTPS. We set no
              other cookies and use no other browser storage.
            </p>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              Cloudflare Turnstile (on our forms), Google Maps (on the inquiry
              and address pages) and Shopify (on its sign-in page and at
              checkout) may set their own cookies or browser storage. We
              don&apos;t control those. You can block or clear cookies in your
              browser settings. If you block them, sign-in and the cart stop
              working.
            </p>
          </div>

          {/* 5. Data Retention */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              5. Data Retention
            </h2>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-brand-black/90">Account data:</strong>{" "}
                we keep it in Shopify while your account is active.
              </li>
              <li>
                <strong className="text-brand-black/90">Order records:</strong>{" "}
                we keep them for at least 7 years, for tax and accounting.
              </li>
              <li>
                <strong className="text-brand-black/90">
                  Booking inquiries and job applications
                </strong>{" "}
                stay in our email inboxes as long as we need them to answer you,
                book your event or fill a job. Ask us and we&apos;ll delete
                yours.
              </li>
              <li>
                <strong className="text-brand-black/90">Your marketing choice</strong>{" "}
                stays in your Shopify profile. Opting out changes it to
                &quot;unsubscribed&quot; but doesn&apos;t delete it. Ask us if
                you want it deleted.
              </li>
              <li>
                <strong className="text-brand-black/90">IP addresses</strong>{" "}
                we use to limit form submissions expire after about 2 hours.
              </li>
              <li>
                <strong className="text-brand-black/90">
                  Server logs and Resend&apos;s email log:
                </strong>{" "}
                Vercel and Resend keep them for the periods they set.
              </li>
              <li>
                <strong className="text-brand-black/90">Cookies</strong> expire
                as listed in section 4.
              </li>
            </ul>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              Ask us to delete your account and we&apos;ll remove your personal
              information within 30 days, except what the law requires us to
              keep, such as order records.
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
                <strong className="text-brand-black/90">Access</strong> your
                personal information. Your account shows your orders, profile
                and saved addresses. Ask us for anything else we hold about you.
              </li>
              <li>
                <strong className="text-brand-black/90">Correct</strong> it.
                You can change your name, birthday and saved addresses in your
                account. You can&apos;t change your email address on our site,
                so email us to correct it or anything else.
              </li>
              <li>
                <strong className="text-brand-black/90">Delete</strong> it,
                except what the law requires us to keep. You can delete saved
                addresses yourself. Ask us to delete your account or anything
                else.
              </li>
              <li>
                <strong className="text-brand-black/90">Withdraw consent</strong>{" "}
                for marketing emails at any time. Opt out in your account
                profile, or ask us.
              </li>
              <li>
                <strong className="text-brand-black/90">Get a copy</strong> of
                your personal information in a portable format. Ask us.
              </li>
            </ul>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              To use any of these rights, email us at{" "}
              <Link
                href="mailto:shop@elgatonegro.coffee"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                shop@elgatonegro.coffee
              </Link>
              . We&apos;ll reply within 30 days.
            </p>
          </div>

          {/* 7. Children's Privacy */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              7. Children&apos;s Privacy
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              Our website and services aren&apos;t meant for children under 13.
              We don&apos;t knowingly collect personal information from children
              under 13. If you think a child has given us personal information,
              email us at{" "}
              <Link
                href="mailto:shop@elgatonegro.coffee"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                shop@elgatonegro.coffee
              </Link>{" "}
              and we&apos;ll delete it.
            </p>
          </div>

          {/* 8. California Privacy Rights */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              8. California Privacy Rights
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              If you live in California, we give you the rights the California
              Consumer Privacy Act (CCPA) describes:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                <strong className="text-brand-black/90">Right to know</strong>{" "}
                what personal information we collect, use and disclose.
              </li>
              <li>
                <strong className="text-brand-black/90">Right to delete</strong>{" "}
                your personal information, with some exceptions.
              </li>
              <li>
                <strong className="text-brand-black/90">Right to correct</strong>{" "}
                personal information we hold about you that&apos;s wrong.
              </li>
              <li>
                <strong className="text-brand-black/90">Right to opt out</strong>{" "}
                of the sale or sharing of your personal information. We
                don&apos;t sell it or share it for advertising, and we
                won&apos;t.
              </li>
              <li>
                <strong className="text-brand-black/90">Right to limit</strong>{" "}
                the use and disclosure of your sensitive personal information.
                We&apos;ll use sensitive information, such as the card details
                you give Shopify or Helcim and your sign-in tokens, only to take
                your payment and keep you signed in.
              </li>
              <li>
                <strong className="text-brand-black/90">
                  Right to non-discrimination
                </strong>{" "}
                for using any of these rights.
              </li>
            </ul>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              To use your California rights, email us at{" "}
              <Link
                href="mailto:shop@elgatonegro.coffee"
                className="text-brand-orange hover:text-brand-yellow transition-colors"
              >
                shop@elgatonegro.coffee
              </Link>
              . We&apos;ll confirm who you are before we act on a request.
            </p>
          </div>

          {/* 9. Data Security */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              9. Data Security
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mb-3">
              We protect your information with:
            </p>
            <ul className="font-sans text-sm leading-relaxed text-brand-black/70 list-disc pl-5 space-y-1">
              <li>
                HTTPS on every page. Our site tells browsers to always use it.
              </li>
              <li>
                Encrypted cookies, so their contents can&apos;t be read in your
                browser.
              </li>
              <li>
                Access controls. Staff sign in through Clerk to reach our admin,
                and your account pages open only when you&apos;re signed in.
              </li>
            </ul>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              No website is completely secure, so we can&apos;t guarantee your
              information will never be exposed.
            </p>
          </div>

          {/* 10. Changes to This Policy */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              10. Changes to This Policy
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              We may update this policy. When we do, we&apos;ll change the
              &quot;Last Updated&quot; date at the top of this page. If you keep
              using our website after a change, the updated policy applies.
            </p>
          </div>

          {/* 11. Contact Us */}
          <div>
            <h2 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              11. Contact Us
            </h2>
            <p className="font-sans text-sm leading-relaxed text-brand-black/70">
              For questions about this policy or your data, contact us:
            </p>
            <div className="font-sans text-sm leading-relaxed text-brand-black/70 mt-3">
              <p>El Gato Negro Coffee</p>
              <p>
                Email:{" "}
                <Link
                  href="mailto:shop@elgatonegro.coffee"
                  className="text-brand-orange hover:text-brand-yellow transition-colors"
                >
                  shop@elgatonegro.coffee
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
