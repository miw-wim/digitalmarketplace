"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGetDashboardStats, apiGetActivity } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useOrders } from "@/lib/orders-store";
import type { DashboardStats, ActivityItem } from "@/lib/types";

const activityIcons: Record<string, string> = {
  listing_created: "📦",
  listing_sold: "💰",
  listing_removed: "🗑️",
  message_sent: "💬",
  account_created: "🎉",
};

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div className={`bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors`}>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { orders } = useOrders();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  useEffect(() => {
    if (!user) return;
    if (user.role === "admin") {
      router.replace("/admin");
      return;
    }
    Promise.all([apiGetDashboardStats(), apiGetActivity()]).then(([s, a]) => {
      setStats(s);
      setActivity(a);
      setLoading(false);
    });
  }, [user]);

  const ordersInTransit = orders.filter((o) => o.buyerId === user?.id && ["placed", "shipped"].includes(o.status)).length;

  const quickActions = [
    { label: "New Listing", href: "/listings?action=create", icon: "+" },
    { label: "My Listings", href: "/listings?mine=true", icon: "📋" },
    { label: "My Sales", href: "/sales", icon: "🏪" },
    { label: "Messages", href: "/messages", icon: "💬" },
    { label: "Activity", href: "/activity", icon: "📊" },
    { label: "My Purchases", href: "/purchases", icon: "🛍️" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">
            Hey{user?.name ? `, ${user.name}` : " there"} 👋
          </h1>
          <p className="text-gray-400 mt-1">Here&apos;s what&apos;s happening with your marketplace activity.</p>
        </div>
        <button onClick={handleLogout}
          className="px-4 py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400 text-sm font-medium rounded-xl transition-all">
          Log out
        </button>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => <div key={i} className="bg-white/5 rounded-2xl h-28 animate-pulse" />)}
        </div>
      ) : stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="My Listings" value={stats.myListings} sub="total posted" color="text-violet-400" />
          <StatCard label="Active" value={stats.activeListings} sub="currently live" color="text-emerald-400" />
          <StatCard label="Messages" value={stats.messages} sub="conversations" color="text-sky-400" />
          <StatCard label="Total Views" value={stats.totalViews} sub="across all listings" color="text-amber-400" />
          <StatCard label="Orders in Transit" value={ordersInTransit} sub="being shipped" color="text-orange-400" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-violet-600/15 border border-white/10 hover:border-violet-500/40 rounded-xl transition-all text-center group">
                <span className="text-2xl">{a.icon}</span>
                <span className="text-xs font-medium text-gray-300 group-hover:text-white transition-colors">{a.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Recent Activity</h2>
            <Link href="/activity" className="text-xs text-violet-400 hover:text-violet-300">View all →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
            </div>
          ) : activity.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No activity yet.</p>
          ) : (
            <div className="space-y-2">
              {activity.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <span className="text-lg mt-0.5">{activityIcons[item.type] ?? "•"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My Purchases */}
      <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">My Purchases</h2>
          <Link href="/purchases" className="text-xs text-violet-400 hover:text-violet-300">View all →</Link>
        </div>
        {orders.filter((o) => o.buyerId === user?.id).length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">No purchases yet. <Link href="/listings" className="text-violet-400 hover:text-violet-300">Browse listings</Link></p>
        ) : (
          <div className="space-y-2">
            {orders.filter((o) => o.buyerId === user?.id).slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl transition-colors">
                <div>
                  <p className="text-sm text-white font-medium">{order.listingTitle}</p>
                  <p className="text-xs text-gray-500">from {order.sellerName} · {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-violet-400 font-bold text-sm">₱{order.total}</span>
                  <Link href={`/purchases/${order.id}`} className="text-xs text-gray-400 hover:text-white transition-colors">View →</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
