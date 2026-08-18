import { z } from "zod";

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string(),
    quantity: z.number().min(1).max(100).optional(),
    variant: z.string().optional(),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().min(1).max(100),
  }),
  params: z.object({
    itemId: z.string(),
  }),
});

export const applyCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3).max(20),
  }),
});
