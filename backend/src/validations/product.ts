import { z } from "zod";

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200),
    description: z.string().min(10),
    shortDescription: z.string().max(500).optional(),
    price: z.number().min(0),
    comparePrice: z.number().min(0).optional(),
    discount: z.number().min(0).max(100).optional(),
    costPrice: z.number().min(0).optional(),
    sku: z.string().optional(),
    barcode: z.string().optional(),
    stock: z.number().min(0),
    lowStockThreshold: z.number().min(0).optional(),
    category: z.string(),
    subCategory: z.string().optional(),
    brand: z.string().optional(),
    variants: z.array(z.object({
      name: z.string(),
      options: z.array(z.object({
        label: z.string(),
        price: z.number().optional(),
        stock: z.number().min(0),
        sku: z.string().optional(),
      })),
    })).optional(),
    specifications: z.array(z.object({
      key: z.string(),
      value: z.string(),
    })).optional(),
    tags: z.array(z.string()).optional(),
    weight: z.number().optional(),
    dimensions: z.object({
      length: z.number(),
      width: z.number(),
      height: z.number(),
    }).optional(),
    isFeatured: z.boolean().optional(),
    isNewArrival: z.boolean().optional(),
    isBestSeller: z.boolean().optional(),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).optional(),
    description: z.string().min(10).optional(),
    shortDescription: z.string().max(500).optional(),
    price: z.number().min(0).optional(),
    comparePrice: z.number().min(0).optional(),
    discount: z.number().min(0).max(100).optional(),
    stock: z.number().min(0).optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    tags: z.array(z.string()).optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const getProductsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.string().optional(),
    category: z.string().optional(),
    brand: z.string().optional(),
    minPrice: z.string().optional(),
    maxPrice: z.string().optional(),
    search: z.string().optional(),
    rating: z.string().optional(),
    discount: z.string().optional(),
    isNew: z.string().optional(),
    isFeatured: z.string().optional(),
  }).passthrough(),
});
