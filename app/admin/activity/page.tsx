"use client";
import { useState, useEffect } from "react";
import AdminDataTable, { Column } from "@/components/admin/AdminDataTable";
import { MOCK_ACTIVITY_LOGS } from "@/lib/mock-data";
import type { ActivityLog, AdminActionType } from "@/lib/types";

const delay = () => new Promise((r) => setTimeout(r, 800));

const actionLabels: Record<AdminActionType, string> = {
  login: "Login", logout: "Logout", listing_created: "Listing Created",
  listing_approved: "Listing Approved", listing_rejected: "Listing Rejected",
  listing_removed: "Listing Removed", order_placed: "Order Placed",
  order_status_changed: "Order Status Changed", dispute_opened: "Dispute Opened",
  dispute_resolved: "Dispute Resolved", user_suspended: "User Suspended",
  user_activated: "User Activated", role_changed: "Role Changed",
  message_sent: "Message Sent", account_created: "Account Created",
};

const actionColors: Record<AdminActionType, string> = {
  login: "bg-sky-100 text-sky-700", logout: "bg-slate-100 text-slate-600",
  listing_created: "bg-blue-100 text-blue-700", listing_approved: "bg-emerald-100 text-emerald-700",
  listing_rejected: "bg-red-100 text-red-700", listing_removed: "bg-red-100 text-red-700",
  order_placed: "bg-violet-100 text-violet-700", order_status_changed: "bg-amber-100 text-amber-700",
  dispute_opened: "bg-orange-100 text-orange-700", dispute_resolved: "bg-emerald-100 text-emerald-700",
  user_suspended: "bg-red-100 text-red-700", user_activated: "bg-emerald-100 text-emerald-700",
  role_changed: "bg-violet-100 text-violet-700", message_sent: "bg-sky-100 text-sky-700",
  account_created: "bg-teal-100 text-teal-700",
};

const actionIcons: Record<AdminActionType, string> = {
  login: "🔐", logout: "👋", listing_created: "📦", listing_approved: "✅",
  listing_rejected: "❌", listing_removed: "🗑️", order_placed: "🛒",
  order_status_changed: "🔄", dispute_opened: "⚠️", dispute_resolved: "🔒",
  user_suspended: "🚫", user_activated: "✅", role_changed: "👑",
  message_sent: "💬", account_created: "👤",
};

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFilter, setUserFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState<AdminActionType | "all">("all");

  useEffect(() => {
    delay().then(() => { setLogs(MOCK_ACTIVITY_LOGS); setLoading(false); });
  }, []);

  const users = [...new Set(logs.map((l) => l.userName))];
  const filtered = logs.filter((l) => {
    if (userFilter !== "all" && l.userName !== userFilter) return false;
    if (actionFilter !== "all" && l.actionType !== actionFilter) return false;
    return true;
  });

  const columns: Column<ActivityLog>[] = [
    { key: "actionType", header: "Action", render: (l) => (
      <div className="flex items-center gap-2">
        <span className="text-base">{actionIcons[l.actionType]}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${actionColors[l.actionType]}`}>{actionLabels[l.actionType]}</span>
      </div>
    )},
    { key: "userName", header: "User", sortable: true, render: (l) => (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-[10px] font-bold shrink-0">{l.userName.charAt(0)}</div>
        <span className="text-slate-700">{l.userName}</span>
      </div>
    )},
    { key: "description", header: "Description", render: (l) => <span className="text-slate-600 max-w-[280px] truncate block">{l.description}</span> },
    { key: "createdAt", header: "Date & Time", sortable: true, render: (l) => (
      <span className="text-xs text-slate-500 whitespace-nowrap">{new Date(l.createdAt).toLocaleString()}</span>
    )},
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-3 items-center">
        <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:border-violet-400">
          <option value="all">All Users</option>
          {users.map((u) => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value as AdminActionType | "all")}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:border-violet-400">
          <option value="all">All Actions</option>
          {(Object.keys(actionLabels) as AdminActionType[]).map((a) => <option key={a} value={a}>{actionLabels[a]}</option>)}
        </select>
        <span className="text-sm text-slate-400 ml-auto">{filtered.length} log{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <AdminDataTable
          columns={columns as Column<Record<string, unknown>>[]}
          data={filtered as unknown as Record<string, unknown>[]}
          loading={loading}
          keyExtractor={(l) => (l as unknown as ActivityLog).id}
          emptyMessage="No activity logs found."
          searchable
          searchKeys={["userName" as never, "description" as never]}
          pageSize={10}
        />
      </div>
    </div>
  );
}
