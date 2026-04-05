import {
  ALL_ACCOUNTS,
  type AccountFilterValue,
  type ThemeMode,
  type UserRole,
} from '@/types/finance';
import type { StoreSlice } from '@/store/useAppStore';

export interface PreferencesSlice {
  role: UserRole;
  themeMode: ThemeMode;
  selectedAccount: AccountFilterValue;
  setRole: (role: UserRole) => void;
  setSelectedAccount: (account: AccountFilterValue) => void;
  toggleThemeMode: () => void;
}

export const createPreferencesSlice: StoreSlice<PreferencesSlice> = (set) => ({
  role: 'admin',
  themeMode: 'light',
  selectedAccount: ALL_ACCOUNTS,
  setRole: (role) => set({ role }),
  setSelectedAccount: (selectedAccount) => set({ selectedAccount }),
  toggleThemeMode: () =>
    set((state) => ({
      themeMode: state.themeMode === 'light' ? 'dark' : 'light',
    })),
});
