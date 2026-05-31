import { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  alpha,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';
import { useNotifyStore } from '@/stores/notifyStore';
import { signIn, signUp } from '@/api/auth';
import type { UserJobRole } from '@/types/api';

export function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const notify = useNotifyStore((s) => s.notify);

  const [tab, setTab] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [jobRole, setJobRole] = useState<UserJobRole>('Builder');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = tab === 0
        ? await signIn(username, password)
        : await signUp(username, password, jobRole);
      setUser(user);
      navigate('/tasks');
    } catch (err: unknown) {
      notify((err as { message: string }).message ?? t('auth.failed'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 30% 40%, ${alpha('#7c3aed', 0.2)} 0%, transparent 55%),
                       radial-gradient(ellipse at 75% 70%, ${alpha('#06b6d4', 0.12)} 0%, transparent 50%)`,
          pointerEvents: 'none',
        },
      }}
    >
      {/* Decorative orbs */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: alpha('#7c3aed', 0.06),
        filter: 'blur(60px)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        right: '8%',
        width: 250,
        height: 250,
        borderRadius: '50%',
        background: alpha('#06b6d4', 0.06),
        filter: 'blur(50px)',
        pointerEvents: 'none',
      }} />

      <Fade in timeout={600}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Branding */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: '"Syne", sans-serif',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                background: 'linear-gradient(135deg, #fff 0%, #9d5cf6 60%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 0.5,
              }}
            >
              Builder App
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('auth.subtitle')}
            </Typography>
          </Box>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{ mb: 3 }}
            slotProps={{
              indicator: {
                style: {
                  background: 'linear-gradient(90deg, #7c3aed, #06b6d4)',
                  height: 3,
                  borderRadius: 2,
                },
              },
            }}
          >
            <Tab label={t('auth.signIn')} />
            <Tab label={t('auth.signUp')} />
          </Tabs>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              size="small"
              label={t('auth.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />

            <TextField
              fullWidth
              size="small"
              type="password"
              label={t('auth.password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={tab === 0 ? 'current-password' : 'new-password'}
              required
            />

            {tab === 1 && (
              <FormControl fullWidth size="small">
                <InputLabel>{t('auth.jobRole')}</InputLabel>
                <Select
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value as UserJobRole)}
                  label={t('auth.jobRole')}
                >
                  <MenuItem value="Builder">{t('role.Builder')}</MenuItem>
                  <MenuItem value="Supervisor">{t('role.Supervisor')}</MenuItem>
                </Select>
              </FormControl>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 1,
                py: 1.25,
                fontSize: '1rem',
                '@keyframes pulse': {
                  '0%, 100%': { boxShadow: '0 4px 15px rgba(124,58,237,0.4)' },
                  '50%': { boxShadow: '0 4px 30px rgba(124,58,237,0.7)' },
                },
                animation: loading ? 'pulse 1.2s ease-in-out infinite' : 'none',
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : tab === 0 ? (
                t('auth.signIn')
              ) : (
                t('auth.createAccount')
              )}
            </Button>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
