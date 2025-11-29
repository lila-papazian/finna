import { Account } from "@/domains/accounts/model/account";
import { NewTransaction, Transaction } from "@/domains/transactions/model/transaction";
import { ExpenseArraySchema } from "@/domains/transactions/schema/expense";


export const storage = {

  // Transactions
  getTransactions: ():Transaction[] => {
      if (typeof window === "undefined") return [];
    try {
      const raw = JSON.parse(localStorage.getItem("finna_transactions") || "[]");
      return ExpenseArraySchema.parse(raw);
    } catch {
      return [];
    }
  },

 addTransaction: (transaction: NewTransaction): void => {
    const expenses = storage.getTransactions();
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    expenses.push(newTransaction);
    localStorage.setItem("finna_transactions", JSON.stringify(expenses));
  },


  deleteTransaction: (id: string): void => {
    const expenses = storage.getTransactions().filter((e) => e.id !== id);
    localStorage.setItem("finna_transactions", JSON.stringify(expenses));
  },

  deleteTransactions: (ids: string[]): void => {
    const expenses = storage.getTransactions().filter((e) => !ids.includes(e.id));
    localStorage.setItem("finna_transactions", JSON.stringify(expenses));
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
