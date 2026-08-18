"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronRight, Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/store/AppContext";
import { orderAPI } from "@/services";
import { formatPrice, formatDate, cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function OrdersPage() {
  const { state } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders({ limit: "50" })
      .then(({ data }) => setOrders(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
        <Link href="/account" className="hover:text-primary-600 transition-colors">Account</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-100 font-medium">Orders</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">My Orders</h1>
      <p className="text-gray-500 mb-8">Track and manage your orders</p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-dark-card rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex p-4 rounded-3xl bg-gray-100 dark:bg-dark-card mb-4">
            <ShoppingBag className="h-12 w-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link href="/products"><Button className="rounded-xl px-8">Shop Now</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div key={order._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                    <Package className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold">Order #{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={cn("text-[10px]", statusColors[order.orderStatus] || "")}>{order.orderStatus}</Badge>
                      <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"} className="text-[10px]">{order.paymentStatus}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:pl-6 md:border-l md:border-gray-100 dark:md:border-dark-border">
                  <div className="text-right">
                    <p className="text-2xl font-bold gradient-text">{formatPrice(order.total)}</p>
                    <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
                  </div>
                  <Link href={`/account/orders/${order._id}`}>
                    <Button variant="outline" size="sm" className="rounded-xl gap-1">
                      <Eye className="h-4 w-4" /> View
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
