"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ReturnPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Return Policy</h1>
      <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300">
        <p>We want you to be completely satisfied with your purchase. If for any reason you are not, we offer a hassle-free return policy.</p>
        <div className="grid md:grid-cols-3 gap-4 my-8">
          {[
            { icon: Clock, title: "7-Day Returns", desc: "Return within 7 days of delivery" },
            { icon: RefreshCw, title: "Easy Process", desc: "Simple online return request" },
            { icon: CreditCard, title: "Quick Refund", desc: "Refund processed within 5-7 days" },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-xl border border-gray-200 dark:border-dark-border">
              <item.icon className="h-8 w-8 text-primary-500 mx-auto mb-2" />
              <h3 className="font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">How to Return</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Log in to your account and go to Orders</li>
          <li>Select the order containing the item you want to return</li>
          <li>Click &quot;Request Return&quot; and select your reason</li>
          <li>Pack the item in its original packaging</li>
          <li>Our delivery partner will pick up the item within 2-3 business days</li>
        </ol>
      </div>
    </div>
  );
}
