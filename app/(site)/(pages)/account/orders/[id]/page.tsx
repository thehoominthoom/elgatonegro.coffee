import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireCustomerSession } from "@/lib/shopify/auth-helpers";
import { customerFetch } from "@/lib/shopify/auth-helpers";
import { CUSTOMER_ORDER_QUERY } from "@/lib/shopify/customer-queries";
import { notFound } from "next/navigation";

interface OrderData {
  order: {
    id: string;
    name: string;
    processedAt: string;
    financialStatus: string;
    fulfillments: {
      nodes: Array<{
        status: string;
        trackingInformation: Array<{
          number: string;
          url: string | null;
        }>;
      }>;
    };
    totalPrice: { amount: string; currencyCode: string };
    subtotal: { amount: string; currencyCode: string };
    totalShipping: { amount: string; currencyCode: string } | null;
    totalTax: { amount: string; currencyCode: string } | null;
    shippingAddress: {
      formatted: string[];
      firstName: string;
      lastName: string;
    } | null;
    lineItems: {
      nodes: Array<{
        id: string;
        title: string;
        quantity: number;
        variantTitle: string | null;
        image: {
          url: string;
          altText: string | null;
          width: number;
          height: number;
        } | null;
        totalPrice: { amount: string; currencyCode: string };
      }>;
    };
  } | null;
}

export const metadata = {
  title: "Order Detail",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireCustomerSession();
  const { id } = await params;
  const orderId = decodeURIComponent(id);

  let order: OrderData["order"] = null;

  try {
    const data = await customerFetch<OrderData>({
      query: CUSTOMER_ORDER_QUERY,
      variables: { orderId },
    });
    order = data.order;
  } catch {
    notFound();
  }

  if (!order) notFound();

  const fulfillment = order.fulfillments.nodes[0];
  const tracking = fulfillment?.trackingInformation[0];

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 font-sans text-xs text-brand-black/40 mb-6">
        <Link
          href="/account/orders"
          className="hover:text-brand-orange transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={12} />
          Orders
        </Link>
        <span>/</span>
        <span className="text-brand-black/60">{order.name}</span>
      </nav>

      {/* Order header */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight text-brand-black">
          {order.name}
        </h2>
        <p className="font-sans text-sm text-brand-black/50 mt-1">
          Placed{" "}
          {new Date(order.processedAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Status + tracking */}
      <div className="flex flex-wrap gap-3 mb-8">
        <StatusBadge label={order.financialStatus} />
        {fulfillment && <StatusBadge label={fulfillment.status} />}
        {tracking?.url && (
          <a
            href={tracking.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs text-brand-orange hover:text-brand-yellow transition-colors underline underline-offset-2"
          >
            Track: {tracking.number}
          </a>
        )}
      </div>

      {/* Line items */}
      <div className="border border-brand-black/10 rounded-sm divide-y divide-brand-black/10 mb-8">
        {order.lineItems.nodes.map((item) => (
          <div key={item.id} className="flex items-center gap-4 px-4 py-4">
            <div className="w-16 h-16 rounded-sm bg-brand-black/5 overflow-hidden shrink-0">
              {item.image && (
                <Image
                  src={item.image.url}
                  alt={item.image.altText ?? item.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans font-extrabold text-sm text-brand-black">
                {item.title}
              </p>
              {item.variantTitle && item.variantTitle !== "Default Title" && (
                <p className="font-sans text-xs text-brand-black/50 mt-0.5">
                  {item.variantTitle}
                </p>
              )}
              <p className="font-sans text-xs text-brand-black/40 mt-0.5">
                Qty: {item.quantity}
              </p>
            </div>
            <p className="font-sans font-extrabold text-sm text-brand-black shrink-0">
              ${parseFloat(item.totalPrice.amount).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Order summary + shipping address side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary */}
        <div className="border border-brand-black/10 rounded-sm px-4 py-4">
          <h3 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
            Order Summary
          </h3>
          <div className="space-y-2 font-sans text-sm">
            <div className="flex justify-between text-brand-black/60">
              <span>Subtotal</span>
              <span>${parseFloat(order.subtotal.amount).toFixed(2)}</span>
            </div>
            {order.totalShipping && (
              <div className="flex justify-between text-brand-black/60">
                <span>Shipping</span>
                <span>
                  ${parseFloat(order.totalShipping.amount).toFixed(2)}
                </span>
              </div>
            )}
            {order.totalTax && (
              <div className="flex justify-between text-brand-black/60">
                <span>Tax</span>
                <span>${parseFloat(order.totalTax.amount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-black font-extrabold pt-2 border-t border-brand-black/10">
              <span>Total</span>
              <span>${parseFloat(order.totalPrice.amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        {order.shippingAddress && (
          <div className="border border-brand-black/10 rounded-sm px-4 py-4">
            <h3 className="font-sans font-extrabold text-xs uppercase tracking-[0.2em] text-brand-black mb-4">
              Shipping Address
            </h3>
            <p className="font-sans text-sm text-brand-black/70 whitespace-pre-line">
              {order.shippingAddress.formatted.join("\n")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  return (
    <span className="inline-block font-sans font-extrabold text-[10px] uppercase tracking-wider text-brand-black/60 bg-brand-black/5 px-2.5 py-1 rounded-sm">
      {label.toLowerCase().replace(/_/g, " ")}
    </span>
  );
}
