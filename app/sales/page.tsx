"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useOrders } from "@/lib/orders-store";
import { useToast } from "@/components/Toast";
import StatusBadge from "@/components/StatusBadge";
import Modal from "@/components/Modal";
import UpdateStatusModal from "@/components/UpdateStatusModal";
import type { Order, OrderStatus, PaymentMethod } from "@/lib/types";

const LOCKED: OrderStatus[] = ["completed", "cancelled", "disputed", "refunded"];

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  placed:           "Mark as Processing",
  processing:       "Mark as Shipped",
  shipped:          "Mark as Out for Delivery",
  out_for_delivery: "Mark as Delivered",
};

function SaleCard({ order }: { order: Order }) {
  const { sellerUpdateStatus } = useOrders();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const isLocked = LOCKED.includes(order.status);
  const { shippingAddress: a } = order;

  const handleSave = async (status: OrderStatus, courierName?: string, trackingNumber?: string) => {
    await sellerUpdateStatus(order.id, status, user?.name ?? "Seller", courierName, trackingNumber);
    showToast(`Order marked as ${status.replace(/_/g, " ")}`, "success");
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
      <div className="flex gap-4 mb-4">
        {order.listingImage && (
          <img src={order.listingImage} alt={order.listingTitle} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white truncate">{order.listingTitle}</p>
            <StatusBadge type="order" value={order.status} />
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Buyer: <span className="text-gray-300">{order.buyerName}</span></p>
          <p className="text-xs text-gray-600 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Shipping address */}
      <div className="bg-white/5 rounded-xl px-4 py-3 mb-3 text-xs text-gray-400 space-y-0.5">
        <p className="text-gray-300 font-medium">{a.fullName} · {a.mobile}</p>
        <p>{a.street}, {a.barangay}, {a.city}, {a.province} {a.postalCode}</p>
      </div>

      {/* Payment */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <span className="text-xs text-gray-500">Payment:</span>
        <StatusBadge type="payment" value={order.paymentStatus} />
        <span className="text-xs text-gray-500">{order.paymentMethod === "gcash" ? "💙 GCash" : "💵 COD"}</span>
        <span className="text-xs font-bold text-violet-400 ml-auto">₱{order.total}</span>
      </div>

      {/* Courier info */}
      {order.courierName && (
        <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-3 py-2 text-xs text-violet-300 mb-3">
          🚚 {order.courierName} · {order.trackingNumber}
        </div>
      )}

      {order.status === "cancelled" && (
        <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl px-3 py-2 text-xs text-gray-400 mb-3">
          Cancelled by buyer
        </div>
      )}

      {order.dispute && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 text-xs text-red-300 mb-3">
          ⚠️ Dispute: {order.dispute.description}
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        <Link href={`/purchases/${order.id}`} className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-colors">
          View details
        </Link>
        <Link href={`/messages?with=${order.buyerId}&name=${encodeURIComponent(order.buyerName)}`}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-colors">
          Message buyer
        </Link>
        {!isLocked && NEXT_LABEL[order.status] && (
          <button onClick={() => setModalOpen(true)}
            className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 text-violet-400 rounded-lg text-xs font-medium transition-colors">
            {NEXT_LABEL[order.status]}
          </button>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Update Order Status" size="sm">
        <UpdateStatusModal order={order} sellerName={user?.name ?? "Seller"} onSave={handleSave} onClose={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default function SalesPage() {
  const { user } = useAuth();
  const { sellerOrders, loading } = useOrders();
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState<PaymentMethod | "all">("all");

  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">Sign in to view your sales.</p>
        <Link href="/login" className="text-violet-400 hover:text-violet-300">Sign in →</Link>
      </div>
    );
  }

  const statusFilters = [
    { value: "all", label: "All" },
    { value: "placed", label: "Placed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "out_for_delivery", label: "Out for Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "disputed", label: "Disputed" },
  ];

  let filtered = sellerOrders;
  if (statusFilter !== "all") filtered = filtered.filter((o) => o.status === statusFilter);
  if (methodFilter !== "all") filtered = filtered.filter((o) => o.paymentMethod === methodFilter);

  const pendingCount = sellerOrders.filter((o) => !LOCKED.includes(o.status)).length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">My Sales</h1>
        <p className="text-gray-400 mt-1">
          {pendingCount > 0
            ? <><span className="text-violet-400 font-semibold">{pendingCount}</span> order{pendingCount > 1 ? "s" : ""} need your attention.</>
            : "Manage and ship your orders."}
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex gap-1 flex-wrap">
          {statusFilters.map((f) => (
            <button key={f.value} onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === f.value ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"}`}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["all", "gcash", "cod"] as const).map((m) => (
            <button key={m} onClick={() => setMethodFilter(m)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${methodFilter === m ? "bg-white/15 text-white" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"}`}>
              {m === "all" ? "All payments" : m === "gcash" ? "💙 GCash" : "💵 COD"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-white/5 rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-400">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((o) => <SaleCard key={o.id} order={o} />)}
        </div>
      )}
    </div>
  );
}
