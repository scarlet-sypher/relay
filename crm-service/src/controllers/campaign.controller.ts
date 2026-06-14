import type { Request, Response, NextFunction } from "express";
import { campaignService } from "../services/campaign.service.js";
import { sendSuccess, sendError } from "../utilities/response.utility.js";
import type { CreateCampaignDTO } from "../validators/campaign.validator.js";

export const createCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const campaign = await campaignService.createCampaign(
      req.body as CreateCampaignDTO,
    );
    sendSuccess(res, campaign, "Campaign created", 201);
  } catch (err) {
    next(err);
  }
};

export const getAllCampaigns = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const campaigns = await campaignService.getAllCampaigns();
    sendSuccess(res, campaigns);
  } catch (err) {
    next(err);
  }
};

export const getCampaignById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const campaign = await campaignService.getCampaignById(
      String(req.params["id"] ?? ""),
    );
    if (!campaign) {
      sendError(res, "Campaign not found", 404);
      return;
    }
    sendSuccess(res, campaign);
  } catch (err) {
    next(err);
  }
};

export const launchCampaign = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await campaignService.launchCampaign(
      String(req.params["id"] ?? ""),
    );
    sendSuccess(res, result, "Campaign launched");
  } catch (err) {
    next(err);
  }
};
