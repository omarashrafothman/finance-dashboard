import { Transaction, TransactionType } from "@/types/transaction";

export interface TransactionFilters {
  fromDate: string;
  toDate: string;
  category: string;
  type: "all" | TransactionType;
}

export type TransactionSortField = "createdAt" | "date" | "amount";
export type TransactionSortOrder = "asc" | "desc";

export interface TransactionSort {
  field: TransactionSortField;
  order: TransactionSortOrder;
}

export const filterTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] => {
  return transactions.filter((tx) => {
    const matchCategory = filters.category === "all" || tx.category === filters.category;
    const matchType = filters.type === "all" || tx.type === filters.type;
    const matchFromDate = !filters.fromDate || tx.date >= filters.fromDate;
    const matchToDate = !filters.toDate || tx.date <= filters.toDate;

    return matchCategory && matchType && matchFromDate && matchToDate;
  });
};

export const sortTransactions = (
  transactions: Transaction[],
  sort: TransactionSort,
): Transaction[] => {
  return [...transactions].sort((a, b) => {
    let diff = 0;

    if (sort.field === "amount") {
      diff = a.amount - b.amount;
    } else if (sort.field === "createdAt") {
      diff = new Date(a.createdAt ?? a.date).getTime() - new Date(b.createdAt ?? b.date).getTime();
    } else {
      diff = new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    return sort.order === "asc" ? diff : -diff;
  });
};

export const getVisibleTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters,
  sort: TransactionSort,
): Transaction[] => {
  const filtered = filterTransactions(transactions, filters);
  return sortTransactions(filtered, sort);
};
