"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/store/AppContext";
import { authAPI } from "@/services";
import toast from "react-hot-toast";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["customer", "seller"]).default("customer"),
});

export default function RegisterPage() {
  const router = useRouter();
  const { dispatch, refreshCart, refreshUser } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await authAPI.register(data);
      const result = response.data.data!;
      localStorage.setItem("accessToken", result.accessToken);
      dispatch({ type: "SET_USER", payload: result.user });
      await refreshCart();
      toast.success("Account created successfully!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center p-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Join Hanif Sales</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">Start Your Shopping Journey</h1>
            <p className="text-lg text-white/80 max-w-md">
              Create your account and get access to exclusive deals, fast delivery, and thousands of products.
            </p>
            <div className="mt-8 space-y-3 text-left max-w-sm mx-auto">
              {["Thousands of products", "Secure payments", "Fast delivery", "Easy returns"].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-white/90">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
                <span className="text-2xl font-bold text-white">H</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-gray-500 mt-2">Join thousands of happy shoppers</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="name" {...register("name")} placeholder="John Doe" className="pl-11 h-12 rounded-xl" />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name.message as string}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
              <div className="relative mt-1.5">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" {...register("email")} placeholder="you@example.com" className="pl-11 h-12 rounded-xl" />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email.message as string}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone <span className="text-gray-400 font-normal">(optional)</span></Label>
              <div className="relative mt-1.5">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="phone" {...register("phone")} placeholder="+92 300 1234567" className="pl-11 h-12 rounded-xl" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Account Type</Label>
              <select {...register("role")} className="mt-1.5 w-full h-12 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card px-3 text-sm font-medium">
                <option value="customer">Customer (Buyer)</option>
                <option value="seller">Seller (Vendor)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <div className="relative mt-1.5">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="password" type={showPassword ? "text" : "password"} {...register("password")} placeholder="Min. 6 characters" className="pl-11 pr-11 h-12 rounded-xl" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password.message as string}</p>}
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl font-semibold text-base" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Sign In <ArrowRight className="inline h-3 w-3" />
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
