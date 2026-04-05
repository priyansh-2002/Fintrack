import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import { Button, Chip, Typography } from '@mui/material';
import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { CardShell } from '@/components/common/CardShell';
import { EmptyState } from '@/components/common/EmptyState';
import { PageIntro } from '@/components/common/PageIntro';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { scheduledPayments } from '@/data/dashboardExperience';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { useAppStore } from '@/store/useAppStore';
import { categoryMeta } from '@/types/finance';
import { filterTransactionsByAccount } from '@/utils/accounts';
import { formatCurrency } from '@/utils/currency';
import { formatLongDate } from '@/utils/date';

export const PaymentsPage = () => {
  const completeRef = useRef<HTMLDivElement | null>(null);
  const scheduledRef = useRef<HTMLDivElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { transactions, selectedAccount, openTransactionDialog, role } = useAppStore(
    useShallow((state) => ({
      transactions: state.transactions,
      selectedAccount: state.selectedAccount,
      openTransactionDialog: state.openTransactionDialog,
      role: state.role,
    })),
  );
  const isLoading = useSimulatedLoading();
  const canManage = role === 'admin';

  const completedPayments = useMemo(
    () =>
      filterTransactionsByAccount(transactions, selectedAccount).filter(
        (transaction) => transaction.type === 'expense',
      ),
    [selectedAccount, transactions],
  );

  useEffect(() => {
    const section = searchParams.get('section');

    if (section === 'scheduled') {
      scheduledRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    if (section === 'completed') {
      completeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [searchParams]);

  if (isLoading) {
    return <PageSkeleton showTable />;
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Payments Workspace"
        title="Track completed payments and recurring payment commitments from one focused route."
        description="Completed payments are pulled from your recorded expense transactions, while scheduled payments keep the upcoming recurring obligations visible in the same workspace."
        action={
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outlined"
              onClick={() => setSearchParams({ section: 'completed' })}
            >
              Complete payments
            </Button>
            <Button
              variant="contained"
              onClick={() => setSearchParams({ section: 'scheduled' })}
            >
              Scheduled payments
            </Button>
          </div>
        }
      />

      {/* Completed payments section: shows the expense transactions that have already been recorded in the ledger. */}
      <section ref={completeRef} className="scroll-mt-28">
        <CardShell
          title="Complete Payments"
          subtitle="These entries are sourced from completed expense transactions in the active account workspace."
          action={
            canManage ? (
              <Button
                variant="outlined"
                onClick={() => openTransactionDialog('create', undefined, 'expense')}
              >
                Add payment
              </Button>
            ) : (
              <Chip label="Read only" size="small" variant="outlined" />
            )
          }
        >
          {completedPayments.length ? (
            <div className="space-y-3">
              {completedPayments.slice(0, 10).map((payment) => (
                <div
                  key={payment.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-r(--app-border) bg-(--app-surface-muted) px-4 py-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{
                        backgroundColor: `${categoryMeta[payment.category].color}18`,
                        color: categoryMeta[payment.category].color,
                      }}
                    >
                      <CallMadeRoundedIcon fontSize="small" />
                    </div>
                    <div className="min-w-0">
                      <Typography
                        variant="body1"
                        className="truncate font-semibold text-(--app-heading)"
                      >
                        {payment.title}
                      </Typography>
                      <Typography variant="body2" className="truncate text-(--app-muted)">
                        {formatLongDate(payment.date)} / {categoryMeta[payment.category].label}
                      </Typography>
                    </div>
                  </div>
                  <div className="text-right">
                    <Typography variant="body1" className="font-semibold text-(--app-heading)">
                      {formatCurrency(payment.amount)}
                    </Typography>
                    <Typography variant="body2" className="text-(--app-muted)">
                      {payment.account}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<CallMadeRoundedIcon />}
              title="No completed payments found"
              description="Once an expense transaction is recorded, it will show up here as a completed payment."
            />
          )}
        </CardShell>
      </section>

      {/* Scheduled payments section: mirrors the recurring payment list and supports deep-linking from the dashboard. */}
      <section ref={scheduledRef} className="scroll-mt-28">
        <CardShell
          title="Scheduled Payments"
          subtitle="Recurring payment commitments that are still on the calendar and waiting to be charged."
          action={
            <Chip
              icon={<ScheduleRoundedIcon />}
              label={`${scheduledPayments.length} scheduled`}
              size="small"
              variant="outlined"
            />
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            {scheduledPayments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-[22px] border border-(--app-border) bg-(--app-surface-muted) p-4"
              >
                <Typography
                  variant="caption"
                  className="uppercase tracking-[0.14em] text-(--app-muted)"
                >
                  Scheduled
                </Typography>
                <Typography variant="h6" className="mt-3 text-(--app-heading)">
                  {payment.name}
                </Typography>
                <Typography variant="body2" className="mt-2 text-(--app-muted)">
                  Recurs monthly
                </Typography>
                <Typography variant="h5" className="mt-6 text-(--app-heading)">
                  {formatCurrency(payment.amount, 2)}
                </Typography>
              </div>
            ))}
          </div>
        </CardShell>
      </section>
    </div>
  );
};
