import mongoose, { Schema, Document } from "mongoose";
import { IOrder } from "../types";

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  variant: { type: String },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const addressEmbeddedSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  isDefault: { type: Boolean },
});

const orderSchema = new Schema<IOrder & Document>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: { type: addressEmbeddedSchema, required: true },
    billingAddress: { type: addressEmbeddedSchema, required: true },
    paymentMethod: { type: String, enum: ["stripe", "cod", "wallet"], required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed", "refunded"], default: "pending" },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "packed", "shipped", "delivered", "cancelled", "returned"],
      default: "pending",
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
    trackingNumber: { type: String },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
    refundStatus: { type: String, enum: ["none", "requested", "approved", "rejected"], default: "none" },
    refundAmount: { type: Number },
    stripeSessionId: { type: String },
    paymentIntentId: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ "items.seller": 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model<IOrder & Document>("Order", orderSchema);
