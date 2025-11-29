import { z } from "zod";
import { NewTransactionSchema, TransactionSchema } from "../schema/transaction";

export type Transaction = z.infer<typeof TransactionSchema>;
export type NewTransaction = z.infer<typeof NewTransactionSchema>