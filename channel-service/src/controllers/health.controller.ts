import type { Request, Response } from "express";
import { sendSuccess } from "../utilities/response.utility.js";

export const healthCheck = (_req: Request, res: Response): void => {
  sendSuccess(
    res,
    { timestamp: new Date().toISOString() },
    "Channel Service Running",
  );
};
