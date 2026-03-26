"use server";

import { revalidatePath } from "next/cache";
import { customerFetch } from "@/lib/shopify/auth-helpers";
import {
  CUSTOMER_ADDRESS_CREATE_MUTATION,
  CUSTOMER_ADDRESS_DELETE_MUTATION,
  CUSTOMER_SET_DEFAULT_ADDRESS_MUTATION,
} from "@/lib/shopify/customer-queries";

export interface AddressActionState {
  success: boolean;
  error: string | null;
}

export async function createAddress(
  _prevState: AddressActionState,
  formData: FormData
): Promise<AddressActionState> {
  const address = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    address1: formData.get("address1") as string,
    address2: (formData.get("address2") as string) || undefined,
    city: formData.get("city") as string,
    zoneCode: formData.get("zoneCode") as string,
    zip: formData.get("zip") as string,
    territoryCode: formData.get("territoryCode") as string,
    phoneNumber: (formData.get("phoneNumber") as string) || undefined,
  };

  if (!address.firstName || !address.lastName || !address.address1 || !address.city || !address.zip) {
    return { success: false, error: "Please fill in all required fields." };
  }

  try {
    const data = await customerFetch<{
      customerAddressCreate: {
        customerAddress: { id: string } | null;
        userErrors: Array<{ message: string }>;
      };
    }>({
      query: CUSTOMER_ADDRESS_CREATE_MUTATION,
      variables: { address },
    });

    if (data.customerAddressCreate.userErrors.length) {
      return {
        success: false,
        error: data.customerAddressCreate.userErrors[0].message,
      };
    }

    revalidatePath("/account/addresses");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function setDefaultAddress(formData: FormData): Promise<AddressActionState> {
  const addressId = formData.get("addressId") as string;
  if (!addressId) return { success: false, error: "No address selected." };

  try {
    const data = await customerFetch<{
      customerAddressUpdate: {
        customerAddress: { id: string } | null;
        userErrors: Array<{ message: string }>;
      };
    }>({
      query: CUSTOMER_SET_DEFAULT_ADDRESS_MUTATION,
      variables: { addressId },
    });

    if (data.customerAddressUpdate.userErrors.length) {
      return {
        success: false,
        error: data.customerAddressUpdate.userErrors[0].message,
      };
    }

    revalidatePath("/account/addresses");
    revalidatePath("/account");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to set default address. Please try again." };
  }
}

export async function deleteAddress(formData: FormData): Promise<AddressActionState> {
  const addressId = formData.get("addressId") as string;
  if (!addressId) return { success: false, error: "No address selected." };

  try {
    const data = await customerFetch<{
      customerAddressDelete: {
        deletedAddressId: string | null;
        userErrors: Array<{ message: string }>;
      };
    }>({
      query: CUSTOMER_ADDRESS_DELETE_MUTATION,
      variables: { addressId },
    });

    if (data.customerAddressDelete.userErrors.length) {
      return {
        success: false,
        error: data.customerAddressDelete.userErrors[0].message,
      };
    }

    revalidatePath("/account/addresses");
    return { success: true, error: null };
  } catch {
    return { success: false, error: "Failed to delete address. Please try again." };
  }
}
