import * as z from "zod";
import { CurrencyEnumSchema } from "@/domains/currencies/schema/currency";

export const BaseTransactionSchema = z.object({
  id: z.uuid(),
  amount: z.coerce.number().nonnegative(),
  currency: CurrencyEnumSchema,
  accountId: z.string().min(1),
  date: z.date(),
  description: z.string().min(1).optional(),
});

export const BaseNewTransactionSchema = BaseTransactionSchema.omit({ id: true });

export const BaseNewTransactionFormSchema = z.object({
  amount: z.string().min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be greater than 0"
    }),
  currency: CurrencyEnumSchema,
  accountId: z.string(),
  description: z.string().optional(),
  date: z.date(),
});

export const TransactionTypeSchema = z.enum(["expense", "income"]);