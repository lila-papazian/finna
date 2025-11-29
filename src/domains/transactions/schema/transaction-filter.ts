import { CurrencyEnumSchema } from "@/domains/currencies/schema/currency";
import { z } from "zod";

export const AmountFilterSchema = z.object({
  type: z.enum(["gt", "lt"]), // greater than / less than
  value: z.number().nonnegative(),
});

export const DateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
}).refine((d) => d.from <= d.to, "Invalid date range");

export const TransactionFiltersSchema = z.object({
  amount: AmountFilterSchema.optional(),
  currency: CurrencyEnumSchema.optional(),
  category: z.string().optional(),
  date: DateRangeSchema.optional(),
  accountId: z.string().optional(),
});

