"use client";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Edit, SlidersHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { List, type RowComponentProps } from "react-window";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { categories } from "@/data/constants/transactionsCategory";
import {
  TransactionFilters,
  TransactionSort,
} from "@/functions/transactionsTable";
import { useTransactions } from "@/lib/hooks/useTransactions";
import TransactionCard from "@/components/transactions/TransactionCard";
import { Transaction } from "@/types/transaction";

type MobileRowProps = {
  items: Transaction[];
  onDelete: (id: string) => void;
};

const MobileRow = ({ index, style, items, onDelete }: RowComponentProps<MobileRowProps>) => {
  const tx = items[index];
  return (
    <div style={style} className="px-1 pb-3">
      <TransactionCard transaction={tx} onDelete={onDelete} />
    </div>
  );
};

type DesktopRowProps = {
  items: Transaction[];
  onDelete: (id: string) => void;
};

const DesktopRow = ({ index, style, items, onDelete }: RowComponentProps<DesktopRowProps>) => {
  const tx = items[index];
  return (
    <div
      style={style}
      className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.2fr] items-center border-t border-primary/10 px-4 text-sm hover:bg-primary/5"
    >
      <p className="font-medium">{tx.title}</p>
      <p>{tx.category}</p>
      <p className="capitalize">{tx.type}</p>
      <p>{tx.date}</p>
      <p className="text-right font-semibold">{tx.amount}</p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm" asChild>
          <Link href={`/transactions/${tx.id}`}>
            <Edit className="size-4" />
            Edit
          </Link>
        </Button>
        <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(tx.id)}>
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default function TransactionsPage() {
  const ITEMS_PER_PAGE = 7;
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { visibleTransactions, loading, filters, sort, setFilters, setSort, deleteTransaction, resetFiltersAndSort } =
    useTransactions();

  const totalPages = Math.max(1, Math.ceil(visibleTransactions.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedTransactions = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return visibleTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [visibleTransactions, safeCurrentPage]);
  const shouldVirtualize = visibleTransactions.length > 50;
  const displayedTransactions = shouldVirtualize ? visibleTransactions : paginatedTransactions;
  const mobileRowProps = useMemo(
    () => ({ items: displayedTransactions, onDelete: (id: string) => setTransactionToDelete(id) }),
    [displayedTransactions],
  );
  const desktopRowProps = useMemo(
    () => ({ items: displayedTransactions, onDelete: (id: string) => setTransactionToDelete(id) }),
    [displayedTransactions],
  );

  const updateFilters = useCallback((updater: (prev: TransactionFilters) => TransactionFilters) => {
    setFilters((prev) => updater(prev));
    setCurrentPage(1);
  }, [setFilters]);

  const updateSort = useCallback((updater: (prev: TransactionSort) => TransactionSort) => {
    setSort((prev) => updater(prev));
    setCurrentPage(1);
  }, [setSort]);

  const handleConfirmDelete = useCallback(async () => {
    if (!transactionToDelete) return;
    try {
      await deleteTransaction(transactionToDelete);
      setTransactionToDelete(null);
      toast.success("Transaction deleted successfully");
    } catch {
      toast.error("Failed to delete transaction. Changes were rolled back.");
    }
  }, [deleteTransaction, transactionToDelete]);

  const resetControls = useCallback(() => {
    resetFiltersAndSort();
    setCurrentPage(1);
  }, [resetFiltersAndSort]);

  const handleFromDateChange = useCallback(
    (value: string) => updateFilters((prev) => ({ ...prev, fromDate: value })),
    [updateFilters],
  );
  const handleToDateChange = useCallback(
    (value: string) => updateFilters((prev) => ({ ...prev, toDate: value })),
    [updateFilters],
  );
  const handleCategoryChange = useCallback(
    (value: string) => updateFilters((prev) => ({ ...prev, category: value })),
    [updateFilters],
  );
  const handleTypeChange = useCallback(
    (value: string) => updateFilters((prev) => ({ ...prev, type: value as TransactionFilters["type"] })),
    [updateFilters],
  );
  const handleSortFieldChange = useCallback(
    (value: string) => updateSort((prev) => ({ ...prev, field: value as TransactionSort["field"] })),
    [updateSort],
  );
  const handleSortOrderChange = useCallback(
    (value: string) => updateSort((prev) => ({ ...prev, order: value as TransactionSort["order"] })),
    [updateSort],
  );

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-primary">Transactions</h1>
        <Button asChild>
          <Link href="/transactions/new">Add Transaction</Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-primary/20 bg-card shadow-sm">
        <div className="border-b border-primary/15 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-4 md:p-5">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-lg border border-primary/20 bg-background p-2">
                <SlidersHorizontal className="size-4 text-primary" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-primary">Filters & Sorting</h2>
                <p className="text-xs text-muted-foreground">Refine your transactions list</p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={resetControls}
            >
              Reset
            </Button>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <div className="space-y-2 rounded-lg border border-primary/15 bg-background p-3">
              <p className="text-xs font-medium text-muted-foreground">From Date</p>
              <Input
                type="date"
                value={filters.fromDate}
                onChange={(e) => handleFromDateChange(e.target.value)}
              />
            </div>

            <div className="space-y-2 rounded-lg border border-primary/15 bg-background p-3">
              <p className="text-xs font-medium text-muted-foreground">To Date</p>
              <Input
                type="date"
                value={filters.toDate}
                onChange={(e) => handleToDateChange(e.target.value)}
              />
            </div>

            <div className="space-y-2 rounded-lg border border-primary/15 bg-background p-3">
              <p className="text-xs font-medium text-muted-foreground">Category</p>
              <Select
                value={filters.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 rounded-lg border border-primary/15 bg-background p-3">
              <p className="text-xs font-medium text-muted-foreground">Type</p>
              <Select
                value={filters.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 rounded-lg border border-primary/15 bg-background p-3">
              <p className="text-xs font-medium text-muted-foreground">Sort By</p>
              <Select
                value={sort.field}
                onValueChange={handleSortFieldChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Newest Added</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 rounded-lg border border-primary/15 bg-background p-3">
              <p className="text-xs font-medium text-muted-foreground">Order</p>
              <Select
                value={sort.order}
                onValueChange={handleSortOrderChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-3 md:hidden">
          {loading ? (
            <p className="rounded-lg border border-border bg-background p-4 text-center text-sm text-muted-foreground">
              Loading transactions...
            </p>
          ) : displayedTransactions.length === 0 ? (
            <p className="rounded-lg border border-border bg-background p-4 text-center text-sm text-muted-foreground">
              No transactions found.
            </p>
          ) : shouldVirtualize ? (
            <List
              rowCount={displayedTransactions.length}
              rowHeight={202}
              rowComponent={MobileRow}
              rowProps={mobileRowProps}
              style={{ height: 560, width: "100%" }}
            />
          ) : (
            displayedTransactions.map((tx) => (
              <TransactionCard key={tx.id} transaction={tx} onDelete={(id) => setTransactionToDelete(id)} />
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          {loading ? (
            <div className="px-4 py-8 text-center text-muted-foreground">Loading transactions...</div>
          ) : displayedTransactions.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">No transactions found.</div>
          ) : shouldVirtualize ? (
            <div>
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1.2fr] bg-primary/10 px-4 py-3 text-sm font-medium text-primary/90">
                <p>Title</p>
                <p>Category</p>
                <p>Type</p>
                <p>Date</p>
                <p className="text-right">Amount</p>
                <p className="text-right">Actions</p>
              </div>
              <List
                rowCount={displayedTransactions.length}
                rowHeight={64}
                rowComponent={DesktopRow}
                rowProps={desktopRowProps}
                style={{ height: 560, width: "100%" }}
              />
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-primary/10">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-primary/90">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-primary/90">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-primary/90">Type</th>
                  <th className="px-4 py-3 text-left font-medium text-primary/90">Date</th>
                  <th className="px-4 py-3 text-right font-medium text-primary/90">Amount</th>
                  <th className="px-4 py-3 text-right font-medium text-primary/90">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedTransactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-primary/10 hover:bg-primary/5">
                    <td className="px-4 py-3 font-medium">{tx.title}</td>
                    <td className="px-4 py-3">{tx.category}</td>
                    <td className="px-4 py-3 capitalize">{tx.type}</td>
                    <td className="px-4 py-3">{tx.date}</td>
                    <td className="px-4 py-3 text-right font-semibold">{tx.amount}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" asChild>
                          <Link href={`/transactions/${tx.id}`}>
                            <Edit className="size-4" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => setTransactionToDelete(tx.id)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && visibleTransactions.length > 0 && !shouldVirtualize ? (
          <div className="flex flex-col items-start justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center">
            <p className="text-xs text-muted-foreground">
              Showing {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}-
              {Math.min(safeCurrentPage * ITEMS_PER_PAGE, visibleTransactions.length)} of{" "}
              {visibleTransactions.length}
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
              >
                Previous
              </Button>

              <div className="hidden items-center gap-2 md:flex">
                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <Button
                      key={page}
                      type="button"
                      size="sm"
                      variant={safeCurrentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <span className="text-xs text-muted-foreground md:hidden">
                Page {safeCurrentPage} / {totalPages}
              </span>

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={safeCurrentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <Dialog open={transactionToDelete !== null} onOpenChange={(open) => !open && setTransactionToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete transaction?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setTransactionToDelete(null)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmDelete}>
              OK, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}