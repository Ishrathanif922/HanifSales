import { Router } from "express";
import * as productController from "../controllers/productController";
import * as authMiddleware from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createProductSchema, updateProductSchema } from "../validations/product";

const router = Router();

router.get("/", productController.getProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/best-sellers", productController.getBestSellers);
router.get("/search", productController.searchProducts);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/my-products", authMiddleware.authenticate, authMiddleware.authorize("seller", "admin"), productController.getMyProducts);
router.get("/:id/related", productController.getRelatedProducts);

router.post("/", authMiddleware.authenticate, authMiddleware.authorize("seller", "admin"), validate(createProductSchema), productController.createProduct);
router.put("/:id", authMiddleware.authenticate, authMiddleware.authorize("seller", "admin"), validate(updateProductSchema), productController.updateProduct);
router.delete("/:id", authMiddleware.authenticate, authMiddleware.authorize("seller", "admin"), productController.deleteProduct);

export default router;
