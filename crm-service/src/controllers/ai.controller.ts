import type { Request, Response, NextFunction } from "express";
import { generateCampaignCopilot } from "../ai/services/copilot.ai.service.js";
import { buildAudienceFromNL } from "../ai/services/audience.ai.service.js";
import { segmentRepository } from "../repositories/segment.repository.js";
import { sendSuccess, sendError } from "../utilities/response.utility.js";
import type { CopilotDTO } from "../validators/ai.validator.js";
import type { Channel } from "@prisma/client";

export const generateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body as CopilotDTO;
    const segment = await segmentRepository.findById(body.segmentId);
    if (!segment) {
      sendError(res, "Segment not found", 404);
      return;
    }

    const result = await generateCampaignCopilot({
      segmentName: segment.name,
      segmentDescription: segment.description ?? "",
      customerCount: segment.customerCount,
      channel: body.channel as Channel,
      brandCategory: body.brandCategory,
      avgSpend: 0,
    });

    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export const buildAudience = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await buildAudienceFromNL(req.body.query as string);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};
