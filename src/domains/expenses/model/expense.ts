import { z } from "zod";
import { ExpenseSchema, NewExpenseSchema } from "../schema/expense";

export type Expense = z.infer<typeof ExpenseSchema>;
export type NewExpense = z.infer<typeof NewExpenseSchema>;
