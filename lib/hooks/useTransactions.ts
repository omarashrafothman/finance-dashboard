"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { Transaction } from "@/types/transaction";
import { useTransactionStore } from "@/lib/zustand/useTransactionStore";
import { readTransactionsAsync, seedTransactionsIfEmpty, writeTransactions } from "@/lib/storage";
import { getVisibleTransactions, TransactionFilters, TransactionSort } from "@/functions/transactionsTable";

const defaultFilters: TransactionFilters = {
  fromDate: "",
  toDate: "",
  category: "all",
  type: "all",
};

const defaultSort: TransactionSort = {
  field: "createdAt",
  order: "desc",
};

export function useTransactions() {
  const { transactions, loading, error, setTransactions, setLoading, setError } = useTransactionStore(
    useShallow((state) => ({
      transactions: state.transactions,
      loading: state.loading,
      error: state.error,
      setTransactions: state.setTransactions,
      setLoading: state.setLoading,
      setError: state.setError,
    })),
  );

  const [filters, setFilters] = useState<TransactionFilters>(defaultFilters);
  const [sort, setSort] = useState<TransactionSort>(defaultSort);
  const [saving, setSaving] = useState(false);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const seeded = await seedTransactionsIfEmpty();
      const data = seeded.length > 0 ? seeded : await readTransactionsAsync();
      setTransactions(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, [setError, setLoading, setTransactions]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const visibleTransactions = useMemo(
    () => getVisibleTransactions(transactions, filters, sort),
    [transactions, filters, sort],
  );

  const persistWithRollback = useCallback(
    async (nextTransactions: Transaction[], previousTransactions: Transaction[]) => {
      setSaving(true);
      try {
        await writeTransactions(nextTransactions);
      } catch (persistError) {
        setTransactions(previousTransactions);
        setError(persistError instanceof Error ? persistError.message : "Failed to save transactions.");
        throw persistError;
      } finally {
        setSaving(false);
      }
    },
    [setError, setTransactions],
  );

  const addTransaction = useCallback(
    async (transaction: Transaction) => {
      const previous = transactions;
      const next = [transaction, ...previous];
      setTransactions(next);
      await persistWithRollback(next, previous);
    },
    [persistWithRollback, setTransactions, transactions],
  );

  const updateTransaction = useCallback(
    async (transaction: Transaction) => {
      const previous = transactions;
      const next = previous.map((item) => (item.id === transaction.id ? transaction : item));
      setTransactions(next);
      await persistWithRollback(next, previous);
    },
    [persistWithRollback, setTransactions, transactions],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const previous = transactions;
      const next = previous.filter((item) => item.id !== id);
      setTransactions(next);
      await persistWithRollback(next, previous);
    },
    [persistWithRollback, setTransactions, transactions],
  );

  const resetFiltersAndSort = useCallback(() => {
    setFilters(defaultFilters);
    setSort(defaultSort);
  }, []);

  return {
    transactions,
    visibleTransactions,
    loading,
    error,
    saving,
    filters,
    sort,
    setFilters,
    setSort,
    setError,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    loadTransactions,
    resetFiltersAndSort,
  };
}
