"use client";

import { useState } from "react";
import { storage } from "@/lib/storage";

export default function Home() {
  const [expenses, setExpenses] = useState(() => storage.getExpenses());

  const refreshExpenses = () => {
    setExpenses(storage.getExpenses());
  };

  return (
    <main>
      <h1>Finna - Expense Tracker</h1>
    </main>
  );
}
