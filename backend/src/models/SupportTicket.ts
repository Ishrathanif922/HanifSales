import mongoose, { Schema, Document } from "mongoose";
import { ISupportTicket } from "../types";

const replySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const supportTicketSchema = new Schema<ISupportTicket & Document>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    replies: [replySchema],
  },
  { timestamps: true }
);

supportTicketSchema.index({ user: 1 });
supportTicketSchema.index({ status: 1 });

export default mongoose.model<ISupportTicket & Document>("SupportTicket", supportTicketSchema);
