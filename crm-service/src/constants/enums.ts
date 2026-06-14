export enum Channel {
  EMAIL = "EMAIL",
  SMS = "SMS",
  WHATSAPP = "WHATSAPP",
}

export enum CampaignStatus {
  DRAFT = "DRAFT",
  SCHEDULED = "SCHEDULED",
  SENDING = "SENDING",
  COMPLETING = "COMPLETING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum CommunicationStatus {
  QUEUED = "QUEUED",
  SENT = "SENT",
  DELIVERED = "DELIVERED",
  OPENED = "OPENED",
  READ = "READ",
  CLICKED = "CLICKED",
  FAILED = "FAILED",
}

export const VALID_COMMUNICATION_TRANSITIONS: Record<
  CommunicationStatus,
  CommunicationStatus[]
> = {
  [CommunicationStatus.QUEUED]: [
    CommunicationStatus.SENT,
    CommunicationStatus.FAILED,
  ],

  [CommunicationStatus.SENT]: [
    CommunicationStatus.DELIVERED,
    CommunicationStatus.FAILED,
  ],

  [CommunicationStatus.DELIVERED]: [CommunicationStatus.OPENED],

  [CommunicationStatus.OPENED]: [CommunicationStatus.READ],

  [CommunicationStatus.READ]: [CommunicationStatus.CLICKED],

  [CommunicationStatus.CLICKED]: [],

  [CommunicationStatus.FAILED]: [],
};
