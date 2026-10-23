import type { OrderStatus, PaymentStatus } from "@/lib/types";

const orderColors: Record<OrderStatus, string> = {
  placed:           "bg-sky-500/20 text-sky-400 border-sky-500/30",
  processing:       "bg-amber-500/20 text-amber-400 border-amber-500/30",
  shipped:          "bg-violet-500/20 text-violet-400 border-violet-500/30",
  out_for_delivery: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  delivered:        "bg-blue-500/20 text-blue-400 border-blue-500/30",
  completed:        "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  cancelled:        "bg-gray-500/20 text-gray-400 border-gray-500/30",
  disputed:         "bg-red-500/20 text-red-400 border-red-500/30",
  refunded:         "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const orderLabels: Record<OrderStatus, string> = {
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

const paymentColors: Record<PaymentStatus, string> = {
  held_in_escrow: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  released:       "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  refunded:       "bg-orange-500/20 text-orange-400 border-orange-500/30",
  to_be_paid:     "bg-sky-500/20 text-sky-400 border-sky-500/30",
  collected:      "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

const paymentLabels: Record<PaymentStatus, string> = {
  held_in_escrow: "Held in Escrow",
  released:       "Released",
  refunded:       "Refunded",
  to_be_paid:     "To be paid on delivery",
  collected:      "Collected",
};

interface Props {
  type: "order" | "payment";
  value: OrderStatus | PaymentStatus;
}

export default function StatusBadge({ type, value }: Props) {
  const color = type === "order" ? orderColors[value as OrderStatus] : paymentColors[value as PaymentStatus];
  const label = type === "order" ? orderLabels[value as OrderStatus] : paymentLabels[value as PaymentStatus];
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${color}`}>
      {label}
    </span>
  );
}
