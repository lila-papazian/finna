"use no memo";
"use client";
import { useCallback, useState } from "react";
import { Account } from "@/domains/accounts/model/account";
import { Transaction } from "@/domains/transactions/model/transaction";
import AddExpenseDialog from "@/domains/transactions/ui/add-expenses/add-expense-dialog";
import AddIncomeDialog from "@/domains/transactions/ui/add-expenses/add-income-dialog";
import { storage } from "@/lib/storage";
import { DataTable } from "@/components/ui/data-table/data-table";
import { NewIncomeForm } from "@/domains/transactions/model/income";
import { NewExpenseForm } from "@/domains/transactions/model/expense";
import { DEFAULT_CURRENCIES } from "@/lib/constants/currencies";

const mockAccounts: Account[] = [
  { id: "acc-123", name: "Checking Account", currency: "USD" },
  { id: "acc-333", name: "Savings Account", currency: "ARS" },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    storage.getTransactions()
  );

  const handleExpenseSubmit = useCallback(
    (formData: NewExpenseForm) => {
      const newExpense: Transaction = {
        id: crypto.randomUUID(),
        amount: Number(formData.amount),
        currency: formData.currency,
        category: formData.category,
        accountId: formData.accountId,
        date: formData.date,
        description: formData.description,
        type: "expense",
      };
      storage.addTransaction(newExpense);
      setTransactions(storage.getTransactions());
    },
    [setTransactions]
  );

  const handleIncomeSubmit = useCallback(
    (formData: NewIncomeForm) => {
      const newIncome: Transaction = {
        id: crypto.randomUUID(),
        amount: Number(formData.amount),
        currency: formData.currency,
        category: formData.category,
        accountId: formData.accountId,
        date: formData.date,
        description: formData.description,
        type: "income",
      };
      storage.addTransaction(newIncome);
      setTransactions(storage.getTransactions());
    },
    [setTransactions]
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
        <p className="text-gray-600">Manage and track all your transactions</p>
      </div>
      <AddExpenseDialog
        onSubmit={handleExpenseSubmit}
        accounts={mockAccounts}
        currencies={DEFAULT_CURRENCIES}
      />
      <AddIncomeDialog
        onSubmit={handleIncomeSubmit}
        accounts={mockAccounts}
        currencies={DEFAULT_CURRENCIES}
      />
      <DataTable data={transactions} accounts={mockAccounts} />
    </div>
  );
}
