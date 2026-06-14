import { prisma } from "../utilities/prisma.utility.js";
import type { CreateCustomerDTO } from "../validators/customer.validator.js";

export const customerRepository = {
  async create(data: CreateCustomerDTO) {
    return prisma.customer.create({
      data: {
        ...data,
        externalId: data.externalId ?? null,
        phone: data.phone ?? null,
        city: data.city ?? null,
      },
    });
  },

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count(),
    ]);
    return { customers, total };
  },

  async findById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        orders: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });
  },

  async updateDenormalizedFields(customerId: string) {
    const result = await prisma.order.aggregate({
      where: { customerId },
      _sum: { amount: true },
      _count: { id: true },
      _max: { createdAt: true },
    });

    return prisma.customer.update({
      where: { id: customerId },
      data: {
        totalOrders: result._count.id,
        totalSpend: result._sum.amount ?? 0,
        lastOrderAt: result._max.createdAt,
      },
    });
  },

  async updateSegmentTags(customerId: string, tags: string[]) {
    return prisma.customer.update({
      where: { id: customerId },
      data: { aiSegmentTags: tags },
    });
  },
};
