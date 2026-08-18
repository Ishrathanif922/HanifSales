"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "How do I place an order?", a: "Simply browse our products, add items to your cart, and proceed to checkout. You can pay via credit/debit card or choose Cash on Delivery." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards through Stripe, and Cash on Delivery (COD) for most areas in Pakistan." },
  { q: "How long does delivery take?", a: "Standard delivery takes 3-7 business days depending on your location. Express delivery is available in major cities." },
  { q: "What is your return policy?", a: "We offer a 7-day return policy for most items. Products must be in original condition with tags attached." },
  { q: "How can I track my order?", a: "Once your order is shipped, you'll receive a tracking number via email and SMS. You can also track orders in your account dashboard." },
  { q: "Do you ship nationwide?", a: "Yes, we deliver to all major cities and towns across Pakistan. Delivery times may vary by location." },
  { q: "How do I become a seller?", a: "Click on 'Become a Seller' and complete the registration process. Your account will be reviewed and activated within 24-48 hours." },
  { q: "Are products authentic?", a: "Yes, all products listed on Hanif Sales are verified for authenticity. We work directly with brands and authorized sellers." },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h1>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 dark:border-dark-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-semibold text-sm pr-4">{faq.q}</span>
              {openIndex === i ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-300">{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
