import mongoose, { Schema, Document } from "mongoose";
import { IBrand } from "../types";

const brandSchema = new Schema<IBrand & Document>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    logo: {
      url: { type: String },
      public_id: { type: String },
    },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

brandSchema.index({ isActive: 1 });

export default mongoose.model<IBrand & Document>("Brand", brandSchema);
