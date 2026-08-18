"use client";

import React from "react";
import { Truck, Clock, MapPin, Package } from "lucide-react";

export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shipping Policy</h1>
      <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300">
        <p>At Hanif Sales, we aim to deliver your orders quickly and safely. Here&apos;s everything you need to know about our shipping.</p>
        <div className="grid md:grid-cols-2 gap-4 my-8">
          {[
            { icon: Truck, title: "Standard Delivery", desc: "3-7 business days. Free on orders over Rs. 5,000." },
            { icon: Clock, title: "Express Delivery", desc: "1-2 business days in major cities. Rs. 200 extra." },
            { icon: MapPin, title: "Nationwide Coverage", desc: "We deliver to all major cities and towns in Pakistan." },
            { icon: Package, title: "Secure Packaging", desc: "All items are securely packaged to prevent damage." },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-dark-border">
              <item.icon className="h-6 w-6 text-primary-500 mb-2" />
              <h3 className="font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">Shipping Charges</h2>
        <p>Orders above Rs. 5,000 qualify for free standard shipping. For orders below Rs. 5,000, a flat shipping fee of Rs. 200 applies.</p>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8">Order Tracking</h2>
        <p>Once your order is shipped, you will receive a tracking number via email and SMS. You can track your order in real-time from your account dashboard.</p>
      </div>
    </div>
  );
}
