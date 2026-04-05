import { alpha, createTheme } from '@mui/material/styles';

import type { ThemeMode } from '@/types/finance';

export const createAppTheme = (mode: ThemeMode) => {
  const isDark = mode === 'dark';
  const borderColor = alpha(isDark ? '#ffffff' : '#161a26', isDark ? 0.08 : 0.08);

  return createTheme({
    // Core palette: controls MUI colors so dialogs, inputs, buttons, and tables match the app mode.
    palette: {
      mode,
      primary: {
        main: isDark ? '#58e7c9' : '#21c6a0',
      },
      secondary: {
        main: '#f3b36b',
      },
      background: {
        default: isDark ? '#0c0914' : '#f3f0f7',
        paper: isDark ? '#181523' : '#ffffff',
      },
      success: {
        main: '#16a34a',
      },
      error: {
        main: '#dc2626',
      },
      text: {
        primary: isDark ? '#f7f7fb' : '#171923',
        secondary: isDark ? '#9ea5b8' : '#7a8091',
      },
    },
    // Shared shape token: controls the default MUI border radius across the interface.
    shape: {
      borderRadius: 24,
    },
    // Typography tokens: controls the heading families and weights used across MUI components.
    typography: {
      fontFamily: '"Manrope", "Segoe UI", sans-serif',
      h3: {
        fontFamily: '"Space Grotesk", "Manrope", sans-serif',
        fontWeight: 700,
        fontSize: 'clamp(2rem, 2vw + 1rem, 3rem)',
      },
      h4: {
        fontFamily: '"Space Grotesk", "Manrope", sans-serif',
        fontWeight: 700,
      },
      h5: {
        fontFamily: '"Space Grotesk", "Manrope", sans-serif',
        fontWeight: 700,
      },
      h6: {
        fontWeight: 700,
      },
      button: {
        fontWeight: 700,
        textTransform: 'none',
      },
    },
    // Component overrides: keeps MUI widgets visually aligned with the custom dashboard CSS variables.
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: 'var(--app-bg)',
            backgroundImage: 'var(--app-gradient)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${borderColor}`,
            boxShadow: isDark
              ? '0 22px 60px rgba(0, 0, 0, 0.18)'
              : '0 18px 48px rgba(25, 27, 36, 0.06)',
          },
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 16,
            paddingInline: 16,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(20,24,38,0.03)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 999,
            fontWeight: 700,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderColor,
          },
          head: {
            fontWeight: 700,
            color: isDark ? '#edf4f1' : '#10242b',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
          },
        },
      },
    },
  });
};
