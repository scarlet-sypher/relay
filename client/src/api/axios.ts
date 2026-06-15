import axios, { type AxiosError, type AxiosResponse } from "axios";

const api = axios.create({
  baseURL: import.meta.env["VITE_CRM_API_URL"] ?? "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  },
);

export default api;
