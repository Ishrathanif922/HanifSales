"use client";

import React from "react";
import { Package, TrendingUp, ShieldCheck, DollarSign, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WholesalePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Wholesale Program</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Partner with Hanif Sales for bulk purchasing at competitive B2B wholesale prices. Ideal for retail stores, resellers, and corporate clients.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: DollarSign, title: "Special Discount", desc: "Enjoy tiered wholesale pricing and bulk discounts." },
          { icon: Package, title: "Bulk Supply", desc: "Consistent inventory and direct sourcing." },
          { icon: ShieldCheck, title: "Quality Assured", desc: "100% verified authentic products with warranty." },
          { icon: TrendingUp, title: "Fast Shipping", desc: "Priority bulk dispatch across Pakistan." },
        ].map((item, i) => (
          <div key={i} className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-center">
            <div className="inline-flex p-3 rounded-xl bg-primary-500/10 text-primary-500 mb-4">
              <item.icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-base mb-1">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Partner With Us?</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
          Get in touch with our B2B sales team to set up your wholesale account and get custom quotations.
        </p>
        <Link href="/contact">
          <Button className="rounded-xl px-8 py-6 font-semibold">
            <Send className="h-4 w-4 mr-2" /> Inquire for Wholesale
          </Button>
        </Link>
      </div>
    </div>
  );
}
