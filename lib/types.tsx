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
  stock: number;
  stockSold: number;
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
  newUsersThisWeek: number;
  activeListings: number;
  totalOrders: number;
  totalSalesAmount: number;
  openDisputes: number;
  totalListings: number;
  pendingModeration: number;
  reportsThisMonth: number;
}

export type AdminUserStatus = "active" | "suspended";
export type DisputeStatus = "open" | "resolved";
export type PaymentTableStatus = "held_in_escrow" | "released" | "refunded" | "to_be_paid" | "collected";
export type AdminActionType =
  | "login" | "logout" | "listing_created" | "listing_approved" | "listing_rejected"
  | "listing_removed" | "order_placed" | "order_status_changed" | "dispute_opened"
  | "dispute_resolved" | "user_suspended" | "user_activated" | "role_changed" | "message_sent" | "account_created";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  verified: boolean;
  listingsCount: number;
  joinedAt: string;
  status: AdminUserStatus;
  avatar?: string;
}

export interface AdminListing {
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
  stock: number;
  rejectionReason?: string;
}

export interface AdminOrder {
  id: string;
  listingTitle: string;
  listingImage: string;
  listingPrice: number;
  shippingFee: number;
  total: number;
  sellerId: string;
  sellerName: string;
  buyerId: string;
  buyerName: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  gcashPayment?: GcashPayment;
  status: OrderStatus;
  timeline: OrderStatusEvent[];
  courierName?: string;
  trackingNumber?: string;
  dispute?: AdminDispute;
  createdAt: string;
}

export interface AdminDispute {
  id: string;
  orderId: string;
  listingTitle: string;
  listingImage: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  reason: DisputeReason;
  description: string;
  paymentMethod: PaymentMethod;
  total: number;
  status: DisputeStatus;
  submittedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  outcome?: "refunded" | "released" | "cancelled" | "closed";
  adminNote?: string;
  messages: { senderId: string; senderName: string; content: string; sentAt: string }[];
}

export interface AdminPayment {
  id: string;
  orderId: string;
  listingTitle: string;
  buyerName: string;
  sellerName: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: PaymentTableStatus;
  referenceNo?: string;
  gcashNumber?: string;
  gcashAccountName?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  actionType: AdminActionType;
  description: string;
  createdAt: string;
  meta?: Record<string, string>;
}

export interface AdminCategory {
  id: string;
  name: string;
  listingsCount: number;
  createdAt: string;
}

export interface SalesDataPoint { month: string; amount: number; }
export interface OrderStatusDataPoint { status: string; count: number; }
export interface CategoryDataPoint { category: string; count: number; }

// ─── Purchase flow ────────────────────────────────────────────────────────────
export type PaymentMethod = "gcash" | "cod";

export type OrderStatus =
  | "placed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "completed"
  | "cancelled"
  | "disputed"
  | "refunded";

export type PaymentStatus =
  | "held_in_escrow"
  | "released"
  | "refunded"
  | "to_be_paid"
  | "collected";

export interface GcashPayment {
  number: string;
  accountName: string;
  amount: number;
  referenceNo: string;
}

export interface ShippingAddress {
  fullName: string;
  mobile: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  postalCode: string;
}

export type DisputeReason = "item_not_received" | "item_damaged" | "item_not_as_described";

export interface Dispute {
  reason: DisputeReason;
  description: string;
  submittedAt: string;
  outcome?: "refunded" | "released" | "cancelled" | "closed";
}

export interface OrderStatusEvent {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  changedBy?: string;
}

export interface StatusChange {
  status: OrderStatus;
  changedBy: string;
  timestamp: string;
}

export interface Order {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingPrice: number;
  shippingFee: number;
  total: number;
  sellerId: string;
  sellerName: string;
  sellerCity: string;
  buyerId: string;
  buyerName: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  gcashPayment?: GcashPayment;
  status: OrderStatus;
  timeline: OrderStatusEvent[];
  courierName?: string;
  trackingNumber?: string;
  dispute?: Dispute;
  createdAt: string;
}
