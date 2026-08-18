"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye, X, Minus, Plus } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getDiscountPercent, cn } from "@/lib/utils";
import { useApp } from "@/store/AppContext";
import { cartAPI, authAPI } from "@/services";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { state, refreshCart, refreshUser } = useApp();
  const discount = getDiscountPercent(product.price, product.comparePrice);
  const isInWishlist = state.user?.wishlist?.includes(product._id);
  const [quickView, setQuickView] = useState(false);
  const [qvQuantity, setQvQuantity] = useState(1);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.user) { toast.error("Please login to add to cart"); return; }
    try {
      await cartAPI.addToCart(product._id, 1);
      await refreshCart();
      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleQuickAdd = async () => {
    if (!state.user) { toast.error("Please login to add to cart"); return; }
    try {
      await cartAPI.addToCart(product._id, qvQuantity);
      await refreshCart();
      toast.success("Added to cart!");
      setQuickView(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!state.user) { toast.error("Please login to add to wishlist"); return; }
    try {
      await authAPI.toggleWishlist(product._id);
      await refreshUser();
      toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist!");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        <Link href={`/products/${product.slug}`} className="group block">
          <div className="relative bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 hover:-translate-y-1.5">
            <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-zinc-900 dark:to-zinc-950 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                {product.images && product.images.length > 0 && product.images[0].url ? (
                  <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center">
                    <span className="text-5xl font-black text-zinc-400 dark:text-zinc-600">
                      {product.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                {discount > 0 && (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg shadow-red-500/25">
                    {discount}% OFF
                  </Badge>
                )}
                {product.isNewArrival && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg shadow-green-500/25">
                    NEW
                  </Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-lg shadow-orange-500/25">
                    HOT
                  </Badge>
                )}
              </div>

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />

              <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                <motion.button
                  onClick={handleToggleWishlist}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all duration-300 ${
                    isInWishlist
                      ? "bg-red-500 text-white shadow-red-500/30"
                      : "bg-white/90 dark:bg-dark-bg/90 text-gray-600 hover:bg-red-500 hover:text-white hover:shadow-red-500/30"
                  }`}
                >
                  <Heart className="h-4 w-4" fill={isInWishlist ? "currentColor" : "none"} />
                </motion.button>
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-full bg-white/90 dark:bg-dark-bg/90 text-gray-600 hover:bg-primary-500 hover:text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-primary-500/30 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                >
                  <ShoppingCart className="h-4 w-4" />
                </motion.button>
              </div>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ scale: 1.05 }}
                  className="opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300"
                >
                  <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickView(true); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm shadow-lg text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-500 hover:text-white transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" /> Quick View
                  </button>
                </motion.div>
              </div>
            </div>

            <div className="p-4">
              <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-1 uppercase tracking-wider">
                {typeof product.category === "object" ? product.category?.name : ""}
              </p>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors text-sm leading-snug">
                {product.name}
              </h3>

              <div className="flex items-center gap-1 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(product.avgRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : i < product.avgRating
                          ? "text-yellow-400 fill-yellow-200"
                          : "text-gray-200 dark:text-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-medium">({product.numReviews})</span>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>

              {product.stock > 0 && product.stock < 10 && (
                <div className="mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full" style={{ width: `${(product.stock / 10) * 100}%` }} />
                    </div>
                    <span className="text-[11px] text-orange-500 font-medium">Only {product.stock} left!</span>
                  </div>
                </div>
              )}
              {product.stock === 0 && (
                <p className="text-xs text-red-500 mt-2 font-medium">Out of stock</p>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-dark-border flex items-center justify-between">
                <span className={`text-xs font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </span>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  size="sm"
                  className="h-9 px-3 rounded-xl gap-1.5 text-xs font-semibold bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20"
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      <AnimatePresence>
        {quickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setQuickView(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="aspect-video bg-gray-100 dark:bg-dark-bg">
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 flex items-center justify-center">
                      <span className="text-6xl font-bold text-primary-200">{product.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <button onClick={() => setQuickView(false)} className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-dark-bg/90 shadow-lg hover:bg-white transition-colors">
                  <X className="h-4 w-4" />
                </button>
                {discount > 0 && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">{discount}% OFF</Badge>
                )}
              </div>

              <div className="p-5">
                <p className="text-xs text-primary-600 font-semibold uppercase tracking-wider mb-1">
                  {typeof product.category === "object" ? product.category?.name : ""}
                </p>
                <h3 className="font-bold text-lg mb-2">{product.name}</h3>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("h-3.5 w-3.5", i < Math.floor(product.avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} />
                  ))}
                  <span className="text-xs text-gray-400 ml-1">({product.numReviews} reviews)</span>
                </div>

                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{product.shortDescription || product.description}</p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {product.stock > 0 ? (
                    <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500" /> In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="text-sm text-red-500 font-medium">Out of Stock</span>
                  )}
                </div>

                {product.stock > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center bg-gray-100 dark:bg-dark-bg rounded-lg">
                      <button onClick={() => setQvQuantity((q) => Math.max(1, q - 1))} className="p-2 hover:bg-white dark:hover:bg-dark-card rounded-lg transition-colors">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 py-1.5 font-bold text-sm min-w-[2.5rem] text-center">{qvQuantity}</span>
                      <button onClick={() => setQvQuantity((q) => Math.min(product.stock, q + 1))} className="p-2 hover:bg-white dark:hover:bg-dark-card rounded-lg transition-colors">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <Button onClick={handleQuickAdd} className="flex-1 gap-2">
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </Button>
                  </div>
                )}

                <Link href={`/products/${product.slug}`} className="block">
                  <Button variant="outline" className="w-full">View Full Details</Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
