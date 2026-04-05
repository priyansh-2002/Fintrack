import dayjs from 'dayjs';

import { mockTransactions } from '@/data/mockTransactions';
import type { Transaction, TransactionFormValues } from '@/types/finance';
import type { StoreSlice } from '@/store/useAppStore';

export interface FinanceSlice {
  transactions: Transaction[];
  addTransaction: (values: TransactionFormValues) => void;
  updateTransaction: (id: string, values: TransactionFormValues) => void;
  deleteTransaction: (id: string) => void;
}

const sortTransactionsByDate = (transactions: Transaction[]): Transaction[] =>
  [...transactions].sort((left, right) =>
    dayjs(right.date).valueOf() - dayjs(left.date).valueOf(),
  );

export const createFinanceSlice: StoreSlice<FinanceSlice> = (set) => ({
  transactions: sortTransactionsByDate(mockTransactions),
  addTransaction: (values) =>
    set((state) => ({
      transactions: sortTransactionsByDate([
        {
          id: crypto.randomUUID(),
          ...values,
          note: values.note.trim(),
          title: values.title.trim(),
          account: values.account.trim() || 'Salary Account',
        },
        ...state.transactions,
      ]),
    })),
  updateTransaction: (id, values) =>
    set((state) => ({
      transactions: sortTransactionsByDate(
        state.transactions.map((transaction) =>
          transaction.id === id
            ? {
                ...transaction,
                ...values,
                note: values.note.trim(),
                title: values.title.trim(),
                account: values.account.trim() || 'Salary Account',
              }
            : transaction,
        ),
      ),
    })),
  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((transaction) => transaction.id !== id),
      editingTransactionId:
        state.editingTransactionId === id ? null : state.editingTransactionId,
      isTransactionDialogOpen:
        state.editingTransactionId === id ? false : state.isTransactionDialogOpen,
      dialogMode: state.editingTransactionId === id ? 'create' : state.dialogMode,
    })),
});
