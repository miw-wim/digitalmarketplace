"use client";
import { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/admin/StatCard";
import ChartCard from "@/components/admin/ChartCard";
import { MOCK_ADMIN_ORDERS, MOCK_ADMIN_USERS, MOCK_DISPUTES, MOCK_SALES_DATA } from "@/lib/mock-data";

const delay = () => new Promise((r) => setTimeout(r, 800));

type ReportType = "sales" | "users" | "orders" | "disputes";

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<ReportType>("sales");
  const [dateFrom, setDateFrom] = useState("2024-11-01");
  const [dateTo, setDateTo] = useState("2024-11-30");
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    delay().then(() => setLoading(false));
  }, []);

  const validate = () => {
    if (dateFrom && dateTo && dateFrom > dateTo) {
      setDateError("Start date must be before end date.");
      return false;
    }
    setDateError("");
    return true;
  };

  const handleGenerate = () => { if (validate()) setLoading(false); };

  const salesTotal = MOCK_SALES_DATA.reduce((s, d) => s + d.amount, 0);
  const maxSales = Math.max(...MOCK_SALES_DATA.map((s) => s.amount), 1);

  const reportRows = useMemo(() => {
    if (reportType === "sales") return MOCK_SALES_DATA.map((s) => ({ label: s.month, value: `₱${s.amount.toLocaleString()}` }));
    if (reportType === "users") return MOCK_ADMIN_USERS.map((u) => ({ label: u.name, value: u.status }));
    if (reportType === "orders") return MOCK_ADMIN_ORDERS.map((o) => ({ label: o.id, value: `₱${o.total} · ${o.status}` }));
    return MOCK_DISPUTES.map((d) => ({ label: d.listingTitle, value: d.status }));
  }, [reportType]);

  const summaryCards = {
    sales: [
      { label: "Total Sales", value: `₱${salesTotal.toLocaleString()}`, color: "green" as const },
      { label: "Months Tracked", value: MOCK_SALES_DATA.length, color: "violet" as const },
      { label: "Avg / Month", value: `₱${Math.round(salesTotal / MOCK_SALES_DATA.length).toLocaleString()}`, color: "blue" as const },
    ],
    users: [
      { label: "Total Users", value: MOCK_ADMIN_USERS.length, color: "violet" as const },
      { label: "Active", value: MOCK_ADMIN_USERS.filter((u) => u.status === "active").length, color: "green" as const },
      { label: "Suspended", value: MOCK_ADMIN_USERS.filter((u) => u.status === "suspended").length, color: "red" as const },
    ],
    orders: [
      { label: "Total Orders", value: MOCK_ADMIN_ORDERS.length, color: "blue" as const },
      { label: "Total Revenue", value: `₱${MOCK_ADMIN_ORDERS.reduce((s, o) => s + o.total, 0).toLocaleString()}`, color: "green" as const },
      { label: "Completed", value: MOCK_ADMIN_ORDERS.filter((o) => o.status === "completed").length, color: "violet" as const },
    ],
    disputes: [
      { label: "Total Disputes", value: MOCK_DISPUTES.length, color: "red" as const },
      { label: "Open", value: MOCK_DISPUTES.filter((d) => d.status === "open").length, color: "amber" as const },
      { label: "Resolved", value: MOCK_DISPUTES.filter((d) => d.status === "resolved").length, color: "green" as const },
    ],
  };

  const iconChart = <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value as ReportType)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:border-violet-400">
            <option value="sales">Sales</option>
            <option value="users">Users</option>
            <option value="orders">Orders</option>
            <option value="disputes">Disputes</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">From</label>
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setDateError(""); }}
            className={`text-sm border rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:border-violet-400 ${dateError ? "border-red-400" : "border-slate-200"}`} />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">To</label>
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setDateError(""); }}
            className={`text-sm border rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:border-violet-400 ${dateError ? "border-red-400" : "border-slate-200"}`} />
        </div>
        <button onClick={handleGenerate} className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors">
          Generate
        </button>
        {dateError && <p className="text-xs text-red-500 self-center">{dateError}</p>}
        <div className="ml-auto flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            Export CSV
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            Print
          </button>
        </div>
      </div>

      {/* Summary cards */}
      {loading ? (
        <div className="grid grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-slate-100 rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {summaryCards[reportType].map((c) => <StatCard key={c.label} label={c.label} value={c.value} color={c.color} icon={iconChart} />)}
        </div>
      )}

      {/* Chart (sales only) */}
      {reportType === "sales" && (
        <ChartCard title="Sales Over Time">
          {loading ? <div className="h-40 bg-slate-100 rounded-xl animate-pulse" /> : (
            <div className="h-40 flex items-end gap-2">
              {MOCK_SALES_DATA.map((s) => (
                <div key={s.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-violet-500 hover:bg-violet-600 rounded-t transition-colors cursor-pointer"
                    style={{ height: `${(s.amount / maxSales) * 130}px` }} title={`₱${s.amount.toLocaleString()}`} />
                  <span className="text-[10px] text-slate-400">{s.month}</span>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      )}

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-700 capitalize">{reportType} Report</p>
          <span className="text-xs text-slate-400">{reportRows.length} rows</span>
        </div>
        {loading ? (
          <div className="p-4 space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded-lg animate-pulse" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Label</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {reportRows.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-slate-700 font-medium">{row.label}</td>
                    <td className="px-5 py-3 text-slate-600">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
