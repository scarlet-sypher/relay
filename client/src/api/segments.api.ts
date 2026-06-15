import api from "./axios";
import type {
  ApiResponse,
  Segment,
  CreateSegmentPayload,
  FilterRules,
  AudienceBuilderResponse,
} from "../types/api.types";

export const getSegments = async (): Promise<ApiResponse<Segment[]>> => {
  const res = await api.get<ApiResponse<Segment[]>>("/segments");
  return res.data;
};

export const getSegmentById = async (
  id: string,
): Promise<ApiResponse<Segment>> => {
  const res = await api.get<ApiResponse<Segment>>(`/segments/${id}`);
  return res.data;
};

export const createSegment = async (
  payload: CreateSegmentPayload,
): Promise<ApiResponse<Segment>> => {
  const res = await api.post<ApiResponse<Segment>>("/segments", payload);
  return res.data;
};

export const previewSegment = async (
  filterRules: FilterRules,
): Promise<ApiResponse<{ count: number; sampleCustomers: unknown[] }>> => {
  const res = await api.post<
    ApiResponse<{ count: number; sampleCustomers: unknown[] }>
  >("/segments/preview", { filterRules });
  return res.data;
};

export const buildSegmentFromNL = async (
  query: string,
): Promise<ApiResponse<AudienceBuilderResponse>> => {
  const res = await api.post<ApiResponse<AudienceBuilderResponse>>(
    "/segments/build-nl",
    { query },
  );
  return res.data;
};
