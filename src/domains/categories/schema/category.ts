import z from "zod";
import { DEFAULT_CATEGORIES } from "@/lib/constants/categories";

export const CategoryEnum = z.enum(
  DEFAULT_CATEGORIES.map(c => c.key) as [string, ...string[]]
);