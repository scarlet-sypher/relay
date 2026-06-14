import { prisma } from "../utilities/prisma.utility.js";
import type { CampaignStatus } from "@prisma/client";
import type { CreateCampaignDTO } from "../validators/campaign.validator.js";

export const campaignRepository = {
  async create(data: CreateCampaignDTO) {
    return prisma.campaign.create({
      data: {
        ...data,
        subjectLine: data.subjectLine ?? null,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      },
    });
  },

  async findAll() {
    return prisma.campaign.findMany({
      include: { segment: true, analytics: true },
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.campaign.findUnique({
      where: { id },
      include: {
        segment: true,
        analytics: true,
        communications: {
          orderBy: { createdAt: "desc" },
          take: 100,
        },
      },
    });
  },

  async updateStatus(
    id: string,
    status: CampaignStatus,
    extra?: {
      sentAt?: Date;
      completedAt?: Date;
      aiInsight?: string;
    },
  ) {
    return prisma.campaign.update({
      where: { id },
      data: { status, ...extra },
    });
  },
};
