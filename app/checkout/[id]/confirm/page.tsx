"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useOrders } from "@/lib/orders-store";
import StatusBadge from "@/components/StatusBadge";

function maskNumber(n: string) {
  return n.slice(0, 4) + "•••" + n.slice(-4);
}

function ConfirmInner() {
  const searchParams = useSearchParams();
  const { orders } = useOrders();
  const orderId = searchParams.get("orderId");
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-gray-400">Order not found.</p>
        <Link href="/purchases" className="text-violet-400 hover:text-violet-300 mt-2 inline-block">My purchases →</Link>
      </div>
    );
  }

  const { shippingAddress: a } = order;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-white">
          {order.paymentMethod === "gcash" ? "Payment Successful!" : "Order Placed!"}
        </h1>
        <p className="text-gray-400 text-sm mt-1">Order <span className="text-white font-mono">{order.id}</span></p>
      </div>

      {/* Item */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
        <div className="flex gap-3 items-center mb-4">
          {order.listingImage && <img src={order.listingImage} alt={order.listingTitle} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />}
          <div>
            <p className="text-sm text-white font-medium">{order.listingTitle}</p>
            <p className="text-xs text-gray-500">Sold by {order.sellerName}</p>
          </div>
        </div>
        <div className="text-xs text-gray-400 space-y-1 border-t border-white/10 pt-3">
          <p><span className="text-gray-500">Ship to:</span> {a.fullName}, {a.street}, {a.barangay}, {a.city}, {a.province} {a.postalCode}</p>
          <p><span className="text-gray-500">Mobile:</span> {a.mobile}</p>
        </div>
      </div>

      {/* Payment details */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white text-sm">Payment</h2>
          <StatusBadge type="payment" value={order.paymentStatus} />
        </div>

        {order.paymentMethod === "gcash" && order.gcashPayment ? (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400"><span>Method</span><span className="text-white">GCash</span></div>
            <div className="flex justify-between text-gray-400"><span>GCash number</span><span className="text-white font-mono">{maskNumber(order.gcashPayment.number)}</span></div>
            <div className="flex justify-between text-gray-400"><span>Account name</span><span className="text-white">{order.gcashPayment.accountName}</span></div>
            <div className="flex justify-between text-gray-400"><span>Amount paid</span><span className="text-white font-bold">₱{order.gcashPayment.amount}</span></div>
            <div className="flex justify-between text-gray-400"><span>Reference no.</span><span className="text-white font-mono text-xs">{order.gcashPayment.referenceNo}</span></div>
            <div className="mt-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-amber-300">
              💰 Payment is held in escrow and will be released to the seller once you confirm delivery.
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400"><span>Method</span><span className="text-white">💵 Cash on Delivery</span></div>
            <div className="flex justify-between text-gray-400"><span>Amount to prepare</span><span className="text-white font-bold">₱{order.total}</span></div>
            <div className="mt-2 bg-sky-500/10 border border-sky-500/30 rounded-xl px-3 py-2 text-xs text-sky-300">
              📦 Please prepare the exact amount of ₱{order.total} for the courier.
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <Link href="/purchases" className="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors text-center text-sm">
          My purchases
        </Link>
        <Link href={`/messages?with=${order.sellerId}&name=${encodeURIComponent(order.sellerName)}`}
          className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-semibold rounded-xl transition-colors text-center text-sm">
          Message seller
        </Link>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={<div className="max-w-lg mx-auto px-4 py-10 space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}</div>}>
      <ConfirmInner />
    </Suspense>
  );
}
