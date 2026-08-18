import mongoose, { Schema, Document } from "mongoose";
import { IProduct } from "../types";

const productVariantSchema = new Schema({
  name: { type: String, required: true },
  options: [
    {
      label: { type: String, required: true },
      price: { type: Number },
      stock: { type: Number, default: 0 },
      sku: { type: String },
    },
  ],
});

const productSchema = new Schema<IProduct & Document>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    comparePrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    costPrice: { type: Number, min: 0 },
    sku: { type: String },
    barcode: { type: String },
    stock: { type: Number, required: true, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    images: [{ url: String, public_id: String }],
    video: { url: String, public_id: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: "Category" },
    brand: { type: Schema.Types.ObjectId, ref: "Brand" },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    variants: [productVariantSchema],
    specifications: [{ key: String, value: String }],
    tags: [String],
    weight: { type: Number },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    numSold: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ price: 1 });
productSchema.index({ avgRating: -1 });
productSchema.index({ numSold: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.model<IProduct & Document>("Product", productSchema);
