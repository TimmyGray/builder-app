import { Navigate, Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { useAuthStore } from '@/stores/authStore';
import { Header } from './Header';

export function ProtectedLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Toolbar /> {/* spacer for fixed AppBar */}
      <Box component="main" sx={{ flex: 1, p: { xs: 2, md: 4 } }}>
        <Outlet />
      </Box>
    </Box>
  );
}
