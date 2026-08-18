import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction): void => {
  console.error("Error:", err);

  if (err.name === "CastError") {
    sendError(res, 400, "Invalid ID format");
    return;
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    sendError(res, 409, `${field} already exists`);
    return;
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    sendError(res, 400, messages.join(", "));
    return;
  }

  if (err.name === "JsonWebTokenError") {
    sendError(res, 401, "Invalid token");
    return;
  }

  if (err.name === "TokenExpiredError") {
    sendError(res, 401, "Token expired");
    return;
  }

  sendError(res, err.statusCode || 500, err.message || "Internal server error");
};
