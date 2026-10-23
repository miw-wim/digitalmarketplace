"use client";
import { useState } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import StatusBadge from "./StatusBadge";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  placed:           "processing",
  processing:       "shipped",
  shipped:          "out_for_delivery",
  out_for_delivery: "delivered",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  placed:           "Order Placed",
  processing:       "Processing",
  shipped:          "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered:        "Delivered",
  completed:        "Completed",
  cancelled:        "Cancelled",
  disputed:         "Disputed",
  refunded:         "Refunded",
};

interface Props {
  order: Order;
  sellerName: string;
  onSave: (status: OrderStatus, courierName?: string, trackingNumber?: string) => Promise<void>;
  onClose: () => void;
}

export default function UpdateStatusModal({ order, sellerName, onSave, onClose }: Props) {
  const nextStatus = NEXT_STATUS[order.status];
  const [courier, setCourier] = useState(order.courierName ?? "");
  const [tracking, setTracking] = useState(order.trackingNumber ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!nextStatus) return null;

  const needsCourier = nextStatus === "shipped";

  const handleSave = async () => {
    if (needsCourier) {
      const e: Record<string, string> = {};
      if (!courier.trim()) e.courier = "Courier name is required.";
      if (!tracking.trim()) e.tracking = "Tracking number is required.";
      if (Object.keys(e).length) { setErrors(e); return; }
    }
    setErrors({});
    setLoading(true);
    try {
      await onSave(nextStatus, needsCourier ? courier : undefined, needsCourier ? tracking : undefined);
      setDone(true);
    } catch {
      setErrors({ general: "Failed to update status. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-4 space-y-3">
        <div className="text-4xl">✅</div>
        <p className="text-white font-semibold">Status updated!</p>
        <p className="text-gray-400 text-sm">Order is now <span className="text-white">{STATUS_LABELS[nextStatus]}</span>.</p>
        <button onClick={onClose} className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-sm font-semibold transition-colors">
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Current status</p>
          <StatusBadge type="order" value={order.status} />
        </div>
        <div className="text-gray-600 text-lg">→</div>
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">New status</p>
          <StatusBadge type="order" value={nextStatus} />
        </div>
      </div>

      {needsCourier && (
        <div className="space-y-3 bg-white/5 rounded-xl p-4">
          <p className="text-xs text-gray-400 font-medium">Shipping details required</p>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Courier Name</label>
            <input
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              placeholder="e.g. J&T Express, LBC, Ninja Van"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
            {errors.courier && <p className="text-xs text-red-400 mt-1">{errors.courier}</p>}
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">Tracking Number</label>
            <input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. JT0012345678"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
            />
            {errors.tracking && <p className="text-xs text-red-400 mt-1">{errors.tracking}</p>}
          </div>
        </div>
      )}

      {errors.general && <p className="text-xs text-red-400">{errors.general}</p>}

      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl text-sm font-medium transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} disabled={loading} className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors">
          {loading ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
