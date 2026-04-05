import CallMadeRoundedIcon from '@mui/icons-material/CallMadeRounded';
import CallReceivedRoundedIcon from '@mui/icons-material/CallReceivedRounded';
import { Chip, Typography } from '@mui/material';

import { CardShell } from '@/components/common/CardShell';
import { categoryMeta, type Transaction } from '@/types/finance';
import { formatCurrency } from '@/utils/currency';
import { formatLongDate } from '@/utils/date';

export const TransactionsRail = ({
  transactions,
}: {
  transactions: Transaction[];
}) => (
  <CardShell
    title="Recent Transactions"
    action={<Chip label="Month" size="small" variant="outlined" />}
    className="h-full"
  >
    {/* Transaction list: controls the stacked recent transaction cards in the right-side rail. */}
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between gap-3 rounded-[22px] border border-(--app-border) bg-(--app-surface-muted) px-4 py-3"
        >
          {/* Transaction identity block: controls the icon, title, and date for each row. */}
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
              style={{
                backgroundColor: `${categoryMeta[transaction.category].color}18`,
                color: categoryMeta[transaction.category].color,
              }}
            >
              {transaction.type === 'income' ? (
                <CallReceivedRoundedIcon fontSize="small" />
              ) : (
                <CallMadeRoundedIcon fontSize="small" />
              )}
            </div>
            <div className="min-w-0">
              <Typography variant="body1" className="truncate font-semibold text-(--app-heading)">
                {transaction.title}
              </Typography>
              <Typography variant="body2" className="truncate text-(--app-muted)">
                {formatLongDate(transaction.date)}
              </Typography>
            </div>
          </div>
          <Typography variant="body1" className="shrink-0 font-semibold text-(--app-heading)">
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </Typography>
        </div>
      ))}
    </div>
  </CardShell>
);
