import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Divider,
  alpha,
  CircularProgress,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useNotifyStore } from '@/stores/notifyStore';
import { useTasksStore } from '@/stores/tasksStore';
import { updateUser } from '@/api/users';
import { signOut, deleteUser } from '@/api/auth';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: Props) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { setUser, clearUser } = useAuthStore();
  const notify = useNotifyStore((s) => s.notify);
  const fetchTasks = useTasksStore((s) => s.fetchTasks);

  const [username, setUsername] = useState(user?.username ?? '');
  const [deletePassword, setDeletePassword] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdateUsername = async () => {
    if (!user || !username.trim()) return;
    setSavingName(true);
    try {
      const updated = await updateUser(user.id, username.trim());
      setUser(updated);
      fetchTasks(); // refresh so the Worker column shows the new username
      notify('Username updated successfully', 'success');
      onClose();
    } catch (e: unknown) {
      notify((e as { message: string }).message ?? 'Failed to update username', 'error');
    } finally {
      setSavingName(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } catch {
      // fire and forget
    } finally {
      clearUser();
      navigate('/auth');
      onClose();
    }
  };

  const handleDeleteAccount = async () => {
    if (!user || !deletePassword.trim()) return;
    setDeleting(true);
    try {
      await deleteUser(user.username, deletePassword);
      clearUser();
      navigate('/auth');
      notify('Account deleted', 'info');
    } catch (e: unknown) {
      notify((e as { message: string }).message ?? 'Failed to delete account', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700, pb: 1 }}>
        Account Settings
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Update username */}
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
            Update Username
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="New username"
            />
            <Button
              variant="contained"
              size="small"
              onClick={handleUpdateUsername}
              disabled={savingName || !username.trim()}
              startIcon={savingName ? <CircularProgress size={14} /> : <SaveIcon />}
              sx={{ flexShrink: 0 }}
            >
              Save
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: alpha('#7c3aed', 0.15) }} />

        {/* Sign out */}
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
            Session
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={signingOut ? <CircularProgress size={14} /> : <LogoutIcon />}
              onClick={handleSignOut}
              disabled={signingOut}
              fullWidth
            >
              Sign Out
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: alpha('#ef4444', 0.15) }} />

        {/* Delete account */}
        <Box>
          <Typography variant="overline" sx={{ color: 'error.main', letterSpacing: '0.1em' }}>
            Danger Zone
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <TextField
              fullWidth
              size="small"
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Confirm password"
            />
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleDeleteAccount}
              disabled={deleting || !deletePassword.trim()}
              startIcon={deleting ? <CircularProgress size={14} /> : <DeleteIcon />}
              sx={{ flexShrink: 0 }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="text" color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
