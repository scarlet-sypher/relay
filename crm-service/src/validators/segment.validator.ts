import { z } from "zod";

const FilterConditionSchema = z.object({
  field: z.string(),
  op: z.string(),
  value: z.unknown(),
});

const FilterRulesSchema = z.object({
  operator: z.enum(["AND", "OR"]),
  conditions: z.array(FilterConditionSchema),
});

export const CreateSegmentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  filterRules: FilterRulesSchema,
  nlQuery: z.string().optional(),
});

export const NLSegmentSchema = z.object({
  query: z.string().min(5),
});

export type CreateSegmentDTO = z.infer<typeof CreateSegmentSchema>;
export type NLSegmentDTO = z.infer<typeof NLSegmentSchema>;
