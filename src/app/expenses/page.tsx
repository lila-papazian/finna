"use client";

import { DataTable } from "@/components/ui/data-table/data-table";
import { Account } from "@/domains/accounts/model/account";
import { Expense } from "@/domains/expenses/model/expense";

const mockData: Expense[] = [
  {
    id: "1",
    category: "Food",
    description: "Groceries",
    amount: 50,
    date: new Date("2024-06-01"),
    currency: "USD",
    accountId: "acc-123",
  },
  {
    id: "2",
    category: "Transport",
    description: "Bus Ticket",
    amount: 3,
    date: new Date("2024-06-02"),
    currency: "ARS",
    accountId: "acc-123",
  },
  {
    id: "3",
    category: "Entertainment",
    description: "Movie",
    amount: 12,
    date: new Date("2024-06-03"),
    currency: "USD",
    accountId: "acc-123",
  },
  {
    id: "4",
    category: "Bills",
    description: "Electricity",
    amount: 75,
    date: new Date("2024-06-04"),
    currency: "ARS",
    accountId: "acc-123",
  },
  {
    id: "5",
    category: "Health",
    description: "Pharmacy",
    amount: 20,
    date: new Date("2024-06-05"),
    currency: "USD",
    accountId: "acc-333",
  },
  {
    id: "6",
    category: "Education",
    description: "Books",
    amount: 30,
    date: new Date("2024-06-06"),
    currency: "ARS",
    accountId: "acc-123",
  },
  {
    id: "7",
    category: "Travel",
    description: "Taxi",
    amount: 15,
    date: new Date("2024-06-07"),
    currency: "USD",
    accountId: "acc-333",
  },
  {
    id: "8",
    category: "Shopping",
    description: "Clothes",
    amount: 100,
    date: new Date("2024-06-08"),
    currency: "ARS",
    accountId: "acc-333",
  },
  
];

const mockAccounts: Account[] = [
  { id: "acc-123", name: "Checking Account", currency: "USD" },
  { id: "acc-333", name: "Savings Account", currency: "ARS" },
];

export default function ExpensesPage() {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h1>
        <p className="text-gray-600">Manage and track all your expenses</p>
      </div>

      <DataTable data={mockData} accounts={mockAccounts}/>
    </div>
  );
}
