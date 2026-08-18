import { Router } from "express";
import * as reviewController from "../controllers/reviewController";
import * as authMiddleware from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createReviewSchema } from "../validations/order";

const router = Router();

router.post("/:productId", authMiddleware.authenticate, validate(createReviewSchema), reviewController.createReview);
router.get("/:productId", reviewController.getProductReviews);
router.put("/:reviewId/helpful", authMiddleware.authenticate, reviewController.markHelpful);
router.put("/:reviewId/report", authMiddleware.authenticate, reviewController.reportReview);
router.delete("/:reviewId", authMiddleware.authenticate, reviewController.deleteReview);

export default router;
