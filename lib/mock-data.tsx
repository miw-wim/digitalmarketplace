import type { User, Listing, Conversation, Message, ActivityItem, DashboardStats, AdminStats, Order, AdminUser, AdminListing, AdminOrder, AdminDispute, AdminPayment, ActivityLog, AdminCategory, SalesDataPoint, OrderStatusDataPoint, CategoryDataPoint } from "./types";

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Alex Rivera", email: "alex@campus.edu", role: "user", joinedAt: "2024-09-01", isActive: true },
  { id: "u2", name: "Jordan Lee", email: "jordan@campus.edu", role: "user", joinedAt: "2024-09-15", isActive: true },
  { id: "u3", name: "Sam Chen", email: "sam@campus.edu", role: "user", joinedAt: "2024-10-02", isActive: false },
  { id: "admin1", name: "Admin User", email: "admin@campus.edu", role: "admin", joinedAt: "2024-08-01", isActive: true },
];

export const MOCK_LISTINGS: Listing[] = [
  { id: "l1", title: "MacBook Pro 2022", description: "Excellent condition, barely used. Comes with charger and original box.", price: 1200, category: "Electronics", status: "active", images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"], sellerId: "u1", sellerName: "Alex Rivera", createdAt: "2024-11-01", stock: 3, stockSold: 142 },
  { id: "l2", title: "Calculus Textbook 8th Ed", description: "Stewart Calculus, minimal highlighting. Perfect for MATH 101.", price: 45, category: "Books", status: "active", images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"], sellerId: "u1", sellerName: "Alex Rivera", createdAt: "2024-11-05", stock: 5, stockSold: 38 },
  { id: "l3", title: "Ergonomic Desk Chair", description: "Mesh back, adjustable height. Great for long study sessions.", price: 180, category: "Furniture", status: "active", images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"], sellerId: "u2", sellerName: "Jordan Lee", createdAt: "2024-11-08", stock: 2, stockSold: 67 },
  { id: "l4", title: "Nike Running Shoes Size 10", description: "Worn twice, like new. Too small for me.", price: 60, category: "Sports", status: "active", images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"], sellerId: "u2", sellerName: "Jordan Lee", createdAt: "2024-11-10", stock: 1, stockSold: 95 },
  { id: "l5", title: "Winter Jacket XL", description: "North Face puffer, navy blue. Kept warm all last winter.", price: 90, category: "Clothing", status: "sold", images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400"], sellerId: "u3", sellerName: "Sam Chen", createdAt: "2024-10-20", stock: 0, stockSold: 210 },
  { id: "l6", title: "Arduino Starter Kit", description: "Complete kit with sensors, breadboard, and components. Never opened.", price: 35, category: "Electronics", status: "pending", images: ["https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400"], sellerId: "u3", sellerName: "Sam Chen", createdAt: "2024-11-12", stock: 4, stockSold: 22 },
  { id: "l7", title: "Psychology 101 Notes Bundle", description: "Full semester notes, color-coded. Scored A+ with these.", price: 15, category: "Books", status: "active", images: ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400"], sellerId: "u1", sellerName: "Alex Rivera", createdAt: "2024-11-14", stock: 10, stockSold: 54 },
  { id: "l8", title: "Portable Monitor 15.6 inch", description: "USB-C powered, 1080p. Perfect for dual-screen setup on the go.", price: 150, category: "Electronics", status: "active", images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400"], sellerId: "u2", sellerName: "Jordan Lee", createdAt: "2024-11-15", stock: 6, stockSold: 88 },
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
  newUsersThisWeek: 14,
  activeListings: 89,
  totalOrders: 342,
  totalSalesAmount: 184500,
  openDisputes: 5,
  totalListings: 342,
  pendingModeration: 6,
  reportsThisMonth: 14,
};

export const MOCK_ADMIN_USERS: AdminUser[] = [
  { id: "u1", name: "Alex Rivera", email: "alex@campus.edu", role: "user", verified: true, listingsCount: 3, joinedAt: "2024-09-01", status: "active" },
  { id: "u2", name: "Jordan Lee", email: "jordan@campus.edu", role: "user", verified: true, listingsCount: 2, joinedAt: "2024-09-15", status: "active" },
  { id: "u3", name: "Sam Chen", email: "sam@campus.edu", role: "user", verified: false, listingsCount: 2, joinedAt: "2024-10-02", status: "suspended" },
  { id: "u4", name: "Maria Santos", email: "maria@campus.edu", role: "user", verified: true, listingsCount: 5, joinedAt: "2024-10-10", status: "active" },
  { id: "u5", name: "Carlo Reyes", email: "carlo@campus.edu", role: "user", verified: false, listingsCount: 0, joinedAt: "2024-11-01", status: "active" },
  { id: "u6", name: "Ana Dela Cruz", email: "ana@campus.edu", role: "user", verified: true, listingsCount: 7, joinedAt: "2024-08-20", status: "active" },
  { id: "admin1", name: "Shopora Admin", email: "shopora.admin@gmail.com", role: "admin", verified: true, listingsCount: 0, joinedAt: "2024-08-01", status: "active" },
];

export const MOCK_ADMIN_LISTINGS: AdminListing[] = [
  { id: "l1", title: "MacBook Pro 2022", description: "Excellent condition, barely used.", price: 1200, category: "Electronics", status: "active", images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"], sellerId: "u1", sellerName: "Alex Rivera", createdAt: "2024-11-01", stock: 3 },
  { id: "l2", title: "Calculus Textbook 8th Ed", description: "Stewart Calculus, minimal highlighting.", price: 45, category: "Books", status: "active", images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400"], sellerId: "u1", sellerName: "Alex Rivera", createdAt: "2024-11-05", stock: 5 },
  { id: "l3", title: "Ergonomic Desk Chair", description: "Mesh back, adjustable height.", price: 180, category: "Furniture", status: "active", images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"], sellerId: "u2", sellerName: "Jordan Lee", createdAt: "2024-11-08", stock: 2 },
  { id: "l4", title: "Arduino Starter Kit", description: "Complete kit, never opened.", price: 35, category: "Electronics", status: "pending", images: ["https://images.unsplash.com/photo-1553406830-ef2513450d76?w=400"], sellerId: "u3", sellerName: "Sam Chen", createdAt: "2024-11-12", stock: 4 },
  { id: "l5", title: "Winter Jacket XL", description: "North Face puffer, navy blue.", price: 90, category: "Clothing", status: "sold", images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400"], sellerId: "u3", sellerName: "Sam Chen", createdAt: "2024-10-20", stock: 0 },
  { id: "l6", title: "Suspicious Item", description: "Unclear description.", price: 999, category: "Other", status: "pending", images: [], sellerId: "u5", sellerName: "Carlo Reyes", createdAt: "2024-11-13", stock: 1 },
  { id: "l7", title: "Psychology 101 Notes", description: "Full semester notes, color-coded.", price: 15, category: "Books", status: "active", images: ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400"], sellerId: "u1", sellerName: "Alex Rivera", createdAt: "2024-11-14", stock: 10 },
  { id: "l8", title: "Portable Monitor 15.6 inch", description: "USB-C powered, 1080p.", price: 150, category: "Electronics", status: "removed", images: ["https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400"], sellerId: "u2", sellerName: "Jordan Lee", createdAt: "2024-11-15", stock: 0, rejectionReason: "Duplicate listing" },
];

export const MOCK_ADMIN_ORDERS: AdminOrder[] = [
  {
    id: "ord-001", listingTitle: "Calculus Textbook 8th Ed", listingImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    listingPrice: 45, shippingFee: 80, total: 125, sellerId: "u1", sellerName: "Alex Rivera", buyerId: "u2", buyerName: "Jordan Lee",
    shippingAddress: { fullName: "Jordan Lee", mobile: "09171234567", street: "123 Katipunan Ave", barangay: "Loyola Heights", city: "Quezon City", province: "Metro Manila", postalCode: "1108" },
    paymentMethod: "gcash", paymentStatus: "held_in_escrow",
    gcashPayment: { number: "09171234567", accountName: "Jordan Lee", amount: 125, referenceNo: "GC-20261023-4821" },
    status: "shipped", timeline: [{ status: "placed", timestamp: "2024-11-01T08:00:00Z" }, { status: "shipped", timestamp: "2024-11-02T10:00:00Z", note: "J&T Express" }],
    courierName: "J&T Express", trackingNumber: "JT0012345678", createdAt: "2024-11-01T08:00:00Z",
  },
  {
    id: "ord-002", listingTitle: "Nike Running Shoes", listingImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    listingPrice: 60, shippingFee: 80, total: 140, sellerId: "u2", sellerName: "Jordan Lee", buyerId: "u4", buyerName: "Maria Santos",
    shippingAddress: { fullName: "Maria Santos", mobile: "09181234567", street: "456 Ayala Ave", barangay: "Bel-Air", city: "Makati", province: "Metro Manila", postalCode: "1226" },
    paymentMethod: "cod", paymentStatus: "to_be_paid", status: "placed",
    timeline: [{ status: "placed", timestamp: "2024-11-03T09:00:00Z" }], createdAt: "2024-11-03T09:00:00Z",
  },
  {
    id: "ord-003", listingTitle: "Psychology 101 Notes", listingImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    listingPrice: 15, shippingFee: 60, total: 75, sellerId: "u1", sellerName: "Alex Rivera", buyerId: "u2", buyerName: "Jordan Lee",
    shippingAddress: { fullName: "Jordan Lee", mobile: "09171234567", street: "789 España Blvd", barangay: "Sampaloc", city: "Manila", province: "Metro Manila", postalCode: "1008" },
    paymentMethod: "gcash", paymentStatus: "released",
    gcashPayment: { number: "09171234567", accountName: "Jordan Lee", amount: 75, referenceNo: "GC-20261010-1193" },
    status: "completed", timeline: [{ status: "placed", timestamp: "2024-11-05T07:00:00Z" }, { status: "completed", timestamp: "2024-11-08T16:00:00Z" }],
    createdAt: "2024-11-05T07:00:00Z",
  },
];

export const MOCK_DISPUTES: AdminDispute[] = [
  {
    id: "d1", orderId: "ord-001", listingTitle: "Calculus Textbook 8th Ed", listingImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    buyerId: "u2", buyerName: "Jordan Lee", sellerId: "u1", sellerName: "Alex Rivera",
    reason: "item_not_as_described", description: "The book has heavy highlighting on every page, not minimal as described.",
    paymentMethod: "gcash", total: 125, status: "open", submittedAt: "2024-11-10T10:00:00Z",
    messages: [
      { senderId: "u2", senderName: "Jordan Lee", content: "The book is in terrible condition, nothing like the photos.", sentAt: "2024-11-10T10:05:00Z" },
      { senderId: "u1", senderName: "Alex Rivera", content: "I described it accurately. The highlighting is minimal.", sentAt: "2024-11-10T11:00:00Z" },
    ],
  },
  {
    id: "d2", orderId: "ord-002", listingTitle: "Nike Running Shoes", listingImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    buyerId: "u4", buyerName: "Maria Santos", sellerId: "u2", sellerName: "Jordan Lee",
    reason: "item_not_received", description: "It has been 2 weeks and I still haven't received my order.",
    paymentMethod: "cod", total: 140, status: "open", submittedAt: "2024-11-12T14:00:00Z",
    messages: [
      { senderId: "u4", senderName: "Maria Santos", content: "Where is my order? It's been 2 weeks!", sentAt: "2024-11-12T14:05:00Z" },
    ],
  },
  {
    id: "d3", orderId: "ord-003", listingTitle: "Psychology 101 Notes", listingImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    buyerId: "u2", buyerName: "Jordan Lee", sellerId: "u1", sellerName: "Alex Rivera",
    reason: "item_damaged", description: "Notes arrived water damaged.",
    paymentMethod: "gcash", total: 75, status: "resolved", submittedAt: "2024-11-06T09:00:00Z",
    resolvedAt: "2024-11-07T15:00:00Z", resolvedBy: "Shopora Admin", outcome: "refunded", adminNote: "Seller confirmed damage. Full refund issued.",
    messages: [{ senderId: "u2", senderName: "Jordan Lee", content: "Notes are completely water damaged.", sentAt: "2024-11-06T09:05:00Z" }],
  },
];

export const MOCK_PAYMENTS: AdminPayment[] = [
  { id: "p1", orderId: "ord-001", listingTitle: "Calculus Textbook 8th Ed", buyerName: "Jordan Lee", sellerName: "Alex Rivera", paymentMethod: "gcash", amount: 125, status: "held_in_escrow", referenceNo: "GC-20261023-4821", gcashNumber: "09171234567", gcashAccountName: "Jordan Lee", createdAt: "2024-11-01T08:00:00Z" },
  { id: "p2", orderId: "ord-002", listingTitle: "Nike Running Shoes", buyerName: "Maria Santos", sellerName: "Jordan Lee", paymentMethod: "cod", amount: 140, status: "to_be_paid", createdAt: "2024-11-03T09:00:00Z" },
  { id: "p3", orderId: "ord-003", listingTitle: "Psychology 101 Notes", buyerName: "Jordan Lee", sellerName: "Alex Rivera", paymentMethod: "gcash", amount: 75, status: "released", referenceNo: "GC-20261010-1193", gcashNumber: "09171234567", gcashAccountName: "Jordan Lee", createdAt: "2024-11-05T07:00:00Z" },
  { id: "p4", orderId: "ord-004", listingTitle: "MacBook Pro 2022", buyerName: "Ana Dela Cruz", sellerName: "Alex Rivera", paymentMethod: "gcash", amount: 1280, status: "refunded", referenceNo: "GC-20261015-9921", gcashNumber: "09191234567", gcashAccountName: "Ana Dela Cruz", createdAt: "2024-11-08T10:00:00Z" },
  { id: "p5", orderId: "ord-005", listingTitle: "Ergonomic Desk Chair", buyerName: "Carlo Reyes", sellerName: "Jordan Lee", paymentMethod: "cod", amount: 260, status: "collected", createdAt: "2024-11-09T11:00:00Z" },
];

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  { id: "al1", userId: "admin1", userName: "Shopora Admin", actionType: "listing_approved", description: "Approved listing \"MacBook Pro 2022\"", createdAt: "2024-11-01T10:05:00Z" },
  { id: "al2", userId: "u1", userName: "Alex Rivera", actionType: "listing_created", description: "Created listing \"Calculus Textbook 8th Ed\"", createdAt: "2024-11-05T11:30:00Z" },
  { id: "al3", userId: "u2", userName: "Jordan Lee", actionType: "order_placed", description: "Placed order #ord-001", createdAt: "2024-11-01T08:00:00Z" },
  { id: "al4", userId: "admin1", userName: "Shopora Admin", actionType: "user_suspended", description: "Suspended user Sam Chen", createdAt: "2024-11-02T09:00:00Z" },
  { id: "al5", userId: "u1", userName: "Alex Rivera", actionType: "login", description: "User logged in", createdAt: "2024-11-15T08:00:00Z" },
  { id: "al6", userId: "u4", userName: "Maria Santos", actionType: "dispute_opened", description: "Opened dispute for order #ord-002", createdAt: "2024-11-12T14:00:00Z" },
  { id: "al7", userId: "admin1", userName: "Shopora Admin", actionType: "dispute_resolved", description: "Resolved dispute #d3 — refunded buyer", createdAt: "2024-11-07T15:00:00Z" },
  { id: "al8", userId: "u3", userName: "Sam Chen", actionType: "listing_created", description: "Created listing \"Arduino Starter Kit\"", createdAt: "2024-11-12T10:00:00Z" },
];

export const MOCK_ADMIN_CATEGORIES: AdminCategory[] = [
  { id: "cat1", name: "Electronics", listingsCount: 42, createdAt: "2024-08-01" },
  { id: "cat2", name: "Books", listingsCount: 38, createdAt: "2024-08-01" },
  { id: "cat3", name: "Clothing", listingsCount: 25, createdAt: "2024-08-01" },
  { id: "cat4", name: "Furniture", listingsCount: 18, createdAt: "2024-08-01" },
  { id: "cat5", name: "Sports", listingsCount: 15, createdAt: "2024-08-01" },
  { id: "cat6", name: "Other", listingsCount: 9, createdAt: "2024-08-01" },
];

export const MOCK_SALES_DATA: SalesDataPoint[] = [
  { month: "Jun", amount: 12400 }, { month: "Jul", amount: 18900 }, { month: "Aug", amount: 15200 },
  { month: "Sep", amount: 22100 }, { month: "Oct", amount: 19800 }, { month: "Nov", amount: 28400 },
];

export const MOCK_ORDER_STATUS_DATA: OrderStatusDataPoint[] = [
  { status: "Placed", count: 45 }, { status: "Processing", count: 32 }, { status: "Shipped", count: 28 },
  { status: "Delivered", count: 18 }, { status: "Completed", count: 180 }, { status: "Cancelled", count: 22 }, { status: "Disputed", count: 5 },
];

export const MOCK_CATEGORY_DATA: CategoryDataPoint[] = [
  { category: "Electronics", count: 42 }, { category: "Books", count: 38 }, { category: "Clothing", count: 25 },
  { category: "Furniture", count: 18 }, { category: "Sports", count: 15 }, { category: "Other", count: 9 },
];

export const CATEGORIES = ["Electronics", "Books", "Clothing", "Furniture", "Sports", "Other"] as const;

export const MOCK_ORDERS: Order[] = [
  {
    id: "ord-001",
    listingId: "l2",
    listingTitle: "Calculus Textbook 8th Ed",
    listingImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
    listingPrice: 45,
    shippingFee: 80,
    total: 125,
    sellerId: "u1",
    sellerName: "Alex Rivera",
    sellerCity: "Quezon City",
    buyerId: "u2",
    buyerName: "Jordan Lee",
    shippingAddress: { fullName: "Jordan Lee", mobile: "09171234567", street: "123 Katipunan Ave", barangay: "Loyola Heights", city: "Quezon City", province: "Metro Manila", postalCode: "1108" },
    paymentMethod: "gcash",
    paymentStatus: "held_in_escrow",
    gcashPayment: { number: "09171234567", accountName: "Jordan Lee", amount: 125, referenceNo: "GC-20261023-4821" },
    status: "shipped",
    timeline: [
      { status: "placed", timestamp: "2026-10-23T08:00:00Z" },
      { status: "shipped", timestamp: "2026-10-24T10:30:00Z", note: "Handed to J&T Express" },
    ],
    courierName: "J&T Express",
    trackingNumber: "JT0012345678",
    createdAt: "2026-10-23T08:00:00Z",
  },
  {
    id: "ord-002",
    listingId: "l4",
    listingTitle: "Nike Running Shoes Size 10",
    listingImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    listingPrice: 60,
    shippingFee: 80,
    total: 140,
    sellerId: "u2",
    sellerName: "Jordan Lee",
    sellerCity: "Makati",
    buyerId: "u2",
    buyerName: "Jordan Lee",
    shippingAddress: { fullName: "Jordan Lee", mobile: "09171234567", street: "456 Ayala Ave", barangay: "Bel-Air", city: "Makati", province: "Metro Manila", postalCode: "1226" },
    paymentMethod: "cod",
    paymentStatus: "to_be_paid",
    status: "placed",
    timeline: [
      { status: "placed", timestamp: "2026-10-25T09:00:00Z" },
    ],
    createdAt: "2026-10-25T09:00:00Z",
  },
  {
    id: "ord-003",
    listingId: "l7",
    listingTitle: "Psychology 101 Notes Bundle",
    listingImage: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400",
    listingPrice: 15,
    shippingFee: 60,
    total: 75,
    sellerId: "u1",
    sellerName: "Alex Rivera",
    sellerCity: "Manila",
    buyerId: "u2",
    buyerName: "Jordan Lee",
    shippingAddress: { fullName: "Jordan Lee", mobile: "09171234567", street: "789 España Blvd", barangay: "Sampaloc", city: "Manila", province: "Metro Manila", postalCode: "1008" },
    paymentMethod: "gcash",
    paymentStatus: "released",
    gcashPayment: { number: "09171234567", accountName: "Jordan Lee", amount: 75, referenceNo: "GC-20261010-1193" },
    status: "completed",
    timeline: [
      { status: "placed", timestamp: "2026-10-10T07:00:00Z" },
      { status: "shipped", timestamp: "2026-10-11T09:00:00Z", note: "Handed to LBC" },
      { status: "delivered", timestamp: "2026-10-13T14:00:00Z" },
      { status: "completed", timestamp: "2026-10-13T16:00:00Z" },
    ],
    courierName: "LBC",
    trackingNumber: "LBC9988776655",
    createdAt: "2026-10-10T07:00:00Z",
  },
];
