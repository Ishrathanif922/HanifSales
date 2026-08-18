"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart, ShoppingCart, Share2, Truck, Shield, RotateCcw,
  Minus, Plus, Star, ChevronRight, Check, Store, Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import StarRating from "@/components/product/StarRating";
import ProductCard from "@/components/product/ProductCard";
import { productAPI, cartAPI, authAPI, reviewAPI } from "@/services";
import { useApp } from "@/store/AppContext";
import { Product, Review } from "@/types";
import { formatPrice, getDiscountPercent, cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const { state, refreshCart, refreshUser } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await productAPI.getProductBySlug(params.slug as string);
        setProduct(data.data || null);
        if (data.data) {
          const [related, reviewsData] = await Promise.all([
            productAPI.getRelatedProducts(data.data._id),
            reviewAPI.getProductReviews(data.data._id),
          ]);
          setRelatedProducts(related.data.data || []);
          setReviews(reviewsData.data.data || []);
        }
      } catch {
        toast.error("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  const handleAddToCart = async () => {
    if (!state.user) { toast.error("Please login first"); return; }
    if (!product) return;
    try {
      await cartAPI.addToCart(product._id, quantity);
      await refreshCart();
      toast.success("Added to cart!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const handleToggleWishlist = async () => {
    if (!state.user || !product) { toast.error("Please login first"); return; }
    try {
      await authAPI.toggleWishlist(product._id);
      await refreshUser();
      toast.success("Wishlist updated!");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3 rounded-lg" />
            <Skeleton className="h-10 w-3/4 rounded-lg" />
            <Skeleton className="h-5 w-1/2 rounded-lg" />
            <Skeleton className="h-12 w-1/3 rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-flex p-4 rounded-3xl bg-gray-100 dark:bg-dark-card mb-6">
          <Package className="h-12 w-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-gray-500 mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/products"><Button className="rounded-xl">Browse Products</Button></Link>
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.comparePrice);
  const isInWishlist = state.user?.wishlist?.includes(product._id);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary-600 transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/products" className="hover:text-primary-600 transition-colors">Products</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-100 truncate font-medium">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <div className="relative aspect-square rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-card dark:to-dark-bg border border-gray-100 dark:border-dark-border overflow-hidden mb-4 shadow-lg">
            {product.images && product.images.length > 0 && product.images[selectedImage]?.url ? (
              <img src={product.images[selectedImage].url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-100 dark:from-primary-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 flex items-center justify-center">
                <span className="text-[120px] font-bold text-primary-200 dark:text-primary-800">
                  {product.name.charAt(0)}
                </span>
              </div>
            )}
            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-lg shadow-red-500/25 px-3 py-1">
                  {discount}% OFF
                </Badge>
              )}
              {product.isNewArrival && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg px-3 py-1">NEW</Badge>
              )}
            </div>
            {discount > 0 && (
              <div className="absolute top-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
                  <span className="text-sm font-bold text-green-600">Save {formatPrice(product.comparePrice! - product.price)}</span>
                </div>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-20 h-20 rounded-xl border-2 overflow-hidden shrink-0 transition-all",
                    selectedImage === i ? "border-primary-500 shadow-md shadow-primary-500/20" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  {img.url ? (
                    <img src={img.url} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs font-medium">{i + 1}</div>
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Badge variant="secondary" className="mb-3">{typeof product.category === "object" ? product.category?.name : ""}</Badge>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.avgRating} showValue reviewCount={product.numReviews} />
            <span className="text-sm text-gray-500">{product.numSold} sold</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border">
            <span className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-lg text-gray-400 line-through">{formatPrice(product.comparePrice)}</span>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">-{discount}%</Badge>
              </>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{product.shortDescription || product.description}</p>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-green-600 font-medium">In Stock ({product.stock} available)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium">Quantity:</span>
            <div className="flex items-center bg-gray-100 dark:bg-dark-bg rounded-xl">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2.5 hover:bg-white dark:hover:bg-dark-card rounded-xl transition-colors">
                <Minus className="h-4 w-4" />
              </button>
              <span className="px-4 py-2 font-bold min-w-[3rem] text-center tabular-nums">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="p-2.5 hover:bg-white dark:hover:bg-dark-card rounded-xl transition-colors">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mb-6">
            <Button size="lg" className="flex-1 h-12 rounded-xl font-semibold" onClick={handleAddToCart} disabled={product.stock === 0}>
              <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" onClick={handleToggleWishlist} className="h-12 w-12 rounded-xl p-0">
              <Heart className={cn("h-5 w-5", isInWishlist && "fill-red-500 text-red-500")} />
            </Button>
            <Button size="lg" variant="outline" className="h-12 w-12 rounded-xl p-0" onClick={async () => {
              if (navigator.share) {
                try {
                  await navigator.share({ title: product.name, text: `Check out ${product.name} on Hanif Sales!`, url: window.location.href });
                } catch {}
              } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }
            }}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Truck, text: "Free Delivery", sub: "On Rs. 5000+" },
              { icon: Shield, text: "Secure Payment", sub: "100% Protected" },
              { icon: RotateCcw, text: "7-Day Returns", sub: "Easy Refund" },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-100 dark:border-dark-border text-center">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                  <f.icon className="h-4 w-4 text-primary-600" />
                </div>
                <span className="text-xs font-semibold">{f.text}</span>
                <span className="text-[10px] text-gray-400">{f.sub}</span>
              </div>
            ))}
          </div>

          {/* Seller */}
          {product.seller && typeof product.seller === "object" && (
            <div className="p-4 rounded-xl border border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <Store className="h-4 w-4 text-primary-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sold by</p>
                  <p className="font-semibold text-sm">{(product.seller as any).name}</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-1 border-b border-gray-200 dark:border-dark-border mb-6">
          {(["description", "specs", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-3 text-sm font-medium border-b-2 transition-all capitalize",
                activeTab === tab ? "border-primary-600 text-primary-600" : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              {tab === "reviews" ? `Reviews (${reviews.length})` : tab === "specs" ? "Specifications" : "Description"}
            </button>
          ))}
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === "description" && (
            <div className="prose max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>{product.description}</p>
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {product.tags.map((tag) => <Badge key={tag} variant="secondary" className="rounded-full">{tag}</Badge>)}
                </div>
              )}
            </div>
          )}

          {activeTab === "specs" && (
            <div className="grid md:grid-cols-2 gap-4">
              {product.specifications.length > 0 ? product.specifications.map((spec, i) => (
                <div key={i} className="flex justify-between py-3 px-4 rounded-xl bg-gray-50 dark:bg-dark-card border border-gray-100 dark:border-dark-border">
                  <span className="text-gray-500 text-sm">{spec.key}</span>
                  <span className="font-medium text-sm">{spec.value}</span>
                </div>
              )) : <p className="text-gray-500 py-4">No specifications available.</p>}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Star className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              ) : reviews.map((review) => (
                <div key={review._id} className="p-5 rounded-2xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600">{review.user.name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{review.user.name}</p>
                        {review.isVerifiedPurchase && <Badge className="bg-green-100 text-green-700 text-[10px]">Verified</Badge>}
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                  </div>
                  <h4 className="font-medium text-sm mb-1">{review.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  );
}
