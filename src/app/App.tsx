import { lazy, Suspense } from 'react';

import { Navigate, Route, Routes } from 'react-router-dom';

import { PageSkeleton } from '@/components/common/PageSkeleton';
import { AppLayout } from '@/components/layout/AppLayout';

const DashboardPage = lazy(async () => ({
  default: (await import('@/pages/DashboardPage')).DashboardPage,
}));

const TransactionsPage = lazy(async () => ({
  default: (await import('@/pages/TransactionsPage')).TransactionsPage,
}));

const CardsPage = lazy(async () => ({
  default: (await import('@/pages/CardsPage')).CardsPage,
}));

const SavingsPage = lazy(async () => ({
  default: (await import('@/pages/SavingsPage')).SavingsPage,
}));

const PaymentsPage = lazy(async () => ({
  default: (await import('@/pages/PaymentsPage')).PaymentsPage,
}));

const ProfilePage = lazy(async () => ({
  default: (await import('@/pages/ProfilePage')).ProfilePage,
}));

const SettingsPage = lazy(async () => ({
  default: (await import('@/pages/SettingsPage')).SettingsPage,
}));

export const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <DashboardPage />
          </Suspense>
        }
      />
      <Route
        path="/transactions"
        element={
          <Suspense fallback={<PageSkeleton showTable />}>
            <TransactionsPage />
          </Suspense>
        }
      />
      <Route
        path="/cards"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <CardsPage />
          </Suspense>
        }
      />
      <Route
        path="/savings"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <SavingsPage />
          </Suspense>
        }
      />
      <Route
        path="/payments"
        element={
          <Suspense fallback={<PageSkeleton showTable />}>
            <PaymentsPage />
          </Suspense>
        }
      />
      <Route
        path="/profile"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <ProfilePage />
          </Suspense>
        }
      />
      <Route
        path="/settings"
        element={
          <Suspense fallback={<PageSkeleton />}>
            <SettingsPage />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
  </Routes>
);
