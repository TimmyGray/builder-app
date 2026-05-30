import { Alert, Snackbar } from '@mui/material';
import { useNotifyStore } from '@/stores/notifyStore';

export function GlobalSnackbar() {
  const { notification, clear } = useNotifyStore();

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={4000}
      onClose={clear}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      key={notification?.key}
    >
      <Alert
        onClose={clear}
        severity={notification?.severity ?? 'info'}
        variant="filled"
        sx={{ minWidth: 280, fontWeight: 500 }}
      >
        {notification?.message}
      </Alert>
    </Snackbar>
  );
}
