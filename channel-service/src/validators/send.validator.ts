import { z } from "zod";

const CommunicationPayloadSchema = z.object({
  communication_id: z.string().uuid(),
  recipient_address: z.string().min(1),
  message: z.string().min(1),
});

export const SendRequestSchema = z.object({
  campaign_id: z.string().uuid(),
  channel: z.enum(["EMAIL", "SMS", "WHATSAPP"]),
  communications: z
    .array(CommunicationPayloadSchema)
    .min(1, "At least one communication is required"),
  callback_url: z.string().url(),
});

export type SendRequestDTO = z.infer<typeof SendRequestSchema>;
