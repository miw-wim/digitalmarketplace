"use client";
import { useState, useEffect } from "react";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import Modal from "@/components/Modal";
import { MOCK_ADMIN_ORDERS } from "@/lib/mock-data";
import type { AdminOrder, OrderStatus, PaymentMethod } from "@/lib/types";

const delay = () => new Promise((r) => setTimeout(r, 800));

const statusColors: Record<OrderStatus, string> = {
  placed: "bg-sky-100 text-sky-700",
  processing: "bg-amber-100 text-amber-700",
  shipped: "bg-violet-100 text-violet-700",
  out_for_delivery: "bg-orange-100 text-orange-700",
  delivered: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-slate-100 text-slate-600",
  disputed: "bg-red-100 text-red-700",
  refunded: "bg-orange-100 text-orange-700",
};

const statusLabels: Record<OrderStatus, string> = {
  placed: "Placed", processing: "Processing", shipped: "Shipped",
  out_for_delivery: "Out for Delivery", delivered: "Delivered",
  completed: "Completed", cancelled: "Cancelled", disputed: "Disputed", refunded: "Refunded",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "all">("all");
  const [selected, setSelected] = useState<AdminOrder | null>(null);

  useEffect(() => {
    delay().then(() => { setOrders(MOCK_ADMIN_ORDERS); setLoading(false); });
  }, []);

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (paymentFilter !== "all" && o.paymentMethod !== paymentFilter) return false;
    return true;
  });

  const columns: Column<AdminOrder>[] = [
    { key: "id", header: "Order #", sortable: true, render: (o) => <span className="font-mono text-xs text-slate-600">{o.id}</span> },
    { key: "listingTitle", header: "Item", sortable: true, render: (o) => (
      <div className="flex items-center gap-2">
        <img src={o.listingImage} alt={o.listingTitle} className="w-8 h-8 rounded-lg object-cover shrink-0" />
        <span className="max-w-[140px] truncate font-medium text-slate-800">{o.listingTitle}</span>
      </div>
    )},
    { key: "buyerName", header: "Buyer", sortable: true },
    { key: "sellerName", header: "Seller", sortable: true },
    { key: "total", header: "Total", sortable: true, render: (o) => <span className="font-semibold text-violet-600">₱{o.total}</span> },
    { key: "paymentMethod", header: "Payment", render: (o) => (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.paymentMethod === "gcash" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}`}>
        {o.paymentMethod === "gcash" ? "GCash" : "COD"}
      </span>
    )},
    { key: "status", header: "Status", render: (o) => (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[o.status]}`}>{statusLabels[o.status]}</span>
    )},
    { key: "createdAt", header: "Date", sortable: true, render: (o) => new Date(o.createdAt).toLocaleDateString() },
    { key: "actions", header: "", render: (o) => (
      <button onClick={() => setSelected(o)} className="text-xs px-2.5 py-1 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 font-medium transition-colors">
        View
      </button>
    )},
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:border-violet-400">
          <option value="all">All Status</option>
          {(Object.keys(statusLabels) as OrderStatus[]).map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value as PaymentMethod | "all")}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:border-violet-400">
          <option value="all">All Payment</option>
          <option value="gcash">GCash</option>
          <option value="cod">COD</option>
        </select>
        <span className="text-sm text-slate-400 ml-auto">{filtered.length} order{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <AdminDataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} loading={loading}
          keyExtractor={(o) => (o as unknown as AdminOrder).id} emptyMessage="No orders found."
          searchable searchKeys={["id" as never, "buyerName" as never]} pageSize={8} />
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Order ${selected?.id}`} size="lg">
        {selected && (
          <div className="space-y-5 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Buyer</p>
                <p className="font-medium text-white">{selected.buyerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Seller</p>
                <p className="font-medium text-white">{selected.sellerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Payment</p>
                <p className="font-medium text-white">{selected.paymentMethod === "gcash" ? "GCash" : "COD"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Total</p>
                <p className="font-semibold text-violet-400">₱{selected.total}</p>
              </div>
              {selected.courierName && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Courier</p>
                  <p className="font-medium text-white">{selected.courierName}</p>
                </div>
              )}
              {selected.trackingNumber && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Tracking #</p>
                  <p className="font-mono text-white">{selected.trackingNumber}</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-2">Shipping Address</p>
              <div className="bg-white/5 rounded-xl p-3 text-slate-300 leading-relaxed">
                {selected.shippingAddress.fullName} · {selected.shippingAddress.mobile}<br />
                {selected.shippingAddress.street}, {selected.shippingAddress.barangay}<br />
                {selected.shippingAddress.city}, {selected.shippingAddress.province} {selected.shippingAddress.postalCode}
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400 mb-2">Order Timeline</p>
              <div className="space-y-2">
                {selected.timeline.map((t, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-violet-500 mt-1.5 shrink-0" />
                    <div>
                      <p className="text-white font-medium capitalize">{statusLabels[t.status]}</p>
                      <p className="text-xs text-slate-400">{new Date(t.timestamp).toLocaleString()}{t.note ? ` · ${t.note}` : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
              ℹ️ Shipping updates are handled by the seller.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
