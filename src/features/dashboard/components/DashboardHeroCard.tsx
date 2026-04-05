import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded';
import CallReceivedRoundedIcon from '@mui/icons-material/CallReceivedRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { Button, Typography } from '@mui/material';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

import type { BalancePoint } from '@/features/dashboard/selectors';
import { formatCurrency } from '@/utils/currency';

interface DashboardHeroCardProps {
  accountLabel: string;
  balance: number;
  history: BalancePoint[];
  canManage: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export const DashboardHeroCard = ({
  accountLabel,
  balance,
  history,
  canManage,
  onDeposit,
  onWithdraw,
}: DashboardHeroCardProps) => {
  const sparklineData = history.slice(-8);
  const previousValue = sparklineData.at(-2)?.balance ?? balance;
  const deltaPercentage =
    previousValue === 0 ? 0 : ((balance - previousValue) / Math.abs(previousValue)) * 100;

  return (
    <div className="page-enter rounded-[34px] border border-(--app-border) bg-(--app-hero-surface) p-6 text-(--app-hero-text) shadow-[0_26px_70px_rgba(15,12,24,0.14)]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        {/* Balance summary: controls the title, selected account label, balance, and action buttons. */}
        <div className="max-w-xl">
          <Typography variant="h5" className="text-(--app-hero-text)">
            Current Balance
          </Typography>
          <Typography variant="body2" className="mt-2 text-(--app-hero-muted)">
            {accountLabel}
          </Typography>
          <Typography variant="h3" className="mt-8 text-(--app-hero-text)">
            {formatCurrency(balance, 2)}
          </Typography>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="contained"
              startIcon={<CallReceivedRoundedIcon />}
              onClick={onDeposit}
              disabled={!canManage}
              sx={{
                backgroundColor: 'var(--app-hero-action-primary)',
                color: 'var(--app-hero-action-primary-text)',
                '&:hover': {
                  backgroundColor: 'var(--app-hero-action-primary)',
                  opacity: 0.92,
                },
              }}
            >
              Deposit
            </Button>
            <Button
              variant="contained"
              startIcon={<CallMadeRoundedIcon />}
              onClick={onWithdraw}
              disabled={!canManage}
              sx={{
                backgroundColor: 'var(--app-hero-action-secondary)',
                color: 'var(--app-hero-action-secondary-text)',
                border: '1px solid rgba(255,255,255,0.14)',
                '&:hover': {
                  backgroundColor: 'var(--app-hero-action-secondary)',
                  opacity: 0.92,
                },
              }}
            >
              Withdraw
            </Button>
          </div>
        </div>

        {/* Trend panel: controls the mini chart and percentage delta shown on the right side of the hero. */}
        <div className="flex w-full max-w-sm flex-col justify-between rounded-[28px] bg-[linear-gradient(180deg,rgba(57,224,185,0.04),rgba(57,224,185,0))] p-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography
                variant="body2"
                className="uppercase tracking-[0.18em] text-(--app-hero-muted)"
              >
                Balance trend
              </Typography>
              <Typography variant="body1" className="mt-2 font-semibold text-(--app-hero-text)">
                Last 8 entries
              </Typography>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-[rgba(88,231,201,0.12)] px-3 py-1 text-sm font-semibold text-[#52e0c0]">
              <TrendingUpRoundedIcon fontSize="inherit" />
              {deltaPercentage.toFixed(0)}%
            </div>
          </div>
          <div className="mt-5 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparklineData}>
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="#43e1bf"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: '#43e1bf' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
