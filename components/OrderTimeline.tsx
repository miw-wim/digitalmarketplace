import type { Order, OrderStatus } from "@/lib/types";

const allSteps: OrderStatus[] = ["placed", "processing", "shipped", "out_for_delivery", "delivered", "completed"];

const stepLabels: Record<OrderStatus, string> = {
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

const stepIcons: Record<OrderStatus, string> = {
  placed:           "📋",
  processing:       "⚙️",
  shipped:          "🚚",
  out_for_delivery: "📍",
  delivered:        "📦",
  completed:        "✅",
  cancelled:        "❌",
  disputed:         "⚠️",
  refunded:         "↩️",
};

export default function OrderTimeline({ order }: { order: Order }) {
  const steps = allSteps;
  const terminalStatuses: OrderStatus[] = ["cancelled", "disputed", "refunded"];
  const isTerminal = terminalStatuses.includes(order.status);
  const activeIndex = isTerminal ? steps.length : steps.indexOf(order.status);

  const getEvent = (status: OrderStatus) => order.timeline.find((e) => e.status === status);

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const done = i <= activeIndex;
        const ev = getEvent(step);
        const isLast = i === steps.length - 1;
        return (
          <div key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-colors ${done ? "border-violet-500 bg-violet-500/20" : "border-white/10 bg-white/5"}`}>
                {done ? <span>{stepIcons[step]}</span> : <span className="w-2 h-2 rounded-full bg-white/20" />}
              </div>
              {!isLast && <div className={`w-0.5 h-8 ${done && i < activeIndex ? "bg-violet-500/50" : "bg-white/10"}`} />}
            </div>
            <div className="pb-6 flex-1">
              <p className={`text-sm font-semibold ${done ? "text-white" : "text-gray-500"}`}>{stepLabels[step]}</p>
              {ev?.timestamp && <p className="text-xs text-gray-500 mt-0.5">{new Date(ev.timestamp).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>}
              {ev?.changedBy && <p className="text-xs text-gray-500 mt-0.5">by {ev.changedBy}</p>}
              {ev?.note && <p className="text-xs text-gray-400 mt-0.5">{ev.note}</p>}
              {step === "shipped" && order.courierName && done && (
                <p className="text-xs text-violet-400 mt-0.5">{order.courierName} · {order.trackingNumber}</p>
              )}
            </div>
          </div>
        );
      })}

      {isTerminal && (
        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-red-500 bg-red-500/20">
              <span>{stepIcons[order.status]}</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-400">{stepLabels[order.status]}</p>
            {getTimestamp(order.status) && (
              <p className="text-xs text-gray-500 mt-0.5">{new Date(getTimestamp(order.status)!).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
