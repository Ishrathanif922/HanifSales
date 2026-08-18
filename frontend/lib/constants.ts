export const navLinks = [
  { href: "/products", label: "All Products" },
  { href: "/products?isNew=true", label: "New Arrivals" },
  { href: "/products?isFeatured=true", label: "Featured" },
  { href: "/products?sort=best_sellers", label: "Best Sellers" },
  { href: "/blog", label: "Blog" },
];

import {
  Smartphone, Shirt, Laptop, Headphones, Watch, Home, Gamepad2, BookOpen,
  Baby, Dog, Car, Gem, ShoppingBag, UtensilsCrossed, Dumbbell, Armchair,
  Palette, Sparkles, HeartPulse, Box
} from "lucide-react";

export const categories = [
  { name: "Electronics", slug: "electronics", icon: Smartphone },
  { name: "Fashion", slug: "fashion", icon: Shirt },
  { name: "Laptops", slug: "laptops", icon: Laptop },
  { name: "Headphones", slug: "headphones", icon: Headphones },
  { name: "Watches", slug: "watches", icon: Watch },
  { name: "Home", slug: "home-decor", icon: Home },
  { name: "Gaming", slug: "gaming", icon: Gamepad2 },
  { name: "Books", slug: "books", icon: BookOpen },
  { name: "Baby", slug: "baby-products", icon: Baby },
  { name: "Pet Supplies", slug: "pet-supplies", icon: Dog },
  { name: "Automotive", slug: "automotive", icon: Car },
  { name: "Jewelry", slug: "jewelry", icon: Gem },
  { name: "Bags", slug: "bags", icon: ShoppingBag },
  { name: "Kitchen", slug: "kitchen", icon: UtensilsCrossed },
  { name: "Sports", slug: "sports", icon: Dumbbell },
  { name: "Furniture", slug: "furniture", icon: Armchair },
  { name: "Beauty", slug: "beauty", icon: Palette },
  { name: "Accessories", slug: "accessories", icon: Sparkles },
  { name: "Health", slug: "health", icon: HeartPulse },
  { name: "Toys", slug: "toys", icon: Box },
];
