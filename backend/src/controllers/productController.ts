import { Response } from "express";
import { IAuthRequest } from "../types";
import Product from "../models/Product";
import { sendSuccess, sendError } from "../utils/response";
import { paginate } from "../utils/helpers";

export const createProduct = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.create({ ...req.body, seller: req.user?._id });
    sendSuccess(res, 201, "Product created", product);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getProducts = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = "1", limit = "20", sort, category, brand,
      minPrice, maxPrice, search, rating, discount, isNew, isFeatured,
    } = req.query as Record<string, string>;

    const filter: any = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }
    if (rating) filter.avgRating = { $gte: Number(rating) };
    if (discount) filter.discount = { $gte: Number(discount) };
    if (isNew === "true") filter.isNewArrival = true;
    if (isFeatured === "true") filter.isFeatured = true;

    const sortOption: any = {};
    switch (sort) {
      case "price_low": sortOption.price = 1; break;
      case "price_high": sortOption.price = -1; break;
      case "rating": sortOption.avgRating = -1; break;
      case "popularity": sortOption.numSold = -1; break;
      case "best_sellers": sortOption.numSold = -1; break;
      case "newest": default: sortOption.createdAt = -1; break;
    }

    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(lim)
        .populate("category", "name slug")
        .populate("brand", "name slug")
        .populate("seller", "name avatar"),
      Product.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Products fetched", products, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getProductBySlug = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate("category", "name slug")
      .populate("subCategory", "name slug")
      .populate("brand", "name slug")
      .populate("seller", "name avatar phone");

    if (!product) {
      sendError(res, 404, "Product not found");
      return;
    }

    sendSuccess(res, 200, "Product fetched", product);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const updateProduct = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, seller: req.user?._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!product) {
      sendError(res, 404, "Product not found or unauthorized");
      return;
    }

    sendSuccess(res, 200, "Product updated", product);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const deleteProduct = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user?._id });
    if (!product) {
      sendError(res, 404, "Product not found or unauthorized");
      return;
    }
    sendSuccess(res, 200, "Product deleted");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getFeaturedProducts = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .populate("category", "name slug")
      .populate("brand", "name slug");
    sendSuccess(res, 200, "Featured products", products);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getNewArrivals = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isNewArrival: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .populate("category", "name slug")
      .populate("brand", "name slug");
    sendSuccess(res, 200, "New arrivals", products);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getBestSellers = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isBestSeller: true, isActive: true })
      .sort({ numSold: -1 })
      .limit(12)
      .populate("category", "name slug")
      .populate("brand", "name slug");
    sendSuccess(res, 200, "Best sellers", products);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getRelatedProducts = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      sendError(res, 404, "Product not found");
      return;
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      isActive: true,
    })
      .limit(8)
      .populate("category", "name slug")
      .populate("brand", "name slug");

    sendSuccess(res, 200, "Related products", related);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getMyProducts = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const filter: any = { seller: req.user?._id };

    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim)
        .populate("category", "name slug")
        .populate("brand", "name slug"),
      Product.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Products fetched", products, {
      page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const searchProducts = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { q } = req.query as { q: string };
    if (!q) {
      sendError(res, 400, "Search query is required");
      return;
    }

    const products = await Product.find({
      $text: { $search: q },
      isActive: true,
    })
      .limit(20)
      .populate("category", "name slug")
      .populate("brand", "name slug");

    sendSuccess(res, 200, "Search results", products);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
