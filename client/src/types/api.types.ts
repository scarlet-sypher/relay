export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  customers: T[];
  total: number;
}

export type Channel = "EMAIL" | "SMS" | "WHATSAPP";
export type CampaignStatus =
  | "DRAFT"
  | "SCHEDULED"
  | "SENDING"
  | "COMPLETING"
  | "COMPLETED"
  | "FAILED";
export type CommunicationStatus =
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "OPENED"
  | "READ"
  | "CLICKED"
  | "FAILED";
export type RiskFlag =
  | "churn_risk"
  | "upsell_opportunity"
  | "loyal_advocate"
  | "neutral";

export interface Customer {
  id: string;
  externalId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  city: string | null;
  preferredChannel: Channel;
  lastOrderAt: string | null;
  totalOrders: number;
  totalSpend: string;
  aiSegmentTags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerWithInsight extends Customer {
  orders: Order[];
  aiInsight: {
    summary: string;
    riskFlag: RiskFlag;
  };
}

export interface Order {
  id: string;
  customerId: string;
  orderNumber: string;
  amount: string;
  productCategory: string | null;
  channel: string | null;
  createdAt: string;
}

export interface FilterCondition {
  field: string;
  op: string;
  value: unknown;
}

export interface FilterRules {
  operator: "AND" | "OR";
  conditions: FilterCondition[];
}

export interface Segment {
  id: string;
  name: string;
  description: string | null;
  filterRules: FilterRules;
  nlQuery: string | null;
  customerCount: number;
  isAiDiscovered: boolean;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
}

export interface Communication {
  id: string;
  campaignId: string;
  customerId: string;
  channel: Channel;
  recipientAddress: string;
  messageBody: string;
  status: CommunicationStatus;
  queuedAt: string;
  sentAt: string | null;
  deliveredAt: string | null;
  openedAt: string | null;
  readAt: string | null;
  clickedAt: string | null;
  failedAt: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CampaignAnalytics {
  id: string;
  campaignId: string;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalOpened: number;
  totalRead: number;
  totalClicked: number;
  deliveryRate: string;
  openRate: string;
  clickRate: string;
  lastUpdatedAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  segmentId: string;
  channel: Channel;
  messageBody: string;
  subjectLine: string | null;
  status: CampaignStatus;
  scheduledAt: string | null;
  sentAt: string | null;
  completedAt: string | null;
  aiInsight: string | null;
  createdAt: string;
  updatedAt: string;
  segment?: Segment;
  analytics?: CampaignAnalytics | null;
  communications?: Communication[];
}

export interface MessageVariant {
  tone: "Direct" | "Warm" | "Playful";
  message: string;
  subject?: string;
  reasoning: string;
}

export interface CopilotResponse {
  variants: MessageVariant[];
  confidenceNote: string;
}

export interface AudienceBuilderResponse {
  filterRules: FilterRules;
  explanation: string;
  suggestedName: string;
  warnings: string[];
  customerCount: number;
  sampleCustomers: Partial<Customer>[];
}

export interface AnalyticsWithCampaign extends CampaignAnalytics {
  campaign: {
    name: string;
    channel: Channel;
    status: CampaignStatus;
  };
}

export interface CreateCustomerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  preferredChannel: Channel;
  externalId?: string;
}

export interface CreateOrderPayload {
  customerId: string;
  orderNumber: string;
  amount: number;
  productCategory?: string;
  channel?: string;
}

export interface CreateSegmentPayload {
  name: string;
  description?: string;
  filterRules: FilterRules;
  nlQuery?: string;
}

export interface CreateCampaignPayload {
  name: string;
  segmentId: string;
  channel: Channel;
  messageBody: string;
  subjectLine?: string;
  scheduledAt?: string;
}

export interface HealthData {
  timestamp: string;
}
