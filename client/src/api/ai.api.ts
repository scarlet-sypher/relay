import api from "./axios";
import type {
  ApiResponse,
  CopilotResponse,
  AudienceBuilderResponse,
  Channel,
} from "../types/api.types";

export const generateMessage = async (payload: {
  segmentId: string;
  channel: Channel;
  brandCategory: string;
}): Promise<ApiResponse<CopilotResponse>> => {
  const res = await api.post<ApiResponse<CopilotResponse>>(
    "/ai/generate-message",
    payload,
  );
  return res.data;
};

export const buildAudience = async (
  query: string,
): Promise<ApiResponse<AudienceBuilderResponse>> => {
  const res = await api.post<ApiResponse<AudienceBuilderResponse>>(
    "/ai/build-audience",
    { query },
  );
  return res.data;
};
