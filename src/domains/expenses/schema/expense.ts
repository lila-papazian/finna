import { z } from "zod";

export const ExpenseSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().nonnegative(),
  currency: z.enum(["USD", "ARS"]),
  description: z.string().min(1),
  date: z.coerce.date(),
  category: z.string().min(1),
  accountId: z.string().min(1),
});

export const NewExpenseSchema = ExpenseSchema.omit({ id: true, accountId: true });

export const ExpenseArraySchema = ExpenseSchema.array();

