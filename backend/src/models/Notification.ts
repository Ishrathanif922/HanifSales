import mongoose, { Schema, Document } from "mongoose";
import { INotification } from "../types";

const notificationSchema = new Schema<INotification & Document>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ["order", "offer", "delivery", "wishlist", "system"], default: "system" },
    isRead: { type: Boolean, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

export default mongoose.model<INotification & Document>("Notification", notificationSchema);
