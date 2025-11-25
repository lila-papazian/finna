import { z } from "zod";
import { CurrencyEnumSchema } from "../schema/currency";

export type CurrencyEnum = z.infer<typeof CurrencyEnumSchema>;