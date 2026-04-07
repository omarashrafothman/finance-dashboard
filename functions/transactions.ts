import { Transaction } from "@/types/transaction";
import { readTransactions, writeTransactions } from "@/lib/storage";

export const getTransactions = (): Transaction[] => {
  return readTransactions();
};

export const saveTransactions = (transactions: Transaction[]): void => {
  void writeTransactions(transactions);
};

export const addTransaction = (transaction: Transaction) => {
  const transactions = getTransactions();
  transactions.push(transaction);
  saveTransactions(transactions);
};

export const updateTransaction = (updated: Transaction) => {
  const transactions = getTransactions();
  const index = transactions.findIndex((t) => t.id === updated.id);
  if (index !== -1) transactions[index] = updated;
  saveTransactions(transactions);
};

export const deleteTransaction = (id: string) => {
  const transactions = getTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  saveTransactions(filtered);
};
