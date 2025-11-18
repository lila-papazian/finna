"use client";

import { storage, type Expense } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ExpenseList({
  expenses,
  onDelete,
}: {
  expenses: Expense[];
  onDelete: () => void;
}) {
  const handleDelete = (id: string) => {
    storage.deleteExpense(id);
    onDelete();
  };

  if (expenses.length === 0) {
    return <p>No expenses yet. Add your first one!</p>;
  }

  return (
    <div>
      {expenses.map((expense) => (
        <Card key={expense.id}>
          <div>
            <strong>{expense.description}</strong>
            <span>
              {expense.currency} {expense.amount.toFixed(2)}
            </span>
            <span>{new Date(expense.date).toLocaleDateString()}</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(expense.id)}
            >
              Delete
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
