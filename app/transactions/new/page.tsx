"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { categories } from "@/data/constants/transactionsCategory";
import TransactionForm from "@/components/transactions/TransactionForm";
import { useTransactions } from "@/lib/hooks/useTransactions";

export default function NewTransactionPage() {
  const router = useRouter();
  const { addTransaction } = useTransactions();

  const handleSubmit = async (values: {
    title: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: string;
    createdAt: string;
  }) => {
    try {
      await addTransaction({
        id: crypto.randomUUID(),
        title: values.title.trim(),
        amount: Number(values.amount),
        type: values.type,
        category: values.category,
        date: values.date,
        createdAt: values.createdAt || new Date().toISOString(),
      });
      toast.success("Transaction added successfully");
      router.push("/transactions");
    } catch {
      toast.error("Failed to save transaction. Changes were rolled back.");
    }
  };

  return (
    <TransactionForm
      title="Add Transaction"
      subtitle="Create a new income or expense record."
      submitLabel="Save Transaction"
      onSubmit={handleSubmit}
      initialValues={{
        title: "",
        amount: 0,
        type: "expense",
        category: categories[0] ?? "",
        date: "",
        createdAt: new Date().toISOString(),
      }}
    />
  );
}
