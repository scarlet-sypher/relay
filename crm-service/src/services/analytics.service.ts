import { analyticsRepository } from "../repositories/analytics.repository.js";

export const analyticsService = {
  async getCampaignAnalytics(campaignId: string) {
    return analyticsRepository.findByCampaignId(campaignId);
  },

  async getAllAnalytics() {
    return analyticsRepository.findAll();
  },
};
