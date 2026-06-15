import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const formatCurrency = (value: string | number): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("en-IN").format(value);

export const formatPercent = (value: string | number): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
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
