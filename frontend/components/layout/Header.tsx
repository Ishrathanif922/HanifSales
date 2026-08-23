"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon,
  ChevronDown, Bell, Globe, Truck, Package, LogOut, Settings,
  LayoutDashboard, ShoppingBag, Star, CheckCheck, MessageSquare, Store
} from "lucide-react";
import { useApp } from "@/store/AppContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { navLinks, categories } from "@/lib/constants";
import { notificationAPI } from "@/services";

export default function Header() {
  const { state, dispatch } = useApp();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dark = localStorage.getItem("theme") === "dark" ||
        (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
      setIsDark(dark);
      document.documentElement.classList.toggle("dark", dark);
    }
  }, []);

  useEffect(() => {
    if (state.user) {
      notificationAPI.getNotifications()
        .then(({ data }) => setNotifications(data.data || []))
        .catch(() => {});
    }
  }, [state.user]);

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const cartCount = state.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistCount = state.user?.wishlist?.length || 0;

  return (
    <header className={cn(
      "sticky top-0 z-50 transition-all duration-300",
      isScrolled ? "bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl shadow-lg shadow-black/5" : "bg-white dark:bg-dark-bg"
    )}>
      {/* Top Bar */}
      <div className="border-b border-gray-100 dark:border-dark-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-8 items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Truck className="h-3 w-3" /> Free shipping on orders over Rs. 5,000</span>
              <span className="hidden sm:flex items-center gap-1"><Package className="h-3 w-3" /> Easy 7-day returns</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/contact" className="hover:text-primary-600 transition-colors">Support</Link>
              <button onClick={toggleDark} className="hover:text-primary-600 transition-colors">
                {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Mobile Menu */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden">
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Hanif Sales" className="h-9 w-9 rounded-xl object-cover" />
            <div>
              <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">
                Hanif Sales
              </h1>
              <p className="text-[10px] text-gray-400 -mt-1 hidden sm:block">Everything You Need</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="pl-10 pr-4 h-11 rounded-xl border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-card focus:bg-white dark:focus:bg-dark-bg"
              />
              <Button type="submit" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-9 rounded-lg">
                Search
              </Button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <Link href="/search" className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors">
              <Search className="h-5 w-5" />
            </Link>

            {state.user && (
              <Link href="/account/wishlist" className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors">
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center">{wishlistCount}</Badge>
                )}
              </Link>
            )}

            <Link href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center">{cartCount}</Badge>
              )}
            </Link>

            {state.user && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors hidden sm:flex"
                >
                  <Bell className="h-5 w-5" />
                  {notifications.filter((n) => !n.isRead).length > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center">
                      {notifications.filter((n) => !n.isRead).length}
                    </Badge>
                  )}
                </button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-dark-card shadow-xl border border-gray-100 dark:border-dark-border z-50"
                      onMouseLeave={() => setNotifOpen(false)}
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-dark-border">
                        <p className="font-semibold text-sm">Notifications</p>
                        {notifications.some((n) => !n.isRead) && (
                          <button
                            onClick={async () => {
                              await notificationAPI.markAllAsRead();
                              setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                            }}
                            className="text-xs text-primary-600 hover:text-primary-700 flex items-center gap-1"
                          >
                            <CheckCheck className="h-3 w-3" /> Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-400 text-sm">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 10).map((notif) => (
                            <button
                              key={notif._id}
                              onClick={async () => {
                                if (!notif.isRead) {
                                  await notificationAPI.markAsRead(notif._id);
                                  setNotifications((prev) => prev.map((n) => n._id === notif._id ? { ...n, isRead: true } : n));
                                }
                                if (notif.link) window.location.href = notif.link;
                              }}
                              className={cn(
                                "w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-border transition-colors border-b border-gray-50 dark:border-dark-border last:border-0",
                                !notif.isRead && "bg-primary-50/50 dark:bg-primary-500/5"
                              )}
                            >
                              <div className="flex items-start gap-3">
                                <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", !notif.isRead ? "bg-primary-500" : "bg-gray-300")} />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{notif.title}</p>
                                  <p className="text-xs text-gray-500 truncate">{notif.message}</p>
                                  <p className="text-[10px] text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User Menu */}
            {state.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-dark-card rounded-lg transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary-600">{state.user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <ChevronDown className="h-3 w-3 hidden sm:block" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-dark-card shadow-xl border border-gray-100 dark:border-dark-border p-2 z-50"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-dark-border mb-1">
                        <p className="font-semibold text-sm">{state.user.name}</p>
                        <p className="text-xs text-gray-500">{state.user.email}</p>
                      </div>
                      <Link href="/account" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                        <User className="h-4 w-4" /> My Account
                      </Link>
                      <Link href="/account/orders" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                        <ShoppingBag className="h-4 w-4" /> My Orders
                      </Link>
                      <Link href="/account/wishlist" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                        <Heart className="h-4 w-4" /> Wishlist
                      </Link>
                      {state.user.role === "seller" && (
                        <Link href="/seller/products" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                          <LayoutDashboard className="h-4 w-4" /> Seller Dashboard
                        </Link>
                      )}
                      {state.user.role === "admin" && (
                        <Link href="/admin/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border transition-colors">
                          <LayoutDashboard className="h-4 w-4" /> Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-gray-100 dark:border-dark-border mt-1 pt-1">
                        <button
                          onClick={async () => {
                            const { authAPI } = await import("@/services");
                            await authAPI.logout();
                            localStorage.removeItem("accessToken");
                            dispatch({ type: "SET_USER", payload: null });
                            window.location.href = "/";
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-t border-gray-100 dark:border-dark-border hidden lg:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-11 items-center gap-1">
            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoryMenuOpen(true)}
              onMouseLeave={() => setCategoryMenuOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Menu className="h-3.5 w-3.5" /> All Categories <ChevronDown className="h-3 w-3" />
              </button>
              <AnimatePresence>
                {categoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 mt-1 w-72 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-gray-100 dark:border-dark-border p-3 z-50"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/category/${cat.slug}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
                        >
                          <cat.icon className="h-4 w-4 text-primary-500" />
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-primary-600 bg-primary-50 dark:bg-primary-500/10"
                    : "text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:bg-gray-50 dark:hover:bg-dark-card"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/seller"
              className="ml-auto px-3.5 py-1.5 text-sm font-semibold rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20 hover:from-red-700 hover:to-rose-700 transition-all duration-300 flex items-center gap-1.5"
            >
              <Store className="h-4 w-4" /> Become a Seller
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-gray-100 dark:border-dark-border"
          >
            <div className="p-4 space-y-2">
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="pl-10" />
                </div>
              </form>
              {categories.slice(0, 10).map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="block px-3 py-2 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-dark-card"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
