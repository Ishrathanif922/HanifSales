"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, Banknote, ChevronRight, Lock, Check, Shield, Truck, Package, ArrowLeft, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/store/AppContext";
import { orderAPI, authAPI } from "@/services";
import { formatPrice, cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const addressSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(5, "Phone is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(3, "ZIP code is required"),
  country: z.string().min(2, "Country is required"),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { state, refreshCart } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod" | "wallet">("cod");
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: state.user?.name || "",
      phone: state.user?.phone || "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Pakistan",
    },
  });

  useEffect(() => {
    if (state.user) {
      authAPI.getWallet().then(({ data }) => setWalletBalance(data.data?.balance || 0)).catch(() => {});
    }
  }, [state.user]);

  const subtotal = state.cart?.total || 0;
  const shipping = subtotal >= 5000 ? 0 : 200;
  const total = subtotal + shipping;

  const onSubmit = async (addressData: any) => {
    if (state.cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setLoading(true);
    try {
      const orderData = {
        shippingAddress: addressData,
        billingAddress: addressData,
        paymentMethod,
        couponCode: couponCode || undefined,
      };

      if (paymentMethod === "stripe") {
        const { data } = await orderAPI.createOrder(orderData);
        const url = (data.data as any)?.url;
        if (url) {
          window.location.href = url;
          return;
        }
      }

      await orderAPI.createOrder(orderData);
      await refreshCart();
      toast.success("Order placed successfully!");
      router.push("/account/orders");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!state.user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
        <Link href="/auth/login"><Button>Sign In</Button></Link>
      </div>
    );
  }

  if (state.cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-2">Cart is Empty</h2>
        <Link href="/products"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/cart" className="hover:text-primary-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Cart
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-900 dark:text-gray-100 font-medium">Checkout</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-gray-500 mb-8">Complete your order by filling in the details below</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <Package className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Shipping Address</h2>
                  <p className="text-xs text-gray-500">Where should we deliver your order?</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium">Full Name</Label>
                  <Input id="fullName" {...register("fullName")} className="mt-1.5 h-11 rounded-xl" />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                  <Input id="phone" {...register("phone")} placeholder="+92 300 1234567" className="mt-1.5 h-11 rounded-xl" />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                  <Input id="address" {...register("address")} placeholder="Street address, apartment, suite" className="mt-1.5 h-11 rounded-xl" />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
                </div>
                <div>
                  <Label htmlFor="city" className="text-sm font-medium">City</Label>
                  <Input id="city" {...register("city")} className="mt-1.5 h-11 rounded-xl" />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-medium">State/Province</Label>
                  <Input id="state" {...register("state")} className="mt-1.5 h-11 rounded-xl" />
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <Label htmlFor="zipCode" className="text-sm font-medium">ZIP Code</Label>
                  <Input id="zipCode" {...register("zipCode")} className="mt-1.5 h-11 rounded-xl" />
                  {errors.zipCode && <p className="text-xs text-red-500 mt-1">{errors.zipCode.message}</p>}
                </div>
                <div>
                  <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                  <Input id="country" {...register("country")} className="mt-1.5 h-11 rounded-xl" />
                  {errors.country && <p className="text-xs text-red-500 mt-1">{errors.country.message}</p>}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-6 shadow-sm"
            >
               <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-xl bg-primary-50 dark:bg-primary-900/20">
                  <CreditCard className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Payment Method</h2>
                  <p className="text-xs text-gray-500">Choose how you&apos;d like to pay</p>
                </div>
              </div>

              {/* Mobile Account Details Notice */}
              <div className="mb-4 p-4 rounded-xl bg-gradient-to-r from-orange-500/10 via-red-500/15 to-purple-500/10 border border-orange-500/20 text-sm space-y-1.5">
                <p className="font-semibold text-gray-900 dark:text-white">📱 Direct Mobile Accounts (JazzCash & EasyPaisa):</p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-700 dark:text-gray-300">
                  <p>🔹 <strong>JazzCash:</strong> 03271192753</p>
                  <p>🔸 <strong>EasyPaisa:</strong> 03415992753</p>
                </div>
                <p className="text-[11px] text-gray-500 pt-1">You can send payment to these accounts and select Cash on Delivery (COD) or contact us at haneefullah922@gmail.com.</p>
              </div>
              <div className="space-y-3">
                {[
                  { value: "cod", label: "Cash on Delivery", icon: Banknote, desc: "Pay when you receive your order", badge: "Popular" },
                  { value: "stripe", label: "Credit/Debit Card", icon: CreditCard, desc: "Pay securely with Stripe", badge: "Secure" },
                  { value: "wallet", label: "Wallet Balance", icon: Wallet, desc: `Rs. ${walletBalance.toLocaleString()} available`, badge: walletBalance >= total ? "Sufficient" : "Insufficient" },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => {
                      if (method.value === "wallet" && walletBalance < total) {
                        toast.error("Insufficient wallet balance");
                        return;
                      }
                      setPaymentMethod(method.value as any);
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300 text-left",
                      paymentMethod === method.value
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-sm shadow-primary-500/10"
                        : "border-gray-200 dark:border-dark-border hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg/50",
                      method.value === "wallet" && walletBalance < total && "opacity-50"
                    )}
                  >
                    <div className={cn("p-2.5 rounded-xl", paymentMethod === method.value ? "bg-primary-100 text-primary-600" : "bg-gray-100 dark:bg-dark-bg")}>
                      <method.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{method.label}</p>
                        <Badge variant={method.value === "wallet" && walletBalance < total ? "destructive" : "secondary"} className="text-[10px]">{method.badge}</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                    </div>
                    {paymentMethod === method.value && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-6 w-6 rounded-full bg-primary-500 flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5 text-white" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="sticky top-24 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-6 shadow-sm"
            >
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>

              <div className="space-y-3 max-h-52 overflow-y-auto mb-4">
                {state.cart.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary-300">{item.product?.name?.charAt(0) || "?"}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product?.name || "Product"}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold shrink-0">{formatPrice(item.itemTotal)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 dark:border-dark-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className={cn("font-medium", shipping === 0 && "text-green-600")}>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-dark-border pt-3 flex justify-between">
                  <span className="font-bold text-base">Total</span>
                  <span className="font-bold text-xl gradient-text">{formatPrice(total)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl font-semibold mt-5" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </div>
                ) : (
                  <>Place Order <Lock className="ml-2 h-4 w-4" /></>
                )}
              </Button>

              <div className="flex items-center justify-center gap-4 pt-3 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Encrypted</span>
                <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> Secure</span>
              </div>
            </motion.div>
          </div>
        </div>
      </form>
    </div>
  );
}
