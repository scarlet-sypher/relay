import api from "./axios";
import type { ApiResponse, HealthData } from "../types/api.types";

export const getHealth = async (): Promise<ApiResponse<HealthData>> => {
  const res = await api.get<ApiResponse<HealthData>>("/health");
  return res.data;
};
