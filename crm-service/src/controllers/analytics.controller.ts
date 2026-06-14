import type { Request, Response, NextFunction } from "express";
import { analyticsService } from "../services/analytics.service.js";
import { sendSuccess, sendError } from "../utilities/response.utility.js";

export const getCampaignAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const analytics = await analyticsService.getCampaignAnalytics(
      String(req.params["campaignId"] ?? ""),
    );
    if (!analytics) {
      sendError(res, "Analytics not found", 404);
      return;
    }
    sendSuccess(res, analytics);
  } catch (err) {
    next(err);
  }
};

export const getAllAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const analytics = await analyticsService.getAllAnalytics();
    sendSuccess(res, analytics);
  } catch (err) {
    next(err);
  }
};
