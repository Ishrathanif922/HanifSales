"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/store/AppContext";
import { adminAPI } from "@/services";
import { formatPrice, cn } from "@/lib/utils";

export default function AdminDashboard() {
  const { state } = useApp();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(({ data }) => setData(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!state.user || state.user.role !== "admin") {
    return <div className="py-20 text-center"><h2 className="text-2xl font-bold">Admin Access Required</h2></div>;
  }

  const stats = [
    { label: "Total Revenue", value: formatPrice(data?.totalRevenue || 0), icon: DollarSign, color: "from-emerald-500 to-green-600", change: "+12%", up: true },
    { label: "Total Orders", value: data?.totalOrders || 0, icon: ShoppingCart, color: "from-blue-500 to-indigo-600", change: "+8%", up: true },
    { label: "Total Products", value: data?.totalProducts || 0, icon: Package, color: "from-purple-500 to-violet-600", change: "+3%", up: true },
    { label: "Total Users", value: data?.totalUsers || 0, icon: Users, color: "from-orange-500 to-red-600", change: "+15%", up: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {state.user.name}</h1>
        <p className="text-sm text-gray-500">Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-3 rounded-xl bg-gradient-to-br text-white shadow-lg", stat.color)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className={cn("flex items-center gap-0.5 text-xs font-semibold", stat.up ? "text-green-600" : "text-red-600")}>
                    {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
              <div className={cn("h-1 bg-gradient-to-r", stat.color)} />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {[
          { label: "Manage Users", href: "/admin/users", icon: Users, color: "from-blue-500 to-blue-600", count: data?.totalUsers || 0 },
          { label: "Manage Products", href: "/admin/products", icon: Package, color: "from-purple-500 to-purple-600", count: data?.totalProducts || 0 },
          { label: "Manage Orders", href: "/admin/orders", icon: ShoppingCart, color: "from-green-500 to-green-600", count: data?.totalOrders || 0 },
        ].map((action, i) => (
          <Link key={i} href={action.href}>
            <div className={cn("rounded-2xl bg-gradient-to-br p-6 text-white hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer", action.color)}>
              <action.icon className="h-8 w-8 mb-3 opacity-80" />
              <h3 className="font-bold text-lg">{action.label}</h3>
              <p className="text-white/70 text-sm">{action.count} total</p>
            </div>
          </Link>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
          {data?.recentOrders?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b dark:border-dark-border">
                  <th className="text-left py-3 font-medium text-gray-500">Order</th>
                  <th className="text-left py-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left py-3 font-medium text-gray-500">Status</th>
                  <th className="text-right py-3 font-medium text-gray-500">Total</th>
                </tr></thead>
                <tbody>
                  {data.recentOrders.map((order: any) => (
                    <tr key={order._id} className="border-b dark:border-dark-border last:border-0 hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                      <td className="py-3 font-medium">#{order.orderNumber}</td>
                      <td className="py-3 text-gray-600">{order.user?.name || "N/A"}</td>
                      <td className="py-3"><Badge variant="secondary" className="text-xs capitalize">{order.orderStatus}</Badge></td>
                      <td className="py-3 text-right font-bold">{formatPrice(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-gray-500 text-center py-8">No recent orders</p>}
        </CardContent>
      </Card>
    </div>
  );
}
