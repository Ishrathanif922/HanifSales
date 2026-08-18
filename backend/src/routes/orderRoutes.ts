import { Router } from "express";
import * as orderController from "../controllers/orderController";
import * as authMiddleware from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createOrderSchema, updateOrderStatusSchema } from "../validations/order";

const router = Router();

router.post("/webhook", orderController.stripeWebhook);

router.post("/", authMiddleware.authenticate, validate(createOrderSchema), orderController.createOrder);
router.get("/my-orders", authMiddleware.authenticate, orderController.getMyOrders);
router.get("/seller-orders", authMiddleware.authenticate, authMiddleware.authorize("seller"), orderController.getSellerOrders);
router.get("/admin/all", authMiddleware.authenticate, authMiddleware.authorize("admin"), orderController.getAllOrders);
router.get("/:id", authMiddleware.authenticate, orderController.getOrderById);
router.put("/:id/cancel", authMiddleware.authenticate, orderController.cancelOrder);
router.put("/:id/refund", authMiddleware.authenticate, orderController.requestRefund);
router.put("/:id/refund/approve", authMiddleware.authenticate, authMiddleware.authorize("admin"), orderController.approveRefund);
router.put("/:id/refund/reject", authMiddleware.authenticate, authMiddleware.authorize("admin"), orderController.rejectRefund);
router.put("/:id/status", authMiddleware.authenticate, authMiddleware.authorize("seller", "admin"), validate(updateOrderStatusSchema), orderController.updateOrderStatus);

export default router;
