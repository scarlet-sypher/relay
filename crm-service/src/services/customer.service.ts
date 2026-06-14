import { customerRepository } from "../repositories/customer.repository.js";
import { generateCustomerInsight } from "../ai/services/customer.ai.service.js";
import type { CreateCustomerDTO } from "../validators/customer.validator.js";

export const customerService = {
  async createCustomer(data: CreateCustomerDTO) {
    return customerRepository.create(data);
  },

  async getAllCustomers(page: number, limit: number) {
    return customerRepository.findAll(page, limit);
  },

  async getCustomerById(id: string) {
    const customer = await customerRepository.findById(id);
    if (!customer) return null;

    const insight = await generateCustomerInsight({
      firstName: customer.firstName,
      totalOrders: customer.totalOrders,
      totalSpend: Number(customer.totalSpend),
      lastOrderAt: customer.lastOrderAt?.toISOString() ?? null,
      aiSegmentTags: customer.aiSegmentTags,
      preferredChannel: customer.preferredChannel,
    });

    return { ...customer, aiInsight: insight };
  },
};
