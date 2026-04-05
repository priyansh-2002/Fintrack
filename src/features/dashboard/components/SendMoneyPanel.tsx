import AddRoundedIcon from '@mui/icons-material/AddRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { Avatar, IconButton, Tooltip } from '@mui/material';

import { CardShell } from '@/components/common/CardShell';
import type { QuickContact } from '@/data/dashboardExperience';

export const SendMoneyPanel = ({
  contacts,
  canManage,
  onNewPayment,
}: {
  contacts: QuickContact[];
  canManage: boolean;
  onNewPayment: () => void;
}) => (
  <CardShell
    title="Send Money To"
    action={
      <Tooltip title="More options">
        <IconButton
          size="small"
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
    contentClassName="flex items-center gap-3 pt-1"
  >
    {/* Add-payment avatar: keeps the quick action visible while matching the circular style from the inspiration. */}
    <button
      type="button"
      onClick={onNewPayment}
      disabled={!canManage}
      aria-label="Create a new payment"
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-(--app-border) bg-(--app-heading) text-white shadow-[0_12px_28px_rgba(17,22,34,0.18)] transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 dark:bg-white dark:text-(--app-heading)"
    >
      <AddRoundedIcon fontSize="small" />
    </button>

    {/* Quick contact row: each avatar is styled as an individual floating contact bubble instead of a stacked group. */}
    <div className="flex min-w-0 items-center gap-3">
      {contacts.slice(0, 4).map((contact) => (
        <Avatar
          key={contact.id}
          sx={{
            width: 48,
            height: 48,
            bgcolor: contact.color,
            color: '#1a1b25',
            fontWeight: 700,
            border: '2px solid rgba(255,255,255,0.92)',
            boxShadow: '0 10px 22px rgba(18,22,33,0.12)',
          }}
        >
          {contact.initials}
        </Avatar>
      ))}
    </div>
  </CardShell>
);
