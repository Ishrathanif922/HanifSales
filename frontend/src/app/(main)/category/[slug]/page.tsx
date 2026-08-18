"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/Skeletons";
import { productAPI } from "@/services";
import { Product } from "@/types";

export default function CategoryPage() {
  const params = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await productAPI.getProducts({ category: params.slug as string, limit: "50" });
        setProducts(data.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetchProducts();
  }, [params.slug]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2 capitalize">{params.slug?.toString().replace(/-/g, " ")}</h1>
      <p className="text-gray-500 mb-6">{products.length} products found</p>
      {loading ? <ProductGridSkeleton /> : products.length === 0 ? (
        <div className="text-center py-16"><p className="text-gray-500">No products in this category yet.</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product, i) => <ProductCard key={product._id} product={product} index={i} />)}
        </div>
      )}
    </div>
  );
}
