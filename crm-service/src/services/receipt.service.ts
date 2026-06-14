import { communicationRepository } from "../repositories/communication.repository.js";
import { campaignRepository } from "../repositories/campaign.repository.js";
import { analyticsRepository } from "../repositories/analytics.repository.js";
import { generateCampaignInsight } from "../ai/services/insight.ai.service.js";
import {
  VALID_COMMUNICATION_TRANSITIONS,
  CommunicationStatus,
} from "../constants/enums.js";
import type { CommunicationStatus as PrismaCommunicationStatus } from "@prisma/client";

interface ReceiptPayload {
  communication_id: string;
  status: string;
  failure_reason?: string;
}

export const receiptService = {
  async processCallback(payload: ReceiptPayload) {
    const communication = await communicationRepository.findById(
      payload.communication_id,
    );

    if (!communication) {
      throw new Error(`Communication not found: ${payload.communication_id}`);
    }

    const currentStatus =
      communication.status as unknown as CommunicationStatus;
    const newStatus = payload.status as CommunicationStatus;

    const validNext = VALID_COMMUNICATION_TRANSITIONS[currentStatus];
    if (!validNext || !validNext.includes(newStatus)) {
      console.warn(
        `[RECEIPT] Invalid transition ${currentStatus} → ${newStatus} for ${payload.communication_id}. Skipping.`,
      );
      return { skipped: true };
    }

    const now = new Date();
    const timestamps: Record<string, Date | string> = {};

    if (newStatus === CommunicationStatus.SENT) timestamps["sentAt"] = now;
    if (newStatus === CommunicationStatus.DELIVERED)
      timestamps["deliveredAt"] = now;
    if (newStatus === CommunicationStatus.OPENED) timestamps["openedAt"] = now;
    if (newStatus === CommunicationStatus.READ) timestamps["readAt"] = now;
    if (newStatus === CommunicationStatus.CLICKED)
      timestamps["clickedAt"] = now;
    if (newStatus === CommunicationStatus.FAILED) {
      timestamps["failedAt"] = now;
      if (payload.failure_reason)
        timestamps["failureReason"] = payload.failure_reason;
    }

    await communicationRepository.updateStatus(
      payload.communication_id,
      newStatus as unknown as PrismaCommunicationStatus,
      timestamps,
    );

    const analytics = await analyticsRepository.upsert(
      communication.campaignId,
    );

    const allResolved = await communicationRepository.allResolved(
      communication.campaignId,
    );

    if (allResolved) {
      const campaign = await campaignRepository.findById(
        communication.campaignId,
      );

      if (campaign && campaign.status === "SENDING") {
        await campaignRepository.updateStatus(
          communication.campaignId,
          "COMPLETING",
        );

        const segment = campaign.segment;
        const insight = await generateCampaignInsight({
          campaignName: campaign.name,
          channel: campaign.channel,
          segmentName: segment.name,
          totalSent: analytics.totalSent,
          totalDelivered: analytics.totalDelivered,
          totalFailed: analytics.totalFailed,
          totalOpened: analytics.totalOpened,
          totalRead: analytics.totalRead,
          totalClicked: analytics.totalClicked,
          deliveryRate: Number(analytics.deliveryRate),
          openRate: Number(analytics.openRate),
          clickRate: Number(analytics.clickRate),
        });

        await campaignRepository.updateStatus(
          communication.campaignId,
          "COMPLETED",
          {
            completedAt: new Date(),
            aiInsight: `${insight.narrative}\n\nRecommended Action: ${insight.recommendedAction}`,
          },
        );
      }
    }

    return { processed: true };
  },
};
