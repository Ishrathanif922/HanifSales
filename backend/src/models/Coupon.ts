import mongoose, { Schema, Document } from "mongoose";
import { ICoupon } from "../types";

const couponSchema = new Schema<ICoupon & Document>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true },
    discountType: { type: String, enum: ["percentage", "fixed", "free_shipping"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    usageLimit: { type: Number, required: true, default: 1 },
    usedCount: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, required: true },
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);

couponSchema.index({ expiresAt: 1 });

export default mongoose.model<ICoupon & Document>("Coupon", couponSchema);
