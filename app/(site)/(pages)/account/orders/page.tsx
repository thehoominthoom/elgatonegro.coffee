import Link from "next/link";
import Image from "next/image";
import { requireCustomerSession } from "@/lib/shopify/auth-helpers";
import { customerFetch } from "@/lib/shopify/auth-helpers";
import { CUSTOMER_ORDERS_QUERY } from "@/lib/shopify/customer-queries";

interface OrdersData {
  customer: {
    orders: {
      nodes: Array<{
        id: string;
        name: string;
        processedAt: string;
        financialStatus: string;
        fulfillments: {
          nodes: Array<{
            status: string;
          }>;
        };
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
  title: "Orders",
};

export default async function OrdersPage() {
  await requireCustomerSession();

  let orders: OrdersData["customer"]["orders"]["nodes"] = [];

  try {
    const data = await customerFetch<OrdersData>({
      query: CUSTOMER_ORDERS_QUERY,
      variables: { first: 50 },
    });
    orders = data.customer.orders.nodes;
  } catch {
    // API unavailable
  }

  return (
    <div>
      <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight text-brand-black mb-6">
        Order History
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 border border-brand-black/10 rounded-sm">
          <p className="font-sans text-sm text-brand-black/40 mb-4">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/shop"
            className="inline-flex bg-brand-orange text-brand-grey text-xs font-sans font-extrabold uppercase tracking-wider px-5 py-2.5 rounded-sm hover:bg-brand-yellow hover:text-brand-black transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-brand-black/10 border border-brand-black/10 rounded-sm">
          {orders.map((order) => {
            const fulfillment = order.fulfillments.nodes[0];
            const status = fulfillment?.status ?? order.financialStatus;
            const itemCount = order.lineItems.nodes.reduce(
              (sum, li) => sum + li.quantity,
              0
            );

            return (
              <Link
                key={order.id}
                href={`/account/orders/${encodeURIComponent(order.id)}`}
                className="flex items-center gap-4 px-4 py-5 hover:bg-brand-black/[0.02] transition-colors"
              >
                {/* Product thumbnails (stack first 2) */}
                <div className="flex -space-x-2 shrink-0">
                  {order.lineItems.nodes.slice(0, 2).map((li, i) => (
                    <div
                      key={i}
                      className="w-11 h-11 rounded-sm bg-brand-black/5 overflow-hidden border-2 border-brand-grey"
                    >
                      {li.image && (
                        <Image
                          src={li.image.url}
                          alt={li.image.altText ?? li.title}
                          width={44}
                          height={44}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
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
                    {" / "}
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-sans font-extrabold text-sm text-brand-black">
                    ${parseFloat(order.totalPrice.amount).toFixed(2)}
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-brand-black/40 mt-0.5">
                    {status.toLowerCase().replace(/_/g, " ")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
