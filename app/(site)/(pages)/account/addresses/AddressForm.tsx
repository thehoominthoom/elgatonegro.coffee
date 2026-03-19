"use client";

import { forwardRef, useActionState, useCallback, useRef } from "react";
import {
  AddressAutocomplete,
  type AddressFields,
} from "@/components/ui/AddressAutocomplete";
import { PhoneInput } from "@/components/ui/PhoneInput";
import { createAddress, type AddressActionState } from "./actions";

const initialState: AddressActionState = { success: false, error: null };

export function AddressForm() {
  const [state, formAction, isPending] = useActionState(createAddress, initialState);

  const cityRef = useRef<HTMLInputElement>(null);
  const zoneCodeRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const territoryCodeRef = useRef<HTMLInputElement>(null);

  const handlePlaceSelect = useCallback((fields: AddressFields) => {
    if (cityRef.current) cityRef.current.value = fields.city;
    if (zoneCodeRef.current) zoneCodeRef.current.value = fields.zoneCode;
    if (zipRef.current) zipRef.current.value = fields.zip;
    if (territoryCodeRef.current) territoryCodeRef.current.value = fields.territoryCode;
  }, []);

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField name="firstName" label="First name" required />
        <InputField name="lastName" label="Last name" required />
      </div>

      <div>
        <label
          htmlFor="address1"
          className="block font-sans text-xs text-brand-black/50 mb-1"
        >
          Address
        </label>
        <AddressAutocomplete onPlaceSelect={handlePlaceSelect} />
      </div>

      <InputField name="address2" label="Apartment, suite, etc." />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <InputField name="city" label="City" required ref={cityRef} />
        <InputField name="zoneCode" label="State" required ref={zoneCodeRef} />
        <InputField name="zip" label="ZIP" required ref={zipRef} />
      </div>
      <input type="hidden" name="territoryCode" defaultValue="US" ref={territoryCodeRef} />

      <div>
        <label
          htmlFor="phoneNumber"
          className="block font-sans text-xs text-brand-black/50 mb-1"
        >
          Phone
        </label>
        <PhoneInput name="phoneNumber" />
      </div>

      {state.error && (
        <p className="font-sans text-xs text-red-600">{state.error}</p>
      )}
      {state.success && (
        <p className="font-sans text-xs text-brand-green">Address added.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-brand-orange text-brand-grey text-xs font-sans font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-sm hover:bg-brand-yellow hover:text-brand-black transition-colors disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Add Address"}
      </button>
    </form>
  );
}

const InputField = forwardRef<
  HTMLInputElement,
  {
    name: string;
    label: string;
    required?: boolean;
    defaultValue?: string;
  }
>(function InputField({ name, label, required, defaultValue }, ref) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-sans text-xs text-brand-black/50 mb-1"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={name}
        name={name}
        type="text"
        required={required}
        defaultValue={defaultValue}
        className="w-full px-3 py-2 bg-brand-grey border border-brand-black/15 rounded-sm font-sans text-sm text-brand-black placeholder:text-brand-black/30 focus:outline-none focus:border-brand-orange transition-colors"
      />
    </div>
  );
});
