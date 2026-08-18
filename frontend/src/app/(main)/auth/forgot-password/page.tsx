"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authAPI } from "@/services";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetUrl, setResetUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      if (res.data?.data?.resetUrl) {
        setResetUrl(res.data.data.resetUrl);
      }
      setSent(true);
      toast.success("Reset link generated successfully!");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed. Please ensure this email is registered and backend is running.";
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.jpg" alt="Hanif Sales" className="h-12 w-12 rounded-2xl object-cover shadow-lg" />
          </Link>
          <h1 className="text-3xl font-bold">Forgot Password?</h1>
          <p className="text-gray-500 mt-2">Enter your email and we&apos;ll send you a reset link</p>
        </div>

        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-8 shadow-sm text-center"
          >
            <div className="inline-flex p-4 rounded-3xl bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Check Your Email / Reset Link</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              We&apos;ve generated a password reset link for <strong>{email}</strong>
            </p>
            {resetUrl && (
              <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-dark-bg text-left border border-gray-200 dark:border-dark-border">
                <p className="text-xs font-semibold text-gray-500 mb-1">Direct Reset Link (Development/SMTP Fallback):</p>
                <a href={resetUrl} className="text-xs text-primary-600 hover:underline break-all font-mono">
                  {resetUrl}
                </a>
              </div>
            )}
            <Link href="/auth/login">
              <Button className="w-full h-12 rounded-xl font-semibold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-11 h-12 rounded-xl" required />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-semibold" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <>Send Reset Link <ArrowRight className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </form>
            <Link href="/auth/login" className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium mt-6 transition-colors">
              <ArrowLeft className="h-3 w-3 inline mr-1" /> Back to Login
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
