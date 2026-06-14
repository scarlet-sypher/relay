export type ChannelType = "EMAIL" | "SMS" | "WHATSAPP";

export type CommunicationEventStatus =
  | "SENT"
  | "DELIVERED"
  | "FAILED"
  | "OPENED"
  | "READ"
  | "CLICKED";

export interface CommunicationPayload {
  communication_id: string;
  recipient_address: string;
  message: string;
}

export interface SendRequest {
  campaign_id: string;
  channel: ChannelType;
  communications: CommunicationPayload[];
  callback_url: string;
}

export interface CallbackPayload {
  communication_id: string;
  status: CommunicationEventStatus;
  failure_reason?: string;
}

export interface DeliveryOutcome {
  delivered: boolean;
  failure_reason?: string;
}

export interface EngagementOutcome {
  opened: boolean;
  read: boolean;
  clicked: boolean;
}

export interface SimulationProbabilities {
  deliveryRate: number;
  openRate: number;
  readRate: number;
  clickRate: number;
}
