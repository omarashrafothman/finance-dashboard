# Finance Dashboard

A Next.js finance tracker with persistent local storage, responsive transactions management, and dashboard analytics.

## Routes

- `/` Dashboard (summary cards + charts)
- `/transactions` Transactions list (filter, sort, delete, responsive list/table)
- `/transactions/new` Add transaction
- `/transactions/[id]` Detail/edit transaction
- `app/not-found.tsx` Custom 404 page

## State Management Choice

The app uses Zustand for global transaction state because it is lightweight, easy to scale for feature hooks, and works well with optimistic updates.

- Global store: `lib/zustand/useTransactionStore.ts`
- App-facing domain hook: `lib/hooks/useTransactions.ts`

## Data and Persistence

- Storage abstraction: `lib/storage.ts`
- Generic localStorage hook: `lib/hooks/useLocalStorage.ts`
- First load seeding: `seedTransactionsIfEmpty()` writes mock data when storage is empty.
- Async simulation: read/write include a fake `300ms` delay.
- Optimistic updates: add/update/delete update UI immediately.
- Rollback on failure: previous snapshot is restored if async persistence fails.

No components perform direct `localStorage` calls.

## Reusable Components

- `components/transactions/TransactionForm.tsx`
  - Controlled fields
  - Field-level inline validation
  - Dirty-state guard (browser unload + in-app link confirm)
  - Submission loading state (disabled submit + spinner)
- `components/transactions/TransactionCard.tsx`
  - Compact mobile transaction item
- `components/dashboard/SummaryCard.tsx`
  - Metric + trend versus previous month

## Charts

Charts are code-split with dynamic imports in `app/page.tsx`:

- `MonthlyIncomeExpenseBarChart` for last 6 months income vs expense
- `CurrentMonthExpenseDonutChart` for current month expense by category

Both charts are responsive through Recharts `ResponsiveContainer`.
Chart skeleton loaders are rendered while transactions are loading.

## Performance Optimizations

- `useMemo` for expensive derived values:
  - dashboard metrics/trends
  - chart datasets
  - filtered/sorted transaction list
- `useCallback` for filter/sort controls and update handlers
- `react-window` virtualization when list size exceeds 50 items

### React DevTools Profiler Findings

Profiler sessions after optimization showed:

- Filter/sort controls trigger fewer unnecessary child re-renders.
- List interactions avoid broad re-render cascades due to memoized handlers.
- Virtualized mode keeps render cost stable for large datasets by rendering only visible rows.

## Validation Rules

Manual validation (no form library) in `functions/transactionValidation.ts`:

- title required
- amount must be positive
- type must be income or expense
- category required
- date required and cannot be in the future

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
