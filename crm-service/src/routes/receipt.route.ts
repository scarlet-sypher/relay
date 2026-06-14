import { Router } from "express";
import { handleReceipt } from "../controllers/receipt.controller.js";

const router = Router();
router.post("/", handleReceipt);
export default router;
