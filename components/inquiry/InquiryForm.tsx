"use client";

import { useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlacesInput } from "@/components/ui/PlacesInput";
import {
  generalInquirySchema,
  type GeneralInquiryValues,
} from "@/lib/inquiry/general-schema";
import { submitGeneralInquiry } from "@/app/inquiry/actions";

// ─── Field wrapper ─────────────────────────────────────────────────────────────

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
      <label className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-grey/50">
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
  "w-full border border-brand-grey/10 bg-brand-grey/5 px-4 py-3 font-sans text-sm text-brand-grey placeholder:text-brand-grey/25 outline-none transition-colors focus:border-brand-orange focus:bg-brand-grey/10 focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black disabled:opacity-40";

const selectClass = cn(inputClass, "appearance-none cursor-pointer");

// ─── Success state ─────────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <div className="flex flex-col items-start gap-6 py-4">
      <div className="flex h-12 w-12 items-center justify-center bg-brand-orange">
        <CheckCircle2 className="size-6 text-brand-grey" />
      </div>
      <div>
        <h2 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-brand-grey">
          We&apos;ll be in touch.
        </h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-brand-grey/60">
          Your inquiry is in. We review every request personally and will
          follow up within 1–2 business days with availability and next steps.
          Check your inbox — a confirmation is on its way.
        </p>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function InquiryForm({
  defaultService,
}: {
  defaultService?: GeneralInquiryValues["serviceType"];
}) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<GeneralInquiryValues>({
    resolver: zodResolver(generalInquirySchema),
    defaultValues: {
      serviceType: defaultService,
      venue: "",
    },
  });

  const venue = useWatch({ control, name: "venue" });

  function handleTurnstileSuccess(token: string) {
    setValue("turnstileToken", token, { shouldValidate: true });
  }

  function onSubmit(data: GeneralInquiryValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await submitGeneralInquiry(data);
      if (result.success) {
        setSubmitted(true);
      } else {
        setServerError(result.error);
      }
    });
  }

  if (submitted) {
    return <SuccessState />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>

      {/* Name */}
      <Field label="Name" error={errors.name?.message}>
        <input
          type="text"
          placeholder="Your name"
          autoComplete="name"
          {...register("name")}
          className={inputClass}
        />
      </Field>

      {/* Email */}
      <Field label="Email" error={errors.email?.message}>
        <input
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          className={inputClass}
        />
      </Field>

      {/* Phone */}
      <Field label="Phone (optional)" error={errors.phone?.message}>
        <input
          type="tel"
          placeholder="(555) 000-0000"
          autoComplete="tel"
          {...register("phone")}
          className={inputClass}
        />
      </Field>

      {/* Service Type */}
      <Field label="Service Type" error={errors.serviceType?.message}>
        <select {...register("serviceType")} className={selectClass}>
          <option value="">Select a service</option>
          <option value="brand-activations">Brand Activations</option>
          <option value="community-conventions">Community &amp; Conventions</option>
          <option value="weddings-celebrations">Weddings &amp; Celebrations</option>
          <option value="private-events">Private Events</option>
        </select>
      </Field>

      {/* Event Date */}
      <Field label="Event Date" error={errors.eventDate?.message}>
        <input
          type="date"
          {...register("eventDate")}
          className={inputClass}
        />
      </Field>

      {/* Venue */}
      <Field label="Venue / Location" error={errors.venue?.message}>
        <PlacesInput
          value={venue}
          onChange={(val) => setValue("venue", val, { shouldValidate: true })}
          placeholder="Venue name or address"
          disabled={isPending}
          className={inputClass}
        />
      </Field>

      {/* Headcount */}
      <Field label="Headcount" error={errors.headcount?.message}>
        <select {...register("headcount")} className={selectClass}>
          <option value="">Select a range</option>
          <option value="under-50">Under 50</option>
          <option value="50-150">50–150</option>
          <option value="150-300">150–300</option>
          <option value="300-plus">300+</option>
        </select>
      </Field>

      {/* Message */}
      <Field label="Message (optional)" error={errors.message?.message}>
        <textarea
          rows={4}
          placeholder="Anything else we should know?"
          {...register("message")}
          className={cn(inputClass, "resize-none")}
        />
      </Field>

      {/* Turnstile */}
      <div>
        <input type="hidden" {...register("turnstileToken")} />
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
          onSuccess={handleTurnstileSuccess}
        />
        {errors.turnstileToken && (
          <p className="mt-1.5 font-sans text-xs text-brand-orange">
            {errors.turnstileToken.message}
          </p>
        )}
      </div>

      {/* Server error */}
      {serverError && (
        <p className="border border-brand-orange/30 bg-brand-orange/10 px-4 py-3 font-sans text-sm text-brand-orange">
          {serverError}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="mt-1 inline-flex items-center gap-3 self-start rounded-sm bg-brand-orange px-8 py-4 font-display font-bold text-sm uppercase tracking-[0.1em] text-brand-grey transition-colors duration-200 hover:bg-brand-yellow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-orange active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send Inquiry
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
