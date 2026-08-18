"use client";

import React from "react";
import Link from "next/link";
import { Truck, Shield, CreditCard, Users, Heart, Globe, Award, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-400 text-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Hanif Sales</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Everything You Need, One Trusted Store. We&apos;re on a mission to make online shopping accessible, affordable, and enjoyable for everyone.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Founded in 2024, Hanif Sales started with a simple idea: create a trusted online marketplace where customers can find everything they need in one place.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                What began as a small e-commerce venture has grown into a full-fledged multi-vendor platform serving thousands of satisfied customers across Pakistan.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                We partner with verified sellers and brands to bring you authentic products at competitive prices, backed by secure payments and reliable delivery.
              </p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 h-80 flex items-center justify-center">
              <span className="text-8xl font-bold text-primary-200 dark:text-primary-800">HS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50 dark:bg-dark-card/50">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Trusted & Secure", desc: "100% secure payments and buyer protection on every order." },
              { icon: Truck, title: "Fast Delivery", desc: "Quick and reliable shipping with real-time order tracking." },
              { icon: Award, title: "Quality Products", desc: "All products are verified and quality-checked before listing." },
              { icon: Headphones, title: "24/7 Support", desc: "Our dedicated support team is always here to help you." },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border">
                <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "10K+", label: "Products Listed" },
              { value: "500+", label: "Verified Sellers" },
              { value: "99%", label: "Satisfaction Rate" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-bold text-primary-600">{stat.value}</p>
                <p className="text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-400 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-white/80 mb-6">Join thousands of happy customers on Hanif Sales today.</p>
          <Link href="/products">
            <Button size="xl" className="bg-white text-primary-600 hover:bg-gray-100">Shop Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
