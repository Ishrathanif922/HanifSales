"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Shield, Truck, CreditCard, Star, ChevronLeft,
  ChevronRight, Flame, Clock, TrendingUp, Sparkles, Gift, Users,
  Package, RefreshCw, Headphones, Smartphone, Laptop, Shirt,
  Home as HomeIcon, BookOpen, Baby, Gamepad2, Gem, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/product/Skeletons";
import { productAPI } from "@/services";
import { Product } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { categories } from "@/lib/constants";

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.05 } } };

const testimonials = [
  { name: "Ahmed Khan", rating: 5, text: "Amazing quality products and super fast delivery. Hanif Sales is my go-to online store!", initials: "AK", color: "from-blue-500 to-indigo-600" },
  { name: "Sara Ali", rating: 5, text: "Best customer service I've experienced. The return process was so smooth and hassle-free.", initials: "SA", color: "from-pink-500 to-rose-600" },
  { name: "Usman Malik", rating: 5, text: "Great prices and authentic products. The flash sales are incredible. Highly recommended!", initials: "UM", color: "from-emerald-500 to-teal-600" },
  { name: "Fatima Noor", rating: 5, text: "I've been shopping here for months. Always satisfied with the quality and fast shipping!", initials: "FN", color: "from-amber-500 to-orange-600" },
  { name: "Bilal Ahmed", rating: 4, text: "Best online marketplace in Pakistan. Authentic products at wholesale prices.", initials: "BA", color: "from-violet-500 to-purple-600" },
  { name: "Ayesha Siddiqui", rating: 5, text: "The flash sale deals are unbeatable. Saved thousands on electronics. Thank you Hanif Sales!", initials: "AS", color: "from-cyan-500 to-blue-600" },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroSlide, setHeroSlide] = useState(0);

  // Working countdown timer
  const [countdown, setCountdown] = useState({ hours: 8, minutes: 45, seconds: 30 });
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, arrivals, sellers] = await Promise.allSettled([
          productAPI.getFeaturedProducts(),
          productAPI.getNewArrivals(),
          productAPI.getBestSellers(),
        ]);
        if (featured.status === "fulfilled") setFeaturedProducts(featured.value.data.data || []);
        if (arrivals.status === "fulfilled") setNewArrivals(arrivals.value.data.data || []);
        if (sellers.status === "fulfilled") setBestSellers(sellers.value.data.data || []);
      } catch {
        // Use sample data
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setHeroSlide((p) => (p + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

  const heroSlides = [
    {
      title: "LUXURY FOOTWEAR & FASHION",
      subtitle: "Step into elegance with our 2025 curated collection. Premium craftsmanship, unmatched comfort.",
      cta: "Explore Collection",
      link: "/products?isNew=true",
      gradient: "from-zinc-950 via-zinc-900 to-red-950",
      icon: Sparkles,
      decor: "bg-red-500/10 rounded-full w-[500px] h-[500px] absolute -top-40 -right-40 blur-3xl",
      decor2: "bg-white/5 rounded-full w-80 h-80 absolute bottom-10 -left-20 blur-2xl",
    },
    {
      title: "EXCLUSIVE SNEAKER DROP",
      subtitle: "Limited edition streetwear and footwear designed for modern icons.",
      cta: "Shop Limited Drop",
      link: "/products?category=shoes",
      gradient: "from-zinc-900 via-zinc-950 to-black",
      icon: Zap,
      decor: "bg-amber-500/10 rounded-full w-[400px] h-[400px] absolute -top-20 right-10 blur-3xl",
      decor2: "bg-red-600/10 rounded-full w-64 h-64 absolute bottom-0 right-1/3 blur-2xl",
    },
    {
      title: "SEASONAL EDIT & ACCESSORIES",
      subtitle: "Elevate your wardrobe with premium accessories and luxury essentials.",
      cta: "Discover More",
      link: "/products?category=fashion",
      gradient: "from-black via-zinc-900 to-zinc-950",
      icon: Gift,
      decor: "bg-purple-500/10 rounded-full w-[450px] h-[450px] absolute -top-20 left-1/4 blur-3xl",
      decor2: "bg-white/5 rounded-full w-72 h-72 absolute bottom-10 left-10 blur-2xl",
    },
  ];

  const stats = useMemo(() => [
    { label: "Happy Customers", value: "50K+", icon: Users },
    { label: "Products", value: "10K+", icon: Package },
    { label: "Sellers", value: "1K+", icon: TrendingUp },
    { label: "Cities", value: "100+", icon: HomeIcon },
  ], []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-6">
          <div className="relative rounded-3xl overflow-hidden min-h-[420px] md:min-h-[500px] shadow-2xl border border-white/10">
            <AnimatePresence mode="wait">
              {heroSlides.map((slide, i) => (
                heroSlide === i && (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                  >
                    <div className={`bg-gradient-to-br ${slide.gradient} h-full w-full p-8 md:p-20 flex items-center relative overflow-hidden`}>
                      <div className={slide.decor} />
                      <div className={slide.decor2} />
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-xl relative z-10"
                      >
                        <Badge className="mb-6 bg-white/10 text-white border-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-medium tracking-widest uppercase">
                          <slide.icon className="h-3.5 w-3.5 mr-2 text-red-400" /> Curated Luxury 2025
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">{slide.title}</h2>
                        <p className="text-lg md:text-xl text-zinc-300 mb-8 font-light leading-relaxed">{slide.subtitle}</p>
                        <Link href={slide.link}>
                          <Button size="xl" className="bg-white text-zinc-950 hover:bg-zinc-100 shadow-2xl hover:scale-105 transition-all duration-300 rounded-full px-10 py-4 font-bold text-base tracking-wide">
                            {slide.cta} <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>

            {/* Slide Controls */}
            <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
              <button onClick={() => setHeroSlide((p) => (p - 1 + 3) % 3)} className="p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {[0, 1, 2].map((i) => (
                <button key={i} onClick={() => setHeroSlide(i)} className={cn("h-2 rounded-full transition-all duration-300", heroSlide === i ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60")} />
              ))}
              <button onClick={() => setHeroSlide((p) => (p + 1) % 3)} className="p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Truck, title: "Free Shipping", desc: "On orders over Rs. 5,000", color: "from-blue-500 to-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
              { icon: Shield, title: "Secure Payment", desc: "100% secure checkout", color: "from-emerald-500 to-emerald-600", bgColor: "bg-emerald-50 dark:bg-emerald-900/20" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7-day return policy", color: "from-orange-500 to-orange-600", bgColor: "bg-orange-50 dark:bg-orange-900/20" },
              { icon: Headphones, title: "24/7 Support", desc: "Dedicated support team", color: "from-purple-500 to-purple-600", bgColor: "bg-purple-50 dark:bg-purple-900/20" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className={cn("p-2.5 rounded-xl", item.bgColor)}>
                  <div className={cn("bg-gradient-to-br p-1 rounded-lg text-white", item.color)}>
                    <item.icon className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-8">
            <Badge className="mb-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Browse</Badge>
            <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
            <p className="text-gray-500 mt-2">Browse our wide range of categories</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-3">
            {categories.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} className="group">
                <motion.div variants={fadeUp} className="flex flex-col items-center gap-2.5 p-3 rounded-2xl hover:bg-white dark:hover:bg-dark-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-gray-100 dark:hover:border-dark-border">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-red-500/20 transition-all duration-300">
                    <cat.icon className="h-6 w-6 text-red-600" />
                  </div>
                  <span className="text-[11px] font-medium text-center leading-tight group-hover:text-red-600 transition-colors">{cat.name}</span>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Flash Sale Banner with Working Countdown */}
      <section className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-700 via-red-600 to-black p-6 md:p-10 shadow-xl shadow-red-500/10">
            <div className="absolute inset-0 opacity-20">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="absolute rounded-full bg-white" style={{ width: Math.random() * 30 + 10, height: Math.random() * 30 + 10, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: Math.random() * 0.4 + 0.1 }} />
              ))}
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-full bg-white/20">
                    <Flame className="h-5 w-5 animate-pulse" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider">Flash Sale</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">Up to 70% Off</h2>
                <p className="text-white/80">Limited time deals. Don&apos;t miss out!</p>
              </div>
              <div className="flex gap-3">
                {[
                  { val: pad(countdown.hours), label: "HRS" },
                  { val: pad(countdown.minutes), label: "MIN" },
                  { val: pad(countdown.seconds), label: "SEC" },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-18 h-18 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center min-w-[72px] min-h-[72px] shadow-inner">
                      <span className="text-3xl font-bold text-white tabular-nums">{item.val}</span>
                    </div>
                    <span className="text-[10px] text-white/70 mt-1.5 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
              <Link href="/products?discount=true">
                <Button size="lg" className="bg-white text-rose-600 hover:bg-gray-100 shadow-xl rounded-full px-8 font-semibold">
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="mb-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Curated</Badge>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-red-500" /> Featured Products
              </h2>
              <p className="text-gray-500 mt-1">Hand-picked products just for you</p>
            </div>
            <Link href="/products?isFeatured=true">
              <Button variant="outline" className="gap-2 rounded-full">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          {loading ? <ProductGridSkeleton /> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.slice(0, 8).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
          {!loading && featuredProducts.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Products will appear here once added by sellers.</p>
            </div>
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/products?isNew=true" className="group">
              <div className="rounded-3xl bg-gradient-to-br from-red-700 via-red-600 to-black p-8 md:p-10 text-white relative overflow-hidden group-hover:shadow-xl group-hover:shadow-red-500/20 transition-all duration-300">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">New Arrivals</h3>
                  <p className="text-white/80 mb-6">Discover the latest trends and styles</p>
                  <Button className="bg-white text-red-600 hover:bg-gray-100 rounded-full">Explore <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>
            </Link>
            <Link href="/seller" className="group">
              <div className="rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-red-700 p-8 md:p-10 text-white relative overflow-hidden group-hover:shadow-xl group-hover:shadow-gray-500/20 transition-all duration-300">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-2">Become a Seller</h3>
                  <p className="text-white/80 mb-6">Start selling to millions of customers today</p>
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-full">Start Selling <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="mb-2 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Just In</Badge>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Clock className="h-6 w-6 text-green-500" /> New Arrivals
              </h2>
              <p className="text-gray-500 mt-1">Fresh stock just for you</p>
            </div>
            <Link href="/products?isNew=true">
              <Button variant="outline" className="gap-2 rounded-full">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          {loading ? <ProductGridSkeleton /> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.slice(0, 8).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-10 bg-gray-50 dark:bg-dark-card/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Badge className="mb-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Popular</Badge>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-orange-500" /> Best Sellers
              </h2>
              <p className="text-gray-500 mt-1">Most popular products this month</p>
            </div>
            <Link href="/products?sort=best_sellers">
              <Button variant="outline" className="gap-2 rounded-full">View All <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          {loading ? <ProductGridSkeleton /> : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.slice(0, 8).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm"
              >
                <div className="inline-flex p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 mb-3">
                  <stat.icon className="h-6 w-6 text-red-600" />
                </div>
                <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <Badge className="mb-3 bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Reviews</Badge>
            <h2 className="text-2xl md:text-3xl font-bold">What Our Customers Say</h2>
            <p className="text-gray-500 mt-2">Trusted by thousands of happy customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex mb-3">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">&quot;{review.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold", review.color)}>
                    {review.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{review.name}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">Verified Buyer</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Partners Marquee */}
      <section className="py-10 border-t border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400 mb-8 uppercase tracking-widest">Trusted Brands</p>
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {["Apple", "Samsung", "Nike", "Adidas", "Sony", "LG", "Dell", "HP", "Xiaomi", "Puma", "Apple", "Samsung", "Nike", "Adidas", "Sony", "LG"].map((brand, i) => (
              <span key={i} className="text-xl font-bold text-gray-300 dark:text-gray-700">{brand}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
