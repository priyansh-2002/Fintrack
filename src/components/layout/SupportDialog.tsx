import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';

interface SupportDialogProps {
  open: boolean;
  onClose: () => void;
}

const supportChannels = [
  {
    label: 'Support email',
    value: 'support@fintrack.app',
  },
  {
    label: 'Phone support',
    value: '+91 98 7654 3210',
  },
  {
    label: 'Support hours',
    value: 'Mon to Sat, 9:00 AM to 6:00 PM IST',
  },
  {
    label: 'Help topics',
    value: 'Cards, scheduled payments, transaction issues, workspace settings',
  },
];

export const SupportDialog = ({ open, onClose }: SupportDialogProps) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogTitle>Support</DialogTitle>
    <DialogContent className="space-y-4 pt-2">
      <Typography variant="body2" className="text-(--app-muted)">
        Reach out if you need help with payments, cards, workspace access, exports, or dashboard
        behavior. These are the primary support channels available in the FinTrack demo workspace.
      </Typography>
      <div className="space-y-3">
        {supportChannels.map((channel) => (
          <div
            key={channel.label}
            className="rounded-[20px] border border-(--app-border) bg-(--app-surface-muted) px-4 py-3"
          >
            <Typography variant="caption" className="uppercase tracking-[0.14em] text-(--app-muted)">
              {channel.label}
            </Typography>
            <Typography variant="body1" className="mt-2 font-semibold text-(--app-heading)">
              {channel.value}
            </Typography>
          </div>
        ))}
      </div>
      <Typography variant="body2" className="text-(--app-muted)">
        When contacting support, include the page name, the action you were taking, and whether
        the issue happened in light mode or dark mode.
      </Typography>
    </DialogContent>
    <DialogActions className="px-6 pb-6">
      <Button onClick={onClose} variant="contained">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);
