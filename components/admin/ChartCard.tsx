interface Props {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export default function ChartCard({ title, children, action }: Props) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-800">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}
