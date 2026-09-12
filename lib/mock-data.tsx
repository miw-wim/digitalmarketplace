import type { User, Listing, Conversation, Message, ActivityItem, DashboardStats, AdminStats } from "./types";

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Alex Rivera", email: "alex@campus.edu", role: "user", joinedAt: "2024-09-01", isActive: true },
  { id: "u2", name: "Jordan Lee", email: "jordan@campus.edu", role: "user", joinedAt: "2024-09-15", isActive: true },
  { id: "u3", name: "Sam Chen", email: "sam@campus.edu", role: "user", joinedAt: "2024-10-02", isActive: false },
  { id: "admin1", name: "Admin User", email: "admin@campus.edu", role: "admin", joinedAt: "2024-08-01", isActive: true },
];

export const MOCK_LISTINGS: Listing[] = [
  { id: "l1", title: "MacBook Pro 2022", description: "Excellent condition, barely used. Comes with charger and original box.", price: 1200, category: "Electronics", status: "active", images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"], sellerId: "u1", sellerName: "Alex Rivera", createdAt: "2024-11-01", views: 142 },
  { id: "l2", title: "Calculus Textbook 8th Ed", description: "Stewart Calculus, minimal highlighting. Perfect for MATH 101.", price: 45, category: "Books", status: "active", images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"], sellerId: "u1", sellerName: "Alex Rivera", createdAt: "2024-11-05", views: 38 },
  { id: "l3", title: "Ergonomic Desk Chair", description: "Mesh back, adjustable height. Great for long study sessions.", price: 180, category: "Furniture", status: "active", images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"], sellerId: "u2", sellerName: "Jordan Lee", createdAt: "2024-11-08", views: 67 },
  { id: "l4", title: "Nike Running Shoes Size 10", description: "Worn twice, like new. Too small for me.", price: 60, category: "Sports", status: "active", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"], sellerId: "u2", sellerName: "Jordan Lee", createdAt: "2024-11-10", views: 95 },
  { id: "l5", title: "Winter Jacket XL", description: "North Face puffer, navy blue. Kept warm all last winter.", price: 90, category: "Clothing", status: "sold", images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400"], sellerId: "u3", sellerName: "Sam Chen", createdAt: "2024-10-20", views: 210 },
  { id: "l6", title: "Arduino Starter Kit", description: "Complete kit with sensors, breadboard, and components. Never opened.", price: 35, category: "Electronics", status: "pending", images: ["https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400"], sellerId: "u3", sellerName: "Sam Chen", createdAt: "2024-11-12", views: 22 },
  { id: "l7", title: "Psychology 101 Notes Bundle", description: "Full semester notes, color-coded. Scored A+ with these.", price: 15, category: "Books", status: "active", images: ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400"], sellerId: "u1", sellerName: "Alex Rivera", createdAt: "2024-11-14", views: 54 },
  { id: "l8", title: "Portable Monitor 15.6\"", description: "USB-C powered, 1080p. Perfect for dual-screen setup on the go.", price: 150, category: "Electronics", status: "active", images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400"], sellerId: "u2", sellerName: "Jordan Lee", createdAt: "2024-11-15", views: 88 },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  { id: "c1", participantId: "u2", participantName: "Jordan Lee", lastMessage: "Is the MacBook still available?", lastMessageAt: "2024-11-15T14:30:00Z", unreadCount: 2, isAdmin: false },
  { id: "c2", participantId: "admin1", participantName: "Shopora Support", lastMessage: "Your listing has been approved.", lastMessageAt: "2024-11-14T09:00:00Z", unreadCount: 1, isAdmin: true },
  { id: "c3", participantId: "u3", participantName: "Sam Chen", lastMessage: "Can you do $40 for the textbook?", lastMessageAt: "2024-11-13T18:45:00Z", unreadCount: 0, isAdmin: false },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  c1: [
    { id: "m1", senderId: "u2", senderName: "Jordan Lee", content: "Hey! Is the MacBook still available?", createdAt: "2024-11-15T14:00:00Z", read: true },
    { id: "m2", senderId: "u1", senderName: "Alex Rivera", content: "Yes it is! Are you interested?", createdAt: "2024-11-15T14:10:00Z", read: true },
    { id: "m3", senderId: "u2", senderName: "Jordan Lee", content: "Definitely. Can we meet tomorrow?", createdAt: "2024-11-15T14:30:00Z", read: false },
  ],
  c2: [
    { id: "m4", senderId: "admin1", senderName: "Shopora Support", content: "Your listing has been approved and is now live.", createdAt: "2024-11-14T09:00:00Z", read: false },
  ],
  c3: [
    { id: "m5", senderId: "u3", senderName: "Sam Chen", content: "Hi, would you take $40 for the calculus textbook?", createdAt: "2024-11-13T18:45:00Z", read: true },
  ],
};

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a1", userId: "u1", type: "listing_created", description: "You listed \"MacBook Pro 2022\" for $1,200", createdAt: "2024-11-01T10:00:00Z" },
  { id: "a2", userId: "u1", type: "listing_created", description: "You listed \"Calculus Textbook 8th Ed\" for $45", createdAt: "2024-11-05T11:30:00Z" },
  { id: "a3", userId: "u1", type: "message_sent", description: "New message from Jordan Lee", createdAt: "2024-11-15T14:30:00Z" },
  { id: "a4", userId: "u1", type: "listing_created", description: "You listed \"Psychology 101 Notes Bundle\" for $15", createdAt: "2024-11-14T09:15:00Z" },
  { id: "a5", userId: "u1", type: "account_created", description: "Welcome to Shopora! Account created.", createdAt: "2024-09-01T08:00:00Z" },
];

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  myListings: 3,
  activeListings: 2,
  messages: 3,
  totalViews: 234,
};

export const MOCK_ADMIN_STATS: AdminStats = {
  totalUsers: 128,
  totalListings: 342,
  pendingModeration: 6,
  reportsThisMonth: 14,
};

export const CATEGORIES = ["Electronics", "Books", "Clothing", "Furniture", "Sports", "Other"] as const;
