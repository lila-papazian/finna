"use client";
"use no memo";

import React from "react";
import { columns } from "./columns";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { Expense } from "@/domains/expenses/model/expense";
import { CATEGORIES } from "@/lib/storage";

type DateFilter = "this-month" | "last-month" | "custom" | "all";

interface DataTableProps {
  data: Expense[];
  accounts: Array<{ id: string; name: string }>;
}

export function DataTable({ data, accounts }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Custom filters
  const [dateFilter, setDateFilter] = React.useState<DateFilter>("this-month");
  const [customStartDate, setCustomStartDate] = React.useState("");
  const [customEndDate, setCustomEndDate] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");
  const [currencyFilter, setCurrencyFilter] = React.useState<string>("all");
  const [accountFilter, setAccountFilter] = React.useState<string>("all");

  // Apply custom filters
  const filteredData = React.useMemo(() => {
    let filtered = [...data];

    // Date filter
    const now = new Date();
    let startDate: Date, endDate: Date;

    switch (dateFilter) {
      case "this-month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0,
          23,
          59,
          59
        );
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= endDate;
        });
        break;
      case "last-month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        filtered = filtered.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= startDate && itemDate <= endDate;
        });
        break;
      case "custom":
        if (customStartDate) {
          startDate = new Date(customStartDate);
          filtered = filtered.filter(
            (item) => new Date(item.date) >= startDate
          );
        }
        if (customEndDate) {
          endDate = new Date(customEndDate + "T23:59:59");
          filtered = filtered.filter((item) => new Date(item.date) <= endDate);
        }
        break;
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Currency filter
    if (currencyFilter !== "all") {
      filtered = filtered.filter((item) => item.currency === currencyFilter);
    }

    // Account filter
    if (accountFilter !== "all") {
      filtered = filtered.filter((item) => item.accountId === accountFilter);
    }

    return filtered;
  }, [
    data,
    dateFilter,
    customStartDate,
    customEndDate,
    categoryFilter,
    currencyFilter,
    accountFilter,
  ]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      {/* Filters Section */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <h3 className="text-lg font-semibold">Filters</h3>

        {/* Quick Date Filters */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={dateFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilter("all")}
          >
            All Time
          </Button>
          <Button
            variant={dateFilter === "this-month" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilter("this-month")}
          >
            This Month
          </Button>
          <Button
            variant={dateFilter === "last-month" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilter("last-month")}
          >
            Last Month
          </Button>
          <Button
            variant={dateFilter === "custom" ? "default" : "outline"}
            size="sm"
            onClick={() => setDateFilter("custom")}
          >
            Custom Range
          </Button>
        </div>

        {/* Custom Date Range */}
        {dateFilter === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Filter */}
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

          {/* Currency Filter */}
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

          {/* Account Filter */}
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
        </div>

        {/* Search by Description */}
        <div>
          <Label>Search Description</Label>
          <Input
            placeholder="Search expenses..."
            value={
              (table.getColumn("description")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
          />
        </div>

        {/* Results Summary */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredData.length} of {data.length} expenses
        </div>
      </div>

      {/* Column Visibility Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table.getAllLeafColumns().map((column) => {
              if (column.id === "select") return null;
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(v) => column.toggleVisibility(!!v)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table style={{ tableLayout: "fixed", width: "100%" }}>
          <TableHeader>
            {table.getHeaderGroups().map((hgroup) => (
              <TableRow key={hgroup.id}>
                {hgroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: `${header.getSize()}px` }}
                  >
                    {header.isPlaceholder
                      ? null
                      : header.column.columnDef.header instanceof Function
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: `${cell.column.getSize()}px` }}
                    >
                      {cell.column.columnDef.cell instanceof Function
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue()}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
