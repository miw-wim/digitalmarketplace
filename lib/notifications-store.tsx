"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "./supabase";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  orderId?: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsContextValue {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue>({
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
});

function rowToNotif(row: Record<string, unknown>): Notification {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    body: row.body as string,
    orderId: (row.order_id as string) ?? undefined,
    read: row.read as boolean,
    createdAt: row.created_at as string,
  };
}

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUserId(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id ?? null);
      if (!session?.user) setNotifications([]);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;

    // Load existing notifications
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data) setNotifications(data.map(rowToNotif));
      });

    // Realtime: new notifications pushed to this user
    const channel = supabase
      .channel(`notifs:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [rowToNotif(payload.new as Record<string, unknown>), ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) =>
            prev.map((n) => n.id === (payload.new as Record<string, unknown>).id ? rowToNotif(payload.new as Record<string, unknown>) : n)
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    await supabase.from("notifications").update({ read: true }).eq("user_id", userId).eq("read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationsContext);

// Helper to insert a notification from anywhere (orders-store, etc.)
export async function pushNotification(userId: string, title: string, body: string, orderId?: string) {
  await supabase.from("notifications").insert({
    user_id: userId,
    title,
    body,
    order_id: orderId ?? null,
    read: false,
  });
}
