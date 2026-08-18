import { Request, Response, NextFunction } from "express";
import { IAuthRequest } from "../types";
import User from "../models/User";
import { verifyAccessToken } from "../utils/tokens";
import { sendError } from "../utils/response";

export const authenticate = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      sendError(res, 401, "Please login to access this resource");
      return;
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      sendError(res, 401, "User not found");
      return;
    }

    if (!user.isActive) {
      sendError(res, 403, "Account has been deactivated");
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    sendError(res, 401, "Invalid or expired token");
  }
};

export const authorize = (...roles: string[]) => {
  return (req: IAuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      sendError(res, 403, "You do not have permission to access this resource");
      return;
    }
    next();
  };
};

export const optionalAuth = async (req: IAuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch {
    // Continue without user
  }
  next();
};
