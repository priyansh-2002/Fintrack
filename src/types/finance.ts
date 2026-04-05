export const categoryOptions = [
  { id: 'salary', label: 'Salary', type: 'income', color: '#0f766e' },
  { id: 'freelance', label: 'Freelance', type: 'income', color: '#14b8a6' },
  { id: 'investments', label: 'Investments', type: 'income', color: '#0ea5e9' },
  { id: 'housing', label: 'Housing', type: 'expense', color: '#ef4444' },
  { id: 'groceries', label: 'Groceries', type: 'expense', color: '#f97316' },
  { id: 'dining', label: 'Dining', type: 'expense', color: '#f59e0b' },
  { id: 'transport', label: 'Transport', type: 'expense', color: '#6366f1' },
  { id: 'utilities', label: 'Utilities', type: 'expense', color: '#8b5cf6' },
  { id: 'health', label: 'Health', type: 'expense', color: '#ec4899' },
  { id: 'entertainment', label: 'Entertainment', type: 'expense', color: '#a855f7' },
  { id: 'software', label: 'Software', type: 'expense', color: '#64748b' },
] as const;

export type CategoryId = (typeof categoryOptions)[number]['id'];
export type TransactionType = (typeof categoryOptions)[number]['type'];

export type UserRole = 'admin' | 'viewer';
export type ThemeMode = 'light' | 'dark';
export type TransactionDateRange = 'all' | '30d' | '90d' | 'year';
export type TransactionSortField = 'date' | 'amount' | 'title' | 'category';
export type SortDirection = 'asc' | 'desc';
export type DialogMode = 'create' | 'edit';
export const ALL_ACCOUNTS = 'all';
export type AccountFilterValue = typeof ALL_ACCOUNTS | string;
export type CardNetwork = 'visa' | 'mastercard' | 'amex' | 'rupay';
export type CardType = 'credit' | 'debit';

export const bankCardOptions = [
  { value: 'hdfc-bank', label: 'HDFC Bank' },
  { value: 'icici-bank', label: 'ICICI Bank' },
  { value: 'axis-bank', label: 'Axis Bank' },
  { value: 'sbi-card', label: 'SBI Card' },
  { value: 'amex-india', label: 'American Express India' },
  { value: 'kotak-bank', label: 'Kotak Mahindra Bank' },
] as const;

export type BankCardBrand = (typeof bankCardOptions)[number]['value'];

export interface UserCard {
  id: string;
  title: string;
  issuer: BankCardBrand;
  holderName: string;
  network: CardNetwork;
  type: CardType;
  balance: number;
  cardNumber: string;
  expiry: string;
}

export interface CardFormValues extends Omit<UserCard, 'id'> {}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: CategoryId;
  account: string;
  date: string;
  note: string;
}

export interface TransactionFormValues extends Omit<Transaction, 'id'> {}

export const cardNetworkOptions: Array<{ value: CardNetwork; label: string }> = [
  { value: 'visa', label: 'Visa' },
  { value: 'mastercard', label: 'Mastercard' },
  { value: 'amex', label: 'American Express' },
  { value: 'rupay', label: 'RuPay' },
];

export const cardTypeOptions: Array<{ value: CardType; label: string }> = [
  { value: 'credit', label: 'Credit Card' },
  { value: 'debit', label: 'Debit Card' },
];

export interface TransactionFilters {
  search: string;
  type: 'all' | TransactionType;
  category: 'all' | CategoryId;
  dateRange: TransactionDateRange;
  sortBy: TransactionSortField;
  sortDirection: SortDirection;
}

export interface CategoryMeta {
  label: string;
  type: TransactionType;
  color: string;
}

export const defaultTransactionFilters: TransactionFilters = {
  search: '',
  type: 'all',
  category: 'all',
  dateRange: 'all',
  sortBy: 'date',
  sortDirection: 'desc',
};

export const categoryMeta = categoryOptions.reduce(
  (accumulator, category) => ({
    ...accumulator,
    [category.id]: {
      label: category.label,
      type: category.type,
      color: category.color,
    },
  }),
  {} as Record<CategoryId, CategoryMeta>,
);

export const incomeCategoryOptions = categoryOptions.filter(
  (category) => category.type === 'income',
);

export const expenseCategoryOptions = categoryOptions.filter(
  (category) => category.type === 'expense',
);

export const roleOptions: Array<{ value: UserRole; label: string }> = [
  { value: 'admin', label: 'Admin' },
  { value: 'viewer', label: 'Viewer' },
];

export const dateRangeOptions: Array<{
  value: TransactionDateRange;
  label: string;
}> = [
  { value: 'all', label: 'All time' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'year', label: 'Last 12 months' },
];

export const sortFieldOptions: Array<{
  value: TransactionSortField;
  label: string;
}> = [
  { value: 'date', label: 'Date' },
  { value: 'amount', label: 'Amount' },
  { value: 'title', label: 'Description' },
  { value: 'category', label: 'Category' },
];
