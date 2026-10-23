import type { PaymentMethod } from "@/lib/types";

interface Props {
  value: PaymentMethod;
  onChange: (v: PaymentMethod) => void;
}

const options: { value: PaymentMethod; label: string; icon: string; desc: string }[] = [
  { value: "gcash", label: "GCash", icon: "💙", desc: "Pay online using your GCash details." },
  { value: "cod",   label: "Cash on Delivery", icon: "💵", desc: "Pay the courier in cash when the item arrives." },
];

export default function PaymentMethodSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all ${
            value === opt.value
              ? "border-violet-500 bg-violet-500/10"
              : "border-white/10 bg-white/5 hover:border-white/20"
          }`}
        >
          <span className="text-2xl mt-0.5">{opt.icon}</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{opt.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 mt-1 flex-shrink-0 transition-colors ${
            value === opt.value ? "border-violet-500 bg-violet-500" : "border-white/30"
          }`} />
        </button>
      ))}
    </div>
  );
}
