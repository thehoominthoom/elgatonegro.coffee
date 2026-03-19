"use server";

import { revalidatePath } from "next/cache";
import { customerFetch, getCustomerSession } from "@/lib/shopify/auth-helpers";
import { adminFetch } from "@/lib/shopify/admin";
import { CUSTOMER_UPDATE_MUTATION } from "@/lib/shopify/customer-queries";
import {
  ADMIN_SET_METAFIELDS_MUTATION,
  ADMIN_CUSTOMER_EMAIL_MARKETING_CONSENT_UPDATE_MUTATION,
} from "@/lib/shopify/admin-queries";

export interface ProfileActionState {
  success: boolean;
  error: string | null;
}

export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData
): Promise<ProfileActionState> {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  if (!firstName || !lastName) {
    return { success: false, error: "First and last name are required." };
  }

  const session = await getCustomerSession();
  if (!session?.customer?.id) {
    return { success: false, error: "Not authenticated." };
  }

  const rawId = String(session.customer.id);
  const customerId = rawId.startsWith("gid://")
    ? rawId
    : `gid://shopify/Customer/${rawId}`;

  const input: Record<string, string> = { firstName, lastName };

  try {
    // Update name via Customer Account API
    const data = await customerFetch<{
      customerUpdate: {
        customer: { id: string } | null;
        userErrors: Array<{ field: string[]; message: string }>;
      };
    }>({
      query: CUSTOMER_UPDATE_MUTATION,
      variables: { input },
    });

    if (data.customerUpdate.userErrors.length) {
      const errors = data.customerUpdate.userErrors;
      console.error("Shopify customerUpdate userErrors:", JSON.stringify(errors));
      return {
        success: false,
        error: errors[0].message,
      };
    }

    // Save birthday as customer metafield via Admin API
    const birthday = formData.get("birthday") as string;
    if (birthday) {
      try {
        const metafieldData = await adminFetch<{
          metafieldsSet: {
            metafields: Array<{ key: string; value: string }> | null;
            userErrors: Array<{ field: string; message: string }>;
          };
        }>({
          query: ADMIN_SET_METAFIELDS_MUTATION,
          variables: {
            metafields: [
              {
                ownerId: customerId,
                namespace: "custom",
                key: "birthday",
                type: "date",
                value: birthday,
              },
            ],
          },
        });

        if (metafieldData.metafieldsSet.userErrors.length) {
          console.error(
            "Birthday metafield userErrors:",
            JSON.stringify(metafieldData.metafieldsSet.userErrors)
          );
        }
      } catch (metaErr) {
        console.error(
          "Birthday metafield save failed:",
          metaErr instanceof Error ? metaErr.message : metaErr
        );
      }
    }

    // Update marketing email consent via Admin API
    const marketingConsent = formData.get("marketingConsent") === "on";
    try {
      const consentData = await adminFetch<{
        customerEmailMarketingConsentUpdate: {
          customer: { id: string } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      }>({
        query: ADMIN_CUSTOMER_EMAIL_MARKETING_CONSENT_UPDATE_MUTATION,
        variables: {
          input: {
            customerId,
            emailMarketingConsent: {
              marketingState: marketingConsent ? "SUBSCRIBED" : "UNSUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN",
            },
          },
        },
      });

      if (consentData.customerEmailMarketingConsentUpdate.userErrors.length) {
        console.error(
          "Marketing consent userErrors:",
          JSON.stringify(consentData.customerEmailMarketingConsentUpdate.userErrors)
        );
      }
    } catch (consentErr) {
      console.error(
        "Marketing consent update failed:",
        consentErr instanceof Error ? consentErr.message : consentErr
      );
    }

    revalidatePath("/account/profile");
    revalidatePath("/account");
    return { success: true, error: null };
  } catch (err) {
    console.error(
      "Profile update failed:",
      err instanceof Error ? err.message : err
    );
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
