import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import BadgeRoundedIcon from '@mui/icons-material/BadgeRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import {
  ClickAwayListener,
  Divider,
  FormControl,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Popover,
  Select,
  Tooltip,
  Typography,
} from '@mui/material';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { useAppStore } from '@/store/useAppStore';
import { roleOptions } from '@/types/finance';
import { getAccountOptions } from '@/utils/accounts';

const routeMeta: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Hello Priyansh',
    description: 'Monitor your accounts, card activity, and cash flow from one place.',
  },
  '/transactions': {
    title: 'Transactions Workspace',
    description: 'Search, filter, sort, and manage ledger records in one place.',
  },
  '/cards': {
    title: 'Cards Workspace',
    description: 'Review every saved bank card, issuer, network, and balance in one dedicated hub.',
  },
  '/savings': {
    title: 'Savings',
    description: 'A focused area for savings-account content and future savings products.',
  },
  '/payments': {
    title: 'Payments Workspace',
    description: 'Review completed payments and scheduled recurring payment commitments.',
  },
  '/profile': {
    title: 'Profile',
    description: 'View the user profile, workspace role, and personalization details.',
  },
  '/settings': {
    title: 'Settings',
    description: 'Configure appearance, notifications, access preview, and workspace preferences.',
  },
};

const settingsLinks = [
  { label: 'Profile', icon: <PersonRoundedIcon fontSize="small" />, path: '/profile' },
  { label: 'My FinTrack Account', icon: <BadgeRoundedIcon fontSize="small" />, path: '/settings' },
  { label: 'Security', icon: <SecurityRoundedIcon fontSize="small" />, path: '/settings' },
  { label: 'Preferences', icon: <TuneRoundedIcon fontSize="small" />, path: '/settings' },
  { label: 'Billing & plans', icon: <AccountCircleRoundedIcon fontSize="small" />, path: '/settings' },
];

