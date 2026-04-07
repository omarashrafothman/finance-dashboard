"use client";

import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";

export default function TransactionCard({
  transaction,
  onDelete,
}: {
  transaction: Transaction;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-primary/15 bg-background p-3">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold">{transaction.title}</p>
          <p className="text-xs text-muted-foreground">{transaction.date}</p>
        </div>
        <p className="text-sm font-semibold text-primary">{transaction.amount}</p>
      </div>
      <div className="mb-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="rounded bg-muted px-2 py-1">{transaction.category}</span>
        <span className="rounded bg-muted px-2 py-1 capitalize">{transaction.type}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="sm" className="flex-1" asChild>
          <Link href={`/transactions/${transaction.id}`}>
            <Edit className="size-4" />
            Edit
          </Link>
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="flex-1"
          onClick={() => onDelete(transaction.id)}
        >
          <Trash2 className="size-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}
