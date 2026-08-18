import mongoose, { Schema, Document } from "mongoose";
import { ICategory } from "../types";

const categorySchema = new Schema<ICategory & Document>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    level: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });

export default mongoose.model<ICategory & Document>("Category", categorySchema);
