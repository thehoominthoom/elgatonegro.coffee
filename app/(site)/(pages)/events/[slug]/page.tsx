import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, ExternalLink } from "lucide-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { formatEventDate } from "@/lib/home/dates";

// ─── ISR ──────────────────────────────────────────────────────────────────────

export const revalidate = 60;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScheduleEntry {
  _key: string;
  date: string;
  openTime: string;
  closeTime: string;
}

interface EventDetail {
  _id: string;
  title: string;
  locationName: string | null;
  displayAddress: string | null;
  mapLink: string | null;
  type: "open" | "ticketed" | "private" | "fundraiser" | "sale" | "new-swag";
  schedule: ScheduleEntry[] | null;
  note: string | null;
  recurrenceLabel: string | null;
  image: Record<string, unknown> | null;
  description: Array<{
    _key: string;
    _type: string;
    style?: string;
    children?: Array<{ _key: string; _type: string; text: string; marks?: string[] }>;
  }> | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  ticketUrl: string | null;
  eventPageType: "internal" | "external" | null;
}

// ─── Query ────────────────────────────────────────────────────────────────────

const EVENT_QUERY = `*[_type == "event" && slug.current == $slug][0] {
  _id,
  title,
  "locationName": location.locationName,
  "displayAddress": location.displayAddress,
  "mapLink": location.mapLink,
  type,
  schedule,
  note,
  recurrenceLabel,
  image,
  description,
  "ctaLabel": cta.ctaLabel,
  "ctaUrl": cta.ctaUrl,
  ticketUrl,
  eventPageType
}`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<EventDetail["type"], string> = {
  open: "Open Event",
  ticketed: "Ticketed",
  private: "Private Event",
  fundraiser: "Fundraiser",
  sale: "Sale",
  "new-swag": "New Swag",
};

const TYPE_COLORS: Record<EventDetail["type"], string> = {
  open: "bg-brand-green",
  ticketed: "bg-brand-orange",
  private: "bg-brand-black",
  fundraiser: "bg-brand-teal",
  sale: "bg-brand-yellow text-brand-black",
  "new-swag": "bg-brand-yellow text-brand-black",
};

