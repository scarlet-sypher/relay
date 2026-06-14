export interface CustomerPromptInput {
  firstName: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderAt: string | null;
  aiSegmentTags: string[];
  preferredChannel: string;
}

export const buildCustomerSystemPrompt = (): string => `
You are a customer intelligence AI.

Return ONLY valid JSON.

Do not explain.
Do not use markdown.
Do not use code blocks.
Do not write any text before or after the JSON.

Return exactly this schema:

{
  "summary": "string",
  "riskFlag": "churn_risk | upsell_opportunity | loyal_advocate | neutral"
}
`;

export const buildCustomerUserPrompt = (input: CustomerPromptInput): string => `
Generate a customer insight for this shopper:

Name: ${input.firstName}
Total Orders: ${input.totalOrders}
Total Spend: ₹${input.totalSpend}
Last Order: ${input.lastOrderAt ?? "Never"}
Segment Tags: ${input.aiSegmentTags.join(", ") || "None"}
Preferred Channel: ${input.preferredChannel}

Respond with this exact JSON structure:
{
  "summary": "One sentence characterization of this customer.",
  "riskFlag": "churn_risk | upsell_opportunity | loyal_advocate | neutral"
}
`;
