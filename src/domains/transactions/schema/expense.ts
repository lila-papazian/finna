// domains/transactions/schema/expense.ts
import { z } from "zod";
import { ExpenseCategoryEnum } from "@/domains/categories/schema/category";
import {
  BaseTransactionSchema,
  BaseNewTransactionSchema,
  BaseNewTransactionFormSchema,
} from "./base";

export const ExpenseSchema = BaseTransactionSchema.extend({
  type: z.literal("expense"),
  category: ExpenseCategoryEnum,
});

export const NewExpenseSchema = BaseNewTransactionSchema.extend({
  type: z.literal("expense"),
  category: ExpenseCategoryEnum,
});

export const NewExpenseFormSchema = BaseNewTransactionFormSchema.extend({
  category: ExpenseCategoryEnum,
});

export const ExpenseArraySchema = ExpenseSchema.array();

