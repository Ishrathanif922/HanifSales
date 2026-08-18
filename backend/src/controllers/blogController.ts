import { Response } from "express";
import { IAuthRequest } from "../types";
import Blog from "../models/Blog";
import { cloudinary } from "../config/cloudinary";
import { sendSuccess, sendError } from "../utils/response";
import { paginate } from "../utils/helpers";
import { generateSlug } from "../utils/helpers";

export const getBlogs = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "12", tag } = req.query as Record<string, string>;
    const filter: any = { isPublished: true };
    if (tag) filter.tags = tag;

    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [blogs, total] = await Promise.all([
      Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim).populate("author", "name avatar"),
      Blog.countDocuments(filter),
    ]);
    sendSuccess(res, 200, "Blogs fetched", blogs, {
      page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getBlogBySlug = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isPublished: true })
      .populate("author", "name avatar");
    if (!blog) {
      sendError(res, 404, "Blog not found");
      return;
    }
    sendSuccess(res, 200, "Blog fetched", blog);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminGetAllBlogs = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [blogs, total] = await Promise.all([
      Blog.find().sort({ createdAt: -1 }).skip(skip).limit(lim).populate("author", "name"),
      Blog.countDocuments(),
    ]);
    sendSuccess(res, 200, "Blogs fetched", blogs, {
      page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminCreateBlog = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const slug = generateSlug(req.body.title);
    const blog = await Blog.create({ ...req.body, slug, author: req.user?._id });
    sendSuccess(res, 201, "Blog created", blog);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminUpdateBlog = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const updateData: any = { ...req.body };
    if (updateData.title) {
      updateData.slug = generateSlug(updateData.title);
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!blog) {
      sendError(res, 404, "Blog not found");
      return;
    }
    sendSuccess(res, 200, "Blog updated", blog);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminDeleteBlog = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      sendError(res, 404, "Blog not found");
      return;
    }
    if ((blog as any).image?.public_id) {
      try { await cloudinary.uploader.destroy((blog as any).image.public_id); } catch {}
    }
    sendSuccess(res, 200, "Blog deleted");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
