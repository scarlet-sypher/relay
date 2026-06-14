import type { Request, Response, NextFunction } from "express";
import { segmentService } from "../services/segment.service.js";
import { sendSuccess, sendError } from "../utilities/response.utility.js";
import type { FilterRules } from "../utilities/segment-filter.utility.js";

export const createSegment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const segment = await segmentService.createSegment(req.body);
    sendSuccess(res, segment, "Segment created", 201);
  } catch (err) {
    next(err);
  }
};

export const previewSegment = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await segmentService.previewSegment(
      req.body.filterRules as FilterRules,
    );
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export const getAllSegments = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const segments = await segmentService.getAllSegments();
    sendSuccess(res, segments);
  } catch (err) {
    next(err);
  }
};

export const getSegmentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const segment = await segmentService.getSegmentById(
      String(req.params["id"] ?? ""),
    );
    if (!segment) {
      sendError(res, "Segment not found", 404);
      return;
    }
    sendSuccess(res, segment);
  } catch (err) {
    next(err);
  }
};

export const buildFromNL = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await segmentService.buildFromNaturalLanguage(
      req.body.query as string,
    );
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};
