import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import { Typography } from '@mui/material';

export const SavingsPage = () => (
  <div className="grid min-h-[calc(100vh-220px)] place-items-center px-1">
    {/* Savings placeholder state: intentionally keeps the page minimal until a real savings account workflow is added. */}
    <div className="flex min-h-90 w-full max-w-2xl flex-col items-center justify-center rounded-[36px] border border-(--app-border) bg-(--app-surface-strong)/92 px-8 py-12 text-center shadow-[0_26px_72px_rgba(15,35,43,0.08)]">
      <SavingsRoundedIcon sx={{ fontSize: 108, color: 'var(--app-accent)' }} />
      <Typography variant="h5" className="mt-6 text-(--app-heading)">
        no savings account added
      </Typography>
    </div>
  </div>
);
