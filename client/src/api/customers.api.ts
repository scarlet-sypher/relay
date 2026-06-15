import api from "./axios";
import type {
  ApiResponse,
  PaginatedData,
  Customer,
  CustomerWithInsight,
  CreateCustomerPayload,
} from "../types/api.types";

export const getCustomers = async (
  page = 1,
  limit = 20,
): Promise<ApiResponse<PaginatedData<Customer>>> => {
  const res = await api.get<ApiResponse<PaginatedData<Customer>>>(
    `/customers?page=${page}&limit=${limit}`,
  );
  return res.data;
};

export const getCustomerById = async (
  id: string,
): Promise<ApiResponse<CustomerWithInsight>> => {
  const res = await api.get<ApiResponse<CustomerWithInsight>>(
    `/customers/${id}`,
  );
  return res.data;
};

export const createCustomer = async (
  payload: CreateCustomerPayload,
): Promise<ApiResponse<Customer>> => {
  const res = await api.post<ApiResponse<Customer>>("/customers", payload);
  return res.data;
};
