import { segmentRepository } from "../repositories/segment.repository.js";
import { buildAudienceFromNL } from "../ai/services/audience.ai.service.js";
import {
  executeSegmentFilter,
  type FilterRules,
} from "../utilities/segment-filter.utility.js";
import type { CreateSegmentDTO } from "../validators/segment.validator.js";

const FIELD_ALIASES: Record<string, string> = {
  total_spend: "totalSpend",
  total_orders: "totalOrders",
  last_order_date: "lastOrderAt",
  lastOrderDate: "lastOrderAt",
};

const OP_ALIASES: Record<string, string> = {
  GT: "gt",
  GTE: "gte",
  LT: "lt",
  LTE: "lte",
  EQ: "eq",
};

const VALID_FIELDS = new Set([
  "totalSpend",
  "totalOrders",
  "lastOrderAt",
  "preferredChannel",
  "city",
  "aiSegmentTags",
]);

const VALID_OPERATORS = new Set([
  "gt",
  "gte",
  "lt",
  "lte",
  "eq",
  "contains",
  "days_ago_gte",
  "days_ago_lte",
]);

export const segmentService = {
  async createSegment(data: CreateSegmentDTO) {
    const rules = data.filterRules as FilterRules;
    const { count } = await executeSegmentFilter(rules);
    return segmentRepository.create({
      name: data.name,
      filterRules: data.filterRules,
      customerCount: count,
      ...(data.description !== undefined && {
        description: data.description,
      }),
      ...(data.nlQuery !== undefined && {
        nlQuery: data.nlQuery,
      }),
    });
  },

  async previewSegment(filterRules: FilterRules) {
    return executeSegmentFilter(filterRules);
  },

  async getAllSegments() {
    return segmentRepository.findAll();
  },

  async getSegmentById(id: string) {
    return segmentRepository.findById(id);
  },

  async buildFromNaturalLanguage(query: string) {
    const aiResult = await buildAudienceFromNL(query);

    const rules = aiResult.filterRules as FilterRules;

    if (!rules?.conditions?.length) {
      return {
        filterRules: aiResult.filterRules,
        explanation: aiResult.explanation,
        suggestedName: aiResult.suggestedName,
        warnings: aiResult.warnings,
        customerCount: 0,
        sampleCustomers: [],
        isValidAudience: false,
        message:
          "Unable to generate audience filters from the provided description.",
      };
    }

    // Normalize AI output
    rules.conditions = rules.conditions.map((condition) => ({
      ...condition,
      field: FIELD_ALIASES[condition.field] ?? condition.field,
      op: OP_ALIASES[condition.op] ?? condition.op,
    }));

    // Validate AI output
    for (const condition of rules.conditions) {
      if (!VALID_FIELDS.has(condition.field)) {
        throw new Error(`AI generated unsupported field: ${condition.field}`);
      }

      if (!VALID_OPERATORS.has(condition.op)) {
        throw new Error(`AI generated unsupported operator: ${condition.op}`);
      }
    }

    console.log("Generated Conditions:", rules.conditions);
    console.log("Condition Count:", rules.conditions.length);

    const { count, sampleCustomers } = await executeSegmentFilter(rules);

    return {
      filterRules: aiResult.filterRules,
      explanation: aiResult.explanation,
      suggestedName: aiResult.suggestedName,
      warnings: aiResult.warnings,
      customerCount: count,
      sampleCustomers,
      isValidAudience: true,
    };
  },
};
