import { createTheme, alpha } from '@mui/material/styles';

const violet = '#7c3aed';
const cyan = '#06b6d4';
const bg = '#080818';
const surface = '#0f0f2a';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: violet, light: '#9d5cf6', dark: '#5b21b6' },
    secondary: { main: cyan, light: '#38d9f5', dark: '#0891b2' },
    background: { default: bg, paper: surface },
    error: { main: '#ef4444' },
    success: { main: '#22c55e' },
    warning: { main: '#f59e0b' },
    text: { primary: '#f1f5f9', secondary: '#94a3b8' },
  },
  typography: {
    fontFamily: '"Space Grotesk", sans-serif',
    h1: { fontFamily: '"Syne", sans-serif', fontWeight: 800 },
    h2: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h3: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
    h4: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
    h5: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
    h6: { fontFamily: '"Syne", sans-serif', fontWeight: 600 },
    button: { fontWeight: 600, letterSpacing: '0.05em', textTransform: 'none' },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `radial-gradient(ellipse at 20% 50%, ${alpha(violet, 0.12)} 0%, transparent 60%),
                       radial-gradient(ellipse at 80% 20%, ${alpha(cyan, 0.08)} 0%, transparent 50%),
                       ${bg}`,
          backgroundAttachment: 'fixed',
          minHeight: '100vh',
        },
        '::-webkit-scrollbar': { width: 6 },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': {
          background: alpha(violet, 0.4),
          borderRadius: 3,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: `${alpha('#1a1a3e', 0.7)}`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(violet, 0.15)}`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          transition: 'all 0.2s ease',
          '&:hover': { transform: 'translateY(-1px)' },
          '&.MuiButton-containedPrimary': {
            background: `linear-gradient(135deg, ${violet} 0%, #9d5cf6 100%)`,
            boxShadow: `0 4px 15px ${alpha(violet, 0.4)}`,
            '&:hover': { boxShadow: `0 6px 25px ${alpha(violet, 0.6)}` },
          },
          '&.MuiButton-outlinedPrimary': {
            borderColor: alpha(violet, 0.5),
            '&:hover': {
              borderColor: violet,
              background: alpha(violet, 0.08),
              boxShadow: `0 0 12px ${alpha(violet, 0.3)}`,
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: alpha('#0a0a1f', 0.5),
            '& fieldset': { borderColor: alpha(violet, 0.25) },
            '&:hover fieldset': { borderColor: alpha(violet, 0.5) },
            '&.Mui-focused fieldset': {
              borderColor: violet,
              boxShadow: `0 0 0 3px ${alpha(violet, 0.15)}`,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          background: alpha('#0a0a1f', 0.5),
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: `${alpha('#12122e', 0.95)}`,
          backdropFilter: 'blur(30px)',
          border: `1px solid ${alpha(violet, 0.2)}`,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.04em',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            background: alpha(violet, 0.06),
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `${alpha('#0a0a22', 0.8)}`,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(violet, 0.15)}`,
          boxShadow: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'none',
          fontSize: '0.9rem',
          minWidth: 120,
        },
      },
    },
  },
});
