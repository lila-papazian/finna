import { Account } from "@/domains/accounts/model/account";
import { Expense } from "@/domains/expenses/model/expense";
import { ExpenseArraySchema } from "@/domains/expenses/schema/expense";

export const storage = {
  getExpenses: (): Expense[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = JSON.parse(localStorage.getItem("finna_expenses") || "[]");
      return ExpenseArraySchema.parse(raw);
    } catch {
      return [];
    }
  },

  addExpense: (expense: Omit<Expense, "id">): Expense => {
    const expenses = storage.getExpenses();
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    expenses.push(newExpense);
    localStorage.setItem("finna_expenses", JSON.stringify(expenses));
    return newExpense;
  },

  updateExpense: (id: string, updates: Partial<Expense>): void => {
    const expenses = storage.getExpenses();
    const index = expenses.findIndex((e) => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      localStorage.setItem("finna_expenses", JSON.stringify(expenses));
    }
  },

  deleteExpense: (id: string): void => {
    const expenses = storage.getExpenses().filter((e) => e.id !== id);
    localStorage.setItem("finna_expenses", JSON.stringify(expenses));
  },

  deleteExpenses: (ids: string[]): void => {
    const expenses = storage.getExpenses().filter((e) => !ids.includes(e.id));
    localStorage.setItem("finna_expenses", JSON.stringify(expenses));
  },

  // Accounts
  getAccounts: (): Account[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("finna_accounts");
    return data ? JSON.parse(data) : [];
  },

  addAccount: (account: Omit<Account, "id">): Account => {
    const accounts = storage.getAccounts();
    const newAccount = {
      ...account,
      id: crypto.randomUUID(),
    };
    accounts.push(newAccount);
    localStorage.setItem("finna_accounts", JSON.stringify(accounts));
    return newAccount;
  },

  updateAccount: (id: string, updates: Partial<Account>): void => {
    const accounts = storage.getAccounts();
    const index = accounts.findIndex((a) => a.id === id);
    if (index !== -1) {
      accounts[index] = { ...accounts[index], ...updates };
      localStorage.setItem("finna_accounts", JSON.stringify(accounts));
    }
  },

  deleteAccount: (id: string): void => {
    const accounts = storage.getAccounts().filter((a) => a.id !== id);
    localStorage.setItem("finna_accounts", JSON.stringify(accounts));
  },
};
