import { requireCustomerSession } from "@/lib/shopify/auth-helpers";
import { customerFetch } from "@/lib/shopify/auth-helpers";
import { adminFetch } from "@/lib/shopify/admin";
import { CUSTOMER_QUERY } from "@/lib/shopify/customer-queries";
import { ADMIN_CUSTOMER_MARKETING_CONSENT_QUERY } from "@/lib/shopify/admin-queries";
import { ProfileForm } from "./ProfileForm";

interface CustomerData {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: { emailAddress: string } | null;
    phoneNumber: { phoneNumber: string } | null;
    metafield: { value: string } | null;
  };
}

interface MarketingConsentData {
  customer: {
    emailMarketingConsent: {
      marketingState: string;
    } | null;
  } | null;
}

export const metadata = {
  title: "Profile | My Account",
};

export default async function ProfilePage() {
  const session = await requireCustomerSession();

  let customer: CustomerData["customer"] | null = null;
  let marketingConsent = false;

  // Fetch customer profile — this must succeed for the page to render
  try {
    const customerData = await customerFetch<CustomerData>({ query: CUSTOMER_QUERY });
    customer = customerData.customer;
  } catch (error) {
    console.error("Profile fetch error:", error instanceof Error ? error.message : error);
  }

  // Fetch marketing consent separately via Admin API — failure here shouldn't break the page
  if (session.customer?.id) {
    try {
      const rawId = String(session.customer.id);
      const adminId = rawId.startsWith("gid://")
        ? rawId
        : `gid://shopify/Customer/${rawId}`;
      const consentData = await adminFetch<MarketingConsentData>({
        query: ADMIN_CUSTOMER_MARKETING_CONSENT_QUERY,
        variables: { id: adminId },
      });
      marketingConsent =
        consentData?.customer?.emailMarketingConsent?.marketingState === "SUBSCRIBED";
    } catch (error) {
      console.error("Marketing consent fetch error:", error instanceof Error ? error.message : error);
    }
  }

  return (
    <div>
      <p className="font-display font-bold text-base md:text-lg uppercase tracking-[0.25em] text-brand-black/50 mb-2">
        Your Details
      </p>
      <h2 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-brand-black mb-6">
        Profile
      </h2>

      {customer ? (
        <div className="border border-brand-black/10 rounded-sm px-5 py-5">
          <ProfileForm
            defaultValues={{
              firstName: customer.firstName,
              lastName: customer.lastName,
              email: customer.emailAddress?.emailAddress ?? "",
              birthday: customer.metafield?.value ?? "",
              marketingConsent,
            }}
          />
        </div>
      ) : (
        <p className="font-sans text-sm text-brand-black/40 py-8 text-center border border-brand-black/10 rounded-sm">
          Unable to load profile. Please try again later.
        </p>
      )}
    </div>
  );
}
