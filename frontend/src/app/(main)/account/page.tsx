"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  User, Package, Heart, MapPin, Settings, LogOut,
  CreditCard, ChevronRight, LayoutDashboard, ShoppingBag, ArrowRight, MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useApp } from "@/store/AppContext";
import { authAPI, orderAPI } from "@/services";
import { formatPrice, formatDate, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const sidebarLinks = [
  { href: "/account", label: "My Account", icon: User },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/tickets", label: "Support Tickets", icon: MessageSquare },
  { href: "/account/settings", label: "Settings", icon: Settings },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  shipped: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AccountPage() {
  const { state, dispatch, refreshUser } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await orderAPI.getMyOrders({ limit: "5" });
        setOrders(data.data || []);
      } catch {} finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (!state.user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-flex p-4 rounded-3xl bg-gray-100 dark:bg-dark-card mb-6">
          <User className="h-12 w-12 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <p className="text-gray-500 mb-6">Login to access your account</p>
        <Link href="/auth/login"><Button className="rounded-xl px-8">Sign In</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-5 shadow-sm mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 flex items-center justify-center">
                <span className="text-xl font-bold text-primary-600">{state.user.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-bold">{state.user.name}</p>
                <p className="text-xs text-gray-500">{state.user.email}</p>
              </div>
            </div>
            <Badge variant="secondary" className="w-full justify-center capitalize">{state.user.role}</Badge>
          </motion.div>

          <nav className="space-y-1 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-3 shadow-sm">
            {sidebarLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  link.href === "/account"
                    ? "bg-primary-50 dark:bg-primary-500/10 text-primary-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg"
                )}
              >
                <link.icon className="h-4 w-4" /> {link.label}
              </Link>
            ))}
            {state.user.role === "seller" && (
              <Link href="/seller" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 dark:hover:bg-dark-bg">
                <LayoutDashboard className="h-4 w-4" /> Seller Dashboard
              </Link>
            )}
            <button
              onClick={async () => {
                await authAPI.logout();
                localStorage.removeItem("accessToken");
                dispatch({ type: "SET_USER", payload: null });
                window.location.href = "/";
              }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 w-full transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {state.user.name.split(" ")[0]} 👋</h1>
            <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your account</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Orders", value: orders.length, icon: Package, color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
              { label: "Wishlist", value: state.user.wishlist?.length || 0, icon: Heart, color: "from-pink-500 to-rose-600", bgColor: "bg-pink-50 dark:bg-pink-900/20" },
              { label: "Addresses", value: state.user.addresses?.length || 0, icon: MapPin, color: "from-green-500 to-emerald-600", bgColor: "bg-green-50 dark:bg-green-900/20" },
              { label: "Wallet", value: formatPrice(state.user.wallet?.balance || 0), icon: CreditCard, color: "from-purple-500 to-violet-600", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className={cn("p-2 rounded-xl w-fit mb-3", stat.bgColor)}>
                  <div className={cn("bg-gradient-to-br p-1 rounded-lg text-white", stat.color)}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg">Recent Orders</h2>
              <Link href="/account/orders" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1 transition-colors">
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingBag className="h-10 w-10 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500 text-sm">No orders yet. Start shopping!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-dark-bg hover:bg-gray-100 dark:hover:bg-dark-border/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                        <Package className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">#{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatPrice(order.total)}</p>
                      <Badge className={cn("text-[10px] mt-1", statusColors[order.orderStatus] || "")}>
                        {order.orderStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
