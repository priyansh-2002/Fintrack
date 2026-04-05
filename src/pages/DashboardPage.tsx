import { Typography } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { PageSkeleton } from '@/components/common/PageSkeleton';
import { quickContacts, scheduledPayments } from '@/data/dashboardExperience';
import { DashboardHeroCard } from '@/features/dashboard/components/DashboardHeroCard';
import { DashboardMetricTiles } from '@/features/dashboard/components/DashboardMetricTiles';
import { MoneyFlowCard } from '@/features/dashboard/components/MoneyFlowCard';
import { ScheduledPaymentsPanel } from '@/features/dashboard/components/ScheduledPaymentsPanel';
import { SendMoneyPanel } from '@/features/dashboard/components/SendMoneyPanel';
import { TransactionsRail } from '@/features/dashboard/components/TransactionsRail';
import {
  getBalanceHistory,
  getMoneyFlowSeries,
  getRecentTransactions,
  getSummaryMetrics,
} from '@/features/dashboard/selectors';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { useAppStore } from '@/store/useAppStore';
import { filterTransactionsByAccount, getAccountOptions } from '@/utils/accounts';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { transactions, selectedAccount, openTransactionDialog, role } = useAppStore(
    useShallow((state) => ({
      transactions: state.transactions,
      selectedAccount: state.selectedAccount,
      openTransactionDialog: state.openTransactionDialog,
      role: state.role,
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
  const canManage = role === 'admin';

  const summaryMetrics = useMemo(
    () => getSummaryMetrics(scopedTransactions),
    [scopedTransactions],
  );
  const balanceHistory = useMemo(
    () => getBalanceHistory(scopedTransactions),
    [scopedTransactions],
  );
  const moneyFlowData = useMemo(
    () => getMoneyFlowSeries(scopedTransactions),
    [scopedTransactions],
  );
  const recentTransactions = useMemo(
    () => getRecentTransactions(scopedTransactions, 6),
    [scopedTransactions],
  );
  const totalBalance = summaryMetrics.find((metric) => metric.key === 'balance')?.value ?? 0;

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6 px-1">
      <div className="grid gap-6 xl:grid-cols-[1.68fr_0.76fr]">
        <div className="space-y-6">
          {/* Analytics stage: this is the dashboard surface that intentionally ends after the money flow graph. */}
          <section className="space-y-6 rounded-[36px] border border-(--app-border) bg-(--app-surface)/88 p-5 shadow-[0_24px_72px_rgba(15,35,43,0.08)] md:p-6">
            <DashboardHeroCard
              accountLabel={`${activeAccount.label} / ${activeAccount.subtitle}`}
              balance={totalBalance}
              history={balanceHistory}
              canManage={canManage}
              onDeposit={() => openTransactionDialog('create', undefined, 'income')}
              onWithdraw={() => openTransactionDialog('create', undefined, 'expense')}
            />

            {/* Financial record block: controls the metric tiles shown under the hero card. */}
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Typography variant="h5" className="text-(--app-heading)">
                    Financial Record
                  </Typography>
                  <Typography variant="body2" className="mt-1 text-(--app-muted)">
                    Metrics for current month
                  </Typography>
                </div>
              </div>
              <DashboardMetricTiles metrics={summaryMetrics} />
            </div>

            {/* Money flow block: this remains the final section inside the primary dashboard stage. */}
            <MoneyFlowCard data={moneyFlowData} />
          </section>

          {/* Lower utility widgets: these sit below the analytics stage and stay independent from the cards workspace. */}
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.25fr]">
            <SendMoneyPanel
              contacts={quickContacts}
              canManage={canManage}
              onNewPayment={() => openTransactionDialog('create', undefined, 'expense')}
            />
            <ScheduledPaymentsPanel
              payments={scheduledPayments}
              onOpenScheduled={() => navigate('/payments?section=scheduled')}
            />
          </div>
        </div>

        {/* Right-side rail: only the recent transactions list remains on the main dashboard now that cards have their own workspace. */}
        <div className="space-y-6">
          <TransactionsRail transactions={recentTransactions} />
        </div>
      </div>
    </div>
  );
};
