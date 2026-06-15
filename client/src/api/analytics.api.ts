import api from "./axios";
import type {
  ApiResponse,
  CampaignAnalytics,
  AnalyticsWithCampaign,
} from "../types/api.types";

export const getAllAnalytics = async (): Promise<
  ApiResponse<AnalyticsWithCampaign[]>
> => {
  const res = await api.get<ApiResponse<AnalyticsWithCampaign[]>>("/analytics");
  return res.data;
};

export const getCampaignAnalytics = async (
  campaignId: string,
): Promise<ApiResponse<CampaignAnalytics>> => {
  const res = await api.get<ApiResponse<CampaignAnalytics>>(
    `/analytics/${campaignId}`,
  );
  return res.data;
};
