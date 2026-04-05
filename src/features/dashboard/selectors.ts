import dayjs from 'dayjs';

import { categoryMeta, type Transaction } from '@/types/finance';
import { formatCompactCurrency } from '@/utils/currency';
import { getMonthKey } from '@/utils/date';

export interface SummaryMetric {
  key: 'balance' | 'income' | 'expenses';
  label: string;
  value: number;
  change: number;
  comparisonLabel: string;
  tone: 'positive' | 'negative' | 'neutral';
}

export interface BalancePoint {
  date: string;
  label: string;
  balance: number;
}

export interface MoneyFlowPoint {
  label: string;
  savings: number;
  expenses: number;
}

export interface DashboardInsight {
  label: string;
  value: string;
  description: string;
  tone: 'positive' | 'negative' | 'neutral';
}

interface MonthlySnapshot {
  income: number;
  expenses: number;
  closingBalance: number;
}

const buildMonthlySnapshots = (
  transactions: Transaction[],
): Record<string, MonthlySnapshot> => {
  const sortedTransactions = [...transactions].sort(
    (left, right) => dayjs(left.date).valueOf() - dayjs(right.date).valueOf(),
  );

  let runningBalance = 0;

  return sortedTransactions.reduce<Record<string, MonthlySnapshot>>(
    (accumulator, transaction) => {
      const monthKey = getMonthKey(transaction.date);
      const snapshot = accumulator[monthKey] ?? {
        income: 0,
        expenses: 0,
        closingBalance: 0,
      };

      if (transaction.type === 'income') {
        snapshot.income += transaction.amount;
        runningBalance += transaction.amount;
      } else {
        snapshot.expenses += transaction.amount;
        runningBalance -= transaction.amount;
      }

      snapshot.closingBalance = runningBalance;
      accumulator[monthKey] = snapshot;

      return accumulator;
    },
    {},
  );
};

const resolveMetricTone = (
  metricKey: SummaryMetric['key'],
  change: number,
): SummaryMetric['tone'] => {
  if (change === 0) {
    return 'neutral';
  }

  if (metricKey === 'expenses') {
    return change < 0 ? 'positive' : 'negative';
  }

  return change > 0 ? 'positive' : 'negative';
};

export const getSummaryMetrics = (transactions: Transaction[]): SummaryMetric[] => {
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalBalance = totalIncome - totalExpenses;
  const monthlySnapshots = buildMonthlySnapshots(transactions);
  const monthKeys = Object.keys(monthlySnapshots).sort();
  const currentMonthKey = monthKeys.at(-1) ?? '';
  const previousMonthKey = monthKeys.at(-2) ?? '';
  const currentSnapshot = monthlySnapshots[currentMonthKey] ?? {
    income: 0,
    expenses: 0,
    closingBalance: totalBalance,
  };
  const previousSnapshot = monthlySnapshots[previousMonthKey] ?? {
    income: 0,
    expenses: 0,
    closingBalance: 0,
  };
  const comparisonLabel = previousMonthKey
    ? `vs ${dayjs(`${previousMonthKey}-01`).format('MMM YYYY')}`
    : 'Starting snapshot';

  return [
    {
      key: 'balance',
      label: 'Balance',
      value: totalBalance,
      change: currentSnapshot.closingBalance - previousSnapshot.closingBalance,
      comparisonLabel,
      tone: resolveMetricTone(
        'balance',
        currentSnapshot.closingBalance - previousSnapshot.closingBalance,
      ),
    },
    {
      key: 'income',
      label: 'Income',
      value: totalIncome,
      change: currentSnapshot.income - previousSnapshot.income,
      comparisonLabel,
      tone: resolveMetricTone(
        'income',
        currentSnapshot.income - previousSnapshot.income,
      ),
    },
    {
      key: 'expenses',
      label: 'Expenses',
      value: totalExpenses,
      change: currentSnapshot.expenses - previousSnapshot.expenses,
      comparisonLabel,
      tone: resolveMetricTone(
        'expenses',
        currentSnapshot.expenses - previousSnapshot.expenses,
      ),
    },
  ];
};

