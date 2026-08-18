import { Router } from "express";
import * as uploadController from "../controllers/uploadController";
import * as authMiddleware from "../middleware/auth";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/image", authMiddleware.authenticate, upload.single("image"), uploadController.uploadImage);
router.post("/images", authMiddleware.authenticate, upload.array("images", 10), uploadController.uploadMultipleImages);
router.delete("/image", authMiddleware.authenticate, uploadController.deleteImage);

export default router;
