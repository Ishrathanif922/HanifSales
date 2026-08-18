export const ROLES = {
  CUSTOMER: "customer",
  SELLER: "seller",
  ADMIN: "admin",
} as const;

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PROCESSING: "processing",
  PACKED: "packed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const PAYMENT_METHODS = {
  STRIPE: "stripe",
  COD: "cod",
  WALLET: "wallet",
} as const;

export const PRODUCT_SORT_OPTIONS = {
  NEWEST: "newest",
  PRICE_LOW: "price_low",
  PRICE_HIGH: "price_high",
  POPULARITY: "popularity",
  RATING: "rating",
  BEST_SELLERS: "best_sellers",
} as const;

export const ITEMS_PER_PAGE = 20;

export const CATEGORIES = [
  "Electronics", "Shoes", "Fashion", "Men Clothing", "Women Clothing",
  "Kids", "Beauty", "Health", "Sports", "Furniture",
  "Kitchen", "Home Decor", "Books", "Gaming", "Laptops",
  "Mobiles", "Tablets", "Earbuds", "Headphones", "Watches",
  "Jewelry", "Bags", "Groceries", "Pet Supplies", "Automotive",
  "Stationery", "Accessories", "Toys", "Baby Products",
] as const;
