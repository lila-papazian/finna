import { Account } from "@/domains/accounts/model/account";
import { NewTransaction, Transaction } from "@/domains/transactions/model/transaction";
import { TransactionArraySchema } from "@/domains/transactions/schema/transaction";

const LOCAL_STORAGE_KEY = "finna_transactions"

export const storage = {

  getTransactions: (): Transaction[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw || raw === "[]") return [];
      
      const parsed = JSON.parse(raw);
      
      const withDates = parsed.map((t: any) => ({
        ...t,
        date: new Date(t.date),
      }));
      
      const res = TransactionArraySchema.parse(withDates);
      return res;
    } catch (error) {
      console.error("Error loading transactions:", error);
      return [];
    }
  },

  addTransaction: (transaction: NewTransaction): void => {
    if (typeof window === "undefined") return;
    
    try {
      const newTransaction: Transaction = {
        id: crypto.randomUUID(),
        ...transaction
      }
      const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
      const transactions = existing ? JSON.parse(existing) : [];
      
      const updated = [...transactions, newTransaction];
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      
      console.log("Saved transactions:", updated.length);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  },


  deleteTransaction: (id: string): void => {
    const expenses = storage.getTransactions().filter((e) => e.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
  },

  deleteTransactions: (ids: string[]): void => {
    const expenses = storage.getTransactions().filter((e) => !ids.includes(e.id));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(expenses));
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
