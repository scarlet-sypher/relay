import dotenv from "dotenv";

dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const ENV = {
  PORT: process.env["PORT"] ?? "5001",
  CRM_RECEIPT_URL: requireEnv("CRM_RECEIPT_URL"),
} as const;
