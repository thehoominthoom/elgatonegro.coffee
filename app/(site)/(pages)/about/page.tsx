import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroImageFrame } from "@/components/shared/HeroImageFrame";

// ── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
  description:
    "El Gato Negro is Nashville's mobile coffee cart — two friends, too many margaritas at El Fuego, and a business that's more events company than coffee company.",
  openGraph: {
    title: "About — El Gato Negro Coffee",
    description:
      "Two friends, too many margaritas at El Fuego, one espresso machine. El Gato Negro — Nashville's mobile coffee cart.",
    type: "website",
    images: [
      {
        url: "/images/about/crew_in_front_of_cart_exchange-260110.webp",
        width: 1200,
        height: 630,
        alt: "El Gato Negro Coffee crew in front of the cart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — El Gato Negro Coffee",
    description:
      "Two friends, too many margaritas at El Fuego, one espresso machine. El Gato Negro — Nashville's mobile coffee cart.",
    images: ["/images/about/crew_in_front_of_cart_exchange-260110.webp"],
  },
};

// ── Data ──────────────────────────────────────────────────────────────────────

const team = [
  {
    name: "Juan Martinez",
    title: "Co-founder",
    role: "Relationships & Growth",
    paragraphs: [
      "I handle the relationships. Clients, negotiations, social media, the shape of where this thing goes. Before EGN I ran a nonprofit and had a vintage furniture business — different rooms, same instinct. You're always connecting people around something. You're always trying to understand what a person actually needs versus what they say they want.",
      "My coffee order: simple, always. Anything more than a little honey and you've turned coffee into dessert. I don't need dessert for breakfast.",
    ],
    describedSelf: "How I'd describe myself: loving and sassy.",
    describedOther: "How Phil describes me: communal and dedicated.",
    image: "/images/about/misc-founding.bts-portrait-juan-01.webp",
    imageAlt: "Portrait of Juan Martinez, co-founder of El Gato Negro",
  },
  {
    name: "Phil Bartko",
    title: "Co-founder",
    role: "Design, Tech & Build",
    paragraphs: [
      "I handle the back end. Accounting, web development, cart builds, design. If I'm not at the cart, I'm behind the scenes doing something that keeps it running.",
      "I've been doing branding and design since high school. My career got weird in all the best ways — archaeologist, bicycle mechanic, hospice worker, nonprofits. I'm sure all of it shows up somewhere in this brand.",
      "What drew me to coffee: I think it might be Burroughs — the idea that the original coffeehouses were one of the only spaces where the bourgeoisie and the commoners sat at the same table. Coffee didn't care where you came from. It still doesn't.",
    ],
    describedSelf: "How I'd describe myself: curious and capable.",
    describedOther: "How Juan describes me: particular and caring.",
    image: "/images/about/the_exchange-barista.cart-service-phil-02.webp",
    imageAlt:
      "Portrait of Phil Bartko working the El Gato Negro cart at The Exchange residency",
  },
];

const approach = [
  {
    title: "Third spaces.",
    description:
      "Home is home. Work is work. Somewhere in between is where people actually choose to be — where they stay longer than they meant to, run into someone they didn't expect, leave feeling less alone. That's what we're building. Not a transaction. A room.",
  },
  {
    title: "Good coffee. No lecture.",
    description:
      "We're not going to explain the terroir to you. We're going to make you something simple and made well. Coffee is the medium. It doesn't need to be a personality.",
  },
  {
    title: "No clickiness.",
    description:
      "All who are welcoming are welcome. Building family — not a list, not a vibe, not an exclusive thing with a door policy. You show up, you're in.",
  },
  {
    title: "Mobile first.",
    description:
      "We don't wait for community to come to us. We go where it already is.",
  },
];

const yearOneStrip = [
  {
    src: "/images/about/rad_100-bts-outdoor.setup-none-02.webp",
    alt: "Truck bed loaded with the El Gato Negro rig at R.A.D. 100 — cold brew bucket, coolers, coffee boxes, and a cake dome on the tailgate",
    caption: "R.A.D. 100, load-in.",
  },
  {
    src: "/images/about/rad_100-community.decor-outdoor.setup-phil.juan.blue-02.webp",
    alt: "Four people around a mid-century coffee table and cowhide rug set up on the pavement beside a truck at R.A.D. 100, with the El Gato Negro sandwich-board sign",
    caption: "R.A.D. 100, rug included.",
  },
  {
    src: "/images/about/brass_horn-founding.bts.coffee_tasting.roaster-misc-na-02.webp",
    alt: "Cupping table at the Brass Horn roaster covered in tasting bowls, sample cards, and spoons",
    caption: "Brass Horn, cupping homework.",
  },
  {
    src: "/images/about/ernies-bts.drinking-portrait-juan-03.webp",
    alt: "Juan Martinez grinning over a beer at a graffiti-covered patio table at Ernie's",
    caption: "Ernie's, debrief.",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ── 1. Hero — Full-viewport image + massive type ──────────────── */}
      <HeroImageFrame
        src="/images/about/crew_in_front_of_cart_exchange-260110.webp"
        alt="El Gato Negro crew in front of the coffee cart"
        minHeight="100svh"
        bleedTop
        objectPosition="center 35%"
      >
        <div className="absolute inset-0 z-10 flex flex-col justify-end max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-orange mb-4">
            Nashville, TN
          </p>
          <h1
            className="font-display font-bold uppercase text-brand-grey tracking-tight leading-[0.9]"
            style={{ fontSize: "var(--text-hero)" }}
          >
            We&apos;re not
            <br />
            a coffee
            <br />
            company.
          </h1>
          <p className="font-sans text-lg md:text-xl text-brand-grey/70 max-w-md leading-relaxed mt-6">
            We&apos;re an events company that happens to make really good
            coffee. The coffee is just how we get everyone in the same room.
          </p>
        </div>
      </HeroImageFrame>

      {/* ── 2. Origin Story — Magazine spread ──────────────────────────── */}
      <section className="relative bg-brand-black overflow-hidden grain-overlay-dark">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-28">
          {/* Mobile-only heading above grid */}
          <div className="md:hidden mb-8">
            <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-4">
              How it started
            </p>
            <h2 className="font-display font-bold text-3xl uppercase text-brand-grey tracking-tight leading-[0.9]">
              Too many
              <br />
              margaritas
              <br />
              at El Fuego.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 items-center">
            {/* Left column — text + inset image */}
            <div className="md:col-span-5 order-2 md:order-1">
              {/* Desktop heading */}
              <div className="hidden md:block mb-10">
                <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-4">
                  How it started
                </p>
                <h2 className="font-display font-bold text-4xl lg:text-5xl xl:text-6xl uppercase text-brand-grey tracking-tight leading-[0.9]">
                  Too many
                  <br />
                  margaritas
                  <br />
                  at El Fuego.
                </h2>
              </div>

              {/* Body text with orange left border */}
              <div className="border-l-2 border-brand-orange pl-5 md:pl-6 space-y-5 mb-10 md:mb-12">
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-grey/70">
                  Juan had been talking about this for a while. He had a list.
                  He&apos;d done the math. Phil had heard the pitch. It was a
                  good pitch.
                </p>
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-grey/70">
                  None of that is what actually locked it in.
                </p>
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-grey/70">
                  What locked it in was sitting at El Fuego, somewhere deep into
                  the margarita situation, when we had the purchase screen open
                  and handed the phone to a friend. We watched them click buy on
                  our first espresso machine. We were right there. We let it
                  happen.
                </p>
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-grey/70">
                  You can walk back a conversation. You can&apos;t walk back a
                  purchase.
                </p>
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-grey/70">
                  That was it. We were in.
                </p>
              </div>

              {/* Inset image — hidden on tablet, visible on mobile + desktop */}
              <div className="block md:hidden lg:block relative aspect-[4/3] overflow-hidden rounded-sm grain-overlay-sm">
                <Image
                  src="/images/about/brass_horn-founding.bts.roaster-misc-juan-07.webp"
                  alt="Juan working the coffee roaster at Brass Horn during the founding era of El Gato Negro"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover photo-treatment-sm"
                />
              </div>
            </div>

            {/* Right column — dominant tall image */}
            <div className="md:col-span-7 order-1 md:order-2">
              <div className="relative aspect-[3/4] md:aspect-[3/5] overflow-hidden rounded-sm grain-overlay-sm">
                <Image
                  src="/images/about/misc-bts.cart.founding.build-misc-none-13.webp"
                  alt="Behind-the-scenes shot of the original El Gato Negro cart being built"
                  fill
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="object-cover photo-treatment"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. First Day + Name Disaster ───────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-28">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-4">
            Day one
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl uppercase text-brand-black tracking-tight leading-[0.95] max-w-4xl mb-10 md:mb-14">
            The bomb, the bad shots, and the name we almost ruined ourselves
            with.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 lg:gap-12 items-start">
            {/* Text column */}
            <div className="md:col-span-5">
              <div className="border-l-2 border-brand-orange pl-5 md:pl-6 space-y-5">
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-black/70">
                  Phil built a contraption that used an air compressor as a
                  water pump. It looked exactly like a bomb. It sort of
                  functioned. We set it up on a collapsing plastic folding table
                  in front of close friends — people who love us enough to drink
                  bad espresso and say it&apos;s fine.
                </p>
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-black/70">
                  The shots were bad. The table was dying. The whole thing was
                  completely janky, and we knew it, and we kept going anyway.
                </p>
                <p className="font-sans text-sm md:text-base leading-relaxed text-brand-black/70">
                  We also needed a new name.
                </p>
              </div>
            </div>

            {/* Photo cluster — day-one evidence */}
            <div className="md:col-span-7">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm grain-overlay-sm">
                <Image
                  src="/images/about/the_exchange-bts.founding.cart-setup-none-04.webp"
                  alt="The first El Gato Negro setup on day one — espresso machine, grinder, and water jugs rigged under folding tables at The Exchange running store"
                  fill
                  sizes="(max-width: 768px) 100vw, 55vw"
                  className="object-cover photo-treatment-sm"
                />
              </div>
              <p className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black/50 mt-2">
                Day one, the folding table in question.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4 items-start">
                <div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm grain-overlay-sm">
                    <Image
                      src="/images/about/misc-founding.bts.espresso_machine.grinder-setup-none-02.webp"
                      alt="Late-night first programming of the grinder and espresso machine, with a notebook of dial-in notes open on the bench"
                      fill
                      sizes="(max-width: 768px) 50vw, 18vw"
                      className="object-cover object-[65%_center] photo-treatment-sm"
                    />
                  </div>
                  <p className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black/50 mt-2">
                    Night one with the machines, notes required.
                  </p>
                </div>
                <div>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm grain-overlay-sm">
                    <Image
                      src="/images/about/misc-founding.bts.espresso_machine.coffee_tasting-outdoor.setup-phil.na-01.webp"
                      alt="Phil Bartko testing the espresso machine at the first outdoor tasting on a backyard deck"
                      fill
                      sizes="(max-width: 768px) 50vw, 18vw"
                      className="object-cover photo-treatment-sm"
                    />
                  </div>
                  <p className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black/50 mt-2">
                    The first outdoor shots, somebody&apos;s deck.
                  </p>
                </div>
                {/* The bomb sketch — a document among photographs, no photo-treatment */}
                <div className="col-span-2 md:col-span-1">
                  <div className="max-w-[260px] md:max-w-none rotate-[2deg]">
                    <Image
                      src="/images/about/misc-founding.bts.sketch.water_system-close_up-none-01.webp"
                      alt="Hand-drawn plumbing sketch of the air-compressor water pump rig — threaded cap with Schrader valve, elbow, and PEX line to the espresso machine"
                      width={900}
                      height={1200}
                      sizes="(max-width: 768px) 260px, 18vw"
                      className="w-full h-auto rounded-sm border border-brand-black/10 shadow-md"
                    />
                  </div>
                  <p className="font-accent text-lg text-brand-green mt-2 -rotate-1">
                    the bomb, as designed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-brand-black/15 my-10 md:my-14 max-w-2xl" />

          <div className="border-l-2 border-brand-orange pl-5 md:pl-6 space-y-5 max-w-2xl">
            <p className="font-sans text-sm md:text-base leading-relaxed text-brand-black/70">
              We&apos;d been running as Coffee 88. Built the whole initial brand
              around it. Started showing it to people.
            </p>
            <p className="font-sans text-sm md:text-base leading-relaxed text-brand-black/70">
              First friend flagged it. Then another. Then another.
            </p>
            <p className="font-sans text-sm md:text-base leading-relaxed text-brand-black/70">
              88. H is the eighth letter of the alphabet. HH. Heil Hitler.
            </p>
            <p className="font-sans text-sm md:text-base leading-relaxed text-brand-black/70">
              We all felt appropriately stupid.
            </p>
            <p className="font-sans text-sm md:text-base leading-relaxed text-brand-black/70">
              Here&apos;s the thing though — losing that name forced a real
              conversation. Not &ldquo;okay what else sounds good?&rdquo; but
              actually: who are we? What&apos;s this actually from?
            </p>
            <p className="font-sans text-sm md:text-base leading-relaxed text-brand-black/70">
              Juan is Mexican. Phil grew up in Southern California, deep in that
              same cultural mix — surf, skate, Spanish in the house, the whole
              thing. We&apos;d been right there the whole time and somehow named
              ourselves after a Nazi symbol before we named ourselves after
              ourselves.
            </p>
          </div>

          <p className="font-accent text-2xl md:text-3xl text-brand-black leading-snug -rotate-2 max-w-md mt-10 md:mt-14 md:ml-[45%] lg:ml-[50%]">
            El Gato Negro.
            <br />
            The black cat.
            <br />
            Taboo.
            <br />
            Counter-culture.
            <br />
            Ours.
          </p>
        </div>
      </section>

      {/* ── 4. The Hellcat ─────────────────────────────────────────────── */}
      <section className="relative bg-brand-yellow overflow-hidden grain-overlay">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/60 mb-12 md:mb-16">
            The logo
          </p>

          {/* Hellcat logo — large, centered */}
          <div className="flex justify-center mb-16 md:mb-24">
            <img
              src="/brand/hellcat-color.svg"
              alt="El Gato Negro Hellcat logo"
              className="w-full max-w-xs md:max-w-md"
            />
          </div>

          {/* Two-column: story + accent closer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <h2 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-black tracking-tight mb-6">
                I drew this cat in 2018 and forgot about it for years.
              </h2>
              <div className="space-y-4 font-sans text-base leading-relaxed text-brand-black/70 max-w-lg">
                <p>
                  Back in 2018, I was doing an apparel line with a company out
                  in Huntington Beach. Drew a cat for it. Project got scrapped.
                  File went into a folder, folder went somewhere deep in a
                  drive, and I moved on.
                </p>
                <p>
                  When we landed on El Gato Negro, I started sketching and mood
                  boarding — trying to figure out what this thing looked like.
                  And then I started remembering this cat I&apos;d drawn.
                  Couldn&apos;t shake the feeling it was already there.
                </p>
                <p>
                  Found the file. Pulled it open. Flattened it, roughed the
                  edges, let it breathe.
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="font-accent text-2xl md:text-3xl text-brand-black leading-snug -rotate-2">
                It fit like it had been waiting eight years for the right name.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Year One ────────────────────────────────────────────────── */}
      <section className="relative bg-brand-black overflow-hidden grain-overlay-dark">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-28">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-yellow mb-4">
            Year one
          </p>
          <h2 className="font-display font-bold text-3xl md:text-5xl lg:text-6xl uppercase text-brand-grey tracking-tight leading-[0.95] max-w-3xl mb-10 md:mb-14">
            The highlight reel is mostly chaos.
          </h2>

          <div className="border-l-2 border-brand-orange pl-5 md:pl-6 space-y-5 max-w-2xl">
            <p className="font-sans text-sm md:text-base leading-relaxed text-brand-grey/70">
              The bomb rig. The bad name. Almost calling our principled,
              community-first Nashville coffee cart Heil Hitler 88 before we
              caught ourselves.
            </p>
            <p className="font-sans text-sm md:text-base leading-relaxed text-brand-grey/70">
              And then R.A.D. 100. We pulled off at a turnout for a quick pee
              break. Mid-stream. Dogs appeared. We had to pinch it and run —
              back to the car, back on the road, on to the next spot.
            </p>
            <p className="font-sans text-sm md:text-base leading-relaxed text-brand-grey/70">
              There hasn&apos;t been an &ldquo;oh shit, this was a
              mistake&rdquo; moment yet. There&apos;s been plenty of everything
              else.
            </p>
          </div>

          {/* Chaos strip — four reel frames under a dashed rule */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-10 md:mt-14 pt-10 md:pt-12 border-t border-dashed border-brand-grey/10">
            {yearOneStrip.map((frame) => (
              <div key={frame.src}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm grain-overlay-sm">
                  <Image
                    src={frame.src}
                    alt={frame.alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover photo-treatment-sm"
                  />
                </div>
                <p className="font-sans font-extrabold text-[10px] md:text-xs uppercase tracking-[0.15em] text-brand-grey/50 mt-2">
                  {frame.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Meet the Team — Editorial cards ─────────────────────────── */}
      <section className="bg-brand-grey grain-overlay py-20 md:py-28">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mb-3">
            The people
          </p>
          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl uppercase text-brand-black tracking-tight leading-[0.9] mb-14 md:mb-20">
            Juan and Phil. That&apos;s the whole team.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
            {team.map((member) => (
              <div key={member.name}>
                {/* Team photo */}
                <div className="relative aspect-[3/4] overflow-hidden grain-overlay-sm rounded-sm">
                  <Image
                    src={member.image}
                    alt={member.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover photo-treatment"
                  />
                </div>

                <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-green mt-6 mb-2">
                  {member.role}
                </p>
                <h3 className="font-display font-bold text-4xl md:text-5xl uppercase text-brand-black tracking-tight mb-1">
                  {member.name}
                </h3>
                <p className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/50 mb-4">
                  {member.title}
                </p>
                <div className="space-y-4 font-sans text-base md:text-lg leading-relaxed text-brand-black/70 max-w-md border-l-2 border-brand-orange pl-6">
                  {member.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <p className="font-accent text-lg text-brand-orange mt-4">
                  {member.describedSelf}
                </p>
                <p className="font-accent text-lg text-brand-green mt-1">
                  {member.describedOther}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Our Approach — Stacked editorial strips ─────────────────── */}
      <section className="relative bg-brand-black overflow-hidden grain-overlay-dark">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
          <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-yellow mb-3">
            How we operate
          </p>
          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl uppercase text-brand-grey tracking-tight leading-[0.9] mb-14 md:mb-20 max-w-4xl">
            Four things we don&apos;t negotiate on.
          </h2>

          <div>
            {approach.map((item, i) => (
              <div
                key={item.title}
                className={[
                  "relative overflow-hidden py-7 md:py-9 border-b border-dashed border-brand-grey/10",
                  i === 0
                    ? "border-t border-dashed border-brand-grey/10"
                    : "",
                ].join(" ")}
              >
                {/* Faded index number */}
                <span
                  className="absolute top-1/2 -translate-y-1/2 right-4 md:right-6 font-display font-bold text-[15vw] md:text-[10vw] lg:text-[8vw] leading-none text-brand-grey/[0.04] select-none pointer-events-none tabular-nums text-left"
                  style={{ width: "2ch" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-display font-bold text-2xl md:text-3xl uppercase text-brand-grey tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-brand-grey/60 max-w-xl">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. CTA — Flat orange with grain ────────────────────────────── */}
      <section className="bg-brand-orange grain-overlay">
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 lg:py-32">
          <p className="font-sans font-extrabold text-[10px] md:text-xs uppercase tracking-[0.2em] text-brand-black/60 mb-4 md:mb-6">
            Work with us
          </p>
          <h2 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl uppercase text-brand-black tracking-tight leading-[0.95] max-w-3xl mb-6 md:mb-8">
            Bring us to your event.
          </h2>
          <p className="font-sans text-base md:text-lg leading-relaxed text-brand-black/70 max-w-2xl mb-10 md:mb-12">
            Nashville&apos;s mobile coffee cart for brand activations, community
            events, weddings, private functions, conventions — anywhere people
            are gathering and coffee makes it better.
          </p>
          <Link
            href="/inquiry"
            className="group inline-flex items-center gap-3 bg-brand-black text-brand-grey font-display font-bold uppercase tracking-[0.1em] text-sm px-8 py-4 md:px-10 md:py-5 rounded-sm hover:bg-brand-orange transition-colors duration-300"
          >
            Start your inquiry
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </>
  );
}
