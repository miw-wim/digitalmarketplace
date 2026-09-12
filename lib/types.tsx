export type Role = "user" | "admin";
export type ListingStatus = "active" | "sold" | "pending" | "removed";
export type Category = "Electronics" | "Books" | "Clothing" | "Furniture" | "Sports" | "Other";
export type ActivityType =
  | "listing_created"
  | "listing_sold"
  | "listing_removed"
  | "message_sent"
  | "account_created";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  joinedAt: string;
  isActive: boolean;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  category: Category;
  status: ListingStatus;
  images: string[];
  sellerId: string;
  sellerName: string;
  createdAt: string;
  views: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  isAdmin: boolean;
}

export interface ActivityItem {
  id: string;
  userId: string;
  type: ActivityType;
  description: string;
  createdAt: string;
  meta?: Record<string, string>;
}

export interface DashboardStats {
  myListings: number;
  activeListings: number;
  messages: number;
  totalViews: number;
}

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  pendingModeration: number;
  reportsThisMonth: number;
}
