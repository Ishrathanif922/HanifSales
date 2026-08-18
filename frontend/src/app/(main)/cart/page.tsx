"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Shield, Truck, RefreshCw, ArrowLeft, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/store/AppContext";
import { cartAPI } from "@/services";
import { formatPrice, cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const { state, refreshCart } = useApp();
  const [couponCode, setCouponCode] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    setUpdating(itemId);
    try {
      await cartAPI.updateCartItem(itemId, quantity);
      await refreshCart();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      await cartAPI.removeFromCart(itemId);
      await refreshCart();
      toast.success("Removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      await cartAPI.applyCoupon(couponCode);
      await refreshCart();
      toast.success("Coupon applied!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid coupon");
    }
  };

  const subtotal = state.cart?.total || 0;
  const shipping = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + shipping;
  const savings = state.cart?.items?.reduce((acc, item) => {
    if (item.product?.comparePrice && item.product.comparePrice > item.price) {
      return acc + (item.product.comparePrice - item.price) * item.quantity;
    }
    return acc;
  }, 0) || 0;

  if (!state.user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-flex p-4 rounded-3xl bg-gray-100 dark:bg-dark-card mb-6">
          <ShoppingBag className="h-12 w-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <p className="text-gray-500 mb-6">Login to view your cart and checkout</p>
        <Link href="/auth/login">
          <Button size="lg" className="rounded-xl px-8">Sign In <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </Link>
      </div>
    );
  }

  if (state.cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-flex p-4 rounded-3xl bg-gray-100 dark:bg-dark-card mb-6">
          <ShoppingBag className="h-12 w-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet</p>
        <Link href="/products">
          <Button size="lg" className="rounded-xl px-8">Continue Shopping <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
          <p className="text-gray-500 mt-1">{state.cart.items.length} {state.cart.items.length === 1 ? "item" : "items"} in your cart</p>
        </div>
        <Link href="/products" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {state.cart.items.map((item, idx) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: idx * 0.05 }}
                className="flex gap-4 p-5 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image */}
                <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 overflow-hidden shrink-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-300 dark:text-primary-700">{item.product?.name?.charAt(0) || "?"}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${item.product?.slug}`} className="font-semibold text-sm hover:text-primary-600 line-clamp-1 transition-colors">
                      {item.product?.name || "Product"}
                    </Link>
                    <button onClick={() => handleRemove(item._id!)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-primary-600 font-bold mt-1">{formatPrice(item.price)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-gray-100 dark:bg-dark-bg rounded-xl">
                      <button
                        onClick={() => handleUpdateQuantity(item._id!, item.quantity - 1)}
                        disabled={item.quantity <= 1 || updating === item._id}
                        className="p-2 hover:bg-white dark:hover:bg-dark-card rounded-xl disabled:opacity-50 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-semibold min-w-[2.5rem] text-center tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id!, item.quantity + 1)}
                        disabled={updating === item._id}
                        className="p-2 hover:bg-white dark:hover:bg-dark-card rounded-xl disabled:opacity-50 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="font-bold text-lg">{formatPrice(item.itemTotal)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div>
          <div className="sticky top-24 space-y-4">
            <div className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-6 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>

              {/* Coupon */}
              <div className="flex gap-2 mb-5">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="text-sm h-11 rounded-xl"
                />
                <Button variant="outline" size="sm" onClick={handleApplyCoupon} className="h-11 px-4 rounded-xl shrink-0">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>You Save</span>
                    <span className="font-medium">-{formatPrice(savings)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={cn("font-medium", shipping === 0 && "text-green-600")}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="border-t border-gray-100 dark:border-dark-border pt-3 flex justify-between">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-bold text-xl gradient-text">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full h-12 rounded-xl font-semibold mt-5" size="lg">
                  Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Shield, label: "Secure", color: "text-blue-500" },
                { icon: Truck, label: "Fast Delivery", color: "text-green-500" },
                { icon: RefreshCw, label: "Easy Returns", color: "text-orange-500" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border text-center">
                  <item.icon className={cn("h-4 w-4", item.color)} />
                  <span className="text-[10px] font-medium text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
