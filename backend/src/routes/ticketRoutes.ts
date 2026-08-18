import { Router } from "express";
import * as ticketController from "../controllers/ticketController";
import * as authMiddleware from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createSupportTicketSchema, replyTicketSchema } from "../validations/misc";

const router = Router();

router.post("/", authMiddleware.authenticate, validate(createSupportTicketSchema), ticketController.createTicket);
router.get("/my-tickets", authMiddleware.authenticate, ticketController.getMyTickets);
router.get("/admin/all", authMiddleware.authenticate, authMiddleware.authorize("admin"), ticketController.getAllTickets);
router.get("/:id", authMiddleware.authenticate, ticketController.getTicketById);
router.post("/:id/reply", authMiddleware.authenticate, validate(replyTicketSchema), ticketController.replyToTicket);
router.put("/:id/status", authMiddleware.authenticate, authMiddleware.authorize("admin"), ticketController.updateTicketStatus);

export default router;
