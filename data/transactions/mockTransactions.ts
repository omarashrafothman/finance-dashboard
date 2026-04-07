import { Transaction, TransactionType } from "@/types/transaction";
// import  categories  from "@/data/constants/transactionsCategory";
import { categories } from "@/data/constants/transactionsCategory";
const randomAmount = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const types: TransactionType[] = ["income", "expense"];
const now = new Date();

export const mockTransactions: Transaction[] = Array.from(
  { length: 30 },
  (_, i) => ({
    id: (i + 1).toString(),
    title: `Transaction ${i + 1}`,
    amount: randomAmount(20, 5000),
    type: types[Math.floor(Math.random() * types.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    date: new Date(
      now.getFullYear(),
      now.getMonth() - Math.floor(Math.random() * 3),
      Math.floor(Math.random() * 28) + 1,
    )
      .toISOString()
      .split("T")[0],
    createdAt: new Date().toISOString(),
  }),
);
