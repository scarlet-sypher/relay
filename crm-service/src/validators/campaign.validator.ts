import { z } from "zod";

export const CreateCampaignSchema = z.object({
  name: z.string().min(1),
  segmentId: z.string().uuid(),
  channel: z.enum(["EMAIL", "SMS", "WHATSAPP"]),
  messageBody: z.string().min(1),
  subjectLine: z.string().optional(),
  scheduledAt: z.string().datetime().nullable().optional(),
});

export const LaunchCampaignSchema = z.object({
  campaignId: z.string().uuid(),
});

export type CreateCampaignDTO = z.infer<typeof CreateCampaignSchema>;
