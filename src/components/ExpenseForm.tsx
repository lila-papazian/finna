"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { storage } from "@/lib/storage";

export function ExpenseForm({
  onExpenseAdded,
}: {
  onExpenseAdded: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState<"ARS" | "USD">("ARS");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    storage.addExpense({
      amount: parseFloat(amount),
      currency,
      description,
      date: new Date().toISOString(),
    });

    setAmount("");
    setDescription("");
    onExpenseAdded();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div>
        <Label>Currency</Label>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as "ARS" | "USD")}
        >
          <option value="ARS">ARS (Pesos)</option>
          <option value="USD">USD (Dollars)</option>
        </select>
      </div>

      <Button type="submit">Add Expense</Button>
    </form>
  );
}
