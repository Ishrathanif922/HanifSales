import { Router } from "express";
import * as notificationController from "../controllers/notificationController";
import * as authMiddleware from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware.authenticate, notificationController.getNotifications);
router.put("/:id/read", authMiddleware.authenticate, notificationController.markAsRead);
router.put("/read-all", authMiddleware.authenticate, notificationController.markAllAsRead);
router.delete("/:id", authMiddleware.authenticate, notificationController.deleteNotification);

export default router;
