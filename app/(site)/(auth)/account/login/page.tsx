import Link from "next/link";
import { redirect } from "next/navigation";
import { getCustomerSession } from "@/lib/shopify/auth-helpers";

export const metadata = {
  title: "Sign In",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  // Already logged in — redirect to account
  const session = await getCustomerSession();
  if (session) redirect("/account");

  const { error } = await searchParams;

  const errorMessages: Record<string, string> = {
    missing_params: "Missing authorization parameters. Please try again.",
    expired_state: "Login session expired. Please try again.",
    invalid_state: "Invalid login state. Please try again.",
    invalid_nonce: "Security validation failed. Please try again.",
    token_exchange: "Authentication failed. Please try again.",
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-sm text-center">
        <h2 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-brand-black mb-3">
          Sign In
        </h2>
        <p className="font-sans text-sm text-brand-black/50 mb-8">
          Sign in to view orders, manage addresses, and more.
        </p>

        {error && errorMessages[error] && (
          <p className="font-sans text-xs text-red-600 mb-4 px-4 py-2.5 bg-red-50 rounded-sm">
            {errorMessages[error]}
          </p>
        )}

        <a
          href="/api/auth/login"
          className="inline-flex w-full justify-center bg-brand-orange text-brand-grey text-sm font-sans font-extrabold uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-brand-yellow hover:text-brand-black transition-colors"
        >
          Sign In
        </a>

        <p className="font-sans text-xs text-brand-black/40 mt-6">
          New customer?{" "}
          <a
            href="/api/auth/login"
            className="text-brand-orange hover:text-brand-yellow transition-colors underline underline-offset-2"
          >
            Create an account
          </a>
        </p>

        <Link
          href="/shop"
          className="inline-block font-sans text-xs text-brand-black/40 hover:text-brand-black transition-colors mt-4"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