export const getBalanceHistory = (transactions: Transaction[]): BalancePoint[] => {
  const sortedTransactions = [...transactions].sort(
    (left, right) => dayjs(left.date).valueOf() - dayjs(right.date).valueOf(),
  );

  let runningBalance = 0;

  return sortedTransactions.map((transaction) => {
    runningBalance +=
      transaction.type === 'income' ? transaction.amount : -transaction.amount;

    return {
      date: transaction.date,
      label: dayjs(transaction.date).format('DD MMM'),
      balance: runningBalance,
    };
  });
};

export const getDashboardInsights = (
  transactions: Transaction[],
): DashboardInsight[] => {
  const monthlySnapshots = buildMonthlySnapshots(transactions);
  const monthKeys = Object.keys(monthlySnapshots).sort();
  const currentMonthKey = monthKeys.at(-1) ?? '';
  const previousMonthKey = monthKeys.at(-2) ?? '';
  const currentSnapshot = monthlySnapshots[currentMonthKey] ?? {
    income: 0,
    expenses: 0,
    closingBalance: 0,
  };
  const previousSnapshot = monthlySnapshots[previousMonthKey] ?? {
    income: 0,
    expenses: 0,
    closingBalance: 0,
  };
  const highestCategory = Object.values(
    transactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce<Record<string, { category: string; total: number }>>(
        (accumulator, transaction) => {
          const existing = accumulator[transaction.category];

          if (existing) {
            existing.total += transaction.amount;
          } else {
            accumulator[transaction.category] = {
              category: categoryMeta[transaction.category].label,
              total: transaction.amount,
            };
          }

          return accumulator;
        },
        {},
      ),
  ).sort((left, right) => right.total - left.total)[0];
  const expenseDelta = currentSnapshot.expenses - previousSnapshot.expenses;
  const expensePercent =
    previousSnapshot.expenses === 0
      ? 0
      : Math.abs((expenseDelta / previousSnapshot.expenses) * 100);
  const savingsRate =
    currentSnapshot.income === 0
      ? 0
      : ((currentSnapshot.income - currentSnapshot.expenses) /
          currentSnapshot.income) *
        100;
  const largestExpense = [...transactions]
    .filter((transaction) => transaction.type === 'expense')
    .sort((left, right) => right.amount - left.amount)[0];

  return [
    {
      label: 'Highest spend',
      value: highestCategory
        ? `${highestCategory.category} (${formatCompactCurrency(
            highestCategory.total,
          )})`
        : 'No expenses yet',
      description: highestCategory
        ? 'Your biggest expense bucket across the current dataset.'
        : 'Add some expense transactions to unlock this insight.',
      tone: 'negative',
    },
    {
      label: 'Monthly comparison',
      value: previousMonthKey
        ? `${expensePercent.toFixed(0)}% ${
            expenseDelta <= 0 ? 'lower' : 'higher'
          }`
        : 'N/A',
      description: previousMonthKey
        ? `Compared with ${dayjs(`${previousMonthKey}-01`).format('MMM YYYY')}.`
        : 'We need at least two months of data to compare spending.',
      tone: expenseDelta <= 0 ? 'positive' : 'negative',
    },
    {
      label: 'Savings rate',
      value: `${Math.max(savingsRate, 0).toFixed(0)}%`,
      description: largestExpense
        ? `Largest recent expense: ${largestExpense.title}.`
        : 'No large expense outliers detected yet.',
      tone: savingsRate >= 30 ? 'positive' : 'neutral',
    },
  ];
};

export const getRecentTransactions = (
  transactions: Transaction[],
  limit = 5,
): Transaction[] =>
  [...transactions]
    .sort((left, right) => dayjs(right.date).valueOf() - dayjs(left.date).valueOf())
    .slice(0, limit);

export const getMoneyFlowSeries = (transactions: Transaction[]): MoneyFlowPoint[] => {
  const monthlySnapshots = buildMonthlySnapshots(transactions);

  return Object.entries(monthlySnapshots)
    .sort(([leftMonth], [rightMonth]) => leftMonth.localeCompare(rightMonth))
    .map(([monthKey, snapshot]) => ({
      label: dayjs(`${monthKey}-01`).format('MMM'),
      savings: Math.max(snapshot.income - snapshot.expenses, 0),
      expenses: snapshot.expenses,
    }));
};
