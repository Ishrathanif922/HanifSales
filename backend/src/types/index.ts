import { Request } from "express";
import mongoose from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: { url: string; public_id: string };
  role: "customer" | "seller" | "admin";
  isVerified: boolean;
  isActive: boolean;
  googleId?: string;
  wishlist: mongoose.Types.ObjectId[];
  addresses: IAddress[];
  wallet: { balance: number; transactions: IWalletTransaction[] };
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface IWalletTransaction {
  _id?: mongoose.Types.ObjectId;
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: Date;
}

export interface ICategory {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  image?: { url: string; public_id: string };
  parent?: mongoose.Types.ObjectId;
  description?: string;
  isActive: boolean;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBrand {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  logo?: { url: string; public_id: string };
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  discount: number;
  costPrice?: number;
  sku?: string;
  barcode?: string;
  stock: number;
  lowStockThreshold: number;
  images: { url: string; public_id: string }[];
  video?: { url: string; public_id: string };
  category: mongoose.Types.ObjectId;
  subCategory?: mongoose.Types.ObjectId;
  brand?: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  variants: IProductVariant[];
  specifications: { key: string; value: string }[];
  tags: string[];
  weight?: number;
  dimensions?: { length: number; width: number; height: number };
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isActive: boolean;
  avgRating: number;
  numReviews: number;
  numSold: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductVariant {
  _id?: mongoose.Types.ObjectId;
  name: string;
  options: { label: string; price?: number; stock: number; sku?: string }[];
}

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
  paymentMethod: "stripe" | "cod" | "wallet";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "pending" | "confirmed" | "processing" | "packed" | "shipped" | "delivered" | "cancelled" | "returned";
  subtotal: number;
  tax: number;
  shippingCost: number;
  discount: number;
  total: number;
  coupon?: mongoose.Types.ObjectId;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  refundStatus?: "none" | "requested" | "approved" | "rejected";
  refundAmount?: number;
  stripeSessionId?: string;
  paymentIntentId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
  seller: mongoose.Types.ObjectId;
}

export interface IReview {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
  images: { url: string; public_id: string }[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  reportedBy: mongoose.Types.ObjectId[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICoupon {
  _id: mongoose.Types.ObjectId;
  code: string;
  description: string;
  discountType: "percentage" | "fixed" | "free_shipping";
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  isActive: boolean;
  expiresAt: Date;
  applicableCategories: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ICart {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  coupon?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICartItem {
  _id?: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  quantity: number;
  variant?: string;
  toObject(): this;
}

export interface INotification {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: "order" | "offer" | "delivery" | "wishlist" | "system";
  isRead: boolean;
  link?: string;
  createdAt: Date;
}

export interface ISupportTicket {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  replies: { user: mongoose.Types.ObjectId; message: string; createdAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IBanner {
  _id: mongoose.Types.ObjectId;
  title: string;
  subtitle?: string;
  image: { url: string; public_id: string };
  link?: string;
  position: "hero" | "sidebar" | "footer" | "popup";
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image: { url: string; public_id: string };
  author: mongoose.Types.ObjectId;
  tags: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthRequest extends Request {
  user?: IUser;
  cookies: {
    accessToken?: string;
    refreshToken?: string;
    [key: string]: any;
  };
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
