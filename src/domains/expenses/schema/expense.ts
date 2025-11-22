import { z } from "zod";
import { CategoryEnum } from "@/domains/categories/schema/category";
import { CurrencyEnum } from "@/domains/currencies/schema/currency";

export const ExpenseSchema = z.object({
  id: z.uuid(),
  amount: z.coerce.number().nonnegative(),
  currency: CurrencyEnum,
  category: CategoryEnum,
  accountId: z.string().min(1),
  date: z.date(),
  description: z.string().min(1).optional(),
});

export const NewExpenseSchema = ExpenseSchema.omit({ id: true });

export const NewExpenseFormSchema = z.object({
  amount: z.string().min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Amount must be greater than 0"
    }),
  currency: CurrencyEnum,
  category: CategoryEnum,
  accountId: z.string(),
  description: z.string().optional(),
  date: z.date(),
});

export const ExpenseArraySchema = ExpenseSchema.array();

