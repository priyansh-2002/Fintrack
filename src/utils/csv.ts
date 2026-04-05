import { categoryMeta, type Transaction } from '@/types/finance';
import { formatLongDate } from '@/utils/date';

const escapeCsvValue = (value: string | number): string =>
  `"${String(value).replaceAll('"', '""')}"`;

export const downloadTransactionsCsv = (transactions: Transaction[]): void => {
  const headers = [
    'Date',
    'Description',
    'Type',
    'Category',
    'Account',
    'Amount (INR)',
    'Note',
  ];

  const rows = transactions.map((transaction) => [
    formatLongDate(transaction.date),
    transaction.title,
    transaction.type,
    categoryMeta[transaction.category].label,
    transaction.account,
    transaction.amount.toFixed(2),
    transaction.note,
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'fintrack-transactions.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
