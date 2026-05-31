import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Tabs,
  Tab,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  useTheme,
  alpha,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { ProfileModal } from './modals/ProfileModal';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = useAuthStore((s) => s.user);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const NAV_ITEMS = [
    { label: t('nav.tasks'), path: '/tasks' },
    { label: t('nav.jobTypes'), path: '/job-types' },
  ];

  const currentTab = NAV_ITEMS.findIndex((n) => location.pathname.startsWith(n.path));

  return (
    <>
      <AppBar position="fixed" elevation={0}>
        <Toolbar disableGutters sx={{ px: { xs: 2, md: 4 } }}>
          {/* Inner wrapper centers the header content to match the centered page content. */}
          <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Logo */}
            <Typography
              variant="h6"
              sx={{
                fontFamily: '"Syne", sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: `linear-gradient(135deg, #fff 0%, ${theme.palette.primary.light} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: 'none',
                filter: `drop-shadow(0 0 12px ${alpha(theme.palette.primary.main, 0.5)})`,
                mr: 2,
                cursor: 'pointer',
                flexShrink: 0,
              }}
              onClick={() => navigate('/tasks')}
            >
              Builder
            </Typography>

            {/* Desktop nav */}
            {!isMobile && (
              <Tabs
                value={currentTab === -1 ? false : currentTab}
                onChange={(_, v) => navigate(NAV_ITEMS[v].path)}
                sx={{ flex: 1 }}
                slotProps={{
                  indicator: {
                    style: {
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      height: 3,
                      borderRadius: 2,
                    },
                  },
                }}
              >
                {NAV_ITEMS.map((item) => (
                  <Tab key={item.path} label={item.label} />
                ))}
              </Tabs>
            )}

            {isMobile && <Box sx={{ flex: 1 }} />}

            <LanguageSwitcher />

            {/* User button */}
            <Button
              startIcon={<AccountCircleIcon />}
              onClick={() => setProfileOpen(true)}
              variant="outlined"
              size="small"
              sx={{ flexShrink: 0 }}
            >
              {user?.username ?? t('nav.account')}
            </Button>

            {/* Mobile menu */}
            {isMobile && (
              <IconButton onClick={() => setDrawerOpen(true)} color="inherit">
                <MenuIcon />
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 240,
              background: alpha('#0f0f2a', 0.97),
              backdropFilter: 'blur(20px)',
            },
          },
        }}
      >
        <Box sx={{ pt: 8 }}>
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  selected={location.pathname.startsWith(item.path)}
                  onClick={() => {
                    navigate(item.path);
                    setDrawerOpen(false);
                  }}
                  sx={{
                    '&.Mui-selected': {
                      background: alpha(theme.palette.primary.main, 0.15),
                    },
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  );
}
