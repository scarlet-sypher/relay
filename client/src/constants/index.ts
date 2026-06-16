export const APP_NAME = import.meta.env["VITE_APP_NAME"] ?? "Relay";

export const POLL_INTERVAL_MS = Number(
  import.meta.env["VITE_POLL_INTERVAL_MS"] ?? 3000,
);

export const CHANNEL_LABELS: Record<string, string> = {
  EMAIL: "Email",
  SMS: "SMS",
  WHATSAPP: "WhatsApp",
};

export const CHANNEL_COLORS: Record<string, string> = {
  EMAIL: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  SMS: "text-green-400 bg-green-400/10 border-green-400/20",
  WHATSAPP: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

export const CAMPAIGN_STATUS_COLORS: Record<string, string> = {
  DRAFT: "text-surface-400 bg-surface-400/10 border-surface-400/20",
  SCHEDULED: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  SENDING: "text-brand-400 bg-brand-400/10 border-brand-400/20",
  COMPLETING: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  COMPLETED: "text-green-400 bg-green-400/10 border-green-400/20",
  FAILED: "text-red-400 bg-red-400/10 border-red-400/20",
};

export const COMMUNICATION_STATUS_COLORS: Record<string, string> = {
  QUEUED: "text-surface-400 bg-surface-400/10 border-surface-400/20",
  SENT: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  DELIVERED: "text-brand-400 bg-brand-400/10 border-brand-400/20",
  OPENED: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  READ: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  CLICKED: "text-green-400 bg-green-400/10 border-green-400/20",
  FAILED: "text-red-400 bg-red-400/10 border-red-400/20",
};

export const RISK_FLAG_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  churn_risk: {
    label: "Churn Risk",
    color: "text-red-400 bg-red-400/10 border-red-400/20",
  },
  upsell_opportunity: {
    label: "Upsell Opportunity",
    color: "text-green-400 bg-green-400/10 border-green-400/20",
  },
  loyal_advocate: {
    label: "Loyal Advocate",
    color: "text-brand-400 bg-brand-400/10 border-brand-400/20",
  },
  neutral: {
    label: "Neutral",
    color: "text-surface-400 bg-surface-400/10 border-surface-400/20",
  },
};

export const SEGMENT_FILTER_FIELDS = [
  { value: "totalSpend", label: "Total Spend (₹)" },
  { value: "totalOrders", label: "Total Orders" },
  { value: "lastOrderAt", label: "Days Since Last Order" },
  { value: "preferredChannel", label: "Preferred Channel" },
  { value: "city", label: "City" },
];

export const SEGMENT_FILTER_OPS = [
  { value: "gte", label: "≥ Greater than or equal" },
  { value: "lte", label: "≤ Less than or equal" },
  { value: "gt", label: "> Greater than" },
  { value: "lt", label: "< Less than" },
  { value: "eq", label: "= Equals" },
  { value: "days_ago_gte", label: "Days ago ≥" },
  { value: "days_ago_lte", label: "Days ago ≤" },
  { value: "contains", label: "Contains" },
];

export const FILTER_OP_LABELS: Record<string, string> = {
  eq: "equals",
  neq: "does not equal",
  gt: "is greater than",
  gte: "is greater than or equal to",
  lt: "is less than",
  lte: "is less than or equal to",
  in: "is one of",
  nin: "is not one of",
  contains: "contains",
  not_contains: "does not contain",
  days_ago_lt: "days ago <",
  days_ago_lte: "days ago ≤",
  days_ago_gt: "days ago >",
  days_ago_gte: "days ago ≥",
};

export const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { path: "/customers", label: "Customers", icon: "Users" },
  { path: "/segments", label: "Segments", icon: "Filter" },
  { path: "/campaigns", label: "Campaigns", icon: "Send" },
  { path: "/analytics", label: "Analytics", icon: "BarChart3" },
  { path: "/ai", label: "AI Studio", icon: "Sparkles" },
  { path: "/health", label: "Health", icon: "Activity" },
];
