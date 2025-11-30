import * as z from "zod";
import { expenseKeys } from "@/lib/constants/default-expenses-categories";
import { incomeKeys } from "@/lib/constants/default-incomes-categories";

export const ExpenseCategoryEnum = z.enum(expenseKeys as [string, ...string[]]);
export const IncomeCategoryEnum = z.enum(incomeKeys as [string, ...string[]]);

export type ExpenseCategory = z.infer<typeof ExpenseCategoryEnum>;
export type IncomeCategory = z.infer<typeof IncomeCategoryEnum>;
