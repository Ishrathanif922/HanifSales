import { Response } from "express";
import { IAuthRequest } from "../types";
import Banner from "../models/Banner";
import { cloudinary } from "../config/cloudinary";
import { sendSuccess, sendError } from "../utils/response";
import { paginate } from "../utils/helpers";

export const getBanners = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { position } = req.query as { position?: string };
    const filter: any = { isActive: true };
    if (position) filter.position = position;

    filter.$or = [
      { startDate: { $exists: false } },
      { startDate: { $lte: new Date() } },
    ];
    filter.$and = [
      { $or: [{ endDate: { $exists: false } }, { endDate: { $gte: new Date() } }] },
    ];

    const banners = await Banner.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, 200, "Banners fetched", banners);
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
    if (!banner) {
      sendError(res, 404, "Banner not found");
      return;
    }
    sendSuccess(res, 200, "Banner updated", banner);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const adminDeleteBanner = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      sendError(res, 404, "Banner not found");
      return;
    }
    if ((banner as any).image?.public_id) {
      try { await cloudinary.uploader.destroy((banner as any).image.public_id); } catch {}
    }
    sendSuccess(res, 200, "Banner deleted");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
