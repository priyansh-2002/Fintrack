import type { ReactNode } from 'react';

import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { Avatar, Chip, IconButton, Switch, Tooltip, Typography } from '@mui/material';
import clsx from 'clsx';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { SupportDialog } from '@/components/layout/SupportDialog';
import { useAppStore } from '@/store/useAppStore';

type NavItem = {
  label: string;
  path?: string;
  icon: ReactNode;
  onClick?: () => void;
};

const primaryNavigation: NavItem[] = [
  {
    label: 'Overview',
    path: '/dashboard',
    icon: <GridViewRoundedIcon fontSize="small" />,
  },
  {
    label: 'Savings',
    path: '/savings',
    icon: <SavingsRoundedIcon fontSize="small" />,
  },
  {
    label: 'Cards',
    path: '/cards',
    icon: <CreditCardRoundedIcon fontSize="small" />,
  },
  {
    label: 'Payments',
    path: '/payments',
    icon: <PaidRoundedIcon fontSize="small" />,
  },
  {
    label: 'Activity',
    path: '/transactions',
    icon: <ReceiptLongRoundedIcon fontSize="small" />,
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: <PersonRoundedIcon fontSize="small" />,
  },
];

interface SidebarProps {
  onNavigate?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar = ({
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) => {
  const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { role, themeMode, toggleThemeMode } = useAppStore(
    useShallow((state) => ({
      role: state.role,
      themeMode: state.themeMode,
      toggleThemeMode: state.toggleThemeMode,
    })),
  );

  const footerNavigation: NavItem[] = [
    {
      label: 'Support',
      icon: <HelpOutlineRoundedIcon fontSize="small" />,
      onClick: () => setIsSupportDialogOpen(true),
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: <SettingsRoundedIcon fontSize="small" />,
    },
  ];

  const handleItemSelect = (item: NavItem) => {
    if (item.path) {
      navigate(item.path);
      onNavigate?.();
      return;
    }

    item.onClick?.();
  };

  const renderNavigationItem = (item: NavItem) => {
    const isActive = item.path ? location.pathname === item.path : false;

    const button = (
      <button
        type="button"
        onClick={() => handleItemSelect(item)}
        className={clsx(
          'flex w-full items-center rounded-[18px] border text-left transition duration-200',
          collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3',
          isActive
            ? 'border-(--app-sidebar-line) bg-(--app-sidebar-active)'
            : 'border-transparent bg-transparent hover:bg-(--app-sidebar-active)',
        )}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--app-sidebar-panel) text-(--app-sidebar-icon)">
          {item.icon}
        </div>
        {!collapsed ? (
          <Typography variant="body1" className="font-semibold text-(--app-sidebar-text)">
            {item.label}
          </Typography>
        ) : null}
      </button>
    );

    if (!collapsed) {
      return <div key={item.label}>{button}</div>;
    }

    return (
      <Tooltip key={item.label} title={item.label} placement="right">
        <span className="block">{button}</span>
      </Tooltip>
    );
  };

  return (
    <>
      <div
        className={clsx(
          'flex h-full flex-col rounded-4xl border py-5 text-(--app-sidebar-text) shadow-[0_24px_80px_rgba(3,12,16,0.12)] transition-all duration-300',
          collapsed ? 'px-3' : 'px-4',
        )}
        style={{
          borderColor: 'var(--app-sidebar-line)',
          backgroundColor: 'var(--app-surface-strong)',
          backgroundImage: 'var(--app-sidebar)',
        }}
      >
        {/* Brand row: keeps the app logo visible and places the desktop collapse toggle to the right of the app name. */}
        <div
          className={clsx(
            'flex items-center',
            collapsed ? 'justify-between px-1' : 'gap-3 px-3',
          )}
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--app-sidebar-active) text-(--app-sidebar-icon)">
            <AccountBalanceWalletRoundedIcon fontSize="small" />
          </div>

          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <Typography variant="h6" className="text-(--app-sidebar-text)">
                FinTrack
              </Typography>
              <Typography variant="body2" className="text-(--app-sidebar-muted)">
                Banking dashboard
              </Typography>
            </div>
          ) : null}

          {onToggleCollapse ? (
            <Tooltip title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
              <IconButton
                onClick={onToggleCollapse}
                size="small"
                sx={{
                  color: 'var(--app-sidebar-icon)',
                  border: '1px solid var(--app-sidebar-line)',
                  backgroundColor: 'var(--app-sidebar-panel)',
                }}
              >
                {collapsed ? (
                  <ChevronRightRoundedIcon fontSize="small" />
                ) : (
                  <ChevronLeftRoundedIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          ) : null}
        </div>

        {/* Account holder block: becomes an avatar-only logo when the sidebar is collapsed. */}
        {collapsed ? (
          <div className="mt-6 flex justify-center">
            <Tooltip title="Account holder" placement="right">
              <Avatar
                sx={{
                  width: 52,
                  height: 52,
                  fontWeight: 800,
                  background:
                    'linear-gradient(135deg, rgba(255,142,119,0.92), rgba(250,204,134,0.92))',
                  color: '#1b1220',
                  boxShadow: '0 14px 28px rgba(18,22,33,0.14)',
                }}
              >
                P
              </Avatar>
            </Tooltip>
          </div>
        ) : (
          <div className="mt-8 rounded-[28px] border border-(--app-sidebar-line) bg-(--app-sidebar-panel) p-4">
            <div className="flex flex-col items-center text-center">
              <Avatar
                sx={{
                  width: 74,
                  height: 74,
                  fontWeight: 800,
                  background:
                    'linear-gradient(135deg, rgba(255,142,119,0.92), rgba(250,204,134,0.92))',
                  color: '#1b1220',
                }}
              >
                P
              </Avatar>
              <Typography variant="h6" className="mt-4 text-(--app-sidebar-text)">
                Priyansh
              </Typography>
            </div>
          </div>
        )}

        {/* Primary navigation: every main workspace section is now routable instead of being a disabled placeholder. */}
        <div className={clsx('mt-6', collapsed ? 'space-y-2' : 'space-y-1')}>
          {primaryNavigation.map(renderNavigationItem)}
        </div>

        <div className="my-6 h-px bg-(--app-sidebar-line)" />

        {/* Footer utility links: support opens a dialog and settings navigates to the dedicated settings page. */}
        <div className={clsx(collapsed ? 'space-y-2' : 'space-y-1')}>
          {footerNavigation.map(renderNavigationItem)}
        </div>

        {/* Theme control: stays as a full card in expanded mode and becomes an icon-only toggle in collapsed mode. */}
        {collapsed ? (
          <div className="mt-6 flex justify-center">
            <Tooltip
              title={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              placement="right"
            >
              <button
                type="button"
                onClick={toggleThemeMode}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--app-sidebar-line) bg-(--app-sidebar-panel) text-(--app-sidebar-icon) transition duration-200 hover:bg-(--app-sidebar-active)"
                aria-label="Toggle theme"
              >
                {themeMode === 'dark' ? (
                  <LightModeRoundedIcon fontSize="small" />
                ) : (
                  <DarkModeRoundedIcon fontSize="small" />
                )}
              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl border border-(--app-sidebar-line) bg-(--app-sidebar-panel) p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body1" className="font-semibold text-(--app-sidebar-text)">
                  Theme
                </Typography>
                <Typography variant="body2" className="text-(--app-sidebar-muted)">
                  Toggle light and dark mode
                </Typography>
              </div>
              <Switch checked={themeMode === 'dark'} onChange={toggleThemeMode} />
            </div>
          </div>
        )}

        {/* Access state: the collapsed sidebar shows only the role label, while the expanded sidebar keeps the full status card. */}
        {collapsed ? (
          <div className="mt-6 flex justify-center">
            <Chip
              size="small"
              label={role === 'admin' ? 'Admin' : 'Viewer'}
              className="bg-(--app-sidebar-active) text-(--app-sidebar-text)"
            />
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-(--app-sidebar-line) bg-(--app-sidebar-panel) p-4">
            <div className="flex items-center justify-between">
              <Typography
                variant="body2"
                className="uppercase tracking-[0.16em] text-(--app-sidebar-muted)"
              >
                Live snapshot
              </Typography>
              <Chip
                size="small"
                label={role === 'admin' ? 'Admin' : 'Viewer'}
                className="bg-(--app-sidebar-active) text-(--app-sidebar-text)"
              />
            </div>
            <Typography variant="body2" className="mt-3 text-(--app-sidebar-muted)">
              Current access type for this workspace.
            </Typography>
          </div>
        )}

        <div className="mt-auto pt-6">
          {collapsed ? (
            <div className="flex justify-center">
              <Tooltip title="Sign out" placement="right">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-transparent bg-(--app-sidebar-panel) text-(--app-sidebar-icon) transition duration-200 hover:bg-(--app-sidebar-active)"
                >
                  <LogoutRoundedIcon fontSize="small" />
                </button>
              </Tooltip>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-[22px] border border-transparent px-2 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-(--app-sidebar-panel) text-(--app-sidebar-icon)">
                  <LogoutRoundedIcon fontSize="small" />
                </div>
                <Typography variant="body1" className="font-semibold text-(--app-sidebar-text)">
                  Sign out
                </Typography>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Support dialog: contains the necessary support contact details requested for the sidebar support action. */}
      <SupportDialog open={isSupportDialogOpen} onClose={() => setIsSupportDialogOpen(false)} />
    </>
  );
};
