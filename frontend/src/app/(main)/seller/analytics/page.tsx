"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Package, TrendingUp, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { productAPI, orderAPI } from "@/services";
import { Product, Order } from "@/types";

export default function SellerAnalyticsPage() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalProducts: 0, conversionRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          productAPI.getMyProducts({ limit: "100" }),
          orderAPI.getSellerOrders({ limit: "100" }),
        ]);

        const products = productsRes.data.data || [];
        const orders = ordersRes.data.data || [];

        const totalRevenue = orders.reduce((sum: number, order: Order) => {
          if (order.paymentStatus === "paid") {
            return sum + order.items.reduce((itemSum: number, item: any) => {
              return itemSum + (item.price * item.quantity);
            }, 0);
          }
          return sum;
        }, 0);

        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          conversionRate: products.length > 0 ? Math.round((orders.length / Math.max(products.length * 10, 1)) * 100) : 0,
        });
      } catch {
        // Use zero values
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: formatPrice(stats.totalRevenue), icon: DollarSign, color: "text-green-600 bg-green-50 dark:bg-green-900/20" },
          { label: "Total Orders", value: String(stats.totalOrders), icon: ShoppingCart, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20" },
          { label: "Total Products", value: String(stats.totalProducts), icon: Package, color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20" },
          { label: "Conversion Rate", value: `${stats.conversionRate}%`, icon: TrendingUp, color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className={`p-2 rounded-lg w-fit mb-3 ${stat.color}`}><stat.icon className="h-5 w-5" /></div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500 py-12">Detailed analytics charts coming soon. Data shown above is based on your current orders and products.</p>
        </CardContent>
      </Card>
    </div>
  );
}
