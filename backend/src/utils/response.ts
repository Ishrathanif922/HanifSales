import { IApiResponse } from "../types";
import { Response } from "express";

export const sendSuccess = <T>(res: Response, statusCode: number, message: string, data?: T, pagination?: any): void => {
  const response: IApiResponse<T> = { success: true, message };
  if (data !== undefined) response.data = data;
  if (pagination) response.pagination = pagination;
  res.status(statusCode).json(response);
};

export const sendError = (res: Response, statusCode: number, message: string): void => {
  const response: IApiResponse = { success: false, message };
  res.status(statusCode).json(response);
};
