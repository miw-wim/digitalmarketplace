"use client";
import { useState, useEffect } from "react";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import StatCard from "@/components/admin/StatCard";
import { MOCK_PAYMENTS } from "@/lib/mock-data";
import type { AdminPayment, PaymentTableStatus } from "@/lib/types";

const delay = () => new Promise((r) => setTimeout(r, 800));

const statusColors: Record<PaymentTableStatus, string> = {
  held_in_escrow: "bg-amber-100 text-amber-700",
  released: "bg-emerald-100 text-emerald-700",
  refunded: "bg-orange-100 text-orange-700",
  to_be_paid: "bg-sky-100 text-sky-700",
  collected: "bg-emerald-100 text-emerald-700",
};

const statusLabels: Record<PaymentTableStatus, string> = {
  held_in_escrow: "Held in Escrow",
  released: "Released",
  refunded: "Refunded",
  to_be_paid: "To Be Collected",
  collected: "Collected",
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"gcash" | "cod">("gcash");

  useEffect(() => {
    delay().then(() => { setPayments(MOCK_PAYMENTS); setLoading(false); });
  }, []);

  const gcash = payments.filter((p) => p.paymentMethod === "gcash");
  const cod = payments.filter((p) => p.paymentMethod === "cod");

  const escrow = gcash.filter((p) => p.status === "held_in_escrow").reduce((s, p) => s + p.amount, 0);
  const released = gcash.filter((p) => p.status === "released").reduce((s, p) => s + p.amount, 0);
  const refunded = gcash.filter((p) => p.status === "refunded").reduce((s, p) => s + p.amount, 0);
  const codToCollect = cod.filter((p) => p.status === "to_be_paid").reduce((s, p) => s + p.amount, 0);

  const gcashColumns: Column<AdminPayment>[] = [
    { key: "orderId", header: "Order #", render: (p) => <span className="font-mono text-xs text-slate-600">{p.orderId}</span> },
    { key: "listingTitle", header: "Item", sortable: true, render: (p) => <span className="max-w-[140px] truncate block">{p.listingTitle}</span> },
    { key: "buyerName", header: "Buyer", sortable: true },
    { key: "sellerName", header: "Seller", sortable: true },
    { key: "referenceNo", header: "Ref #", render: (p) => <span className="font-mono text-xs">{p.referenceNo ?? "—"}</span> },
    { key: "gcashNumber", header: "GCash #", render: (p) => p.gcashNumber ? <span className="font-mono text-xs">{p.gcashNumber.slice(0, 4)}***{p.gcashNumber.slice(-3)}</span> : <span>—</span> },
    { key: "gcashAccountName", header: "Account", render: (p) => <span>{p.gcashAccountName ?? "—"}</span> },
    { key: "amount", header: "Amount", sortable: true, render: (p) => <span className="font-semibold text-violet-600">₱{p.amount}</span> },
    { key: "status", header: "Status", render: (p) => (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status]}`}>{statusLabels[p.status]}</span>
    )},
    { key: "createdAt", header: "Date", sortable: true, render: (p) => new Date(p.createdAt).toLocaleDateString() },
  ];

  const codColumns: Column<AdminPayment>[] = [
    { key: "orderId", header: "Order #", render: (p) => <span className="font-mono text-xs text-slate-600">{p.orderId}</span> },
    { key: "listingTitle", header: "Item", sortable: true, render: (p) => <span className="max-w-[140px] truncate block">{p.listingTitle}</span> },
    { key: "buyerName", header: "Buyer", sortable: true },
    { key: "sellerName", header: "Seller", sortable: true },
    { key: "amount", header: "Amount", sortable: true, render: (p) => <span className="font-semibold text-violet-600">₱{p.amount}</span> },
    { key: "status", header: "Status", render: (p) => (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[p.status]}`}>{statusLabels[p.status]}</span>
    )},
    { key: "createdAt", header: "Date", sortable: true, render: (p) => new Date(p.createdAt).toLocaleDateString() },
  ];

  const iconCash = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;

  return (
    <div className="space-y-5 animate-fade-in">
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Held in Escrow" value={`₱${escrow.toLocaleString()}`} color="amber" icon={iconCash} />
          <StatCard label="Released" value={`₱${released.toLocaleString()}`} color="green" icon={iconCash} />
          <StatCard label="Refunded" value={`₱${refunded.toLocaleString()}`} color="red" icon={iconCash} />
          <StatCard label="COD to Collect" value={`₱${codToCollect.toLocaleString()}`} color="blue" icon={iconCash} />
        </div>
      )}

      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {(["gcash", "cod"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all uppercase ${tab === t ? "bg-violet-600 text-white" : "text-slate-500 hover:text-slate-800"}`}>
            {t} ({(t === "gcash" ? gcash : cod).length})
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <AdminDataTable
          columns={(tab === "gcash" ? gcashColumns : codColumns) as Column<Record<string, unknown>>[]}
          data={(tab === "gcash" ? gcash : cod) as unknown as Record<string, unknown>[]}
          loading={loading}
          keyExtractor={(p) => (p as unknown as AdminPayment).id}
          emptyMessage="No payments found."
          searchable
          searchKeys={["orderId" as never, "buyerName" as never]}
          pageSize={8}
        />
      </div>
    </div>
  );
}
