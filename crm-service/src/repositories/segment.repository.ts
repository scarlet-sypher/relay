import { Prisma } from "@prisma/client";
import { prisma } from "../utilities/prisma.utility.js";
import type { CreateSegmentDTO } from "../validators/segment.validator.js";

export const segmentRepository = {
  async create(
    data: CreateSegmentDTO & {
      customerCount: number;
      isAiDiscovered?: boolean;
      description?: string;
    },
  ) {
    return prisma.segment.create({
      data: {
        ...data,
        description: data.description ?? null,
        nlQuery: data.nlQuery ?? null,
        filterRules: data.filterRules as Prisma.InputJsonValue,
      },
    });
  },

  async findAll() {
    return prisma.segment.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async findById(id: string) {
    return prisma.segment.findUnique({
      where: { id },
    });
  },

  async updateCustomerCount(id: string, count: number) {
    return prisma.segment.update({
      where: { id },
      data: {
        customerCount: count,
        lastUsedAt: new Date(),
      },
    });
  },
};
