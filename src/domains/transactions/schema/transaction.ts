// domains/transactions/schema/transaction.ts
import { z } from "zod";
import { ExpenseSchema, NewExpenseSchema } from "./expense";
import { IncomeSchema, NewIncomeSchema } from "./income";

export const TransactionSchema = z.discriminatedUnion("type", [
  ExpenseSchema,
  IncomeSchema,
]);

export const NewTransactionSchema = z.discriminatedUnion("type", [
  NewExpenseSchema,
  NewIncomeSchema,
]);

export const TransactionArraySchema = TransactionSchema.array();

