import { Response } from "express";
import { IAuthRequest } from "../types";
import User from "../models/User";
import Product from "../models/Product";
import Order from "../models/Order";
import Category from "../models/Category";
import Review from "../models/Review";
import Coupon from "../models/Coupon";
import Banner from "../models/Banner";
import Blog from "../models/Blog";
import { cloudinary } from "../config/cloudinary";
import { sendSuccess, sendError } from "../utils/response";
import { paginate } from "../utils/helpers";

const deleteCloudinaryImages = async (images: { public_id?: string }[]) => {
  for (const img of images) {
    if (img.public_id) {
      try { await cloudinary.uploader.destroy(img.public_id); } catch {}
    }
  }
};

export const getDashboardStats = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders,
      recentOrders,
      monthlyRevenue,
    ] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "seller" }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.countDocuments({ orderStatus: "pending" }),
      Order.find().sort({ createdAt: -1 }).limit(10).populate("user", "name email"),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, paymentStatus: "paid" } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    sendSuccess(res, 200, "Dashboard stats", {
      totalUsers,
      totalSellers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      recentOrders,
      monthlyRevenue,
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getAllUsers = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20", role, search } = req.query as Record<string, string>;
    const filter: any = {};
    if (role) filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];

    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim).select("-password"),
      User.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Users fetched", users, {
      page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const updateUserStatus = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: req.body.isActive },
      { new: true }
    ).select("-password");

    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    sendSuccess(res, 200, "User status updated", user);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const updateUserRole = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true }
    ).select("-password");

    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    sendSuccess(res, 200, "User role updated", user);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminCreateCategory = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { name, parent, description } = req.body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    let level = 0;
    if (parent) {
      const parentCat = await Category.findById(parent);
      if (parentCat) level = parentCat.level + 1;
    }

    const category = await Category.create({ name, slug, parent: parent || null, description, level });
    sendSuccess(res, 201, "Category created", category);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminUpdateCategory = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) {
      sendError(res, 404, "Category not found");
      return;
    }
    sendSuccess(res, 200, "Category updated", category);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminDeleteCategory = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      sendError(res, 404, "Category not found");
      return;
    }
    sendSuccess(res, 200, "Category deleted");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminGetAllCategories = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await Category.find().sort({ level: 1, name: 1 }).populate("parent", "name");
    sendSuccess(res, 200, "Categories fetched", categories);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminCreateCoupon = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.create(req.body);
    sendSuccess(res, 201, "Coupon created", coupon);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminGetAllCoupons = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [coupons, total] = await Promise.all([
      Coupon.find().sort({ createdAt: -1 }).skip(skip).limit(lim),
      Coupon.countDocuments(),
    ]);
    sendSuccess(res, 200, "Coupons fetched", coupons, {
      page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminUpdateCoupon = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) {
      sendError(res, 404, "Coupon not found");
      return;
    }
    sendSuccess(res, 200, "Coupon updated", coupon);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminDeleteCoupon = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) {
      sendError(res, 404, "Coupon not found");
      return;
    }
    sendSuccess(res, 200, "Coupon deleted");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminGetAllReviews = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [reviews, total] = await Promise.all([
      Review.find().sort({ createdAt: -1 }).skip(skip).limit(lim)
        .populate("user", "name email")
        .populate("product", "name slug"),
      Review.countDocuments(),
    ]);
    sendSuccess(res, 200, "Reviews fetched", reviews, {
      page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminToggleReviewApproval = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
    if (!review) {
      sendError(res, 404, "Review not found");
      return;
    }
    sendSuccess(res, 200, "Review updated", review);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminGetAllProducts = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20", search } = req.query as Record<string, string>;
    const filter: any = {};
    if (search) filter.name = { $regex: search, $options: "i" };

    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim)
        .populate("category", "name slug")
        .populate("brand", "name slug")
        .populate("seller", "name email"),
      Product.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Products fetched", products, {
      page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminDeleteProduct = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      sendError(res, 404, "Product not found");
      return;
    }
    await deleteCloudinaryImages(product.images || []);
    sendSuccess(res, 200, "Product deleted");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminGetAllOrders = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20", status, search } = req.query as Record<string, string>;
    const filter: any = {};
    if (status) filter.orderStatus = status;
    if (search) filter.orderNumber = { $regex: search, $options: "i" };

    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim)
        .populate("user", "name email"),
      Order.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Orders fetched", orders, {
      page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminGetAllBanners = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [banners, total] = await Promise.all([
      Banner.find().sort({ createdAt: -1 }).skip(skip).limit(lim),
      Banner.countDocuments(),
    ]);
    sendSuccess(res, 200, "Banners fetched", banners, {
      page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminCreateBanner = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const banner = await Banner.create(req.body);
    sendSuccess(res, 201, "Banner created", banner);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminUpdateBanner = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) { sendError(res, 404, "Banner not found"); return; }
    sendSuccess(res, 200, "Banner updated", banner);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminDeleteBanner = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) { sendError(res, 404, "Banner not found"); return; }
    if ((banner as any).image?.public_id) await deleteCloudinaryImages([(banner as any).image]);
    sendSuccess(res, 200, "Banner deleted");
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
    const slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
      updateData.slug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!blog) { sendError(res, 404, "Blog not found"); return; }
    sendSuccess(res, 200, "Blog updated", blog);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminDeleteBlog = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) { sendError(res, 404, "Blog not found"); return; }
    if ((blog as any).image?.public_id) await deleteCloudinaryImages([(blog as any).image]);
    sendSuccess(res, 200, "Blog deleted");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
