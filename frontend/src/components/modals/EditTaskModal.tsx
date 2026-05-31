import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useTasksStore } from '@/stores/tasksStore';
import { useUsersStore } from '@/stores/usersStore';
import { useNotifyStore } from '@/stores/notifyStore';
import { updateTask, type TaskScopeInput } from '@/api/tasks';
import { MEASURE_LABELS, type TaskResponse, type TaskStatus } from '@/types/api';

const STATUS_OPTIONS: TaskStatus[] = ['ToBeDone', 'InProgress', 'Completed', 'Cancelled'];

interface Props {
  open: boolean;
  onClose: () => void;
  task: TaskResponse | null;
}

// Cap the dropdown at ~5 rows so a long worker list scrolls instead of overflowing.
const MENU_PROPS = { slotProps: { paper: { sx: { maxHeight: 280 } } } };

export function EditTaskModal({ open, onClose, task }: Props) {
  const { t } = useTranslation();
  const { users, fetchUsers } = useUsersStore();
  const replaceTask = useTasksStore((s) => s.replaceTask);
  const notify = useNotifyStore((s) => s.notify);

  const [status, setStatus] = useState<TaskStatus>('ToBeDone');
  const [userId, setUserId] = useState<number | ''>('');
  const [dateOfCompletion, setDateOfCompletion] = useState('');
  const [scopeValue, setScopeValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && task) {
      setStatus(task.status);
      setUserId(task.user.id);
      setDateOfCompletion(task.dateOfCompletion ? task.dateOfCompletion.slice(0, 10) : '');
      setScopeValue(
        task.measure
          ? (task.quantity != null ? String(task.quantity) : '')
          : (task.scopeOfWork ?? ''),
      );
      if (users.length === 0) fetchUsers();
    }
  }, [open, task, users.length, fetchUsers]);

  const measure = task?.measure ?? null;
  const trimmedScope = scopeValue.trim();
  const scopeInvalid = measure != null && trimmedScope !== '' && !(Number(trimmedScope) > 0);

  const handleSubmit = async () => {
    if (!task || scopeInvalid) return;
    setSubmitting(true);
    try {
      const patch: { status?: TaskStatus; dateOfCompletion?: string | null; userId?: number } & TaskScopeInput = {};
      if (status !== task.status) patch.status = status;
      if (userId && userId !== task.user.id) patch.userId = userId as number;
      const docValue = dateOfCompletion || null;
      if (docValue !== task.dateOfCompletion) patch.dateOfCompletion = docValue;

      if (trimmedScope !== '') {
        if (measure) {
          const q = Number(trimmedScope);
          if (q !== task.quantity) patch.quantity = q;
        } else if (trimmedScope !== (task.scopeOfWork ?? '')) {
          patch.scopeOfWork = trimmedScope;
        }
      }

      const updated = await updateTask(task.id, patch);
      replaceTask(updated);
      notify(t('editTask.updated'), 'success');
      onClose();
    } catch (e: unknown) {
      notify((e as { message: string }).message ?? t('editTask.updateFailed'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
        {t('editTask.title')}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('common.status')}</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} label={t('common.status')}>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>{t(`status.${s}`)}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>{t('editTask.reassignWorker')}</InputLabel>
            <Select value={userId} onChange={(e) => setUserId(e.target.value as number)} label={t('editTask.reassignWorker')} MenuProps={MENU_PROPS}>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            type="date"
            label={t('common.dateOfCompletion')}
            value={dateOfCompletion}
            onChange={(e) => {
              setDateOfCompletion(e.target.value);
              if (e.target.value) setStatus('Completed');
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          />

          <TextField
            fullWidth
            size="small"
            label={t('common.scopeOfWork')}
            type={measure ? 'number' : 'text'}
            value={scopeValue}
            onChange={(e) => setScopeValue(e.target.value)}
            error={scopeInvalid}
            helperText={
              scopeInvalid
                ? t('common.enterPositiveNumber')
                : measure
                  ? t('common.amountOfWork', { unit: MEASURE_LABELS[measure] })
                  : t('editTask.describeWork')
            }
            slotProps={
              measure
                ? {
                    input: {
                      endAdornment: <InputAdornment position="end">{MEASURE_LABELS[measure]}</InputAdornment>,
                    },
                    htmlInput: { min: 0, step: 'any', onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault(); } },
                  }
                : undefined
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">{t('common.cancel')}</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || scopeInvalid}
          startIcon={submitting ? <CircularProgress size={14} /> : null}
        >
          {t('editTask.saveChanges')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
