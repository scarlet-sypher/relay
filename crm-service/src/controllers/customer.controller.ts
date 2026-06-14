import type { Request, Response, NextFunction } from "express";
import { customerService } from "../services/customer.service.js";
import { sendSuccess, sendError } from "../utilities/response.utility.js";
import type { CreateCustomerDTO } from "../validators/customer.validator.js";

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const customer = await customerService.createCustomer(
      req.body as CreateCustomerDTO,
    );
    sendSuccess(res, customer, "Customer created", 201);
  } catch (err) {
    next(err);
  }
};

export const getAllCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = parseInt(String(req.query["page"] ?? "1"));
    const limit = parseInt(String(req.query["limit"] ?? "20"));
    const result = await customerService.getAllCustomers(page, limit);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
};

export const getCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const customer = await customerService.getCustomerById(
      String(req.params["id"] ?? ""),
    );
    if (!customer) {
      sendError(res, "Customer not found", 404);
      return;
    }
    sendSuccess(res, customer);
  } catch (err) {
    next(err);
  }
};
