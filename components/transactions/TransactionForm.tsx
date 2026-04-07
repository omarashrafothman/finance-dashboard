"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categories } from "@/data/constants/transactionsCategory";
import { Transaction, TransactionType } from "@/types/transaction";
import { TransactionFormErrors, validateTransactionForm } from "@/functions/transactionValidation";

type TransactionDraft = Pick<Transaction, "title" | "amount" | "type" | "category" | "date" | "createdAt">;

export default function TransactionForm({
  initialValues,
  submitLabel,
  onSubmit,
  backHref = "/transactions",
  title,
  subtitle,
}: {
  initialValues: TransactionDraft;
  submitLabel: string;
  onSubmit: (values: TransactionDraft) => Promise<void>;
  backHref?: string;
  title: string;
  subtitle: string;
}) {
  const [values, setValues] = useState<TransactionDraft>(initialValues);
  const [errors, setErrors] = useState<TransactionFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const isDirty = useMemo(
    () =>
      values.title !== initialValues.title ||
      values.amount !== initialValues.amount ||
      values.type !== initialValues.type ||
      values.category !== initialValues.category ||
      values.date !== initialValues.date,
    [initialValues, values],
  );

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || isSubmitting) return;
      event.preventDefault();
      event.returnValue = "";
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (!isDirty || isSubmitting) return;
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("/")) return;
      const allowLeave = window.confirm("You have unsaved changes. Leave this page?");
      if (!allowLeave) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isDirty, isSubmitting]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateTransactionForm({
      title: values.title,
      amount: Number(values.amount),
      type: values.type as TransactionType,
      category: values.category,
      date: values.date,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={backHref}>Back</Link>
        </Button>
      </div>

      <form onSubmit={submit} className="space-y-6 rounded-2xl border border-border bg-card/95 p-6 shadow-sm backdrop-blur md:p-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-muted-foreground">
              Title
            </label>
            <Input
              id="title"
              value={values.title}
              onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter transaction title"
              className="h-10"
            />
            {errors.title ? <p className="text-xs text-destructive">{errors.title}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-muted-foreground">
              Date
            </label>
            <Input
              id="date"
              type="date"
              value={values.date}
              onChange={(e) => setValues((prev) => ({ ...prev, date: e.target.value }))}
              className="h-10"
            />
            {errors.date ? <p className="text-xs text-destructive">{errors.date}</p> : null}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-muted-foreground">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={String(values.amount)}
              onChange={(e) => setValues((prev) => ({ ...prev, amount: Number(e.target.value) || 0 }))}
              placeholder="0.00"
              className="h-10"
            />
            {errors.amount ? <p className="text-xs text-destructive">{errors.amount}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Type</label>
            <Select
              value={values.type}
              onValueChange={(value) => setValues((prev) => ({ ...prev, type: value as TransactionType }))}
            >
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
            {errors.type ? <p className="text-xs text-destructive">{errors.type}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Category</label>
            <Select value={values.category} onValueChange={(value) => setValues((prev) => ({ ...prev, category: value }))}>
              <SelectTrigger className="h-10 w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category ? <p className="text-xs text-destructive">{errors.category}</p> : null}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border pt-4">
          <Button type="button" variant="outline" asChild disabled={isSubmitting}>
            <Link href={backHref}>Cancel</Link>
          </Button>
          <Button type="submit" className="min-w-36" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
