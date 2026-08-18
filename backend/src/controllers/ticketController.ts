import { Response } from "express";
import { IAuthRequest } from "../types";
import SupportTicket from "../models/SupportTicket";
import { sendSuccess, sendError } from "../utils/response";
import { paginate } from "../utils/helpers";

export const createTicket = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await SupportTicket.create({ ...req.body, user: req.user?._id });
    sendSuccess(res, 201, "Ticket created", ticket);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getMyTickets = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const tickets = await SupportTicket.find({ user: req.user?._id }).sort({ createdAt: -1 });
    sendSuccess(res, 200, "Tickets fetched", tickets);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getTicketById = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await SupportTicket.findById(req.params.id).populate("replies.user", "name avatar role");
    if (!ticket) {
      sendError(res, 404, "Ticket not found");
      return;
    }
    sendSuccess(res, 200, "Ticket fetched", ticket);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const replyToTicket = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      sendError(res, 404, "Ticket not found");
      return;
    }

    ticket.replies.push({ user: req.user?._id as any, message: req.body.message, createdAt: new Date() });
    ticket.status = "in_progress";
    await ticket.save();

    sendSuccess(res, 200, "Reply added", ticket);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const getAllTickets = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const { page = "1", limit = "20", status } = req.query as Record<string, string>;
    const filter: any = {};
    if (status) filter.status = status;

    const { skip, limit: lim } = paginate(Number(page), Number(limit));
    const [tickets, total] = await Promise.all([
      SupportTicket.find(filter).sort({ createdAt: -1 }).skip(skip).limit(lim).populate("user", "name email"),
      SupportTicket.countDocuments(filter),
    ]);

    sendSuccess(res, 200, "Tickets fetched", tickets, {
      page: Number(page), limit: Number(limit), total, totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const updateTicketStatus = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!ticket) {
      sendError(res, 404, "Ticket not found");
      return;
    }
    sendSuccess(res, 200, "Ticket status updated", ticket);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
