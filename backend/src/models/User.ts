import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types";

const addressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: "Pakistan" },
  isDefault: { type: Boolean, default: false },
});

const walletTransactionSchema = new Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new Schema<IUser & Document>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    phone: { type: String, trim: true },
    avatar: {
      url: { type: String, default: "/avatars/default.png" },
      public_id: { type: String },
    },
    role: { type: String, enum: ["customer", "seller", "admin"], default: "customer" },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    googleId: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    addresses: [addressSchema],
    wallet: {
      balance: { type: Number, default: 0 },
      transactions: [walletTransactionSchema],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser & Document>("User", userSchema);
