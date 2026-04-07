"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TransactionForm from "@/components/transactions/TransactionForm";
import { useTransactions } from "@/lib/hooks/useTransactions";

export default function TransactionDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const transactionId = params?.id ?? "";
  const { transactions, loading, updateTransaction } = useTransactions();

  const transaction = useMemo(
    () => transactions.find((item) => item.id === transactionId),
    [transactions, transactionId],
  );

  if (loading && !transaction) {
    return <p className="p-6 text-muted-foreground">Loading transaction...</p>;
  }

  if (!loading && !transaction) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 p-6">
        <h1 className="text-2xl font-bold text-primary">Edit Transaction</h1>
        <p className="text-muted-foreground">Transaction not found.</p>
        <Button asChild>
          <Link href="/transactions">Back to Transactions</Link>
        </Button>
      </div>
    );
  }

  return (
    <TransactionForm
      title="Edit Transaction"
      subtitle="Update your transaction details."
      submitLabel="Save Changes"
      onSubmit={async (values) => {
        if (!transaction) return;
        try {
          await updateTransaction({
            id: transaction.id,
            title: values.title.trim(),
            amount: Number(values.amount),
            type: values.type,
            category: values.category,
            date: values.date,
            createdAt: values.createdAt || transaction.createdAt,
          });
          toast.success("Transaction updated successfully");
          router.push("/transactions");
        } catch {
          toast.error("Failed to update transaction. Changes were rolled back.");
        }
      }}
      initialValues={{
        title: transaction?.title ?? "",
        amount: transaction?.amount ?? 0,
        type: transaction?.type ?? "expense",
        category: transaction?.category ?? "",
        date: transaction?.date ?? "",
        createdAt: transaction?.createdAt ?? new Date().toISOString(),
      }}
    />
  );
}
