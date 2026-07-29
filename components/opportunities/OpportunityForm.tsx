"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  opportunitySchema,
  EXPERIENCE_OPTIONS,
  AVAILABILITY_OPTIONS,
  type OpportunityValues,
} from "@/lib/opportunities/schema";
import { submitOpportunity } from "@/app/opportunities/actions";

// ── Field wrapper ────────────────────────────────────────────────────────────

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

// ── Success state ────────────────────────────────────────────────────────────

function SuccessState() {
  return (
    <div className="flex flex-col items-start gap-6 py-4">
      <div className="flex h-12 w-12 items-center justify-center bg-brand-orange">
        <CheckCircle2 className="size-6 text-brand-grey" />
      </div>
      <div>
        <h2 className="font-display text-3xl font-black uppercase leading-none tracking-tight text-brand-grey">
          Application received.
        </h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-brand-grey/60">
          Thanks for your interest in joining the El Gato Negro team.
          We review every application personally and will reach out if
          there&apos;s a fit. Keep an eye on your inbox.
        </p>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function OpportunityForm() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OpportunityValues>({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      availability: [],
    },
  });

  function handleTurnstileSuccess(token: string) {
    setValue("turnstileToken", token, { shouldValidate: true });
  }

  function onSubmit(data: OpportunityValues) {
    setServerError(null);
    startTransition(async () => {
      const result = await submitOpportunity(data);
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

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="First Name" error={errors.firstName?.message}>
          <input
            type="text"
            placeholder="First name"
            autoComplete="given-name"
            {...register("firstName")}
            className={inputClass}
          />
        </Field>

        <Field label="Last Name" error={errors.lastName?.message}>
          <input
            type="text"
            placeholder="Last name"
            autoComplete="family-name"
            {...register("lastName")}
            className={inputClass}
          />
        </Field>
      </div>

      {/* Contact row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            className={inputClass}
          />
        </Field>

        <Field label="Phone" error={errors.phone?.message}>
          <input
            type="tel"
            placeholder="(555) 000-0000"
            autoComplete="tel"
            {...register("phone")}
            className={inputClass}
          />
        </Field>
      </div>

      {/* Current shop */}
      <Field label="Current / Most Recent Coffee Shop" error={errors.currentShop?.message}>
        <input
          type="text"
          placeholder="Where do you work now (or most recently)?"
          {...register("currentShop")}
          className={inputClass}
        />
      </Field>

      {/* Experience */}
      <Field label="Years of Coffee Experience" error={errors.experience?.message}>
        <select {...register("experience")} className={selectClass}>
          <option value="">Select experience level</option>
          {EXPERIENCE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </Field>

      {/* Availability checkboxes */}
      <Field label="Availability" error={errors.availability?.message}>
        <div className="flex flex-col gap-2.5 mt-1">
          {AVAILABILITY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                value={opt.value}
                {...register("availability")}
                className="size-4 shrink-0 appearance-none border border-brand-grey/20 bg-brand-grey/5 transition-colors checked:border-brand-orange checked:bg-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange/50 cursor-pointer"
              />
              <span className="font-sans text-sm text-brand-grey/60 group-hover:text-brand-grey/80 transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </Field>

      {/* Nashville area */}
      <Field label="Based in Nashville area?" error={errors.nashvilleArea?.message}>
        <div className="flex items-center gap-6 mt-1">
          {(["yes", "no"] as const).map((val) => (
            <label
              key={val}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <input
                type="radio"
                value={val}
                {...register("nashvilleArea")}
                className="size-4 shrink-0 appearance-none rounded-full border border-brand-grey/20 bg-brand-grey/5 transition-colors checked:border-brand-orange checked:border-[5px] focus-visible:ring-2 focus-visible:ring-brand-orange/50 cursor-pointer"
              />
              <span className="font-sans text-sm text-brand-grey/60 group-hover:text-brand-grey/80 transition-colors capitalize">
                {val}
              </span>
            </label>
          ))}
        </div>
      </Field>

      {/* Additional info */}
      <Field label="Anything else? (optional)" error={errors.additionalInfo?.message}>
        <textarea
          rows={4}
          placeholder="Tell us anything else you'd like us to know"
          {...register("additionalInfo")}
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
            Submit Application
            <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}
