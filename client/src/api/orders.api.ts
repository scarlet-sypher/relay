import api from "./axios";
import type {
  ApiResponse,
  Order,
  CreateOrderPayload,
} from "../types/api.types";

export const getOrdersByCustomer = async (
  customerId: string,
): Promise<ApiResponse<Order[]>> => {
  const res = await api.get<ApiResponse<Order[]>>(
    `/orders/customer/${customerId}`,
  );
  return res.data;
};

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<ApiResponse<Order>> => {
  const res = await api.post<ApiResponse<Order>>("/orders", payload);
  return res.data;
};
