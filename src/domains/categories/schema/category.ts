import * as z from "zod";

export const ExpenseCategoryEnum = z.enum([
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Other",
]);

export const IncomeCategoryEnum = z.enum([
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Other",
]);

export const CategoryEnum = z.union([ExpenseCategoryEnum, IncomeCategoryEnum]);

