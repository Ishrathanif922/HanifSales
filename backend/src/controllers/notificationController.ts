import { Response } from "express";
import { IAuthRequest } from "../types";
import Notification from "../models/Notification";
import { sendSuccess, sendError } from "../utils/response";

export const getNotifications = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find({ user: req.user?._id })
      .sort({ createdAt: -1 })
      .limit(50);
    sendSuccess(res, 200, "Notifications fetched", notifications);
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const markAsRead = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    sendSuccess(res, 200, "Marked as read");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const markAllAsRead = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.updateMany({ user: req.user?._id, isRead: false }, { isRead: true });
    sendSuccess(res, 200, "All marked as read");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};

export const deleteNotification = async (req: IAuthRequest, res: Response): Promise<void> => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    sendSuccess(res, 200, "Notification deleted");
  } catch (error: any) {
    sendError(res, 500, error.message);
  }
};
