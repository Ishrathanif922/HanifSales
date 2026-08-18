"use client";

import React, { useEffect, useState } from "react";
import { Loader2, ChevronDown } from "lucide-react";
import { orderAPI } from "@/services";
import { formatPrice, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Order } from "@/types";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  packed: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const nextStatuses: Record<string, string[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["packed"],
  packed: ["shipped"],
  shipped: ["delivered"],
};

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    orderAPI.getSellerOrders({ limit: "50" })
      .then(({ data }) => setOrders(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const payload: any = { orderStatus: newStatus };
      if (newStatus === "shipped" && trackingInputs[orderId]) {
        payload.trackingNumber = trackingInputs[orderId];
      }
      await orderAPI.updateStatus(orderId, payload);
      setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, orderStatus: newStatus as any } : o));
      toast.success(`Order ${newStatus}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">Seller Orders</h1>
      <p className="text-sm text-gray-500 mb-6">Orders containing your products</p>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-center py-16">No orders yet</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)} · {typeof order.user === "object" ? (order.user as any)?.name : "Customer"}</p>
                  <p className="text-xs text-gray-400 mt-1">{order.items.length} item(s) · {formatPrice(order.total)}</p>
                  {order.trackingNumber && <p className="text-xs text-gray-400 mt-1">Tracking: {order.trackingNumber}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`text-xs capitalize ${statusColors[order.orderStatus] || ""}`}>{order.orderStatus}</Badge>
                  <Badge variant={order.paymentStatus === "paid" ? "success" : "outline"} className="text-xs capitalize">{order.paymentStatus}</Badge>

                  {nextStatuses[order.orderStatus]?.length > 0 && (
                    <div className="flex items-center gap-2">
                      {order.orderStatus === "shipped" && (
                        <Input
                          placeholder="Tracking #"
                          value={trackingInputs[order._id] || ""}
                          onChange={(e) => setTrackingInputs((prev) => ({ ...prev, [order._id]: e.target.value }))}
                          className="w-32 h-8 text-xs"
                        />
                      )}
                      <select
                        onChange={(e) => { if (e.target.value) handleStatusUpdate(order._id, e.target.value); e.target.value = ""; }}
                        disabled={updatingId === order._id}
                        className="text-xs rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-2 py-1.5"
                        defaultValue=""
                      >
                        <option value="" disabled>Update</option>
                        {nextStatuses[order.orderStatus]?.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {updatingId === order._id && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
