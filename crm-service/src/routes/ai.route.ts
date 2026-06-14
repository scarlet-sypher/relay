import { Router } from "express";
import {
  generateMessage,
  buildAudience,
} from "../controllers/ai.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { CopilotSchema, NLAudienceSchema } from "../validators/ai.validator.js";

const router = Router();

router.post("/generate-message", validate(CopilotSchema), generateMessage);
router.post("/build-audience", validate(NLAudienceSchema), buildAudience);

export default router;
