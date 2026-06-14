import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";
import { sendError } from "../utilities/response.utility.js";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      sendError(
        res,
        "Validation failed",
        400,
        result.error.issues.map((i) => i.message).join(", "),
      );
      return;
    }
    req.body = result.data;
    next();
  };
