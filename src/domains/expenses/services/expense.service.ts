import { Expense } from "../model/expense";
import { ExpenseFilters } from "../schema/expense-filter";

export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFilters
): Expense[] {
  return expenses.filter((e) => {
    // amount
    if (filters.amount) {
      if (filters.amount.type === "gt" && e.amount <= filters.amount.value) {
        return false;
      }
      if (filters.amount.type === "lt" && e.amount >= filters.amount.value) {
        return false;
      }
    }

    // currency
    if (filters.currency && e.currency !== filters.currency) {
      return false;
    }

    // category
    if (filters.category && e.category !== filters.category) {
      return false;
    }

    // accountId
    if (filters.accountId && e.accountId !== filters.accountId) {
      return false;
    }

    // date range
    if (filters.date) {
      const d = e.date;
      if (d < filters.date.from || d > filters.date.to) {
        return false;
      }
    }

    return true;
  });
}
