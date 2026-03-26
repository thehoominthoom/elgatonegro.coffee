"use client";

import { useActionState } from "react";
import { deleteAddress, setDefaultAddress, type AddressActionState } from "./actions";

interface AddressCardProps {
  address: {
    id: string;
    formatted: string[];
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

  return (
    <div className="border border-brand-black/10 rounded-sm px-4 py-4 hover:border-brand-orange/30 transition-colors">
      {isDefault && (
        <p className="font-sans font-extrabold text-[10px] uppercase tracking-[0.2em] text-brand-orange mb-2">
          Default
        </p>
      )}
      <p className="font-sans text-sm text-brand-black/70 whitespace-pre-line">
        {address.formatted.join("\n")}
      </p>
      {error && (
        <p className="font-sans text-xs text-red-600 mt-2">{error}</p>
      )}
      <div className="flex gap-3 mt-3">
        {!isDefault && (
          <form action={defaultAction}>
            <input type="hidden" name="addressId" value={address.id} />
            <button
              type="submit"
              className="font-sans text-xs text-brand-black/40 hover:text-brand-orange transition-colors underline underline-offset-2 py-1.5"
            >
              Set as default
            </button>
          </form>
        )}
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
    </div>
  );
}
