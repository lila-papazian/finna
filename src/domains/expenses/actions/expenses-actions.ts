"use server";
import { revalidatePath } from "next/cache";
import { storage } from "@/lib/storage";
import { NewExpense } from "../model/expense";
import { NewExpenseSchema } from "../schema/expense";

export async function createExpense(data: NewExpense) {
    const parsed = NewExpenseSchema.parse(data);
    // storage.addExpense(parsed);
    revalidatePath("/expenses");
}