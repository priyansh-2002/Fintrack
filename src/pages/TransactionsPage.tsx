import AddRoundedIcon from '@mui/icons-material/AddRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Button, Chip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { CardShell } from '@/components/common/CardShell';
import { PageIntro } from '@/components/common/PageIntro';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { TransactionFilters } from '@/features/transactions/components/TransactionFilters';
import { TransactionTable } from '@/features/transactions/components/TransactionTable';
import { getFilteredTransactions, getNetFlow } from '@/features/transactions/selectors';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { useAppStore } from '@/store/useAppStore';
import { filterTransactionsByAccount, getAccountOptions } from '@/utils/accounts';
import { downloadTransactionsCsv } from '@/utils/csv';
import { formatCurrency } from '@/utils/currency';

export const TransactionsPage = () => {
  const {
    transactions,
    filters,
    role,
    selectedAccount,
    setFilters,
    resetFilters,
    setSortField,
    openTransactionDialog,
    deleteTransaction,
  } = useAppStore(
    useShallow((state) => ({
      transactions: state.transactions,
      filters: state.filters,
      role: state.role,
      selectedAccount: state.selectedAccount,
      setFilters: state.setFilters,
      resetFilters: state.resetFilters,
      setSortField: state.setSortField,
      openTransactionDialog: state.openTransactionDialog,
      deleteTransaction: state.deleteTransaction,
    })),
  );
  const isLoading = useSimulatedLoading();
  const scopedTransactions = useMemo(
    () => filterTransactionsByAccount(transactions, selectedAccount),
    [selectedAccount, transactions],
  );
  const accountOptions = useMemo(() => getAccountOptions(transactions), [transactions]);
  const activeAccount =
    accountOptions.find((account) => account.value === selectedAccount) ?? accountOptions[0];
  const filteredTransactions = useMemo(
    () => getFilteredTransactions(scopedTransactions, filters),
    [filters, scopedTransactions],
  );
  const netFlow = useMemo(() => getNetFlow(filteredTransactions), [filteredTransactions]);
  const canManage = role === 'admin';

  if (isLoading) {
    return <PageSkeleton showTable />;
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow=""
        title="A transaction workspace designed for search, filters, role-based actions, and export."
        description={`Filters live in the Zustand UI slice because multiple controls need to stay in sync. You are currently viewing ${activeAccount.label.toLowerCase()} transactions.`}
        action={
          canManage ? (
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => openTransactionDialog('create')}
            >
              Add transaction
            </Button>
          ) : null
        }
      />

      <TransactionFilters
        filters={filters}
        role={role}
        onFilterChange={setFilters}
        onReset={resetFilters}
        onExport={() => downloadTransactionsCsv(filteredTransactions)}
        onAdd={() => openTransactionDialog('create')}
      />

      <CardShell
        title="Ledger overview"
        subtitle="This summary reacts to the active filters so the table and metrics stay aligned."
        action={
          <Chip
            icon={<InfoOutlinedIcon />}
            label={
              canManage
                ? `Admin can edit ${activeAccount.label}`
                : `Viewer can inspect ${activeAccount.label}`
            }
            variant="outlined"
          />
        }
      >
        {/* Ledger metrics row: controls the visible count, net flow, and export explanation content. */}
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <Typography
              variant="body2"
              className="uppercase tracking-[0.18em] text-(--app-muted)"
            >
              Visible transactions
            </Typography>
            <Typography variant="h5" className="mt-2 text-(--app-text)">
              {filteredTransactions.length}
            </Typography>
          </div>
          <div>
            <Typography
              variant="body2"
              className="uppercase tracking-[0.18em] text-(--app-muted)"
            >
              Net flow
            </Typography>
            <Typography
              variant="h5"
              className={
                netFlow >= 0
                  ? 'mt-2 text-emerald-600 dark:text-emerald-300'
                  : 'mt-2 text-rose-600 dark:text-rose-300'
              }
            >
              {netFlow >= 0 ? '+' : '-'}
              {formatCurrency(Math.abs(netFlow))}
            </Typography>
          </div>
          <div className="max-w-md">
            <Typography variant="body2" className="text-(--app-muted)">
              Export respects the current filtered view, which is usually what users expect
              in SaaS dashboards because the file should match the on-screen dataset.
            </Typography>
          </div>
        </div>
      </CardShell>

      <TransactionTable
        transactions={filteredTransactions}
        canManage={canManage}
        sortBy={filters.sortBy}
        sortDirection={filters.sortDirection}
        onSort={setSortField}
        onEdit={(transactionId) => openTransactionDialog('edit', transactionId)}
        onDelete={(transactionId) => {
          if (window.confirm('Delete this transaction? This action cannot be undone.')) {
            deleteTransaction(transactionId);
          }
        }}
        onAddFirstTransaction={() => openTransactionDialog('create')}
      />
    </div>
  );
};
