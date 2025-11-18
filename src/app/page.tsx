"use client";

import { useState } from "react";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { storage } from "@/lib/storage";

export default function Home() {
  const [expenses, setExpenses] = useState(() => storage.getExpenses());

  const refreshExpenses = () => {
    setExpenses(storage.getExpenses());
  };

  return (
    <main>
      <h1>Finna - Expense Tracker</h1>

      <section>
        <h2>Add Expense</h2>
        <ExpenseForm onExpenseAdded={refreshExpenses} />
      </section>

      <section>
        <h2>Your Expenses</h2>
        <ExpenseList expenses={expenses} onDelete={refreshExpenses} />
      </section>
    </main>
  );
}
