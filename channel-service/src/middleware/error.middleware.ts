import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utilities/response.utility.js";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  console.error(`[ERROR] ${err.message}`, err.stack);
  sendError(res, "Internal server error", 500, err.message);
};
