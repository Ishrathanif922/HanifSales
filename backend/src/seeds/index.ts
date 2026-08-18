import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/database";
import Category from "../models/Category";
import Brand from "../models/Brand";
import User from "../models/User";
import Product from "../models/Product";

const categories = [
  "Electronics", "Shoes", "Fashion", "Men Clothing", "Women Clothing",
  "Kids", "Beauty", "Health", "Sports", "Furniture",
  "Kitchen", "Home Decor", "Books", "Gaming", "Laptops",
  "Mobiles", "Tablets", "Earbuds", "Headphones", "Watches",
  "Jewelry", "Bags", "Groceries", "Pet Supplies", "Automotive",
  "Stationery", "Accessories", "Toys", "Baby Products",
];

const brands = [
  "Apple", "Samsung", "Nike", "Adidas", "Puma",
  "Zara", "H&M", "Sony", "LG", "Dell",
  "HP", "Lenovo", "Xiaomi", "OnePlus", "Boat",
  "JBL", "Logitech", "Canon", "Nikon", "Dyson",
];

const seed = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    await Category.deleteMany({});
    await Brand.deleteMany({});
    await Product.deleteMany({});

    const createdCategories = await Category.insertMany(
      categories.map((name) => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        isActive: true,
        level: 0,
      }))
    );
    console.log(`${createdCategories.length} categories created`);

    const createdBrands = await Brand.insertMany(
      brands.map((name) => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        isActive: true,
      }))
    );
    console.log(`${createdBrands.length} brands created`);

    let admin = await User.findOne({ email: "admin@hanifsales.com" });
    if (!admin) {
      admin = await User.create({
        name: "Admin",
        email: "admin@hanifsales.com",
        password: "admin123",
        role: "admin",
        isVerified: true,
      });
      console.log("Admin user created");
    }

    let seller = await User.findOne({ email: "seller@hanifsales.com" });
    if (!seller) {
      seller = await User.create({
        name: "Demo Seller",
        email: "seller@hanifsales.com",
        password: "seller123",
        role: "seller",
        isVerified: true,
      });
      console.log("Seller user created");
    }

    const sampleProducts = [
      { name: "iPhone 15 Pro Max", category: "Mobiles", brand: "Apple", price: 289999, stock: 50, description: "Latest Apple flagship with A17 Pro chip, titanium design, and advanced camera system.", tags: ["phone", "apple", "flagship"], isFeatured: true, isNewArrival: true, discount: 5, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=60" },
      { name: "Samsung Galaxy S24 Ultra", category: "Mobiles", brand: "Samsung", price: 259999, stock: 35, description: "Samsung's premium smartphone with S Pen, AI features, and stunning display.", tags: ["phone", "samsung", "flagship"], isFeatured: true, discount: 8, image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=60" },
      { name: "MacBook Pro M3", category: "Laptops", brand: "Apple", price: 449999, stock: 20, description: "Powerful laptop with M3 chip for professionals and creators.", tags: ["laptop", "apple", "professional"], isFeatured: true, isBestSeller: true, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60" },
      { name: "Nike Air Max 270", category: "Shoes", brand: "Nike", price: 18999, stock: 100, description: "Iconic lifestyle shoe with Max Air unit for all-day comfort.", tags: ["shoes", "nike", "running"], isBestSeller: true, discount: 15, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60" },
      { name: "Sony WH-1000XM5", category: "Headphones", brand: "Sony", price: 69999, stock: 40, description: "Industry-leading noise cancelling headphones with exceptional sound quality.", tags: ["headphones", "sony", "noise-cancelling"], isFeatured: true, isNewArrival: true, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60" },
      { name: "Dell XPS 15", category: "Laptops", brand: "Dell", price: 329999, stock: 15, description: "Premium ultrabook with stunning InfinityEdge display.", tags: ["laptop", "dell", "ultrabook"], isFeatured: true, image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=60" },
      { name: "Boat Airdopes 141", category: "Earbuds", brand: "Boat", price: 1299, stock: 200, description: "True wireless earbuds with ENx noise cancellation and 42h playback.", tags: ["earbuds", "boat", "wireless"], isBestSeller: true, discount: 40, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=60" },
      { name: "Dyson V15 Detect", category: "Home Decor", brand: "Dyson", price: 94999, stock: 25, description: "Cordless vacuum with laser dust detection and LCD screen.", tags: ["vacuum", "dyson", "cleaning"], isNewArrival: true, image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&auto=format&fit=crop&q=60" },
      { name: "Canon EOS R50", category: "Electronics", brand: "Canon", price: 134999, stock: 12, description: "Compact mirrorless camera with 24.2MP sensor and 4K video.", tags: ["camera", "canon", "mirrorless"], isFeatured: true, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=60" },
      { name: "Zara Leather Jacket", category: "Men Clothing", brand: "Zara", price: 15999, stock: 30, description: "Premium faux leather jacket for a modern, edgy look.", tags: ["jacket", "zara", "men"], isNewArrival: true, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=60" },
      { name: "Samsung 65\" OLED TV", category: "Electronics", brand: "Samsung", price: 349999, stock: 10, description: "Stunning 4K OLED smart TV with Infinity Screen design.", tags: ["tv", "samsung", "oled"], isFeatured: true, discount: 10, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=60" },
    ];

    const createdProducts = await Product.insertMany(
      sampleProducts.map((p) => ({
        ...p,
        slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        seller: seller._id,
        category: createdCategories.find((c) => c.name === p.category)?._id || createdCategories[0]._id,
        brand: createdBrands.find((b) => b.name === p.brand)?._id || createdBrands[0]._id,
        images: [{ url: p.image, public_id: "seed-" + Math.random() }],
        avgRating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        numReviews: Math.floor(Math.random() * 200),
        numSold: Math.floor(Math.random() * 500),
        isActive: true,
        comparePrice: p.price * 1.2,
        lowStockThreshold: 10,
        specifications: [
          { key: "Brand", value: p.brand },
          { key: "Model", value: p.name },
        ],
      }))
    );
    console.log(`${createdProducts.length} products created`);

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seed();
