import { requireCustomerSession } from "@/lib/shopify/auth-helpers";
import { customerFetch } from "@/lib/shopify/auth-helpers";
import { CUSTOMER_QUERY } from "@/lib/shopify/customer-queries";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";

interface CustomerData {
  customer: {
    defaultAddress: { id: string } | null;
    addresses: {
      nodes: Array<{
        id: string;
        formatted: string[];
        firstName: string;
        lastName: string;
        address1: string;
        address2: string | null;
        city: string;
        zoneCode: string;
        zip: string;
        territoryCode: string;
        phoneNumber: string | null;
      }>;
    };
  };
}

export const metadata = {
  title: "Addresses",
};

export default async function AddressesPage() {
  await requireCustomerSession();

  let addresses: CustomerData["customer"]["addresses"]["nodes"] = [];
  let defaultAddressId: string | null = null;

  try {
    const data = await customerFetch<CustomerData>({ query: CUSTOMER_QUERY });
    addresses = data.customer.addresses.nodes;
    defaultAddressId = data.customer.defaultAddress?.id ?? null;
  } catch {
    // API unavailable
  }

  return (
    <div>
      <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/50 mb-2">
        Your Addresses
      </p>
      <h2 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-brand-black mb-6">
        Addresses
      </h2>

      {/* Address list */}
      {addresses.length === 0 ? (
        <p className="font-sans text-sm text-brand-black/40 py-8 text-center border border-brand-black/10 rounded-sm mb-8">
          No saved addresses yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              isDefault={address.id === defaultAddressId}
            />
          ))}
        </div>
      )}

      {/* Add new address form */}
      <div className="border border-brand-black/10 rounded-sm px-5 py-5">
        <h3 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-5">
          Add New Address
        </h3>
        <AddressForm />
      </div>
    </div>
  );
}