export const Topbar = ({ onOpenSidebar }: { onOpenSidebar: () => void }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  );
  const [settingsAnchorEl, setSettingsAnchorEl] = useState<HTMLButtonElement | null>(null);
  const { role, setRole, selectedAccount, setSelectedAccount, transactions } = useAppStore(
    useShallow((state) => ({
      role: state.role,
      setRole: state.setRole,
      selectedAccount: state.selectedAccount,
      setSelectedAccount: state.setSelectedAccount,
      transactions: state.transactions,
    })),
  );

  const activeRoute = routeMeta[location.pathname] ?? routeMeta['/dashboard'];
  const accountOptions = useMemo(() => getAccountOptions(transactions), [transactions]);

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const timer = window.setTimeout(() => searchInputRef.current?.focus(), 180);
    return () => window.clearTimeout(timer);
  }, [isSearchOpen]);

  return (
    <div className="sticky top-4 z-20 mb-6 rounded-[30px] border border-(--app-border) bg-(--app-surface)/88 px-4 py-3 shadow-[0_18px_54px_rgba(18,16,30,0.05)] backdrop-blur md:px-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Route heading: controls the title and supporting copy on the left side of the topbar. */}
        <div className="flex items-center gap-3">
          <IconButton
            onClick={onOpenSidebar}
            className="lg:hidden"
            sx={{ display: { lg: 'none' } }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <div>
            <Typography variant="overline" className="tracking-[0.24em] text-(--app-muted)">
              Finance workspace
            </Typography>
            <Typography variant="h4" className="text-(--app-heading)">
              {activeRoute.title}
            </Typography>
            <Typography variant="body2" className="text-(--app-muted)">
              {activeRoute.description}
            </Typography>
          </div>
        </div>

        {/* Control cluster: account switcher, role switcher, search, notifications, and settings live here. */}
        <div className="flex flex-wrap items-center gap-3">
          <FormControl size="small" sx={{ minWidth: 184 }}>
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

          <FormControl size="small" sx={{ minWidth: 118 }}>
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

          {/* Search control: expands horizontally into a full text input when the icon is clicked. */}
          <ClickAwayListener onClickAway={() => setIsSearchOpen(false)}>
            <div
              className={clsx(
                'flex h-11 items-center overflow-hidden rounded-full border bg-(--app-utility-bg)] transition-all duration-300',
                isSearchOpen ? 'w-full px-3 sm:w-70' : 'w-11',
              )}
              style={{ borderColor: 'var(--app-border)' }}
            >
              <Tooltip title="Search">
                <IconButton
                  onClick={() => setIsSearchOpen(true)}
                  className="h-11 w-11 shrink-0"
                  sx={{
                    color: 'var(--app-text)',
                    '&:hover': {
                      backgroundColor: 'var(--app-accent-soft)',
                    },
                  }}
                >
                  <SearchRoundedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <InputBase
                inputRef={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') {
                    setIsSearchOpen(false);
                  }
                }}
                placeholder="Search FinTrack"
                className={clsx(
                  'min-w-0 flex-1 text-sm text-(--app-text) transition-opacity duration-200',
                  isSearchOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
                )}
                sx={{
                  '& .MuiInputBase-input::placeholder': {
                    color: 'var(--app-muted)',
                    opacity: 1,
                  },
                }}
              />
            </div>
          </ClickAwayListener>

          <Tooltip title="Notifications">
            <IconButton
              className="h-11 w-11"
              onClick={(event) => setNotificationAnchorEl(event.currentTarget)}
              sx={{
                backgroundColor: 'var(--app-utility-bg)',
                border: '1px solid var(--app-border)',
                color: 'var(--app-text)',
                '&:hover': {
                  backgroundColor: 'var(--app-accent-soft)',
                },
              }}
            >
              <NotificationsRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Settings">
            <IconButton
              className="h-11 w-11"
              onClick={(event) => setSettingsAnchorEl(event.currentTarget)}
              sx={{
                backgroundColor: 'var(--app-utility-bg)',
                border: '1px solid var(--app-border)',
                color: 'var(--app-text)',
                '&:hover': {
                  backgroundColor: 'var(--app-accent-soft)',
                },
              }}
            >
              <SettingsRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      <Popover
        open={Boolean(notificationAnchorEl)}
        anchorEl={notificationAnchorEl}
        onClose={() => setNotificationAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            maxWidth: 320,
            borderRadius: 1,
            backgroundColor: 'var(--app-surface-strong)',
            border: '1px solid var(--app-border)',
          },
        }}
      >
        {/* Notification popover body: controls the empty-state messaging for notifications. */}
        <div className="p-4">
          <Typography variant="h6" className="text-(--app-heading)">
            Notifications
          </Typography>
          <Typography variant="body2" className="mt-2 text-(--app-muted)">
            YAY! You have no new notifications currently.
          </Typography>
        </div>
      </Popover>

      <Menu
        open={Boolean(settingsAnchorEl)}
        anchorEl={settingsAnchorEl}
        onClose={() => setSettingsAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            minWidth: 250,
            borderRadius: 1,
            backgroundColor: 'var(--app-surface-strong)',
            border: '1px solid var(--app-border)',
          },
        }}
      >
        {/* Settings menu header: introduces the account shortcut list. */}
        <div className="px-4 py-3">
          <Typography variant="body2" className="uppercase tracking-[0.18em] text-(--app-muted)">
            Quick settings
          </Typography>
          <Typography variant="body1" className="mt-2 font-semibold text-(--app-heading)">
            Manage your workspace
          </Typography>
        </div>
        <Divider />
        {settingsLinks.map((item) => (
          <MenuItem
            key={item.label}
            onClick={() => {
              setSettingsAnchorEl(null);
              navigate(item.path);
            }}
          >
            <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-2xl bg-(--app-utility-bg) text-(--app-text)">
              {item.icon}
            </span>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
