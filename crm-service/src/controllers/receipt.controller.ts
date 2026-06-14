import type { Request, Response, NextFunction } from "express";
import { receiptService } from "../services/receipt.service.js";
import { sendSuccess } from "../utilities/response.utility.js";

export const handleReceipt = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await receiptService.processCallback(req.body);
    sendSuccess(res, result, "Receipt processed");
  } catch (err) {
    next(err);
  }
};
