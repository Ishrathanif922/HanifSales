import mongoose, { Schema, Document } from "mongoose";
import { IBlog } from "../types";

const blogSchema = new Schema<IBlog & Document>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true },
    image: { url: { type: String, required: true }, public_id: { type: String, required: true } },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [String],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

blogSchema.index({ isPublished: 1 });

export default mongoose.model<IBlog & Document>("Blog", blogSchema);
