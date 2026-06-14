import { prisma } from "./prisma.utility.js";

export interface FilterCondition {
  field: string;
  op: string;
  value: unknown;
}

export interface FilterRules {
  operator: "AND" | "OR";
  conditions: FilterCondition[];
}

const ALLOWED_FIELDS = new Set([
  "totalSpend",
  "totalOrders",
  "lastOrderAt",
  "preferredChannel",
  "city",
  "aiSegmentTags",
]);

const buildWhereClause = (rules: FilterRules): Record<string, unknown> => {
  const clauses = rules.conditions.map((condition) => {
    if (!ALLOWED_FIELDS.has(condition.field)) {
      throw new Error(`Field not allowed in filters: ${condition.field}`);
    }

    switch (condition.op) {
      case "gte":
        return { [condition.field]: { gte: condition.value } };
      case "lte":
        return { [condition.field]: { lte: condition.value } };
      case "eq":
        return { [condition.field]: { equals: condition.value } };
      case "gt":
        return { [condition.field]: { gt: condition.value } };
      case "lt":
        return { [condition.field]: { lt: condition.value } };
      case "days_ago_gte": {
        const days = Number(condition.value);
        const date = new Date();
        date.setDate(date.getDate() - days);
        return { [condition.field]: { lte: date } };
      }
      case "days_ago_lte": {
        const days = Number(condition.value);
        const date = new Date();
        date.setDate(date.getDate() - days);
        return { [condition.field]: { gte: date } };
      }
      case "contains":
        return {
          [condition.field]: { has: condition.value },
        };
      default:
        throw new Error(`Unsupported operator: ${condition.op}`);
    }
  });

  if (rules.operator === "AND") {
    return { AND: clauses };
  }

  return { OR: clauses };
};

export const executeSegmentFilter = async (
  rules: FilterRules,
): Promise<{ count: number; sampleCustomers: unknown[] }> => {
  const where = buildWhereClause(rules);

  const [count, sampleCustomers] = await Promise.all([
    prisma.customer.count({ where }),
    prisma.customer.findMany({
      where,
      take: 10,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        totalSpend: true,
        totalOrders: true,
        lastOrderAt: true,
        aiSegmentTags: true,
      },
    }),
  ]);

  return { count, sampleCustomers };
};

export const getCustomerIdsForSegment = async (
  rules: FilterRules,
): Promise<string[]> => {
  const where = buildWhereClause(rules);

  const customers = await prisma.customer.findMany({
    where,
    select: { id: true },
  });

  return customers.map((c) => c.id);
};
