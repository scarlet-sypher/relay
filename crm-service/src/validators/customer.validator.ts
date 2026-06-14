import { z } from "zod";

export const CreateCustomerSchema = z.object({
  externalId: z.string().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  city: z.string().optional(),
  preferredChannel: z.enum(["EMAIL", "SMS", "WHATSAPP"]).default("EMAIL"),
});

export type CreateCustomerDTO = z.infer<typeof CreateCustomerSchema>;
