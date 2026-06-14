import { prisma } from "../utilities/prisma.utility.js";
import type { Channel, CommunicationStatus } from "@prisma/client";

export const communicationRepository = {
  async createMany(
    communications: {
      campaignId: string;
      customerId: string;
      channel: Channel;
      recipientAddress: string;
      messageBody: string;
    }[],
  ) {
    return prisma.communication.createMany({ data: communications });
  },

  async findById(id: string) {
    return prisma.communication.findUnique({ where: { id } });
  },

  async findByCampaignId(campaignId: string) {
    return prisma.communication.findMany({
      where: { campaignId },
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
      },
    });
  },

  async updateStatus(
    id: string,
    status: CommunicationStatus,
    timestamps: Partial<{
      sentAt: Date;
      deliveredAt: Date;
      openedAt: Date;
      readAt: Date;
      clickedAt: Date;
      failedAt: Date;
      failureReason: string;
    }>,
  ) {
    return prisma.communication.update({
      where: { id },
      data: { status, ...timestamps },
    });
  },

  async countByStatus(campaignId: string) {
    return prisma.communication.groupBy({
      by: ["status"],
      where: { campaignId },
      _count: { status: true },
    });
  },

  async allResolved(campaignId: string): Promise<boolean> {
    const pending = await prisma.communication.count({
      where: {
        campaignId,
        status: { notIn: ["CLICKED", "FAILED", "DELIVERED", "READ", "OPENED"] },
      },
    });
    return pending === 0;
  },
};
