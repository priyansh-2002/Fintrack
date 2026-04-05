import clsx from 'clsx';
import { Drawer } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';

import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { TransactionFormDialog } from '@/features/transactions/components/TransactionFormDialog';
import { useAppStore } from '@/store/useAppStore';

export const AppLayout = () => {
  const {
    isMobileSidebarOpen,
    setMobileSidebarOpen,
    isDesktopSidebarCollapsed,
    toggleDesktopSidebar,
  } = useAppStore(
    useShallow((state) => ({
      isMobileSidebarOpen: state.isMobileSidebarOpen,
      setMobileSidebarOpen: state.setMobileSidebarOpen,
      isDesktopSidebarCollapsed: state.isDesktopSidebarCollapsed,
      toggleDesktopSidebar: state.toggleDesktopSidebar,
    })),
  );

  return (
    <div className="min-h-screen bg-(--app-bg) text-(--app-text)">
      {/* App-wide atmospheric glow that should remain visible behind the shell for the full page length. */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(143,209,196,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(238,205,138,0.16),transparent_28%)]" />
      <Drawer
        open={isMobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none',
            padding: 1.5,
            width: 320,
          },
        }}
        sx={{ display: { lg: 'none' } }}
      >
        {/* Mobile drawer version of the sidebar navigation. */}
        <Sidebar onNavigate={() => setMobileSidebarOpen(false)} />
      </Drawer>
      <div className="relative px-4 py-4 md:px-6 xl:px-8">
        {/* Outer shell background: this is the red-arrow surface and it now stretches with the full content height. */}
        <div className="mx-auto min-h-[calc(100vh-32px)] max-w-400 rounded-[40px] border border-(--app-shell-border) bg-(--app-shell) p-3 shadow-(--app-shell-shadow) backdrop-blur-xl md:p-4">
          <div
            className={clsx(
              'grid min-h-[calc(100vh-56px)] gap-4 transition-[grid-template-columns] duration-300 lg:items-stretch',
              isDesktopSidebarCollapsed
                ? 'lg:grid-cols-[112px_minmax(0,1fr)]'
                : 'lg:grid-cols-[280px_minmax(0,1fr)]',
            )}
          >
            {/* Desktop sidebar column: this stretches with the shell so the sidebar background fills its own full column. */}
            <aside className="hidden h-full lg:block">
              <Sidebar
                collapsed={isDesktopSidebarCollapsed}
                onToggleCollapse={toggleDesktopSidebar}
              />
            </aside>
            {/* Main workspace column: page-specific sections render here without forcing a single full-height panel. */}
            <main className="min-w-0 rounded-4xl bg-(--app-main-panel) px-1 pb-4">
              <Topbar onOpenSidebar={() => setMobileSidebarOpen(true)} />
              <Outlet />
            </main>
          </div>
        </div>
      </div>
      {/* Global transaction modal so dashboard actions can open it from any route. */}
      <TransactionFormDialog />
    </div>
  );
};
