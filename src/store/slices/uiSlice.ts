import {
  defaultTransactionFilters,
  type DialogMode,
  type TransactionFilters,
  type TransactionSortField,
  type TransactionType,
} from '@/types/finance';
import type { StoreSlice } from '@/store/useAppStore';

export interface UiSlice {
  filters: TransactionFilters;
  isMobileSidebarOpen: boolean;
  isDesktopSidebarCollapsed: boolean;
  isTransactionDialogOpen: boolean;
  dialogMode: DialogMode;
  editingTransactionId: string | null;
  transactionDraftType: TransactionType;
  setFilters: (updates: Partial<TransactionFilters>) => void;
  resetFilters: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleDesktopSidebar: () => void;
  openTransactionDialog: (
    mode: DialogMode,
    transactionId?: string,
    draftType?: TransactionType,
  ) => void;
  closeTransactionDialog: () => void;
  setSortField: (field: TransactionSortField) => void;
}

export const createUiSlice: StoreSlice<UiSlice> = (set) => ({
  filters: defaultTransactionFilters,
  isMobileSidebarOpen: false,
  isDesktopSidebarCollapsed: false,
  isTransactionDialogOpen: false,
  dialogMode: 'create',
  editingTransactionId: null,
  transactionDraftType: 'expense',
  setFilters: (updates) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...updates,
      },
    })),
  resetFilters: () =>
    set({
      filters: defaultTransactionFilters,
    }),
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  toggleDesktopSidebar: () =>
    set((state) => ({
      isDesktopSidebarCollapsed: !state.isDesktopSidebarCollapsed,
    })),
  openTransactionDialog: (mode, transactionId, draftType = 'expense') =>
    set({
      dialogMode: mode,
      editingTransactionId: transactionId ?? null,
      isTransactionDialogOpen: true,
      transactionDraftType: draftType,
    }),
  closeTransactionDialog: () =>
    set({
      dialogMode: 'create',
      editingTransactionId: null,
      isTransactionDialogOpen: false,
      transactionDraftType: 'expense',
    }),
  setSortField: (field) =>
    set((state) => ({
      filters: {
        ...state.filters,
        sortBy: field,
        sortDirection:
          state.filters.sortBy === field && state.filters.sortDirection === 'desc'
            ? 'asc'
            : 'desc',
      },
    })),
});
