import { Router } from "express";
import * as authController from "../controllers/authController";
import * as authMiddleware from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, updateProfileSchema, addAddressSchema, updateAddressSchema } from "../validations/auth";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/google", authController.googleAuth);
router.post("/logout", authController.logout);
router.post("/refresh-token", authController.refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

router.get("/me", authMiddleware.authenticate, authController.getMe);
router.put("/update-profile", authMiddleware.authenticate, validate(updateProfileSchema), authController.updateProfile);
router.put("/change-password", authMiddleware.authenticate, validate(changePasswordSchema), authController.changePassword);

router.post("/address", authMiddleware.authenticate, validate(addAddressSchema), authController.addAddress);
router.put("/address/:id", authMiddleware.authenticate, validate(updateAddressSchema), authController.updateAddress);
router.delete("/address/:id", authMiddleware.authenticate, authController.deleteAddress);

router.post("/wishlist/:productId", authMiddleware.authenticate, authController.toggleWishlist);

router.get("/wallet", authMiddleware.authenticate, authController.getWallet);
router.post("/wallet/add-funds", authMiddleware.authenticate, authController.addFunds);

export default router;
