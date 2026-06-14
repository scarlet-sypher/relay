import { Router } from "express";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  launchCampaign,
} from "../controllers/campaign.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { CreateCampaignSchema } from "../validators/campaign.validator.js";

const router = Router();

router.post("/", validate(CreateCampaignSchema), createCampaign);
router.get("/", getAllCampaigns);
router.get("/:id", getCampaignById);
router.post("/:id/launch", launchCampaign);

export default router;
