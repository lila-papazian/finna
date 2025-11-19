import { z } from "zod";
import { AccountSchema, NewAccountSchema } from "../schema/account";

export type Account = z.infer<typeof AccountSchema>;
export type NewAccount = z.infer<typeof NewAccountSchema>;