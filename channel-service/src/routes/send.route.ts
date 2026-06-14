import { Router } from "express";
import { handleSend } from "../controllers/send.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { SendRequestSchema } from "../validators/send.validator.js";

const router = Router();

router.post("/", validate(SendRequestSchema), handleSend);

export default router;
