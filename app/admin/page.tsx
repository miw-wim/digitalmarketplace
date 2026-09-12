"use client";
import { useState, useEffect } from "react";
import DataTable from "@/components/DataTable";
import { useToast } from "@/components/Toast";
import { apiGetAdminStats, apiGetUsers, apiGetListings, apiToggleUserStatus, apiDeleteListing } from "@/lib/api";
import type { AdminStats, User, Listing } from "@/lib/types";

type Tab = "overview" | "users" | "listings";

function StatCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className={`text-3xl font-black ${color}`}>{value}</span>
      </div>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

export default function AdminPage() {
  const { showToast } = useToast();  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetAdminStats(), apiGetUsers(), apiGetListings()]).then(([s, u, l]) => {
      setStats(s);
      setUsers(u);
      setListings(l);
      setLoading(false);
    });
  }, []);

  const toggleUser = async (id: string) => {
    await apiToggleUserStatus(id);
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, isActive: !u.isActive } : u));
    showToast("User status updated.", "success");
  };

  const removeListing = async (id: string) => {
    await apiDeleteListing(id);
    setListings((prev) => prev.filter((l) => l.id !== id));
    showToast("Listing removed.", "success");
  };

  const userColumns = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "role", header: "Role", render: (u: User) => (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === "admin" ? "bg-violet-600/20 text-violet-400" : "bg-white/10 text-gray-400"}`}>
        {u.role}
      </span>
    )},
    { key: "joinedAt", header: "Joined", render: (u: User) => new Date(u.joinedAt).toLocaleDateString() },
    { key: "isActive", header: "Status", render: (u: User) => (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isActive ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
        {u.isActive ? "Active" : "Suspended"}
      </span>
    )},
    { key: "actions", header: "Actions", render: (u: User) => (
      <button onClick={() => toggleUser(u.id)}
        className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${u.isActive ? "bg-red-600/20 text-red-400 hover:bg-red-600/40" : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/40"}`}>
        {u.isActive ? "Suspend" : "Activate"}
      </button>
    )},
  ];

  const listingColumns = [
    { key: "title", header: "Title", render: (l: Listing) => <span className="font-medium text-white">{l.title}</span> },
    { key: "sellerName", header: "Seller" },
    { key: "category", header: "Category" },
    { key: "price", header: "Price", render: (l: Listing) => <span className="text-violet-400 font-semibold">${l.price}</span> },
    { key: "status", header: "Status", render: (l: Listing) => {
      const colors: Record<string, string> = { active: "bg-emerald-500/20 text-emerald-400", sold: "bg-gray-500/20 text-gray-400", pending: "bg-amber-500/20 text-amber-400", removed: "bg-red-500/20 text-red-400" };
      return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[l.status]}`}>{l.status}</span>;
    }},
    { key: "actions", header: "Actions", render: (l: Listing) => (
      <button onClick={() => removeListing(l.id)} className="text-xs px-3 py-1 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors font-medium">
        Remove
      </button>
    )},
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "users", label: `Users (${users.length})` },
    { key: "listings", label: `Listings (${listings.length})` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Admin Panel</h1>
        <p className="text-gray-400 mt-1">Manage users, listings, and platform health.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit mb-8">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.key ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="space-y-8">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <div key={i} className="bg-white/5 rounded-2xl h-28 animate-pulse" />)}
            </div>
          ) : stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Users" value={stats.totalUsers} color="text-violet-400" icon="👥" />
              <StatCard label="Total Listings" value={stats.totalListings} color="text-sky-400" icon="📦" />
              <StatCard label="Pending Review" value={stats.pendingModeration} color="text-amber-400" icon="⏳" />
              <StatCard label="Reports This Month" value={stats.reportsThisMonth} color="text-red-400" icon="🚩" />
            </div>
          )}

          {/* Charts placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {["Listings Over Time", "User Growth"].map((title) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">{title}</h3>
                <div className="h-40 flex items-end gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-violet-600/30 hover:bg-violet-600/50 rounded-t transition-colors" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-2">
                  <span>Jan</span><span>Jun</span><span>Dec</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "users" && (
        <DataTable columns={userColumns} data={users} loading={loading} keyExtractor={(u) => u.id} emptyMessage="No users found." />
      )}

      {tab === "listings" && (
        <DataTable columns={listingColumns} data={listings} loading={loading} keyExtractor={(l) => l.id} emptyMessage="No listings found." />
      )}
    </div>
  );
}
