export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: { url: string; public_id: string };
  role: "customer" | "seller" | "admin";
  isVerified: boolean;
  isActive: boolean;
  wishlist: string[];
  addresses: Address[];
  wallet: { balance: number; transactions: any[] };
  createdAt: string;
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: { url: string; public_id: string };
  parent?: string;
  isActive: boolean;
  level: number;
  subCategories?: Category[];
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  logo?: { url: string; public_id: string };
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  discount: number;
  sku?: string;
  stock: number;
  images: { url: string; public_id: string }[];
  category: Category | string;
  subCategory?: Category | string;
  brand?: Brand | string;
  seller: User | string;
  variants: ProductVariant[];
  specifications: { key: string; value: string }[];
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  avgRating: number;
  numReviews: number;
  numSold: number;
  createdAt: string;
}

export interface ProductVariant {
  _id?: string;
  name: string;
  options: { label: string; price?: number; stock: number; sku?: string }[];
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: "stripe" | "cod" | "wallet";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  stripeSessionId?: string;
  refundStatus?: string;
  refundAmount?: number;
  createdAt: string;
}

export interface OrderItem {
  _id?: string;
  product: Product | string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  variant?: string;
  price: number;
  itemTotal: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  coupon?: any;
}

export interface Review {
  _id: string;
  user: any;
  product: any;
  rating: number;
  title: string;
  comment: string;
  images: { url: string; public_id: string }[];
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulVotes: number;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: "order" | "offer" | "delivery" | "wishlist" | "system";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
