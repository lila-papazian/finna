"use client";
import React, { useEffect, useState } from "react";
import { Account } from "@/domains/accounts/model/account";
import { Transaction } from "@/domains/transactions/model/transaction";
import AddExpenseDialog from "@/domains/transactions/ui/add-expenses/add-expense-dialog";
import AddIncomeDialog from "@/domains/transactions/ui/add-expenses/add-income-dialog";
import { storage } from "@/lib/storage";
import { Button } from "@/components/button";
import { DataTable } from "@/components/ui/data-table/data-table";

const mockAccounts: Account[] = [
  { id: "acc-123", name: "Checking Account", currency: "USD" },
  { id: "acc-333", name: "Savings Account", currency: "ARS" },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const transactions = storage.getTransactions();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransactions(transactions);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">Manage and track all your transactions</p>
      </div>
      <AddExpenseDialog
        trigger={<Button variant="outline">Add Expense</Button>}
      />
      <AddIncomeDialog
        trigger={<Button variant="outline">Add Income</Button>}
      />
      <DataTable data={transactions} accounts={mockAccounts} />
    </div>
  );
}
