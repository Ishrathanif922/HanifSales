import mongoose, { Schema, Document } from "mongoose";
import { ICart } from "../types";

const cartItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  variant: { type: String },
});

const cartSchema = new Schema<ICart & Document>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
    coupon: { type: Schema.Types.ObjectId, ref: "Coupon" },
  },
  { timestamps: true }
);

export default mongoose.model<ICart & Document>("Cart", cartSchema);
