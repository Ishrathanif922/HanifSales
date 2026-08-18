import mongoose, { Schema, Document } from "mongoose";
import { IBanner } from "../types";

const bannerSchema = new Schema<IBanner & Document>(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    image: { url: { type: String, required: true }, public_id: { type: String, required: true } },
    link: { type: String },
    position: { type: String, enum: ["hero", "sidebar", "footer", "popup"], default: "hero" },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

bannerSchema.index({ position: 1, isActive: 1 });

export default mongoose.model<IBanner & Document>("Banner", bannerSchema);
