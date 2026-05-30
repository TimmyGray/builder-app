import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { theme } from './theme';
import { ProtectedLayout } from './components/ProtectedLayout';
import { AuthPage } from './pages/AuthPage';
import { TasksPage } from './pages/TasksPage';
import { JobTypesPage } from './pages/JobTypesPage';
import { GlobalSnackbar } from './components/GlobalSnackbar';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<ProtectedLayout />}>
            <Route index element={<Navigate to="/tasks" replace />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/job-types" element={<JobTypesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <GlobalSnackbar />
    </ThemeProvider>
  );
}
