import { Router } from "express";
import * as blogController from "../controllers/blogController";
import * as authMiddleware from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createBlogSchema } from "../validations/misc";

const router = Router();

router.get("/", blogController.getBlogs);
router.get("/:slug", blogController.getBlogBySlug);

const adminRouter = Router();
adminRouter.use(authMiddleware.authenticate, authMiddleware.authorize("admin"));
adminRouter.get("/", blogController.adminGetAllBlogs);
adminRouter.post("/", validate(createBlogSchema), blogController.adminCreateBlog);
adminRouter.put("/:id", blogController.adminUpdateBlog);
adminRouter.delete("/:id", blogController.adminDeleteBlog);

export { adminRouter as adminBlogRoutes };
export default router;
