import clsx from 'clsx';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { IconButton, Tooltip, Typography } from '@mui/material';

import { CardShell } from '@/components/common/CardShell';
import type { ScheduledPayment } from '@/data/dashboardExperience';
import { formatCurrency } from '@/utils/currency';

const formatCadenceShort = (cadence: string) => {
  if (cadence.toLowerCase() === 'monthly') {
    return '/M';
  }

  return cadence;
};

export const ScheduledPaymentsPanel = ({
  payments,
  onOpenScheduled,
}: {
  payments: ScheduledPayment[];
  onOpenScheduled?: () => void;
}) => (
  <div
    role={onOpenScheduled ? 'button' : undefined}
    tabIndex={onOpenScheduled ? 0 : undefined}
    onClick={onOpenScheduled}
    onKeyDown={
      onOpenScheduled
        ? (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpenScheduled();
            }
          }
        : undefined
    }
    className={clsx(onOpenScheduled ? 'cursor-pointer transition duration-200 hover:-translate-y-0.5' : '')}
  >
    <CardShell
      title="Scheduled Payments"
      action={
        <Tooltip title={onOpenScheduled ? 'Open scheduled payments workspace' : 'More options'}>
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onOpenScheduled?.();
            }}
            sx={{
              color: 'var(--app-muted)',
              border: '1px solid transparent',
            }}
          >
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      }
      className="h-full rounded-[30px] border border-(--app-border) bg-(--app-surface-strong)/96 shadow-[0_18px_40px_rgba(15,35,43,0.06)]"
    >
      {/* Payment pill row: renders each recurring payment as a compact capsule like the inspiration cards. */}
      <div className="grid gap-3 sm:grid-cols-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="rounded-[18px] border border-(--app-border) bg-(--app-surface-muted) px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]"
          >
            {/* Payment text stack: keeps the name muted and the amount visually dominant without changing the value. */}
            <Typography variant="body2" className="truncate text-(--app-muted)">
              {payment.name}
            </Typography>
            <div className="mt-1 flex items-baseline gap-1">
              <Typography variant="body1" className="font-semibold text-(--app-heading)">
                {formatCurrency(payment.amount, 2)}
              </Typography>
              <Typography
                variant="caption"
                className="uppercase tracking-[0.08em] text-(--app-muted)"
              >
                {formatCadenceShort(payment.cadence)}
              </Typography>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  </div>
);
