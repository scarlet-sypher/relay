import { Router } from "express";
import {
  createOrder,
  getOrdersByCustomer,
} from "../controllers/order.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { CreateOrderSchema } from "../validators/order.validator.js";

const router = Router();

router.post("/", validate(CreateOrderSchema), createOrder);
router.get("/customer/:customerId", getOrdersByCustomer);

export default router;
