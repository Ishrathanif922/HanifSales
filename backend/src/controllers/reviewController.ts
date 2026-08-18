import { Response } from "express";
import { IAuthRequest } from "../types";
import Review from "../models/Review";
import Product from "../models/Product";
import Order from "../models/Order";
import { sendSuccess, sendError } from "../utils/response";
import { paginate } from "../utils/helpers";

export const createReview = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { rating, title, comment } = req.body;

    const existingReview = await Review.findOne({ user: req.user?._id, product: productId });
    if (existingReview) {
      sendError(res, 400, "You have already reviewed this product");
      return;
    }

    const order = await Order.findOne({
      user: req.user?._id,
      "items.product": productId,
      orderStatus: "delivered",
    });

    const review = await Review.create({
      user: req.user?._id,
      product: productId,
      rating,
      title,
      comment,
      isVerifiedPurchase: !!order,
    });

    const reviews = await Review.find({ product: productId, isApproved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      avgRating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });

    sendSuccess(res, 201, "Review created", review);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getProductReviews = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "10" } = req.query as Record<string, string>;
    const { skip, limit: lim } = paginate(Number(page), Number(limit));

    const [reviews, total] = await Promise.all([
      Review.find({ product: req.params.productId, isApproved: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(lim)
        .populate("user", "name avatar"),
      Review.countDocuments({ product: req.params.productId, isApproved: true }),
    ]);

    sendSuccess(res, 200, "Reviews fetched", reviews, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const markHelpful = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { $inc: { helpfulVotes: 1 } },
      { new: true }
    );

    if (!review) {
      sendError(res, 404, "Review not found");
      return;
    }

    sendSuccess(res, 200, "Marked as helpful", review);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const reportReview = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      sendError(res, 404, "Review not found");
      return;
    }

    if (review.reportedBy.includes(req.user?._id as any)) {
      sendError(res, 400, "Already reported");
      return;
    }

    review.reportedBy.push(req.user?._id as any);
    await review.save();

    sendSuccess(res, 200, "Review reported");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const deleteReview = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.role === "admin";
    const filter: any = { _id: req.params.reviewId };
    if (!isAdmin) {
      filter.user = req.user?._id;
    }

    const review = await Review.findOneAndDelete(filter);

    if (!review) {
      sendError(res, 404, "Review not found or unauthorized");
      return;
    }

    const reviews = await Review.find({ product: review.product, isApproved: true });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    await Product.findByIdAndUpdate(review.product, {
      avgRating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });

    sendSuccess(res, 200, "Review deleted");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
