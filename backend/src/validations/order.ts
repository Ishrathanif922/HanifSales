import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    shippingAddressId: z.string().optional(),
    shippingAddress: z.object({
      fullName: z.string().min(2),
      phone: z.string().min(5),
      address: z.string().min(5),
      city: z.string().min(2),
      state: z.string().min(2),
      zipCode: z.string().min(3),
      country: z.string().min(2),
    }).optional(),
    billingAddressId: z.string().optional(),
    billingAddress: z.object({
      fullName: z.string().min(2),
      phone: z.string().min(5),
      address: z.string().min(5),
      city: z.string().min(2),
      state: z.string().min(2),
      zipCode: z.string().min(3),
      country: z.string().min(2),
    }).optional(),
    paymentMethod: z.enum(["stripe", "cod", "wallet"]),
    couponCode: z.string().optional(),
    notes: z.string().optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum(["pending", "confirmed", "processing", "packed", "shipped", "delivered", "cancelled"]),
    trackingNumber: z.string().optional(),
    cancelReason: z.string().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    title: z.string().min(3).max(100),
    comment: z.string().min(10).max(2000),
  }),
  params: z.object({
    productId: z.string(),
  }),
});

export const createCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3).max(20).toUpperCase(),
    description: z.string().min(5),
    discountType: z.enum(["percentage", "fixed", "free_shipping"]),
    discountValue: z.number().min(0),
    minPurchase: z.number().min(0).optional(),
    maxDiscount: z.number().min(0).optional(),
    usageLimit: z.number().min(1),
    perUserLimit: z.number().min(1).optional(),
    expiresAt: z.string().transform((str) => new Date(str)),
    applicableCategories: z.array(z.string()).optional(),
  }),
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    parent: z.string().optional().nullable(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50),
    parent: z.string().optional().nullable(),
    description: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});
