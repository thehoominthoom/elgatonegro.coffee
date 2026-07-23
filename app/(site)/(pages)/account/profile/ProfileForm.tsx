"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileActionState } from "./actions";

const initialState: ProfileActionState = { success: false, error: null };

interface ProfileFormProps {
  defaultValues: {
    firstName: string;
    lastName: string;
    email: string;
    birthday: string;
    marketingConsent: boolean;
  };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/50 mb-1"
          >
            First name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            defaultValue={defaultValues.firstName}
            className="w-full px-3 py-2 bg-brand-grey border border-brand-black/15 rounded-sm font-sans text-sm text-brand-black focus:outline-none focus:border-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-grey transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/50 mb-1"
          >
            Last name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            defaultValue={defaultValues.lastName}
            className="w-full px-3 py-2 bg-brand-grey border border-brand-black/15 rounded-sm font-sans text-sm text-brand-black focus:outline-none focus:border-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-grey transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/50 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          disabled
          defaultValue={defaultValues.email}
          className="w-full px-3 py-2 bg-brand-grey border border-brand-black/15 rounded-sm font-sans text-sm text-brand-black/40 focus:outline-none cursor-not-allowed"
        />
        <p className="font-sans text-[10px] text-brand-black/30 mt-1">
          Email is managed through your Shopify account
        </p>
      </div>

      <div>
        <label
          htmlFor="birthday"
          className="block font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black/50 mb-1"
        >
          Birthday
        </label>
        <input
          id="birthday"
          name="birthday"
          type="date"
          defaultValue={defaultValues.birthday}
          className="w-full px-3 py-2 bg-brand-grey border border-brand-black/15 rounded-sm font-sans text-sm text-brand-black focus:outline-none focus:border-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-grey transition-colors"
        />
      </div>

      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="marketingConsent"
            defaultChecked={defaultValues.marketingConsent}
            className="mt-0.5 h-4 w-4 rounded-sm border-brand-black/15 accent-brand-orange cursor-pointer"
          />
          <span className="font-sans text-sm text-brand-black">
            Sign up for news, offers, and updates from El Gato Negro
            <span className="block font-sans text-[10px] text-brand-black/30 mt-0.5">
              You can unsubscribe at any time
            </span>
          </span>
        </label>
      </div>

      {state.error && (
        <p className="font-sans text-xs text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="font-sans text-xs text-brand-green">Profile updated.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-brand-orange text-brand-grey text-sm font-display font-bold uppercase tracking-[0.1em] px-5 py-2.5 rounded-sm hover:bg-brand-yellow hover:text-brand-black transition-colors disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
