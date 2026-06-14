export interface InsightPromptInput {
  campaignName: string;
  channel: string;
  segmentName: string;
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalOpened: number;
  totalRead: number;
  totalClicked: number;
  deliveryRate: number;
  openRate: number;
  clickRate: number;
}

export const buildInsightSystemPrompt = (): string => `
You are a marketing analyst AI.

Return ONLY valid JSON.

Do not explain.
Do not use markdown.
Do not use code blocks.
Do not write any text before or after the JSON.

Return exactly this schema:

{
  "narrative": "string",
  "recommendedAction": "string"
}
`;

export const buildInsightUserPrompt = (input: InsightPromptInput): string => `
Analyze this campaign performance data and generate an insight narrative.

Campaign: ${input.campaignName}
Channel: ${input.channel}
Audience: ${input.segmentName}

Stats:
- Sent: ${input.totalSent}
- Delivered: ${input.totalDelivered} (${input.deliveryRate}%)
- Failed: ${input.totalFailed}
- Opened: ${input.totalOpened}
- Read: ${input.totalRead}
- Clicked: ${input.totalClicked} (${input.clickRate}%)

Respond with this exact JSON structure:
{
  "narrative": "3-5 sentence plain English story of what happened, what worked, what didn't, and what to do next.",
  "recommendedAction": "One specific, actionable next step for the marketer."
}
`;
