import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const formatCurrency = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return "₹0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatNumber = (value: number | string | null | undefined): string => {
  if (value === null || value === undefined) return "0";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0";
  return new Intl.NumberFormat("en-IN").format(num);
};

export const formatPercent = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) return "0.0%";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0.0%";
  return `${num.toFixed(1)}%`;
};

export const formatDate = (date: string | null | undefined): string => {
  if (!date) return "—";
  return format(new Date(date), "MMM d, yyyy");
};

export const formatDateTime = (date: string | null | undefined): string => {
  if (!date) return "—";
  return format(new Date(date), "MMM d, yyyy · h:mm a");
};

export const formatRelativeTime = (date: string | null | undefined): string => {
  if (!date) return "—";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const getInitials = (firstName: string, lastName: string): string =>
  `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

export const truncate = (str: string, length: number): string =>
  str.length > length ? `${str.slice(0, length)}...` : str;

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const isValidBrandCategory = (category: string): boolean => {
  if (!category) return false;
  const trimmed = category.trim();
  if (trimmed.length < 2) return false;
  
  // Reject if it has 4+ identical consecutive characters
  if (/(.)\1{3,}/.test(trimmed)) return false;

  // Reject common keyboard smashes
  const smashes = ["asdf", "qwer", "zxcv", "1234", "qwerty", "uiop", "hjkl"];
  if (smashes.some(s => trimmed.toLowerCase().includes(s))) return false;

  // Must contain at least one letter
  if (!/[a-zA-Z]/.test(trimmed)) return false;

  // Must not be mostly punctuation
  const lettersCount = (trimmed.match(/[a-zA-Z0-9]/g) || []).length;
  if (lettersCount < trimmed.length / 2) return false;

  return true;
};
