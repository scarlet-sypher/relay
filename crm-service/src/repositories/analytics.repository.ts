import { prisma } from "../utilities/prisma.utility.js";

export const analyticsRepository = {
  async upsert(campaignId: string) {
    const counts = await prisma.communication.groupBy({
      by: ["status"],
      where: { campaignId },
      _count: { status: true },
    });

    const map: Record<string, number> = {};
    for (const row of counts) {
      map[row.status] = row._count.status;
    }

    const totalSent = Object.values(map).reduce((a, b) => a + b, 0);
    const totalDelivered =
      (map["DELIVERED"] ?? 0) +
      (map["OPENED"] ?? 0) +
      (map["READ"] ?? 0) +
      (map["CLICKED"] ?? 0);
    const totalFailed = map["FAILED"] ?? 0;
    const totalOpened =
      (map["OPENED"] ?? 0) + (map["READ"] ?? 0) + (map["CLICKED"] ?? 0);
    const totalRead = (map["READ"] ?? 0) + (map["CLICKED"] ?? 0);
    const totalClicked = map["CLICKED"] ?? 0;

    const deliveryRate = totalSent > 0 ? (totalDelivered / totalSent) * 100 : 0;
    const openRate =
      totalDelivered > 0 ? (totalOpened / totalDelivered) * 100 : 0;
    const clickRate = totalRead > 0 ? (totalClicked / totalRead) * 100 : 0;

    return prisma.campaignAnalytics.upsert({
      where: { campaignId },
      create: {
        campaignId,
        totalSent,
        totalDelivered,
        totalFailed,
        totalOpened,
        totalRead,
        totalClicked,
        deliveryRate,
        openRate,
        clickRate,
        lastUpdatedAt: new Date(),
      },
      update: {
        totalSent,
        totalDelivered,
        totalFailed,
        totalOpened,
        totalRead,
        totalClicked,
        deliveryRate,
        openRate,
        clickRate,
        lastUpdatedAt: new Date(),
      },
    });
  },

  async findByCampaignId(campaignId: string) {
    return prisma.campaignAnalytics.findUnique({ where: { campaignId } });
  },

  async findAll() {
    return prisma.campaignAnalytics.findMany({
      include: {
        campaign: { select: { name: true, channel: true, status: true } },
      },
      orderBy: { lastUpdatedAt: "desc" },
    });
  },
};
