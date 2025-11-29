import * as z from "zod";
import { TransactionFiltersSchema } from "../schema/transaction-filter";

export type TransactionFilters = z.infer<typeof TransactionFiltersSchema>;
