import type { ReactNode } from 'react';

import { Paper, Typography } from '@mui/material';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <Paper
    elevation={0}
    className="flex min-h-70 flex-col items-center justify-center rounded-[28px] border border-dashed border-(--app-border) bg-(--app-surface)/70 px-6 py-12 text-center"
  >
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--app-accent-soft) text-(--app-accent)">
      {icon}
    </div>
    <Typography variant="h6">{title}</Typography>
    <Typography variant="body2" className="mt-2 max-w-md text-(--app-muted)">
      {description}
    </Typography>
    {action ? <div className="mt-5">{action}</div> : null}
  </Paper>
);
