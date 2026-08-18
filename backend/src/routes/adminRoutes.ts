import { Router } from "express";
import * as adminController from "../controllers/adminController";
import * as authMiddleware from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createCouponSchema, updateCategorySchema, createCategorySchema } from "../validations/order";

const router = Router();

router.use(authMiddleware.authenticate, authMiddleware.authorize("admin"));

router.get("/dashboard", adminController.getDashboardStats);

router.get("/users", adminController.getAllUsers);
router.put("/users/:id/status", adminController.updateUserStatus);
router.put("/users/:id/role", adminController.updateUserRole);

router.get("/categories", adminController.adminGetAllCategories);
router.post("/categories", validate(createCategorySchema), adminController.adminCreateCategory);
router.put("/categories/:id", validate(updateCategorySchema), adminController.adminUpdateCategory);
router.delete("/categories/:id", adminController.adminDeleteCategory);

router.get("/coupons", adminController.adminGetAllCoupons);
router.post("/coupons", validate(createCouponSchema), adminController.adminCreateCoupon);
router.put("/coupons/:id", adminController.adminUpdateCoupon);
router.delete("/coupons/:id", adminController.adminDeleteCoupon);

router.get("/reviews", adminController.adminGetAllReviews);
router.put("/reviews/:id/approval", adminController.adminToggleReviewApproval);

router.get("/products", adminController.adminGetAllProducts);
router.delete("/products/:id", adminController.adminDeleteProduct);

router.get("/orders", adminController.adminGetAllOrders);

export default router;
