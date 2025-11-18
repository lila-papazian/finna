export interface Expense {
  id: string;
  amount: number;
  currency: 'ARS' | 'USD';
  description: string;
  date: string;
  category?: string;
}

export const storage = {
  getExpenses: (): Expense[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem('finna_expenses');
    return data ? JSON.parse(data) : [];
  },

  addExpense: (expense: Omit<Expense, 'id'>): Expense => {
    const expenses = storage.getExpenses();
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    expenses.push(newExpense);
    localStorage.setItem('finna_expenses', JSON.stringify(expenses));
    return newExpense;
  },

  deleteExpense: (id: string): void => {
    const expenses = storage.getExpenses().filter(e => e.id !== id);
    localStorage.setItem('finna_expenses', JSON.stringify(expenses));
  },
};