interface Props {
  label: string;
  value: string | number;
  sub?: string;
  color?: "violet" | "blue" | "green" | "red" | "amber" | "slate";
  icon: React.ReactNode;
}

const colorMap = {
  violet: "bg-violet-50 text-violet-600 border-violet-100",
  blue:   "bg-blue-50 text-blue-600 border-blue-100",
  green:  "bg-emerald-50 text-emerald-600 border-emerald-100",
  red:    "bg-red-50 text-red-600 border-red-100",
  amber:  "bg-amber-50 text-amber-600 border-amber-100",
  slate:  "bg-slate-50 text-slate-600 border-slate-100",
};

export default function StatCard({ label, value, sub, color = "violet", icon }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-black text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}
