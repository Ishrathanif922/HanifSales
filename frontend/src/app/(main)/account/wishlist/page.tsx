"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";
import { authAPI, cartAPI } from "@/services";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function WishlistPage() {
  const { state, refreshUser, refreshCart } = useApp();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await authAPI.getMe();
        const user = data.data;
        if (user?.wishlist) {
          setWishlistProducts(user.wishlist as any);
        }
      } catch {} finally { setLoading(false); }
    };
    fetchWishlist();
  }, []);

  const handleAddToCart = async (productId: string) => {
    try {
      await cartAPI.addToCart(productId, 1);
      await refreshCart();
      toast.success("Added to cart!");
    } catch { toast.error("Failed to add to cart"); }
  };

  const handleRemove = async (productId: string) => {
    try {
      await authAPI.toggleWishlist(productId);
      await refreshUser();
      setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));
      toast.success("Removed from wishlist");
    } catch { toast.error("Failed"); }
  };

  if (!state.user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <Link href="/auth/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/account" className="hover:text-primary-600">Account</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-100">Wishlist</span>
      </nav>

      <h1 className="text-2xl font-bold mb-6">My Wishlist ({wishlistProducts.length})</h1>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Wishlist is Empty</h3>
          <p className="text-gray-500 mb-6">Save items you love for later</p>
          <Link href="/products"><Button>Discover Products</Button></Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistProducts.map((product) => (
            <div key={product._id} className="flex gap-4 p-4 rounded-xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border">
              <div className="w-20 h-20 rounded-lg bg-gray-50 dark:bg-dark-bg shrink-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-300">{product.name.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <Link href={`/products/${product.slug}`} className="font-semibold text-sm hover:text-primary-600 line-clamp-1">{product.name}</Link>
                <p className="text-primary-600 font-bold mt-1">{formatPrice(product.price)}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => handleAddToCart(product._id)}>
                    <ShoppingCart className="h-3 w-3 mr-1" /> Add to Cart
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleRemove(product._id)}>
                    <Trash2 className="h-3 w-3 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
