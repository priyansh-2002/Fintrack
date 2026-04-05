import dayjs from 'dayjs';

import {
  categoryMeta,
  type SortDirection,
  type Transaction,
  type TransactionFilters,
  type TransactionSortField,
} from '@/types/finance';

const getReferenceDate = (transactions: Transaction[]): dayjs.Dayjs =>
  transactions.length === 0
    ? dayjs()
    : transactions.reduce(
        (latest, transaction) =>
          dayjs(transaction.date).isAfter(latest) ? dayjs(transaction.date) : latest,
        dayjs(transactions[0].date),
      );

const matchesDateRange = (
  transaction: Transaction,
  dateRange: TransactionFilters['dateRange'],
  referenceDate: dayjs.Dayjs,
): boolean => {
  if (dateRange === 'all') {
    return true;
  }

  const daysByRange = {
    '30d': 30,
    '90d': 90,
    year: 365,
  } as const;

  return dayjs(transaction.date).isAfter(
    referenceDate.subtract(daysByRange[dateRange], 'day'),
  );
};

const compareValues = (
  left: Transaction,
  right: Transaction,
  field: TransactionSortField,
  direction: SortDirection,
): number => {
  const multiplier = direction === 'asc' ? 1 : -1;

  if (field === 'date') {
    return (
      (dayjs(left.date).valueOf() - dayjs(right.date).valueOf()) * multiplier
    );
  }

  if (field === 'amount') {
    return (left.amount - right.amount) * multiplier;
  }

  if (field === 'category') {
    return (
      categoryMeta[left.category].label.localeCompare(
        categoryMeta[right.category].label,
      ) * multiplier
    );
  }

  return left.title.localeCompare(right.title) * multiplier;
};

export const getFilteredTransactions = (
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] => {
  const referenceDate = getReferenceDate(transactions);
  const searchQuery = filters.search.trim().toLowerCase();

  return [...transactions]
    .filter((transaction) => {
      const matchesSearch =
        searchQuery.length === 0 ||
        transaction.title.toLowerCase().includes(searchQuery) ||
        transaction.account.toLowerCase().includes(searchQuery) ||
        transaction.note.toLowerCase().includes(searchQuery) ||
        categoryMeta[transaction.category].label.toLowerCase().includes(searchQuery);

      const matchesType =
        filters.type === 'all' || transaction.type === filters.type;
      const matchesCategory =
        filters.category === 'all' || transaction.category === filters.category;

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesDateRange(transaction, filters.dateRange, referenceDate)
      );
    })
    .sort((left, right) =>
      compareValues(left, right, filters.sortBy, filters.sortDirection),
    );
};

export const getNetFlow = (transactions: Transaction[]): number =>
  transactions.reduce(
    (sum, transaction) =>
      sum + (transaction.type === 'income' ? transaction.amount : -transaction.amount),
    0,
  );
