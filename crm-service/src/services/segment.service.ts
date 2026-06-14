import { segmentRepository } from "../repositories/segment.repository.js";
import { buildAudienceFromNL } from "../ai/services/audience.ai.service.js";
import {
  executeSegmentFilter,
  type FilterRules,
} from "../utilities/segment-filter.utility.js";
import type { CreateSegmentDTO } from "../validators/segment.validator.js";

export const segmentService = {
  async createSegment(data: CreateSegmentDTO) {
    const rules = data.filterRules as FilterRules;
    const { count } = await executeSegmentFilter(rules);
    return segmentRepository.create({ ...data, customerCount: count });
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
    const { count, sampleCustomers } = await executeSegmentFilter(rules);

    return {
      filterRules: aiResult.filterRules,
      explanation: aiResult.explanation,
      suggestedName: aiResult.suggestedName,
      warnings: aiResult.warnings,
      customerCount: count,
      sampleCustomers,
    };
  },
};
