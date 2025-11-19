import { z } from "zod";

export const AmountFilterSchema = z.object({
  type: z.enum(["gt", "lt"]), // greater than / less than
  value: z.number().nonnegative(),
});

export const DateRangeSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date(),
}).refine((d) => d.from <= d.to, "Invalid date range");

export const ExpenseFiltersSchema = z.object({
  amount: AmountFilterSchema.optional(),
  currency: z.string().optional(),
  category: z.string().optional(),
  date: DateRangeSchema.optional(),
  accountId: z.string().optional(),
});

export type ExpenseFilters = z.infer<typeof ExpenseFiltersSchema>;
