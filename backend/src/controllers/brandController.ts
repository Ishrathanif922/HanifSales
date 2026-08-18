import { Response } from "express";
import { IAuthRequest } from "../types";
import Brand from "../models/Brand";
import { sendSuccess, sendError } from "../utils/response";
import { paginate, generateSlug } from "../utils/helpers";

export const getBrands = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const brands = await Brand.find({ isActive: true }).sort({ name: 1 });
    sendSuccess(res, 200, "Brands fetched", brands);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getBrandBySlug = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug, isActive: true });
    if (!brand) {
      sendError(res, 404, "Brand not found");
      return;
    }
    sendSuccess(res, 200, "Brand fetched", brand);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminGetAllBrands = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20" } = req.query as Record<string, string>;
    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [brands, total] = await Promise.all([
      Brand.find().sort({ name: 1 }).skip(skip).limit(lim),
      Brand.countDocuments(),
    ]);
    sendSuccess(res, 200, "Brands fetched", brands, {
      page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminCreateBrand = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const slug = generateSlug(req.body.name);
    const brand = await Brand.create({ ...req.body, slug });
    sendSuccess(res, 201, "Brand created", brand);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminUpdateBrand = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const updateData: any = { ...req.body };
    if (updateData.name) {
      updateData.slug = generateSlug(updateData.name);
    }
    const brand = await Brand.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!brand) {
      sendError(res, 404, "Brand not found");
      return;
    }
    sendSuccess(res, 200, "Brand updated", brand);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminDeleteBrand = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    if (!brand) {
      sendError(res, 404, "Brand not found");
      return;
    }
    sendSuccess(res, 200, "Brand deleted");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