function formatDayOfWeek(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function renderPortableText(
  blocks: EventDetail["description"]
): React.ReactNode[] {
  if (!blocks?.length) return [];
  return blocks
    .filter((b) => b._type === "block" && b.children?.length)
    .map((block) => {
      const text = block.children!
        .map((child) => {
          if (!child.marks?.length) return child.text;
          let node: React.ReactNode = child.text;
          if (child.marks.includes("strong"))
            node = <strong key={child._key}>{node}</strong>;
          if (child.marks.includes("em"))
            node = <em key={child._key}>{node}</em>;
          return node;
        });
      return (
        <p key={block._key} className="font-sans text-sm md:text-base leading-relaxed text-brand-black/70">
          {text}
        </p>
      );
    });
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await client.fetch<EventDetail | null>(
    EVENT_QUERY,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!event || event.eventPageType !== "internal") {
    return { title: "Event Not Found | El Gato Negro Coffee" };
  }

  const descriptionText = event.description
    ?.filter((b) => b._type === "block")
    .flatMap((b) => b.children?.map((c) => c.text) ?? [])
    .join(" ")
    .slice(0, 160) || `${event.title} — El Gato Negro Coffee event.`;

  return {
    title: `${event.title} | El Gato Negro Coffee`,
    description: descriptionText,
    openGraph: {
      title: `${event.title} | El Gato Negro Coffee`,
      description: descriptionText,
      type: "website",
      ...(event.image && {
        images: [
          {
            url: urlFor(event.image).width(1200).height(630).url(),
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} | El Gato Negro Coffee`,
      description: descriptionText,
      ...(event.image && {
        images: [urlFor(event.image).width(1200).height(630).url()],
      }),
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await client.fetch<EventDetail | null>(
    EVENT_QUERY,
    { slug },
    { next: { revalidate: 60 } }
  );

  if (!event || event.eventPageType !== "internal") notFound();

  const schedule = event.schedule
    ? [...event.schedule].sort((a, b) => a.date.localeCompare(b.date))
    : [];

  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="relative w-full min-h-[100svh] overflow-hidden">
        {event.image ? (
          <Image
            src={urlFor(event.image).width(1440).url()}
            alt={event.title}
            fill
            priority
            sizes="100vw"
            className="object-cover photo-treatment"
          />
        ) : (
          <div className="absolute inset-0 bg-brand-black" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/40 to-brand-black/30" />
        <div className="absolute inset-0 grain-overlay-dark pointer-events-none" />

        <div className="absolute inset-0 z-10 flex flex-col justify-end max-w-7xl mx-auto px-4 md:px-6 pb-16 md:pb-20">
          <span
            className={`self-start font-sans font-extrabold text-[10px] uppercase tracking-[0.15em] px-2 py-1 rounded-sm mb-5 ${TYPE_COLORS[event.type]} text-brand-grey`}
          >
            {TYPE_LABELS[event.type]}
          </span>

          <h1
            className="font-display font-bold uppercase text-brand-grey tracking-tight leading-[0.9]"
            style={{ fontSize: "clamp(2.5rem, 10vw, 10rem)" }}
          >
            {event.title}
          </h1>

          <div className="mt-6 space-y-2">
            {schedule.length > 0 && (
              <p className="font-sans text-sm md:text-base text-brand-grey/70">
                {schedule.length === 1
                  ? `${formatDayOfWeek(schedule[0].date)}, ${formatEventDate(schedule[0].date)} \u2014 ${schedule[0].openTime} \u2013 ${schedule[0].closeTime} CT`
                  : `${formatEventDate(schedule[0].date)} \u2013 ${formatEventDate(schedule[schedule.length - 1].date)}`}
              </p>
            )}
            {event.recurrenceLabel && (
              <p className="font-sans text-sm text-brand-grey/50 italic">
                {event.recurrenceLabel}
              </p>
            )}
            {event.locationName && (
              <p className="font-sans text-sm md:text-base text-brand-grey/70">
                {event.locationName}
                {event.displayAddress && (
                  <span className="text-brand-grey/50"> \u2014 {event.displayAddress}</span>
                )}
              </p>
            )}
            {event.note && (
              <p className="font-sans text-sm text-brand-orange italic mt-2">
                {event.note}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── 2. Details ───────────────────────────────────────────────────── */}
      <section className="bg-brand-grey grain-overlay">
        <div className="relative z-10 max-w-3xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-brand-black/50 hover:text-brand-orange transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            All Events
          </Link>

          {event.description && event.description.length > 0 && (
            <div className="space-y-4 border-l-2 border-brand-orange pl-5 md:pl-6 mb-10">
              {renderPortableText(event.description)}
            </div>
          )}

          {schedule.length > 1 && (
            <div className="mb-10">
              <h2 className="font-display font-bold text-lg uppercase tracking-tight text-brand-black mb-4">
                Schedule
              </h2>
              <div className="space-y-2">
                {schedule.map((s) => (
                  <p
                    key={s._key}
                    className="font-sans font-extrabold text-xs uppercase tracking-[0.15em] text-brand-black"
                  >
                    {formatDayOfWeek(s.date)}, {formatEventDate(s.date)}: {s.openTime} \u2013 {s.closeTime} CT
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-4">
            {event.ticketUrl && (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-orange text-brand-grey font-display font-bold text-sm uppercase tracking-[0.1em] rounded-sm px-8 py-3.5 hover:bg-brand-black transition-colors"
              >
                Get Tickets
                <ExternalLink size={14} />
              </a>
            )}
            {event.ctaLabel && event.ctaUrl && (
              <a
                href={event.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-black text-brand-grey font-display font-bold text-sm uppercase tracking-[0.1em] rounded-sm px-8 py-3.5 hover:bg-brand-orange transition-colors"
              >
                {event.ctaLabel}
                <ExternalLink size={14} />
              </a>
            )}
            {event.mapLink && (
              <a
                href={event.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-brand-orange hover:text-brand-black transition-colors"
              >
                <MapPin size={14} />
                View Map
              </a>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
