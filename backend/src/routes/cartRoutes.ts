import { Router } from "express";
import * as cartController from "../controllers/cartController";
import * as authMiddleware from "../middleware/auth";
import { validate } from "../middleware/validate";
import { addToCartSchema, updateCartItemSchema, applyCouponSchema } from "../validations/cart";

const router = Router();

router.get("/", authMiddleware.authenticate, cartController.getCart);
router.post("/add", authMiddleware.authenticate, validate(addToCartSchema), cartController.addToCart);
router.put("/item/:itemId", authMiddleware.authenticate, validate(updateCartItemSchema), cartController.updateCartItem);
router.delete("/item/:itemId", authMiddleware.authenticate, cartController.removeFromCart);
router.delete("/clear", authMiddleware.authenticate, cartController.clearCart);
router.post("/coupon/apply", authMiddleware.authenticate, validate(applyCouponSchema), cartController.applyCoupon);
router.delete("/coupon/remove", authMiddleware.authenticate, cartController.removeCoupon);

export default router;
