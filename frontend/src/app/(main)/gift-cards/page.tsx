"use client";

import React, { useState } from "react";
import { Gift, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function GiftCardsPage() {
  const [amount, setAmount] = useState("5000");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient) {
      toast.error("Please enter recipient email");
      return;
    }
    toast.success(`Gift Card of Rs. ${amount} successfully sent to ${recipient}!`);
    setRecipient("");
    setMessage("");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="text-center mb-12">
        <div className="inline-flex p-4 rounded-3xl bg-primary-500/10 text-primary-500 mb-4">
          <Gift className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">Hanif Sales Gift Cards</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Give the perfect gift of choice. Send a digital gift card instantly to your loved ones for any occasion.
        </p>
      </div>

      <form onSubmit={handlePurchase} className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Select Amount (PKR)</label>
          <div className="grid grid-cols-4 gap-3">
            {["1000", "2500", "5000", "10000"].map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setAmount(val)}
                className={`py-3 rounded-xl border font-semibold transition-all ${
                  amount === val ? "border-primary-500 bg-primary-500/10 text-primary-600" : "border-gray-200 dark:border-gray-800"
                }`}
              >
                Rs. {val}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Recipient Email</label>
          <Input
            type="email"
            placeholder="friend@example.com"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="rounded-xl h-12"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Personal Message (Optional)</label>
          <textarea
            placeholder="Happy Birthday! Enjoy shopping on Hanif Sales."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-transparent p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl font-semibold text-base">
          <Sparkles className="h-5 w-5 mr-2" /> Purchase Gift Card (Rs. {amount})
        </Button>
      </form>
    </div>
  );
}
