import { Response } from "express";
import { IAuthRequest } from "../types";
import Category from "../models/Category";
import { sendSuccess, sendError } from "../utils/response";

export const getCategories = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true, level: 0 }).sort({ name: 1 });
    const categoryIds = categories.map((c) => c._id);
    const subCategories = await Category.find({ parent: { $in: categoryIds }, isActive: true }).sort({ name: 1 });

    const result = categories.map((cat) => ({
      ...cat.toObject(),
      subCategories: subCategories.filter((sub) => sub.parent?.toString() === cat._id.toString()),
    }));

    sendSuccess(res, 200, "Categories fetched", result);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getCategoryBySlug = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      sendError(res, 404, "Category not found");
      return;
    }

    const subcategories = await Category.find({ parent: category._id, isActive: true });

    sendSuccess(res, 200, "Category fetched", { category, subcategories });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
