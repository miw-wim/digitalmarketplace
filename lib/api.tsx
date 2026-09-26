import type { Listing, User, Conversation, Message, ActivityItem, DashboardStats, AdminStats } from "./types";
import {
  MOCK_LISTINGS, MOCK_USERS, MOCK_CONVERSATIONS,
  MOCK_MESSAGES, MOCK_ACTIVITY, MOCK_DASHBOARD_STATS, MOCK_ADMIN_STATS,
} from "./mock-data";

// Stub delay — replace each function body with a real Supabase call later
const delay = () => new Promise((r) => setTimeout(r, 800));

// ─── Auth ─────────────────────────────────────────────────────────────────────
export async function apiRegister(_data: { name: string; email: string; password: string }) {
  await delay();
  return { success: true };
}

export async function apiLogin(_email: string, _password: string) {
  await delay();
  return { success: true };
}

export async function apiForgotPassword(_email: string) {
  await delay();
  return { success: true };
}

export async function apiResetPassword(_email: string, _password: string) {
  await delay();
  return { success: true };
}

// ─── Listings ─────────────────────────────────────────────────────────────────
export async function apiGetListings(): Promise<Listing[]> {
  await delay();
  return MOCK_LISTINGS;
}

export async function apiGetListing(id: string): Promise<Listing | null> {
  await delay();
  return MOCK_LISTINGS.find((l) => l.id === id) ?? null;
}

export async function apiCreateListing(_data: Partial<Listing>): Promise<Listing> {
  await delay();
  return { ...MOCK_LISTINGS[0], id: `l${Date.now()}`, ..._data } as Listing;
}

export async function apiUpdateListing(id: string, _data: Partial<Listing>): Promise<Listing> {
  await delay();
  return { ...(MOCK_LISTINGS.find((l) => l.id === id) ?? MOCK_LISTINGS[0]), ..._data };
}

export async function apiDeleteListing(_id: string): Promise<void> {
  await delay();
}

// ─── Users (admin) ────────────────────────────────────────────────────────────
export async function apiGetUsers(): Promise<User[]> {
  await delay();
  return MOCK_USERS;
}

export async function apiToggleUserStatus(_id: string): Promise<void> {
  await delay();
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export async function apiGetConversations(): Promise<Conversation[]> {
  await delay();
  return MOCK_CONVERSATIONS;
}

export async function apiGetMessages(conversationId: string): Promise<Message[]> {
  await delay();
  return MOCK_MESSAGES[conversationId] ?? [];
}

export async function apiSendMessage(_conversationId: string, _content: string): Promise<Message> {
  await delay();
  return {
    id: `m${Date.now()}`,
    senderId: "u1",
    senderName: "Alex Rivera",
    content: _content,
    createdAt: new Date().toISOString(),
    read: false,
  };
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export async function apiGetDashboardStats(): Promise<DashboardStats> {
  await delay();
  return MOCK_DASHBOARD_STATS;
}

export async function apiGetAdminStats(): Promise<AdminStats> {
  await delay();
  return MOCK_ADMIN_STATS;
}

export async function apiGetActivity(): Promise<ActivityItem[]> {
  await delay();
  return MOCK_ACTIVITY;
}
