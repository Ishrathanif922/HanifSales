"use client";

import React, { useEffect, useState } from "react";
import { adminAPI } from "@/services";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { Order } from "@/types";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  packed: "bg-cyan-100 text-cyan-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  returned: "bg-orange-100 text-orange-800",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    adminAPI.getAllOrders({ page: String(page), limit: "20", ...(search && { search }) })
      .then(({ data }) => {
        setOrders(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">All Orders</h1>
          <p className="text-sm text-gray-500">Manage all platform orders</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by order number..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-9 w-64" />
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
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Order</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Customer</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Items</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Payment</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={7} className="py-8 text-center text-gray-500">No orders found</td></tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order._id} className="border-b dark:border-dark-border last:border-0 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                        <td className="py-3 px-4 font-medium">#{order.orderNumber}</td>
                        <td className="py-3 px-4">
                          <p className="font-medium">{(order.user as any)?.name || "Unknown"}</p>
                          <p className="text-xs text-gray-500">{(order.user as any)?.email || ""}</p>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{order.items.length} item(s)</td>
                        <td className="py-3 px-4 text-gray-500">{formatDate(order.createdAt)}</td>
                        <td className="py-3 px-4"><Badge className={`text-xs capitalize ${statusColors[order.orderStatus] || ""}`}>{order.orderStatus}</Badge></td>
                        <td className="py-3 px-4"><Badge variant={order.paymentStatus === "paid" ? "success" : "outline"} className="text-xs capitalize">{order.paymentStatus}</Badge></td>
                        <td className="py-3 px-4 text-right font-bold">{formatPrice(order.total)}</td>
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
