import { Chip, Typography } from '@mui/material';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CardShell } from '@/components/common/CardShell';
import type { MoneyFlowPoint } from '@/features/dashboard/selectors';
import { formatCompactCurrency, formatCurrency } from '@/utils/currency';

export const MoneyFlowCard = ({ data }: { data: MoneyFlowPoint[] }) => (
  <CardShell
    title="Money Flow"
    subtitle="Savings and expenses compared across recent monthly snapshots."
    action={<Chip label="Monthly" size="small" variant="outlined" />}
    className="h-full"
  >
    {/* Legend row: controls the labels and dots that explain the chart series colors. */}
    <div className="mb-5 flex items-center gap-5 text-sm text-(--app-muted)">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-(--app-heading)" />
        Total Saving
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ecb38f]" />
        Total Expense
      </div>
    </div>

    {/* Chart area: controls the axes, tooltip, and line rendering for the money flow graph. */}
    <div className="h-75">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--app-chart-grid)" strokeDasharray="4 4" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--app-muted)', fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--app-muted)', fontSize: 12 }}
            tickFormatter={formatCompactCurrency}
            width={76}
          />
          <Tooltip
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <div className="rounded-2xl border border-(--app-border) bg-(--app-surface-strong) px-4 py-3 shadow-lg">
                  <Typography variant="body2" className="font-semibold text-(--app-heading)">
                    {label}
                  </Typography>
                  {payload.map((item) => (
                    <Typography
                      key={`${String(item.dataKey)}-${String(item.name)}`}
                      variant="body2"
                      className="mt-1 text-(--app-muted)"
                    >
                      {item.name}: {formatCurrency(Number(item.value))}
                    </Typography>
                  ))}
                </div>
              ) : null
            }
          />
          <Line
            type="monotone"
            dataKey="savings"
            name="Total Saving"
            stroke="var(--app-heading)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 6, fill: 'var(--app-heading)' }}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Total Expense"
            stroke="#ecb38f"
            strokeWidth={2.5}
            strokeDasharray="4 6"
            dot={false}
            activeDot={{ r: 6, fill: '#ecb38f' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardShell>
);
