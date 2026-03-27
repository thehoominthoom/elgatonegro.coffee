import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { requireCustomerSession } from "@/lib/shopify/auth-helpers";
import { customerFetch } from "@/lib/shopify/auth-helpers";
import { CUSTOMER_QUERY, CUSTOMER_ORDERS_QUERY } from "@/lib/shopify/customer-queries";

interface CustomerData {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    emailAddress: { emailAddress: string } | null;
    defaultAddress: {
      formatted: string[];
    } | null;
  };
}

interface OrdersData {
  customer: {
    orders: {
      nodes: Array<{
        id: string;
        name: string;
        processedAt: string;
        financialStatus: string;
        totalPrice: { amount: string; currencyCode: string };
        lineItems: {
          nodes: Array<{
            title: string;
            quantity: number;
            image: { url: string; altText: string | null } | null;
          }>;
        };
      }>;
    };
  };
}

export const metadata = {
  title: "Overview | My Account",
};

export default async function AccountPage() {
  const session = await requireCustomerSession();

  let customerData: CustomerData | null = null;
  let ordersData: OrdersData | null = null;

  try {
    [customerData, ordersData] = await Promise.all([
      customerFetch<CustomerData>({ query: CUSTOMER_QUERY }),
      customerFetch<OrdersData>({
        query: CUSTOMER_ORDERS_QUERY,
        variables: { first: 3 },
      }),
    ]);
  } catch {
    // API unavailable — show fallback from session
  }

  const customer = customerData?.customer;
  const recentOrders = ordersData?.customer.orders.nodes ?? [];
  const displayName =
    customer?.firstName || session.customer?.firstName || "there";

  return (
    <div>
      {/* Welcome */}
      <div className="mb-10">
        <h2 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tight text-brand-black">
          Welcome back, {displayName}
        </h2>
        <p className="font-sans text-sm text-brand-black/50 mt-1">
          {customer?.emailAddress?.emailAddress ?? session.customer?.email}
        </p>
      </div>

      {/* Quick links grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-brand-black/10 rounded-sm mb-10">
        <QuickLink
          href="/account/orders"
          label="Order History"
          description="View and track your orders"
        />
        <QuickLink
          href="/account/addresses"
          label="Addresses"
          description="Manage shipping addresses"
        />
        <QuickLink
          href="/account/profile"
          label="Profile"
          description="Update your information"
        />
        <QuickLink
          href="/shop"
          label="Shop"
          description="Browse products"
        />
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black">
            Recent Orders
          </h3>
          {recentOrders.length > 0 && (
            <Link
              href="/account/orders"
              className="font-sans text-xs text-brand-orange hover:text-brand-yellow transition-colors"
            >
              View all
            </Link>
          )}
        </div>

        {recentOrders.length === 0 ? (
          <p className="font-sans text-sm text-brand-black/40 py-8 text-center border border-brand-black/10 rounded-sm">
            No orders yet.
          </p>
        ) : (
          <div className="divide-y divide-brand-black/10 border border-brand-black/10 rounded-sm">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${encodeURIComponent(order.id)}`}
                className="flex items-center gap-4 px-4 py-4 hover:bg-brand-black/[0.02] transition-colors"
              >
                {/* First line item image */}
                <div className="w-12 h-12 rounded-sm bg-brand-black/5 overflow-hidden shrink-0">
                  {order.lineItems.nodes[0]?.image && (
                    <Image
                      src={order.lineItems.nodes[0].image.url}
                      alt={
                        order.lineItems.nodes[0].image.altText ??
                        order.lineItems.nodes[0].title
                      }
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans font-extrabold text-sm text-brand-black">
                    {order.name}
                  </p>
                  <p className="font-sans text-xs text-brand-black/50 mt-0.5">
                    {new Date(order.processedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {" "}
                    <span className="capitalize">
                      {order.financialStatus.toLowerCase().replace(/_/g, " ")}
                    </span>
                  </p>
                </div>
                <p className="font-sans font-extrabold text-sm text-brand-black shrink-0">
                  ${parseFloat(order.totalPrice.amount).toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Default address */}
      {customer?.defaultAddress && (
        <div className="mt-10">
          <h3 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
            Default Address
          </h3>
          <div className="border border-brand-black/10 rounded-sm px-4 py-4">
            <p className="font-sans text-sm text-brand-black/70 whitespace-pre-line">
              {customer.defaultAddress.formatted.join("\n")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickLink({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between bg-brand-grey px-5 py-5 border border-transparent rounded-sm hover:border-brand-orange/30 hover:bg-brand-black/[0.02] transition-colors"
    >
      <div>
        <p className="font-display font-bold text-sm uppercase tracking-tight text-brand-black">
          {label}
        </p>
        <p className="font-sans text-xs text-brand-black/50 mt-1">
          {description}
        </p>
      </div>
      <ArrowRight
        size={16}
        className="text-brand-black/20 group-hover:text-brand-orange group-hover:translate-x-1 transition-all shrink-0"
      />
    </Link>
  );
}
