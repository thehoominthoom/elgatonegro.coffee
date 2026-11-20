"use client";

import { useActionState } from "react";
import { formatUS } from "@/components/ui/PhoneInput";
import { deleteAddress, setDefaultAddress, type AddressActionState } from "./actions";

interface AddressCardProps {
  address: {
    id: string;
    formatted: string[];
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
  };
  isDefault: boolean;
}

const initialState: AddressActionState = { success: false, error: null };

export function AddressCard({ address, isDefault }: AddressCardProps) {
  const [defaultState, defaultAction] = useActionState(
    (_prev: AddressActionState, formData: FormData) => setDefaultAddress(formData),
    initialState
  );
  const [deleteState, deleteAction] = useActionState(
    (_prev: AddressActionState, formData: FormData) => deleteAddress(formData),
    initialState
  );

  const error = defaultState.error || deleteState.error;

  // Shopify leaves the name out of `formatted` and never includes the phone.
  const name = [address.firstName, address.lastName].filter(Boolean).join(" ");
  // The form saves US numbers as +1XXXXXXXXXX; any other format shows as Shopify stores it.
  const phone = address.phoneNumber && /^\+1\d{10}$/.test(address.phoneNumber)
    ? formatUS(address.phoneNumber.slice(2))
    : address.phoneNumber;

  return (
    <div className="border border-brand-black/10 rounded-sm px-4 py-4 hover:border-brand-orange/30 transition-colors">
      {isDefault && (
        <p className="font-sans font-extrabold text-[10px] uppercase tracking-[0.2em] text-brand-orange mb-2">
          Default
        </p>
      )}
      <p className="font-sans text-sm text-brand-black/70 whitespace-pre-line">
        {[name, ...address.formatted, phone].filter(Boolean).join("\n")}
      </p>
      {error && (
        <p className="font-sans text-xs text-red-600 mt-2">{error}</p>
      )}
      {isDefault ? (
        // Shopify refuses to delete the default address, so Remove is not offered on it.
        <p className="font-sans text-xs text-brand-black/60 mt-3 py-1.5">
          Set another address as default before deleting this one.
        </p>
      ) : (
        <div className="flex gap-3 mt-3">
          <form action={defaultAction}>
            <input type="hidden" name="addressId" value={address.id} />
            <button
              type="submit"
              className="font-sans text-xs text-brand-black/40 hover:text-brand-orange transition-colors underline underline-offset-2 py-1.5"
            >
              Set as default
            </button>
          </form>
          <form action={deleteAction}>
            <input type="hidden" name="addressId" value={address.id} />
            <button
              type="submit"
              className="font-sans text-xs text-brand-black/40 hover:text-brand-orange transition-colors underline underline-offset-2 py-1.5"
            >
              Remove
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
