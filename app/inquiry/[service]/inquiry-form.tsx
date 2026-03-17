"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { inquirySchema, type InquiryFormData } from "@/lib/inquiry/schema";
import { type ServiceConfig } from "@/lib/inquiry/config";
import { submitInquiry } from "./actions";
import { cn } from "@/lib/utils";

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-brand-grey/50">
        {label}
      </label>
      {children}
      {error && (
        <p className="font-sans text-xs text-brand-orange">{error}</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full border border-brand-grey/10 bg-brand-grey/5 px-4 py-3 font-sans text-sm text-brand-grey placeholder:text-brand-grey/20 outline-none transition-colors focus:border-brand-orange focus:bg-brand-grey/8";

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = ["Event Details", "Contact", "Confirm"] as const;

// ─── Main form ────────────────────────────────────────────────────────────────

export function InquiryForm({ config }: { config: ServiceConfig }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { service: config.slug },
  });

  const step0Fields = Object.entries(config.formFields)
    .filter(([, v]) => v)
    .map(([k]) => k) as (keyof InquiryFormData)[];

  const step1Fields: (keyof InquiryFormData)[] = ["name", "email", "phone"];

  async function nextStep() {
    const fields = step === 0 ? step0Fields : step1Fields;
    const valid = await trigger(fields);
    if (valid) setStep((s) => s + 1);
  }

  async function onSubmit(data: InquiryFormData) {
    setServerError(null);
    const result = await submitInquiry(data);
    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.error);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-start gap-6">
        <div className="flex h-12 w-12 items-center justify-center bg-brand-orange">
          <CheckCircle2 className="size-6 text-brand-grey" />
        </div>
        <div>
          <h2 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-brand-grey">
            {config.successHeading}
          </h2>
          <p className="mt-3 font-sans text-sm leading-relaxed text-brand-grey/60">
            {config.successBody}
          </p>
        </div>
        <Link
          href="/services"
          className="mt-4 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-brand-orange underline underline-offset-4 hover:text-brand-yellow"
        >
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* Progress */}
      <div className="flex items-center gap-3">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-6 w-6 items-center justify-center font-sans text-xs font-bold transition-colors",
                  i < step
                    ? "bg-brand-orange text-brand-grey"
                    : i === step
                      ? "border border-brand-orange text-brand-orange"
                      : "border border-brand-grey/20 text-brand-grey/20",
                )}
              >
                {i < step ? "✓" : i + 1}
              </div>
              <span
                className={cn(
                  "font-sans text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
                  i === step ? "text-brand-grey" : "text-brand-grey/30",
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="h-px w-6 bg-brand-grey/10" />
            )}
          </div>
        ))}
      </div>

      <div className="h-px bg-brand-grey/10" />

      {/* ── Step 0: Event details ─────────────────────────────────── */}
      {step === 0 && (
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-2xl font-black uppercase leading-none tracking-tight text-brand-grey">
            Tell us about your event.
          </h2>

          <input type="hidden" {...register("service")} />

          {config.formFields.eventDate && (
            <Field label="Event Date" error={errors.eventDate?.message}>
              <input
                type="date"
                {...register("eventDate")}
                className={inputClass}
              />
            </Field>
          )}

          {config.formFields.venue && (
            <Field label="Venue / Location" error={errors.venue?.message}>
              <input
                type="text"
                placeholder="Venue name or city"
                {...register("venue")}
                className={inputClass}
              />
            </Field>
          )}

          {config.formFields.guestCount && (
            <Field label="Estimated Guest Count" error={errors.guestCount?.message}>
              <input
                type="text"
                placeholder="e.g. 150"
                {...register("guestCount")}
                className={inputClass}
              />
            </Field>
          )}

          {config.formFields.attendeeCount && (
            <Field label="Expected Attendees" error={errors.attendeeCount?.message}>
              <input
                type="text"
                placeholder="e.g. 200"
                {...register("attendeeCount")}
                className={inputClass}
              />
            </Field>
          )}

          {config.formFields.company && (
            <Field label="Company / Organization" error={errors.company?.message}>
              <input
                type="text"
                placeholder="Your company name"
                {...register("company")}
                className={inputClass}
              />
            </Field>
          )}

          {config.formFields.industry && (
            <Field label="Industry" error={errors.industry?.message}>
              <input
                type="text"
                placeholder="e.g. Tech, Finance, Entertainment"
                {...register("industry")}
                className={inputClass}
              />
            </Field>
          )}

          {config.formFields.duration && (
            <Field label="Event Duration" error={errors.duration?.message}>
              <select {...register("duration")} className={inputClass}>
                <option value="">Select duration</option>
                <option value="half-day">Half Day (up to 4 hrs)</option>
                <option value="full-day">Full Day (up to 8 hrs)</option>
                <option value="multi-day">Multi-Day</option>
              </select>
            </Field>
          )}

          {config.formFields.productionType && (
            <Field label="Production Type" error={errors.productionType?.message}>
              <select {...register("productionType")} className={inputClass}>
                <option value="">Select type</option>
                <option value="film">Film</option>
                <option value="tv">TV / Streaming</option>
                <option value="commercial">Commercial</option>
                <option value="music-video">Music Video</option>
                <option value="other">Other</option>
              </select>
            </Field>
          )}

          {config.formFields.propertyName && (
            <Field label="Property Name" error={errors.propertyName?.message}>
              <input
                type="text"
                placeholder="Apartment community name"
                {...register("propertyName")}
                className={inputClass}
              />
            </Field>
          )}

          {config.formFields.unitCount && (
            <Field label="Number of Units" error={errors.unitCount?.message}>
              <input
                type="text"
                placeholder="e.g. 200"
                {...register("unitCount")}
                className={inputClass}
              />
            </Field>
          )}

          {config.formFields.partnershipType && (
            <Field label="Partnership Type" error={errors.partnershipType?.message}>
              <select {...register("partnershipType")} className={inputClass}>
                <option value="">Select type</option>
                <option value="co-brand">Co-Branded Merchandise</option>
                <option value="wholesale">Wholesale Account</option>
                <option value="content">Content / Media</option>
                <option value="sponsorship">Sponsorship</option>
                <option value="affiliate">Affiliate / Referral</option>
                <option value="other">Other</option>
              </select>
            </Field>
          )}
        </div>
      )}

      {/* ── Step 1: Contact ──────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-2xl font-black uppercase leading-none tracking-tight text-brand-grey">
            How do we reach you?
          </h2>

          <Field label="Full Name" error={errors.name?.message}>
            <input
              type="text"
              placeholder="Your name"
              {...register("name")}
              className={inputClass}
            />
          </Field>

          <Field label="Email Address" error={errors.email?.message}>
            <input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              className={inputClass}
            />
          </Field>

          <Field label="Phone (optional)" error={errors.phone?.message}>
            <input
              type="tel"
              placeholder="(555) 000-0000"
              {...register("phone")}
              className={inputClass}
            />
          </Field>
        </div>
      )}

      {/* ── Step 2: Confirm ──────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col gap-5">
          <h2 className="font-display text-2xl font-black uppercase leading-none tracking-tight text-brand-grey">
            Anything else?
          </h2>

          <Field label="Additional Notes (optional)" error={errors.message?.message}>
            <textarea
              rows={5}
              placeholder="Questions, details, or anything you'd like us to know..."
              {...register("message")}
              className={cn(inputClass, "resize-none")}
            />
          </Field>

          {serverError && (
            <p className="border border-brand-orange/30 bg-brand-orange/10 px-4 py-3 font-sans text-sm text-brand-orange">
              {serverError}
            </p>
          )}

          <p className="font-sans text-xs leading-relaxed text-brand-grey/30">
            By submitting you agree to be contacted about this inquiry. We
            don&rsquo;t spam.
          </p>
        </div>
      )}

      {/* ── Navigation ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-brand-grey/40 hover:text-brand-grey transition-colors"
          >
            ← Back
          </button>
        )}

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center gap-3 bg-brand-orange px-8 py-4 font-sans text-sm font-bold uppercase tracking-[0.15em] text-brand-grey transition-all duration-200 hover:bg-brand-yellow hover:text-brand-black"
          >
            Continue
            <ArrowRight className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-3 bg-brand-orange px-8 py-4 font-sans text-sm font-bold uppercase tracking-[0.15em] text-brand-grey transition-all duration-200 hover:bg-brand-yellow hover:text-brand-black disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Sending…" : "Send Inquiry"}
            <ArrowRight className="size-4" />
          </button>
        )}
      </div>
    </form>
  );
}
