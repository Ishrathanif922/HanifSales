import mongoose, { Schema, Document } from "mongoose";
import { IReview } from "../types";

const reviewSchema = new Schema<IReview & Document>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
    images: [{ url: String, public_id: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    helpfulVotes: { type: Number, default: 0 },
    reportedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });

export default mongoose.model<IReview & Document>("Review", reviewSchema);
