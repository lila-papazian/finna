import { DEFAULT_CURRENCIES } from "@/lib/constants/currencies";
import z from "zod";

export const CurrencyEnumSchema = z.enum(DEFAULT_CURRENCIES);