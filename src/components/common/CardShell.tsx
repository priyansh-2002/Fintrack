import type { PropsWithChildren, ReactNode } from 'react';

import { Paper, Typography } from '@mui/material';
import clsx from 'clsx';

interface CardShellProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const CardShell = ({
  title,
  subtitle,
  action,
  className,
  contentClassName,
  children,
}: CardShellProps) => {
  // Reusable card surface: controls the standard panel frame shared across dashboard and transactions widgets.
  return (
    <Paper
      className={clsx(
        'rounded-[28px] bg-(--app-surface-strong)/90 p-5 shadow-[0_18px_60px_rgba(15,35,43,0.08)]',
        className,
      )}
      elevation={0}
    >
      {/* Card header: controls the title, optional subtitle, and right-aligned action area. */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Typography variant="h6" className="text-(--app-text)">
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" className="mt-1 text-(--app-muted)">
              {subtitle}
            </Typography>
          ) : null}
        </div>
        {action}
      </div>

      {/* Card content: renders the custom body passed in by each feature component. */}
      <div className={contentClassName}>{children}</div>
    </Paper>
  );
};
