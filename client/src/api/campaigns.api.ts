import api from "./axios";
import type {
  ApiResponse,
  Campaign,
  CreateCampaignPayload,
} from "../types/api.types";

export const getCampaigns = async (): Promise<ApiResponse<Campaign[]>> => {
  const res = await api.get<ApiResponse<Campaign[]>>("/campaigns");
  return res.data;
};

export const getCampaignById = async (
  id: string,
): Promise<ApiResponse<Campaign>> => {
  const res = await api.get<ApiResponse<Campaign>>(`/campaigns/${id}`);
  return res.data;
};

export const createCampaign = async (
  payload: CreateCampaignPayload,
): Promise<ApiResponse<Campaign>> => {
  const res = await api.post<ApiResponse<Campaign>>("/campaigns", payload);
  return res.data;
};

export const launchCampaign = async (
  id: string,
): Promise<ApiResponse<{ campaignId: string; communicationCount: number }>> => {
  const res = await api.post<
    ApiResponse<{ campaignId: string; communicationCount: number }>
  >(`/campaigns/${id}/launch`);
  return res.data;
};
