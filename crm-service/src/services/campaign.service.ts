import { campaignRepository } from "../repositories/campaign.repository.js";
import { communicationRepository } from "../repositories/communication.repository.js";
import { segmentRepository } from "../repositories/segment.repository.js";
import { analyticsRepository } from "../repositories/analytics.repository.js";
import {
  getCustomerIdsForSegment,
  type FilterRules,
} from "../utilities/segment-filter.utility.js";
import { prisma } from "../utilities/prisma.utility.js";
import { ENV } from "../config/env.js";
import type { CreateCampaignDTO } from "../validators/campaign.validator.js";
import type { Channel } from "@prisma/client";

export const campaignService = {
  async createCampaign(data: CreateCampaignDTO) {
    return campaignRepository.create(data);
  },

  async getAllCampaigns() {
    return campaignRepository.findAll();
  },

  async getCampaignById(id: string) {
    return campaignRepository.findById(id);
  },

  async launchCampaign(campaignId: string) {
    const campaign = await campaignRepository.findById(campaignId);
    if (!campaign) throw new Error("Campaign not found");
    if (campaign.status !== "DRAFT" && campaign.status !== "SCHEDULED") {
      throw new Error(`Cannot launch campaign in status: ${campaign.status}`);
    }

    const segment = await segmentRepository.findById(campaign.segmentId);
    if (!segment) throw new Error("Segment not found");

    if (!segment.filterRules) {
      throw new Error("Segment filter rules missing");
    }

    const rules = segment.filterRules as unknown as FilterRules;
    const customerIds = await getCustomerIdsForSegment(rules);

    if (customerIds.length === 0) {
      throw new Error("Segment has no matching customers");
    }

    const customers = await prisma.customer.findMany({
      where: { id: { in: customerIds } },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
      },
    });

    const resolveMessage = (messageBody: string, firstName: string): string => {
      return messageBody.replace(/{{first_name}}/g, firstName);
    };

    const resolveAddress = (
      channel: Channel,
      customer: { email: string; phone: string | null },
    ): string | null => {
      if (channel === "EMAIL") return customer.email;
      return customer.phone;
    };

    const communications = customers
      .map((customer) => {
        const address = resolveAddress(campaign.channel, customer);
        if (!address) return null;
        return {
          campaignId,
          customerId: customer.id,
          channel: campaign.channel,
          recipientAddress: address,
          messageBody: resolveMessage(campaign.messageBody, customer.firstName),
        };
      })
      .filter((c): c is NonNullable<typeof c> => c !== null);

    await communicationRepository.createMany(communications);

    await campaignRepository.updateStatus(campaignId, "SENDING", {
      sentAt: new Date(),
    });

    await analyticsRepository.upsert(campaignId);

    const allComms = await communicationRepository.findByCampaignId(campaignId);
    const payload = {
      campaign_id: campaignId,
      channel: campaign.channel,
      communications: allComms.map((c) => ({
        communication_id: c.id,
        recipient_address: c.recipientAddress,
        message: c.messageBody,
      })),
      callback_url: `${ENV.CRM_RECEIPT_URL}/api/receipt`,
    };

    try {
      await fetch(`${ENV.CHANNEL_SERVICE_URL}/api/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      console.error("[CAMPAIGN] Channel service unreachable. Continuing.");
    }

    return { campaignId, communicationCount: communications.length };
  },
};
