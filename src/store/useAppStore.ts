import { create, type StateCreator } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  createCardsSlice,
  type CardsSlice,
} from '@/store/slices/cardsSlice';
import {
  createFinanceSlice,
  type FinanceSlice,
} from '@/store/slices/financeSlice';
import {
  createPreferencesSlice,
  type PreferencesSlice,
} from '@/store/slices/preferencesSlice';
import { createUiSlice, type UiSlice } from '@/store/slices/uiSlice';
import {
  ALL_ACCOUNTS,
  type AccountFilterValue,
  type Transaction,
  type UserCard,
} from '@/types/finance';
import { convertLegacyUsdAmountToInr } from '@/utils/currency';
import { mockCards } from '@/data/mockCards';

export type AppStore = FinanceSlice & CardsSlice & PreferencesSlice & UiSlice;
export type StoreSlice<T> = StateCreator<
  AppStore,
  [['zustand/persist', unknown]],
  [],
  T
>;

type PersistedAppState = {
  transactions: Transaction[];
  cards: UserCard[];
  role: AppStore['role'];
  themeMode: AppStore['themeMode'];
  selectedAccount: AccountFilterValue;
  isDesktopSidebarCollapsed: boolean;
};

export const useAppStore = create<AppStore>()(
  persist(
    (...arguments_) => ({
      ...createFinanceSlice(...arguments_),
      ...createCardsSlice(...arguments_),
      ...createPreferencesSlice(...arguments_),
      ...createUiSlice(...arguments_),
    }),
    {
      name: 'fintrack-dashboard-store',
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState, version): PersistedAppState => {
        const state = persistedState as Partial<PersistedAppState>;
        const transactions = (state.transactions ?? []).map((transaction) =>
          version < 1
            ? {
                ...transaction,
                amount: convertLegacyUsdAmountToInr(transaction.amount),
              }
            : transaction,
        );

        return {
          transactions,
          cards: state.cards ?? mockCards,
          role: state.role ?? 'admin',
          themeMode: state.themeMode ?? 'light',
          selectedAccount: state.selectedAccount ?? ALL_ACCOUNTS,
          isDesktopSidebarCollapsed: state.isDesktopSidebarCollapsed ?? false,
        };
      },
      partialize: (state) => ({
        transactions: state.transactions,
        cards: state.cards,
        role: state.role,
        themeMode: state.themeMode,
        selectedAccount: state.selectedAccount,
        isDesktopSidebarCollapsed: state.isDesktopSidebarCollapsed,
      }),
    },
  ),
);
