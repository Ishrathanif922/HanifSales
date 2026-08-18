"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package, ShoppingCart, DollarSign, TrendingUp, Plus,
  LayoutDashboard, BarChart3, ArrowRight, Store
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/store/AppContext";
import { productAPI, orderAPI } from "@/services";
import { Product, Order } from "@/types";
import { formatPrice, formatDate, cn } from "@/lib/utils";

export default function SellerDashboard() {
  const { state } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, orderRes] = await Promise.all([
          productAPI.getProducts({ limit: "100" }),
          orderAPI.getMyOrders({ limit: "50" }),
        ]);
        setProducts(prodRes.data.data || []);
        setOrders(orderRes.data.data || []);
        setStats({
          totalProducts: prodRes.data.pagination?.total || 0,
          totalOrders: orderRes.data.pagination?.total || 0,
          totalRevenue: (orderRes.data.data || []).reduce((sum: number, o: any) => sum + (o.total || 0), 0),
        });
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (!state.user || (state.user.role !== "seller" && state.user.role !== "admin")) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-flex p-4 rounded-3xl bg-gray-100 dark:bg-dark-card mb-6">
          <Store className="h-12 w-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Seller Access Required</h2>
        <p className="text-gray-500 mb-6">You need a seller account to access this page</p>
        <Link href="/auth/register"><Button className="rounded-xl px-8">Register as Seller</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {state.user.name}</p>
        </div>
        <Link href="/seller/products">
          <Button className="gap-2 rounded-xl px-6"><Plus className="h-4 w-4" /> Add Product</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Products", value: stats.totalProducts, icon: Package, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "Orders", value: stats.totalOrders, icon: ShoppingCart, color: "from-green-500 to-emerald-600", bgColor: "bg-green-50 dark:bg-green-900/20" },
          { label: "Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: "from-purple-500 to-violet-600", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className={cn("p-2.5 rounded-xl w-fit mb-4", stat.bgColor)}>
              <div className={cn("bg-gradient-to-br p-1 rounded-lg text-white", stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Manage Products", desc: "View and edit your listings", href: "/seller/products", icon: Package, color: "from-blue-600 to-indigo-600" },
          { label: "View Orders", desc: "Track and fulfill orders", href: "/seller/orders", icon: ShoppingCart, color: "from-green-600 to-emerald-600" },
          { label: "Analytics", desc: "View your store performance", href: "/seller/analytics", icon: BarChart3, color: "from-purple-600 to-violet-600" },
        ].map((action, i) => (
          <Link key={i} href={action.href}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
            >
              <div className={cn("bg-gradient-to-br p-2 rounded-xl text-white w-fit mb-3", action.color)}>
                <action.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold mb-1 group-hover:text-primary-600 transition-colors">{action.label}</h3>
              <p className="text-xs text-gray-500 mb-3">{action.desc}</p>
              <span className="text-xs text-primary-600 font-medium flex items-center gap-1">
                Go to {action.label} <ArrowRight className="h-3 w-3" />
              </span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">Recent Orders</h2>
          <Link href="/seller/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors">
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart className="h-10 w-10 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-dark-border">
                  <th className="text-left py-3 font-medium text-gray-500">Order</th>
                  <th className="text-left py-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 font-medium text-gray-500">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order: any) => (
                  <tr key={order._id} className="border-b border-gray-50 dark:border-dark-border last:border-0 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="py-3.5 font-medium">#{order.orderNumber}</td>
                    <td className="py-3.5">{order.user?.name || "N/A"}</td>
                    <td className="py-3.5">
                      <Badge variant="secondary" className="text-xs capitalize">{order.orderStatus}</Badge>
                    </td>
                    <td className="py-3.5 text-right font-bold">{formatPrice(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
