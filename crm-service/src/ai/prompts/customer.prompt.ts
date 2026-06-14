export interface CustomerPromptInput {
  firstName: string;
  totalOrders: number;
  totalSpend: number;
  lastOrderAt: string | null;
  aiSegmentTags: string[];
  preferredChannel: string;
}

export const buildCustomerSystemPrompt = (): string => `
You are a customer intelligence AI for a D2C brand CRM called Relay.
Your job is to produce a one-line characterization of a customer and flag their risk or opportunity status.
You must always respond with valid JSON only. No markdown. No explanation outside the JSON.
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
