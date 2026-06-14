import { Router } from "express";
import {
  createSegment,
  getAllSegments,
  getSegmentById,
  previewSegment,
  buildFromNL,
} from "../controllers/segment.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  CreateSegmentSchema,
  NLSegmentSchema,
} from "../validators/segment.validator.js";

const router = Router();

router.post("/", validate(CreateSegmentSchema), createSegment);
router.post("/preview", previewSegment);
router.post("/build-nl", validate(NLSegmentSchema), buildFromNL);
router.get("/", getAllSegments);
router.get("/:id", getSegmentById);

export default router;
