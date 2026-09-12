"use client";
import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import { apiGetActivity } from "@/lib/api";
import type { ActivityItem } from "@/lib/types";

const typeLabels: Record<string, { label: string; color: string; icon: string }> = {
  listing_created: { label: "Listing Created", color: "bg-violet-500/20 text-violet-400", icon: "📦" },
  listing_sold: { label: "Listing Sold", color: "bg-emerald-500/20 text-emerald-400", icon: "💰" },
  listing_removed: { label: "Listing Removed", color: "bg-red-500/20 text-red-400", icon: "🗑️" },
  message_sent: { label: "Message", color: "bg-sky-500/20 text-sky-400", icon: "💬" },
  account_created: { label: "Account Created", color: "bg-amber-500/20 text-amber-400", icon: "🎉" },
};

export default function ActivityPage() {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    apiGetActivity().then((data) => { setActivity(data); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? activity : activity.filter((a) => a.type === filter);

  const columns = [
    {
      key: "type",
      header: "Type",
      render: (item: ActivityItem) => {
        const meta = typeLabels[item.type] ?? { label: item.type, color: "bg-white/10 text-gray-400", icon: "•" };
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
            <span>{meta.icon}</span>
            {meta.label}
          </span>
        );
      },
    },
    {
      key: "description",
      header: "Description",
      render: (item: ActivityItem) => <span className="text-gray-200">{item.description}</span>,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (item: ActivityItem) => (
        <span className="text-gray-400">{new Date(item.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
      ),
    },
  ];

  const filterOptions = [
    { value: "all", label: "All Activity" },
    { value: "listing_created", label: "Listings Created" },
    { value: "listing_sold", label: "Listings Sold" },
    { value: "message_sent", label: "Messages" },
    { value: "account_created", label: "Account" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Activity History</h1>
        <p className="text-gray-400 mt-1">A log of all your actions on Shopora.</p>
      </div>

      {/* Summary cards */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Events", value: activity.length, color: "text-white" },
            { label: "Listings", value: activity.filter((a) => a.type.startsWith("listing")).length, color: "text-violet-400" },
            { label: "Messages", value: activity.filter((a) => a.type === "message_sent").length, color: "text-sky-400" },
            { label: "This Month", value: activity.filter((a) => new Date(a.createdAt).getMonth() === new Date().getMonth()).length, color: "text-emerald-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap mb-5">
        {filterOptions.map((opt) => (
          <button key={opt.value} onClick={() => setFilter(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === opt.value ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400 hover:text-white border border-white/10"}`}>
            {opt.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        keyExtractor={(item) => item.id}
        emptyMessage="No activity found for this filter."
      />
    </div>
  );
}
