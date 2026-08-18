"use client";

import React, { useEffect, useState } from "react";
import { Search, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminAPI } from "@/services";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    adminAPI.getAllProducts({ page: String(page), limit: "20", ...(search && { search }) })
      .then(({ data }) => {
        setProducts(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This action cannot be undone.")) return;
    try {
      await adminAPI.deleteAdminProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Products</h1>
          <p className="text-sm text-gray-500">View and manage all products on the platform</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search products..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 w-64" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Seller</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Rating</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-gray-500">No products found</td></tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product._id} className="border-b dark:border-dark-border last:border-0 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-primary-400 font-bold text-sm shrink-0">
                              {product.images?.[0]?.url ? (
                                <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover rounded-lg" />
                              ) : product.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                              <p className="text-xs text-gray-500">{typeof product.category === "object" ? product.category?.name : ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{(product.seller as any)?.name || "Unknown"}</td>
                        <td className="py-3 px-4 font-medium">{formatPrice(product.price)}</td>
                        <td className="py-3 px-4"><span className={product.stock < 10 ? "text-red-500 font-medium" : ""}>{product.stock}</span></td>
                        <td className="py-3 px-4">{product.avgRating.toFixed(1)} ({product.numReviews})</td>
                        <td className="py-3 px-4"><Badge variant={product.isActive ? "success" : "destructive"} className="text-xs">{product.isActive ? "Active" : "Inactive"}</Badge></td>
                        <td className="py-3 px-4 text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(product._id)}>
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="py-2 px-4 text-sm text-gray-500">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}
