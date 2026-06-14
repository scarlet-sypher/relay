import type { Request, Response, NextFunction } from "express";
import { processSendRequest } from "../services/send.service.js";
import { sendSuccess } from "../utilities/response.utility.js";
import type { SendRequestDTO } from "../validators/send.validator.js";

export const handleSend = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const body = req.body as SendRequestDTO;

    /*
    |--------------------------------------------------------------------------
    | Respond 202 immediately.
    |--------------------------------------------------------------------------
    | The CRM must not wait for delivery simulation to complete.
    | 202 Accepted means: "we received your request and will process it."
    | The actual simulation runs entirely in the background after this line.
    */

    sendSuccess(
      res,
      {
        campaign_id: body.campaign_id,
        accepted: body.communications.length,
      },
      "Send request accepted",
      202,
    );

    /*
    |--------------------------------------------------------------------------
    | Kick off simulation AFTER responding.
    |--------------------------------------------------------------------------
    | processSendRequest is synchronous — it loops through communications
    | and fires void async tasks for each one. It returns immediately.
    */

    processSendRequest(body);
  } catch (err) {
    next(err);
  }
};
