import { Router } from "express";
import {
  getCampaignAnalytics,
  getAllAnalytics,
} from "../controllers/analytics.controller.js";

const router = Router();

router.get("/", getAllAnalytics);
router.get("/:campaignId", getCampaignAnalytics);

export default router;
