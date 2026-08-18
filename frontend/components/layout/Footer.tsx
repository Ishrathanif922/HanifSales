"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowRight, Send, CreditCard, Shield, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ticketAPI } from "@/services";
import toast from "react-hot-toast";

const footerLinks = {
  shop: [
    { label: "All Products", href: "/products" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Best Sellers", href: "/products?sort=best_sellers" },
    { label: "Flash Sale", href: "/products?discount=true" },
    { label: "Gift Cards", href: "/gift-cards" },
  ],
  help: [
    { label: "Customer Service", href: "/contact" },
    { label: "Track Order", href: "/account/orders" },
    { label: "Returns & Refunds", href: "/return-policy" },
    { label: "Shipping Policy", href: "/shipping-policy" },
    { label: "FAQ", href: "/faq" },
  ],
  about: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
  sell: [
    { label: "Become a Seller", href: "/seller" },
    { label: "Seller Dashboard", href: "/seller" },
    { label: "Affiliate Program", href: "/affiliate" },
    { label: "Wholesale", href: "/wholesale" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) return;
    try {
      await ticketAPI.create({
        subject: `Newsletter Subscription - ${email}`,
        message: `User ${email} wants to subscribe to the newsletter.`,
        priority: "low",
      });
      setSubscribed(true);
      setEmail("");
      toast.success("Subscribed! We'll keep you updated.");
    } catch {
      toast.error("Failed to subscribe");
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-700 p-8 md:p-12 relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-2">Stay in the loop</h3>
                <p className="text-white/80">Sign up for our newsletter and get 10% off your first order.</p>
              </div>
              <div className="flex w-full md:w-auto gap-2">
                {subscribed ? (
                  <div className="flex items-center gap-2 text-white font-medium">
                    <CheckCircle className="h-5 w-5 text-green-400" /> Thanks for subscribing!
                  </div>
                ) : (
                  <>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 max-w-sm h-12 rounded-xl backdrop-blur-sm"
                    />
                    <Button onClick={handleSubscribe} className="shrink-0 h-12 px-6 rounded-xl bg-white text-primary-600 hover:bg-gray-100 font-semibold">
                      <Send className="h-4 w-4 mr-2" /> Subscribe
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt="Hanif Sales" className="h-10 w-10 rounded-2xl object-cover shadow-lg" />
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent">Hanif Sales</span>
                <p className="text-[10px] text-gray-500 -mt-0.5">Everything You Need</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">Your trusted marketplace for premium products at the best prices.</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5"><div className="p-1.5 rounded-lg bg-primary-500/10"><Phone className="h-3.5 w-3.5 text-primary-400" /></div> EasyPaisa: 03415992753</div>
              <div className="flex items-center gap-2.5"><div className="p-1.5 rounded-lg bg-primary-500/10"><Phone className="h-3.5 w-3.5 text-primary-400" /></div> JazzCash: 03271192753</div>
              <div className="flex items-center gap-2.5"><div className="p-1.5 rounded-lg bg-primary-500/10"><Mail className="h-3.5 w-3.5 text-primary-400" /></div> haneefullah922@gmail.com</div>
              <div className="flex items-center gap-2.5"><div className="p-1.5 rounded-lg bg-primary-500/10"><MapPin className="h-3.5 w-3.5 text-primary-400" /></div> Karachi, Pakistan</div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-primary-400 transition-colors flex items-center gap-1 group">
                      <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Payment & Trust */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-green-500" /> Secure Payments</span>
            <span className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-blue-500" /> JazzCash: 03271192753</span>
            <span className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-orange-500" /> EasyPaisa: 03415992753</span>
            <span className="flex items-center gap-1.5">Cash on Delivery Available</span>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Hanif Sales. All rights reserved.</p>
            <div className="flex items-center gap-3">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="h-9 w-9 rounded-xl bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all duration-300">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
