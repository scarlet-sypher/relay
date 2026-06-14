import { prisma } from "../utilities/prisma.utility.js";
import type { CreateOrderDTO } from "../validators/order.validator.js";

export const orderRepository = {
  async create(data: CreateOrderDTO) {
    return prisma.order.create({
      data: {
        ...data,
        productCategory: data.productCategory ?? null,
        channel: data.channel ?? null,
      },
    });
  },

  async findByCustomerId(customerId: string) {
    return prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    });
  },
};
