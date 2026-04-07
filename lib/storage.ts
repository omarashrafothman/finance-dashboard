import { mockTransactions } from "@/data/transactions/mockTransactions";
import { Transaction } from "@/types/transaction";

export const TRANSACTIONS_KEY = "finance_transactions";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const parseTransactions = (raw: string | null): Transaction[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Transaction[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const readTransactions = (): Transaction[] => {
  if (typeof window === "undefined") return [];
  return parseTransactions(localStorage.getItem(TRANSACTIONS_KEY));
};

export const readTransactionsAsync = async (): Promise<Transaction[]> => {
  await delay(300);
  return readTransactions();
};

export const writeTransactions = async (transactions: Transaction[]): Promise<void> => {
  if (typeof window === "undefined") return;
  await delay(300);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};

export const seedTransactionsIfEmpty = async (): Promise<Transaction[]> => {
  if (typeof window === "undefined") return [];
  const current = readTransactions();
  if (current.length > 0) return current;
  await writeTransactions(mockTransactions);
  return mockTransactions;
};
