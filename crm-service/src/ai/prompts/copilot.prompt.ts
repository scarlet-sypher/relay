import type { Channel } from "@prisma/client";

export interface CopilotPromptInput {
  segmentName: string;
  segmentDescription: string;
  customerCount: number;
  channel: Channel;
  brandCategory: string;
  avgSpend: number;
  previousCampaignPerformance?: string;
}

export const buildCopilotSystemPrompt = (): string => `
You are an expert marketing copywriter for a D2C brand CRM platform called Relay.
Your job is to generate campaign message variants that are channel-appropriate, audience-aware, and conversion-focused.
You must always respond with valid JSON only. No markdown. No explanation outside the JSON.
`;

export const buildCopilotUserPrompt = (input: CopilotPromptInput): string => {
  const channelConstraints: Record<Channel, string> = {
    SMS: "Maximum 160 characters. No subject line needed. Be concise and direct.",
    EMAIL:
      "Include a subject line. Message can be longer. Professional but engaging tone.",
    WHATSAPP:
      "Maximum 1000 characters. Conversational tone. Can include emoji. No subject line needed.",
  };

  return `
Generate 3 campaign message variants for the following audience and channel.

Audience Segment: ${input.segmentName}
Segment Description: ${input.segmentDescription}
Customer Count: ${input.customerCount}
Channel: ${input.channel}
Brand Category: ${input.brandCategory}
Average Customer Spend: ₹${input.avgSpend}
${input.previousCampaignPerformance ? `Previous Campaign Notes: ${input.previousCampaignPerformance}` : ""}

Channel Constraints: ${channelConstraints[input.channel]}

Available personalization tags: {{first_name}}, {{last_order_date}}, {{favorite_product_category}}

Respond with this exact JSON structure:
{
  "variants": [
    {
      "tone": "Direct",
      "message": "...",
      "subject": "...(only for EMAIL, omit for SMS and WHATSAPP)",
      "reasoning": "..."
    },
    {
      "tone": "Warm",
      "message": "...",
      "subject": "...(only for EMAIL, omit for SMS and WHATSAPP)",
      "reasoning": "..."
    },
    {
      "tone": "Playful",
      "message": "...",
      "subject": "...(only for EMAIL, omit for SMS and WHATSAPP)",
      "reasoning": "..."
    }
  ],
  "confidenceNote": "..."
}
`;
};
