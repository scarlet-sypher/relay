import { Router } from "express";
import {
  createCustomer,
  getAllCustomers,
  getCustomerById,
} from "../controllers/customer.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { CreateCustomerSchema } from "../validators/customer.validator.js";

const router = Router();

router.post("/", validate(CreateCustomerSchema), createCustomer);
router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);

export default router;
