import type { PropsWithChildren } from 'react';
import { useEffect, useMemo } from 'react';

import { CssBaseline, ThemeProvider } from '@mui/material';

import { createAppTheme } from '@/app/theme';
import { useAppStore } from '@/store/useAppStore';

export const AppProviders = ({ children }: PropsWithChildren) => {
  const themeMode = useAppStore((state) => state.themeMode);
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
};
