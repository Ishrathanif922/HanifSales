import { Router } from "express";
import * as brandController from "../controllers/brandController";
import * as authMiddleware from "../middleware/auth";

const router = Router();

router.get("/", brandController.getBrands);
router.get("/:slug", brandController.getBrandBySlug);

const adminRouter = Router();
adminRouter.use(authMiddleware.authenticate, authMiddleware.authorize("admin"));
adminRouter.get("/", brandController.adminGetAllBrands);
adminRouter.post("/", brandController.adminCreateBrand);
adminRouter.put("/:id", brandController.adminUpdateBrand);
adminRouter.delete("/:id", brandController.adminDeleteBrand);

export { adminRouter as adminBrandRoutes };
export default router;
