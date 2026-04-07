import { TransactionType } from "@/types/transaction";

export interface TransactionFormValues {
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
}

export interface TransactionFormErrors {
  title?: string;
  amount?: string;
  type?: string;
  category?: string;
  date?: string;
}

export const validateTransactionForm = (
  values: TransactionFormValues,
): { isValid: boolean; errors: TransactionFormErrors } => {
  const title = values.title.trim();
  const amount = Number(values.amount);
  const errors: TransactionFormErrors = {};

  if (!title) {
    errors.title = "Title is required.";
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Amount must be a valid number greater than 0.";
  }

  if (values.type !== "income" && values.type !== "expense") {
    errors.type = "Type must be either income or expense.";
  }

  if (!values.category.trim()) {
    errors.category = "Category is required.";
  }

  if (!values.date) {
    errors.date = "Date is required.";
  }

  const parsedDate = new Date(values.date);
  if (Number.isNaN(parsedDate.getTime())) {
    errors.date = "Date is invalid.";
  } else {
    const today = new Date();
    const selected = new Date(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (selected > todayOnly) {
      errors.date = "Date can't be in the future.";
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
};
