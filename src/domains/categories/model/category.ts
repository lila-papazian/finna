import * as z from "zod";
import { ExpenseCategoryEnum, IncomeCategoryEnum, CategoryEnum } from "../schema/category";

export type ExpenseCategory = z.infer<typeof ExpenseCategoryEnum>;
export type IncomeCategory = z.infer<typeof IncomeCategoryEnum>;
export type Category = z.infer<typeof CategoryEnum>;