import type { Request, Response, NextFunction } from "express";
import { generateCampaignCopilot } from "../ai/services/copilot.ai.service.js";
import { segmentService } from "../services/segment.service.js";
import { segmentRepository } from "../repositories/segment.repository.js";
import { sendSuccess, sendError } from "../utilities/response.utility.js";
import type { CopilotDTO } from "../validators/ai.validator.js";
import type { Channel } from "@prisma/client";

const isValidBrandCategory = (category: string): boolean => {
  if (!category) return false;
  const trimmed = category.trim();
  if (trimmed.length < 2) return false;
  
  if (/(.)\1{3,}/.test(trimmed)) return false;

  const smashes = ["asdf", "qwer", "zxcv", "1234", "qwerty", "uiop", "hjkl"];
  if (smashes.some(s => trimmed.toLowerCase().includes(s))) return false;

  if (!/[a-zA-Z]/.test(trimmed)) return false;

  const lettersCount = (trimmed.match(/[a-zA-Z0-9]/g) || []).length;
  if (lettersCount < trimmed.length / 2) return false;

  return true;
};

export const generateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const body = req.body as CopilotDTO;
    const segment = await segmentRepository.findById(body.segmentId);
    if (!segment) {
      sendError(res, "No segment selected", 400);
      return;
    }

    if (segment.customerCount === 0) {
      sendError(res, "Selected segment contains no customers", 400);
      return;
    }

    const filterRules = segment.filterRules as any;
    if (!filterRules?.conditions?.length) {
      sendError(res, "Selected segment is not based on valid audience rules", 400);
      return;
    }

    if (!isValidBrandCategory(body.brandCategory)) {
      sendError(res, "Invalid brand category", 400);
      return;
    }

    console.log("Selected Segment:", segment);
    console.log("Customer Count:", segment.customerCount);
    console.log("Filter Rules:", segment.filterRules);
    console.log("Brand Category:", body.brandCategory);

    const result = await generateCampaignCopilot({
      segmentName: segment.name,
      segmentDescription: segment.description ?? "",
      customerCount: segment.customerCount,
      channel: body.channel as Channel,
      brandCategory: body.brandCategory,
      avgSpend: 0,
      filterRules: JSON.stringify(segment.filterRules),
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
    const result = await segmentService.buildFromNaturalLanguage(req.body.query as string);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};
