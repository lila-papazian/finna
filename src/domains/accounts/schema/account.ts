import { z } from "zod";

export const AccountSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  currency: z.enum(["USD", "ARS"]),
  description: z.string().min(3).optional(),
  balance: z.number().nonnegative().optional(),
});

export const NewAccountSchema = AccountSchema.omit({ id: true });

export const AccountArraySchema = AccountSchema.array();