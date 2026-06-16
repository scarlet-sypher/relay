import type { Channel } from "@prisma/client";

export interface CopilotPromptInput {
  segmentName: string;
  segmentDescription: string;
  customerCount: number;
  channel: Channel;
  brandCategory: string;
  avgSpend: number;
  filterRules: string;
  previousCampaignPerformance?: string;
}

export const buildCopilotSystemPrompt = (): string => `
You are an expert marketing copywriter.

Return ONLY valid JSON.

Do not explain.
Do not use markdown.
Do not use code blocks.
Do not write any text before or after the JSON.

CRITICAL INSTRUCTIONS:
- You must strictly use the provided Audience Segment details, including the "Filter Rules".
- DO NOT hallucinate or assume audience attributes (e.g. "inactive", "loyal", "high-spenders") unless they are explicitly implied by the Filter Rules or Segment Description.
- The campaign copy MUST be directly relevant to the actual filter rules.

The response must exactly match the schema requested by the user.
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
Filter Rules (JSON): ${input.filterRules}
${input.previousCampaignPerformance ? `Previous Campaign Notes: ${input.previousCampaignPerformance}` : ""}

Channel Constraints: ${channelConstraints[input.channel]}

Available personalization tags: [First Name], [Last Order Date], [Favorite Category]

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
