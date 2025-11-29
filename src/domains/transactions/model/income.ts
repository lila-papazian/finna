import { z } from "zod";
import { IncomeSchema, NewIncomeSchema, NewIncomeFormSchema } from "../schema/income";

export type Income = z.infer<typeof IncomeSchema>;
export type NewIncome = z.infer<typeof NewIncomeSchema>;
export type NewIncomeForm = z.infer<typeof NewIncomeFormSchema>;