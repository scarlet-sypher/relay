import api from "./axios";
import type { HealthResponse } from "../types/api.types";

export const getHealthStatus = async (): Promise<HealthResponse> => {
  const response = await api.get<HealthResponse>("/health");

  return response.data;
};
