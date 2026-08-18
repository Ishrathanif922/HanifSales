"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Package } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/Skeletons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { productAPI, categoryAPI } from "@/services";
import { Product, Category } from "@/types";
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "best_sellers", label: "Best Sellers" },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    rating: searchParams.get("rating") || "",
    discount: searchParams.get("discount") || "",
    isNew: searchParams.get("isNew") || "",
    isFeatured: searchParams.get("isFeatured") || "",
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "20", sort };
      if (filters.category) params.category = filters.category;
      if (filters.brand) params.brand = filters.brand;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.rating) params.rating = filters.rating;
      if (filters.discount) params.discount = filters.discount;
      if (filters.isNew) params.isNew = "true";
      if (filters.isFeatured) params.isFeatured = "true";
      if (searchParams.get("search")) params.search = searchParams.get("search")!;

      const { data } = await productAPI.getProducts(params);
      setProducts(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, filters, searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    categoryAPI.getCategories().then(({ data }) => setCategories(data.data || []));
  }, []);

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {searchParams.get("search")
              ? `Results for "${searchParams.get("search")}"`
              : "All Products"}
          </h1>
          <p className="text-gray-500 mt-1">{products.length} products found</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2 h-10 rounded-xl">
            <SlidersHorizontal className="h-4 w-4" /> Filters
            {activeFilterCount > 0 && <Badge className="ml-1">{activeFilterCount}</Badge>}
          </Button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-4 pr-8 text-sm font-medium appearance-none cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilterCount > 0 && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-wrap gap-2 mb-4">
          {Object.entries(filters).map(([key, value]) => {
            if (!value) return null;
            return (
              <Badge key={key} variant="secondary" className="gap-1 rounded-full px-3 py-1">
                {key}: {value}
                <button onClick={() => setFilters((f) => ({ ...f, [key]: "" }))} className="ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
          <Button variant="ghost" size="sm" onClick={() => setFilters({ category: "", brand: "", minPrice: "", maxPrice: "", rating: "", discount: "", isNew: "", isFeatured: "" })} className="text-xs">
            Clear All
          </Button>
        </motion.div>
      )}

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-64 shrink-0 hidden md:block"
          >
            <div className="sticky top-24 space-y-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-5 shadow-sm">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h3>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Price Range</h4>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                    className="h-9 text-sm rounded-lg"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                    className="h-9 text-sm rounded-lg"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Rating</h4>
                {[4, 3, 2, 1].map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilters((f) => ({ ...f, rating: f.rating === String(r) ? "" : String(r) }))}
                    className={cn(
                      "flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-lg transition-colors",
                      filters.rating === String(r) ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600" : "hover:bg-gray-50 dark:hover:bg-dark-bg"
                    )}
                  >
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={cn("text-sm", i < r ? "text-yellow-400" : "text-gray-300")}>★</span>
                      ))}
                    </div>
                    <span>& up</span>
                  </button>
                ))}
              </div>

              {/* Discounts */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Discount</h4>
                {["10", "20", "30", "50"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilters((f) => ({ ...f, discount: f.discount === d ? "" : d }))}
                    className={cn(
                      "block w-full text-left px-2 py-1.5 text-sm rounded-lg transition-colors",
                      filters.discount === d ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600" : "hover:bg-gray-50 dark:hover:bg-dark-bg"
                    )}
                  >
                    {d}% or more
                  </button>
                ))}
              </div>

              {/* Quick Filters */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Quick Filters</h4>
                <label className="flex items-center gap-2 text-sm cursor-pointer py-1.5">
                  <input
                    type="checkbox"
                    checked={filters.isNew === "true"}
                    onChange={(e) => setFilters((f) => ({ ...f, isNew: e.target.checked ? "true" : "" }))}
                    className="rounded border-gray-300"
                  /> New Arrivals
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer py-1.5">
                  <input
                    type="checkbox"
                    checked={filters.isFeatured === "true"}
                    onChange={(e) => setFilters((f) => ({ ...f, isFeatured: e.target.checked ? "true" : "" }))}
                    className="rounded border-gray-300"
                  /> Featured
                </label>
              </div>
            </div>
          </motion.aside>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex p-4 rounded-3xl bg-gray-100 dark:bg-dark-card mb-4">
                <Package className="h-12 w-12 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-xl">
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                    <Button
                      key={i}
                      variant={page === i + 1 ? "default" : "outline"}
                      onClick={() => setPage(i + 1)}
                      className="rounded-xl min-w-[40px]"
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-xl">
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8"><ProductGridSkeleton /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
