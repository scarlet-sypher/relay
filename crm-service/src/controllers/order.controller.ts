import type { Request, Response, NextFunction } from "express";
import { orderService } from "../services/order.service.js";
import { sendSuccess } from "../utilities/response.utility.js";
import type { CreateOrderDTO } from "../validators/order.validator.js";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const order = await orderService.createOrder(req.body as CreateOrderDTO);
    sendSuccess(res, order, "Order created", 201);
  } catch (err) {
    next(err);
  }
};

export const getOrdersByCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const orders = await orderService.getOrdersByCustomer(
      String(req.params["customerId"] ?? ""),
    );
    sendSuccess(res, orders);
  } catch (err) {
    next(err);
  }
};
