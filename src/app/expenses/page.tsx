"use client";

import { useState, useEffect, useMemo } from "react";
import { storage, CATEGORIES, type Expense, type Account } from "@/lib/storage";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import styles from "./expenses.module.css";

type DateFilter = "this-month" | "last-month" | "custom";
type AmountFilter = "all" | "more-than" | "less-than";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isClient, setIsClient] = useState(false);

  // Filters
  const [dateFilter, setDateFilter] = useState<DateFilter>("this-month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [amountFilter, setAmountFilter] = useState<AmountFilter>("all");
  const [amountValue, setAmountValue] = useState("");
  const [accountFilter, setAccountFilter] = useState<string>("all");

  // Selection & Pagination
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Edit/Clone Dialog
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"edit" | "clone">("edit");

  useEffect(() => {
    setIsClient(true);
    refresh();
  }, []);

  const refresh = () => {
    setExpenses(storage.getExpenses());
    setAccounts(storage.getAccounts());
  };

  // Date range calculation
  const getDateRange = () => {
    const now = new Date();
    let start: Date, end: Date;

    switch (dateFilter) {
      case "this-month":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case "last-month":
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
      case "custom":
        start = customStartDate ? new Date(customStartDate) : new Date(0);
        end = customEndDate ? new Date(customEndDate + "T23:59:59") : now;
        break;
      default:
        start = new Date(0);
        end = now;
    }

    return { start, end };
  };

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    const { start, end } = getDateRange();

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      if (expenseDate < start || expenseDate > end) return false;
      if (categoryFilter !== "all" && expense.category !== categoryFilter)
        return false;
      if (currencyFilter !== "all" && expense.currency !== currencyFilter)
        return false;
      if (
        searchQuery &&
        !expense.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (amountFilter === "more-than" && amountValue) {
        if (expense.amount <= parseFloat(amountValue)) return false;
      }
      if (amountFilter === "less-than" && amountValue) {
        if (expense.amount >= parseFloat(amountValue)) return false;
      }
      if (accountFilter !== "all" && expense.accountId !== accountFilter)
        return false;

      return true;
    });
  }, [
    expenses,
    dateFilter,
    customStartDate,
    customEndDate,
    categoryFilter,
    currencyFilter,
    searchQuery,
    amountFilter,
    amountValue,
    accountFilter,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Totals
  const totals = useMemo(() => {
    const ars = filteredExpenses
      .filter((e) => e.currency === "ARS")
      .reduce((sum, e) => sum + e.amount, 0);
    const usd = filteredExpenses
      .filter((e) => e.currency === "USD")
      .reduce((sum, e) => sum + e.amount, 0);
    return { ars, usd };
  }, [filteredExpenses]);

  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedExpenses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedExpenses.map((e) => e.id)));
    }
  };

  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedIds.size} expense(s)?`)) {
      storage.deleteExpenses(Array.from(selectedIds));
      setSelectedIds(new Set());
      refresh();
    }
  };

  const handleDeleteOne = (id: string) => {
    if (confirm("Delete this expense?")) {
      storage.deleteExpense(id);
      refresh();
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleClone = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogMode("clone");
    setIsDialogOpen(true);
  };

  const handleSaveExpense = () => {
    if (!editingExpense) return;

    if (dialogMode === "edit") {
      storage.updateExpense(editingExpense.id, editingExpense);
    } else {
      const { id, ...expenseData } = editingExpense;
      storage.addExpense(expenseData);
    }

    setIsDialogOpen(false);
    setEditingExpense(null);
    refresh();
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h1>
        <p className="text-gray-600">Manage and track all your expenses</p>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>

        {/* Quick Date Filters */}
        <div className="flex gap-2 flex-wrap mb-4">
          <button
            className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
              dateFilter === "this-month"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            } ${styles.quickFilterButton}`}
            onClick={() => setDateFilter("this-month")}
          >
            This Month
          </button>
          <button
            className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
              dateFilter === "last-month"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            } ${styles.quickFilterButton}`}
            onClick={() => setDateFilter("last-month")}
          >
            Last Month
          </button>
          <button
            className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
              dateFilter === "custom"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            } ${styles.quickFilterButton}`}
            onClick={() => setDateFilter("custom")}
          >
            Custom Range
          </button>
        </div>

        {/* Custom Date Range */}
        {dateFilter === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <Label>Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Currency</Label>
            <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Currencies</SelectItem>
                <SelectItem value="ARS">ARS</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Account</Label>
            <Select value={accountFilter} onValueChange={setAccountFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Amount</Label>
            <Select
              value={amountFilter}
              onValueChange={(v: AmountFilter) => setAmountFilter(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Amounts</SelectItem>
                <SelectItem value="more-than">More than...</SelectItem>
                <SelectItem value="less-than">Less than...</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {amountFilter !== "all" && (
            <div>
              <Label>Amount Value</Label>
              <Input
                type="number"
                step="0.01"
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          )}
        </div>

        {/* Search */}
        <div>
          <Label>Search Description</Label>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search expenses..."
          />
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedIds.size} selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
              >
                Delete Selected
              </Button>
            </>
          )}
        </div>

        <div className="flex gap-6">
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Total ARS
            </div>
            <div className="text-xl font-bold text-blue-600">
              $ {totals.ars.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              Total USD
            </div>
            <div className="text-xl font-bold text-blue-600">
              $ {totals.usd.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {paginatedExpenses.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No expenses found
            </h3>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        selectedIds.size === paginatedExpenses.length &&
                        paginatedExpenses.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedExpenses.map((expense) => (
                  <TableRow key={expense.id} className={styles.tableRow}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.has(expense.id)}
                        onCheckedChange={() => handleSelectOne(expense.id)}
                      />
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="font-medium">
                      {expense.description}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {expense.category}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {expense.accountId
                        ? accounts.find((a) => a.id === expense.accountId)
                            ?.name || "-"
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        {expense.currency} {expense.amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className={styles.tableActions}>
                        <button
                          onClick={() => handleEdit(expense)}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleClone(expense)}
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title="Clone"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleDeleteOne(expense.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <div className="text-sm text-gray-600">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredExpenses.length)}{" "}
                of {filteredExpenses.length} expenses
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit/Clone Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "edit" ? "Edit" : "Clone"} Expense
            </DialogTitle>
            <DialogDescription>
              {dialogMode === "edit"
                ? "Update the expense details below"
                : "Create a new expense based on this one"}
            </DialogDescription>
          </DialogHeader>
          {editingExpense && (
            <div className="space-y-4">
              <div>
                <Label>Description</Label>
                <Input
                  value={editingExpense.description}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={editingExpense.amount}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      amount: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label>Currency</Label>
                <Select
                  value={editingExpense.currency}
                  onValueChange={(v: "ARS" | "USD") =>
                    setEditingExpense({ ...editingExpense, currency: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARS">ARS</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={editingExpense.category}
                  onValueChange={(v) =>
                    setEditingExpense({ ...editingExpense, category: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  type="date"
                  value={editingExpense.date.split("T")[0]}
                  onChange={(e) =>
                    setEditingExpense({
                      ...editingExpense,
                      date: new Date(e.target.value).toISOString(),
                    })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveExpense}>
              {dialogMode === "edit" ? "Save Changes" : "Create Copy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
