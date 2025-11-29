import { z } from "zod";
import { IncomeCategoryEnum } from "@/domains/categories/schema/category";
import {
  BaseTransactionSchema,
  BaseNewTransactionSchema,
  BaseNewTransactionFormSchema,
} from "./base";

export const IncomeSchema = BaseTransactionSchema.extend({
  type: z.literal("income"),
  category: IncomeCategoryEnum,
});

export const NewIncomeSchema = BaseNewTransactionSchema.extend({
  type: z.literal("income"),
  category: IncomeCategoryEnum,
});

export const NewIncomeFormSchema = BaseNewTransactionFormSchema.extend({
  category: IncomeCategoryEnum,
});

export const IncomeArraySchema = IncomeSchema.array();