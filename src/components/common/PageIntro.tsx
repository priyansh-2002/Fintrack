import type { ReactNode } from 'react';

import { Chip, Typography } from '@mui/material';

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export const PageIntro = ({
  eyebrow,
  title,
  description,
  action,
}: PageIntroProps) => {
  // Intro banner: controls the large descriptive header section used on route pages like Transactions.
  return (
    <div className="page-enter relative overflow-hidden rounded-4xl border border-(--app-border) bg-(--app-surface-strong)/85 p-6 shadow-[0_20px_60px_rgba(15,35,43,0.08)] md:p-8">
      <div className="absolute inset-y-0 right-0 hidden w-80 bg-[radial-gradient(circle_at_center,rgba(15,118,110,0.18),transparent_65%)] lg:block" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <Chip
            label={eyebrow}
            size="small"
            className="border border-(--app-border) bg-(--app-accent-soft) font-semibold text-(--app-accent)"
          />
          <Typography variant="h3" className="mt-4 text-balance text-(--app-text)">
            {title}
          </Typography>
          <Typography variant="body1" className="mt-3 max-w-xl text-(--app-muted)">
            {description}
          </Typography>
        </div>
        {action}
      </div>
    </div>
  );
};
