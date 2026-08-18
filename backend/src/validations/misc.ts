import { z } from "zod";

export const createSupportTicketSchema = z.object({
  body: z.object({
    subject: z.string().min(5).max(200),
    message: z.string().min(10).max(5000),
    priority: z.enum(["low", "medium", "high"]).optional(),
  }),
});

export const replyTicketSchema = z.object({
  body: z.object({
    message: z.string().min(1).max(5000),
  }),
  params: z.object({
    id: z.string(),
  }),
});

export const createBannerSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(100),
    subtitle: z.string().max(200).optional(),
    link: z.string().optional(),
    position: z.enum(["hero", "sidebar", "footer", "popup"]),
    isActive: z.boolean().optional(),
    startDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
    endDate: z.string().optional().transform((str) => str ? new Date(str) : undefined),
  }),
});

export const createBlogSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(200),
    content: z.string().min(50),
    excerpt: z.string().min(20).max(500),
    tags: z.array(z.string()).optional(),
    isPublished: z.boolean().optional(),
  }),
});
