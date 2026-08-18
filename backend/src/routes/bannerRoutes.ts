import { Router } from "express";
import * as bannerController from "../controllers/bannerController";
import * as authMiddleware from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createBannerSchema } from "../validations/misc";

const router = Router();

router.get("/", bannerController.getBanners);

const adminRouter = Router();
adminRouter.use(authMiddleware.authenticate, authMiddleware.authorize("admin"));
adminRouter.get("/", bannerController.adminGetAllBanners);
adminRouter.post("/", validate(createBannerSchema), bannerController.adminCreateBanner);
adminRouter.put("/:id", bannerController.adminUpdateBanner);
adminRouter.delete("/:id", bannerController.adminDeleteBanner);

export { adminRouter as adminBannerRoutes };
export default router;
