import {
  ALL_ACCOUNTS,
  type AccountFilterValue,
  type Transaction,
} from '@/types/finance';

export interface AccountOption {
  value: AccountFilterValue;
  label: string;
  subtitle: string;
}

const accountSubtitles: Record<string, string> = {
  'Salary Account': 'Salary credits and bills',
  'Business Account': 'Client payments',
  'Credit Card': 'Everyday spends',
  'Demat Account': 'Investments',
};

export const getAccountOptions = (
  transactions: Transaction[],
): AccountOption[] => {
  const uniqueAccounts = [...new Set(transactions.map((transaction) => transaction.account))];

  return [
    {
      value: ALL_ACCOUNTS,
      label: 'All Accounts',
      subtitle: 'Everything combined',
    },
    ...uniqueAccounts.map((account) => ({
      value: account,
      label: account,
      subtitle: accountSubtitles[account] ?? 'Custom account',
    })),
  ];
};

export const filterTransactionsByAccount = (
  transactions: Transaction[],
  selectedAccount: AccountFilterValue,
): Transaction[] =>
  selectedAccount === ALL_ACCOUNTS
    ? transactions
    : transactions.filter((transaction) => transaction.account === selectedAccount);
