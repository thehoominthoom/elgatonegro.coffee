"use client";

import { deleteAddress, setDefaultAddress } from "./actions";

interface AddressCardProps {
  address: {
    id: string;
    formatted: string[];
  };
  isDefault: boolean;
}

export function AddressCard({ address, isDefault }: AddressCardProps) {
  return (
    <div className="border border-brand-black/10 rounded-sm px-4 py-4">
      {isDefault && (
        <p className="font-sans font-extrabold text-[10px] uppercase tracking-wider text-brand-orange mb-2">
          Default
        </p>
      )}
      <p className="font-sans text-sm text-brand-black/70 whitespace-pre-line">
        {address.formatted.join("\n")}
      </p>
      <div className="flex gap-3 mt-3">
        {!isDefault && (
          <form action={setDefaultAddress}>
            <input type="hidden" name="addressId" value={address.id} />
            <button
              type="submit"
              className="font-sans text-xs text-brand-black/40 hover:text-brand-orange transition-colors underline underline-offset-2"
            >
              Set as default
            </button>
          </form>
        )}
        <form action={deleteAddress}>
          <input type="hidden" name="addressId" value={address.id} />
          <button
            type="submit"
            className="font-sans text-xs text-brand-black/40 hover:text-brand-orange transition-colors underline underline-offset-2"
          >
            Remove
          </button>
        </form>
      </div>
    </div>
  );
}
