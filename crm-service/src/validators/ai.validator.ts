import { z } from "zod";

export const CopilotSchema = z.object({
  segmentId: z.string().uuid(),
  channel: z.enum(["EMAIL", "SMS", "WHATSAPP"]),
  brandCategory: z.string().min(1),
});

export const NLAudienceSchema = z.object({
  query: z.string().min(5),
});

export type CopilotDTO = z.infer<typeof CopilotSchema>;
export type NLAudienceDTO = z.infer<typeof NLAudienceSchema>;
