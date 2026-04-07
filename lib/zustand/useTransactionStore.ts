import { create } from "zustand";
import { Transaction } from "@/types/transaction";

interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  setTransactions: (updater: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void;
  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  loading: true,
  error: null,
  setTransactions: (updater) =>
    set((state) => ({
      transactions: updater instanceof Function ? updater(state.transactions) : updater,
    })),
  setLoading: (value) => set({ loading: value }),
  setError: (value) => set({ error: value }),
}));
