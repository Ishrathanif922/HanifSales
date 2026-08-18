"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/Skeletons";
import { productAPI } from "@/services";
import { Product } from "@/types";

const trendingSearches = ["iPhone", "Nike", "Headphones", "Laptop", "Sneakers", "Smart Watch", "Camera"];

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await productAPI.searchProducts(q);
      setProducts(data.data || []);
    } catch { setProducts([]); } finally { setLoading(false); }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Products</h1>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products, brands, categories..."
            className="pl-12 h-14 text-lg rounded-2xl"
          />
        </form>
        {!searched && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-3 flex items-center justify-center gap-1">
              <TrendingUp className="h-4 w-4" /> Trending Searches
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => { setSearchQuery(term); performSearch(term); }}
                  className="px-4 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-dark-card hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : searched && products.length === 0 ? (
        <div className="text-center py-16">
          <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No results found</h3>
          <p className="text-gray-500">Try different keywords or browse our categories</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product._id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8"><ProductGridSkeleton /></div>}><SearchContent /></Suspense>;
}
