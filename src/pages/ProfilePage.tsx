import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { Avatar, Chip, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { CardShell } from '@/components/common/CardShell';
import { PageIntro } from '@/components/common/PageIntro';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { useAppStore } from '@/store/useAppStore';
import { formatCompactCurrency } from '@/utils/currency';

export const ProfilePage = () => {
  const { role, themeMode, selectedAccount, transactions, cards } = useAppStore(
    useShallow((state) => ({
      role: state.role,
      themeMode: state.themeMode,
      selectedAccount: state.selectedAccount,
      transactions: state.transactions,
      cards: state.cards,
    })),
  );
  const isLoading = useSimulatedLoading();
  const totalFlow = useMemo(
    () => transactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    [transactions],
  );

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Profile"
        title="Your FinTrack identity, workspace preferences, and portfolio footprint in one place."
        description="This section gives the user profile enough substance to feel like a real SaaS workspace instead of a placeholder sidebar item."
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CardShell title="Profile Overview" subtitle="Primary account identity visible across the workspace.">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Avatar
              sx={{
                width: 108,
                height: 108,
                fontSize: 42,
                fontWeight: 800,
                background: 'linear-gradient(135deg, rgba(255,142,119,0.92), rgba(250,204,134,0.92))',
                color: '#1b1220',
              }}
            >
              P
            </Avatar>
            <div className="space-y-3">
              <Typography variant="h4" className="text-(--app-heading)">
                Priyansh
              </Typography>
              <div className="flex flex-wrap gap-2">
                <Chip label={role === 'admin' ? 'Admin access' : 'Viewer access'} />
                <Chip label={themeMode === 'dark' ? 'Dark mode' : 'Light mode'} variant="outlined" />
                <Chip label={selectedAccount === 'all' ? 'All accounts' : selectedAccount} variant="outlined" />
              </div>
              <Typography variant="body2" className="max-w-xl text-(--app-muted)">
                This profile reflects the current FinTrack workspace owner and the preview settings you are actively using while exploring the dashboard.
              </Typography>
            </div>
          </div>
        </CardShell>

        <CardShell title="Workspace Snapshot" subtitle="A quick profile-oriented rollup of the current portfolio.">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[22px] border border-(--app-border) bg-(--app-surface-muted) p-4">
              <Typography variant="caption" className="uppercase tracking-[0.14em] text-(--app-muted)">
                Transactions
              </Typography>
              <Typography variant="h4" className="mt-3 text-(--app-heading)">
                {transactions.length}
              </Typography>
            </div>
            <div className="rounded-[22px] border border-(--app-border) bg-(--app-surface-muted) p-4">
              <Typography variant="caption" className="uppercase tracking-[0.14em] text-(--app-muted)">
                Cards
              </Typography>
              <Typography variant="h4" className="mt-3 text-(--app-heading)">
                {cards.length}
              </Typography>
            </div>
            <div className="rounded-[22px] border border-(--app-border) bg-(--app-surface-muted) p-4 sm:col-span-2">
              <Typography variant="caption" className="uppercase tracking-[0.14em] text-(--app-muted)">
                Total tracked flow
              </Typography>
              <Typography variant="h4" className="mt-3 text-(--app-heading)">
                {formatCompactCurrency(totalFlow)}
              </Typography>
            </div>
          </div>
        </CardShell>
      </div>

      <CardShell title="Profile Highlights" subtitle="Helpful context cards that make this section feel complete.">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-(--app-border) bg-(--app-surface-muted) p-5">
            <PersonRoundedIcon className="text-(--app-accent)" />
            <Typography variant="h6" className="mt-4 text-(--app-heading)">
              Workspace owner
            </Typography>
            <Typography variant="body2" className="mt-2 text-(--app-muted)">
              Priyansh currently controls the admin-facing workspace preview and dashboard settings.
            </Typography>
          </div>
          <div className="rounded-3xl border border-(--app-border) bg-(--app-surface-muted) p-5">
            <AutoAwesomeRoundedIcon className="text-(--app-accent)" />
            <Typography variant="h6" className="mt-4 text-(--app-heading)">
              Personalization
            </Typography>
            <Typography variant="body2" className="mt-2 text-(--app-muted)">
              Theme mode, active account, and cards workspace preferences can all be tuned from the settings route.
            </Typography>
          </div>
          <div className="rounded-3xl border border-(--app-border) bg-(--app-surface-muted) p-5">
            <AutoAwesomeRoundedIcon className="text-(--app-accent)" />
            <Typography variant="h6" className="mt-4 text-(--app-heading)">
              Access awareness
            </Typography>
            <Typography variant="body2" className="mt-2 text-(--app-muted)">
              Switching between admin and viewer mode changes what the user can create, edit, or delete across the workspace.
            </Typography>
          </div>
        </div>
      </CardShell>
    </div>
  );
};
