export interface MessageVariant {
  tone: "Direct" | "Warm" | "Playful";
  message: string;
  subject?: string;
  reasoning: string;
}

export interface CopilotResponse {
  variants: MessageVariant[];
  confidenceNote: string;
}

export interface FilterConditionAI {
  field: string;
  op: string;
  value: unknown;
}

export interface FilterRulesAI {
  operator: "AND" | "OR";
  conditions: FilterConditionAI[];
}

export interface AudienceBuilderResponse {
  filterRules: FilterRulesAI;
  explanation: string;
  suggestedName: string;
  warnings: string[];
}

export interface InsightResponse {
  narrative: string;
  recommendedAction: string;
}

export interface CustomerInsightResponse {
  summary: string;
  riskFlag: "churn_risk" | "upsell_opportunity" | "loyal_advocate" | "neutral";
}
