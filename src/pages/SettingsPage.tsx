import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import {
  FormControl,
  MenuItem,
  Select,
  Switch,
  Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { CardShell } from '@/components/common/CardShell';
import { PageIntro } from '@/components/common/PageIntro';
import { PageSkeleton } from '@/components/common/PageSkeleton';
import { useSimulatedLoading } from '@/hooks/useSimulatedLoading';
import { useAppStore } from '@/store/useAppStore';
import { roleOptions } from '@/types/finance';
import { getAccountOptions } from '@/utils/accounts';

export const SettingsPage = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const {
    transactions,
    role,
    setRole,
    selectedAccount,
    setSelectedAccount,
    themeMode,
    toggleThemeMode,
  } = useAppStore(
    useShallow((state) => ({
      transactions: state.transactions,
      role: state.role,
      setRole: state.setRole,
      selectedAccount: state.selectedAccount,
      setSelectedAccount: state.setSelectedAccount,
      themeMode: state.themeMode,
      toggleThemeMode: state.toggleThemeMode,
    })),
  );
  const isLoading = useSimulatedLoading();
  const accountOptions = useMemo(() => getAccountOptions(transactions), [transactions]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageIntro
        eyebrow="Settings"
        title="The core controls for appearance, access, notifications, and workspace preferences."
        description="These settings give the app a real configuration surface instead of leaving the sidebar settings action empty."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <CardShell title="Workspace Preferences" subtitle="These controls directly affect the live FinTrack workspace preview.">
          <div className="space-y-5">
            <div className="flex items-center justify-between rounded-[22px] border border-(--app-border) bg-(--app-surface-muted) px-4 py-4">
              <div>
                <Typography variant="body1" className="font-semibold text-(--app-heading)">
                  Theme mode
                </Typography>
                <Typography variant="body2" className="text-(--app-muted)">
                  Switch the interface between light and dark.
                </Typography>
              </div>
              <Switch checked={themeMode === 'dark'} onChange={toggleThemeMode} />
            </div>

            <div className="rounded-[22px] border border-(--app-border) bg-(--app-surface-muted) p-4">
              <Typography variant="body1" className="font-semibold text-(--app-heading)">
                Active account
              </Typography>
              <Typography variant="body2" className="mt-1 text-(--app-muted)">
                Choose the account scope used across the dashboard and transactions.
              </Typography>
              <FormControl fullWidth className="mt-4">
                <Select
                  value={selectedAccount}
                  onChange={(event) => setSelectedAccount(event.target.value)}
                >
                  {accountOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="rounded-[22px] border border-(--app-border) bg-(--app-surface-muted) p-4">
              <Typography variant="body1" className="font-semibold text-(--app-heading)">
                Access mode preview
              </Typography>
              <Typography variant="body2" className="mt-1 text-(--app-muted)">
                Switch between admin and viewer to validate role-based UI behavior.
              </Typography>
              <FormControl fullWidth className="mt-4">
                <Select
                  value={role}
                  onChange={(event) => setRole(event.target.value as typeof role)}
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
        </CardShell>

        <CardShell title="Notification Controls" subtitle="The core reminders a finance dashboard usually exposes.">
          <div className="space-y-4">
            {[
              {
                label: 'Email notifications',
                description: 'Receive workspace summaries and product updates by email.',
                checked: emailNotifications,
                onChange: setEmailNotifications,
              },
              {
                label: 'Payment reminders',
                description: 'Surface reminders for upcoming scheduled payments.',
                checked: paymentReminders,
                onChange: setPaymentReminders,
              },
              {
                label: 'Security alerts',
                description: 'Notify the user when important account or access events occur.',
                checked: securityAlerts,
                onChange: setSecurityAlerts,
              },
            ].map((setting) => (
              <div
                key={setting.label}
                className="flex items-center justify-between rounded-[22px] border border-(--app-border) bg-(--app-surface-muted) px-4 py-4"
              >
                <div className="pr-6">
                  <Typography variant="body1" className="font-semibold text-(--app-heading)">
                    {setting.label}
                  </Typography>
                  <Typography variant="body2" className="mt-1 text-(--app-muted)">
                    {setting.description}
                  </Typography>
                </div>
                <Switch
                  checked={setting.checked}
                  onChange={(event) => setting.onChange(event.target.checked)}
                />
              </div>
            ))}
          </div>
        </CardShell>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CardShell title="Security" subtitle="A lightweight placeholder for the security-related settings users expect.">
          <div className="space-y-4">
            <div className="rounded-[22px] border border-(--app-border) bg-(--app-surface-muted) p-4">
              <SecurityRoundedIcon className="text-(--app-accent)" />
              <Typography variant="h6" className="mt-4 text-(--app-heading)">
                Access hygiene
              </Typography>
              <Typography variant="body2" className="mt-2 text-(--app-muted)">
                Review role access frequently and keep support contact details nearby when handing the workspace to viewers.
              </Typography>
            </div>
          </div>
        </CardShell>

        <CardShell title="General" subtitle="A final bucket for practical workspace preferences.">
          <div className="space-y-4">
            <div className="rounded-[22px] border border-(--app-border) bg-(--app-surface-muted) p-4">
              <TuneRoundedIcon className="text-(--app-accent)" />
              <Typography variant="h6" className="mt-4 text-(--app-heading)">
                Workspace defaults
              </Typography>
              <Typography variant="body2" className="mt-2 text-(--app-muted)">
                Settings in this demo currently focus on theme, role preview, account scope, and payment-related reminders.
              </Typography>
            </div>
          </div>
        </CardShell>
      </div>
    </div>
  );
};
