import { z } from "zod";
import { ExpenseSchema, NewExpenseFormSchema, NewExpenseSchema } from "../schema/expense";

export type Expense = z.infer<typeof ExpenseSchema>;
export type NewExpense = z.infer<typeof NewExpenseSchema>;
export type NewExpenseForm = z.infer<typeof NewExpenseFormSchema>;
