import { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response";
import { ZodSchema, ZodError } from "zod";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const messages = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
        sendError(res, 400, messages.join(", "));
      } else {
        sendError(res, 400, "Validation error");
      }
    }
  };
};
