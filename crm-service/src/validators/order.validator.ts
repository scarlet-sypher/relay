import { z } from "zod";

export const CreateOrderSchema = z.object({
  customerId: z.string().uuid(),
  orderNumber: z.string().min(1),
  amount: z.number().positive(),
  productCategory: z.string().optional(),
  channel: z.string().optional(),
});

export type CreateOrderDTO = z.infer<typeof CreateOrderSchema>;
