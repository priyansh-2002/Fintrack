import type { ReactNode } from 'react';

import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded';
import CallReceivedRoundedIcon from '@mui/icons-material/CallReceivedRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import WalletRoundedIcon from '@mui/icons-material/WalletRounded';
import { Chip, Typography } from '@mui/material';

import type { SummaryMetric } from '@/features/dashboard/selectors';
import { formatCurrency, formatSignedCurrency } from '@/utils/currency';

const tileMeta: Record<
  SummaryMetric['key'],
  { label: string; background: string; icon: ReactNode }
> = {
  balance: {
    label: 'Total Saving',
    background: 'var(--app-record-saving)',
    icon: <WalletRoundedIcon fontSize="small" />,
  },
  income: {
    label: 'Total Income',
    background: 'var(--app-record-income)',
    icon: <CallReceivedRoundedIcon fontSize="small" />,
  },
  expenses: {
    label: 'Total Expense',
    background: 'var(--app-record-expense)',
    icon: <CallMadeRoundedIcon fontSize="small" />,
  },
};

const orderedKeys: SummaryMetric['key'][] = ['income', 'expenses', 'balance'];

const toneClassName: Record<SummaryMetric['tone'], string> = {
  positive: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-200',
  negative: 'bg-rose-500/12 text-rose-700 dark:text-rose-200',
  neutral: 'bg-slate-400/12 text-slate-700 dark:text-slate-200',
};

export const DashboardMetricTiles = ({ metrics }: { metrics: SummaryMetric[] }) => {
  const metricMap = metrics.reduce(
    (accumulator, metric) => ({
      ...accumulator,
      [metric.key]: metric,
    }),
    {} as Record<SummaryMetric['key'], SummaryMetric>,
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {orderedKeys.map((metricKey) => {
        const metric = metricMap[metricKey];
        const meta = tileMeta[metricKey];

        return (
          <div
            key={metric.key}
            className="rounded-[28px] border border-(--app-border) p-5 shadow-[0_18px_46px_rgba(18,16,30,0.06)]"
            style={{ background: meta.background }}
          >
            {/* Metric tile header: controls the icon and overflow menu at the top of each summary tile. */}
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/70 text-(--app-text)">
                {meta.icon}
              </div>
              <MoreHorizRoundedIcon className="text-(--app-muted)" />
            </div>

            {/* Metric tile body: controls the label, amount, change chip, and comparison copy. */}
            <Typography variant="body2" className="mt-5 text-(--app-muted)">
              {meta.label}
            </Typography>
            <Typography variant="h5" className="mt-3 text-(--app-heading)">
              {formatCurrency(metric.value)}
            </Typography>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Chip
                size="small"
                label={formatSignedCurrency(metric.change)}
                className={toneClassName[metric.tone]}
              />
              <Typography variant="caption" className="text-(--app-muted)">
                {metric.comparisonLabel}
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
};
