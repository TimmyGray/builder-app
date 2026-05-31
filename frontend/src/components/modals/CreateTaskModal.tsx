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
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useUsersStore } from '@/stores/usersStore';
import { useJobTypesStore } from '@/stores/jobTypesStore';
import { useTasksStore } from '@/stores/tasksStore';
import { useNotifyStore } from '@/stores/notifyStore';
import { createTask, type TaskCreateInput } from '@/api/tasks';
import { MEASURE_LABELS, type TaskStatus } from '@/types/api';

const STATUS_OPTIONS: TaskStatus[] = ['ToBeDone', 'InProgress', 'Completed', 'Cancelled'];

interface Props {
  open: boolean;
  onClose: () => void;
}

// Cap the dropdown at ~5 rows so long Worker/Job Type lists scroll instead of overflowing.
const MENU_PROPS = { slotProps: { paper: { sx: { maxHeight: 280 } } } };

export function CreateTaskModal({ open, onClose }: Props) {
  const { t } = useTranslation();
  const { users, fetchUsers } = useUsersStore();
  const { jobTypes, fetchJobTypes } = useJobTypesStore();
  const addTask = useTasksStore((s) => s.addTask);
  const notify = useNotifyStore((s) => s.notify);

  const [userId, setUserId] = useState<number | ''>('');
  const [jobTypeId, setJobTypeId] = useState<number | ''>('');
  const [status, setStatus] = useState<TaskStatus>('ToBeDone');
  const [dateOfCompletion, setDateOfCompletion] = useState('');
  const [scopeValue, setScopeValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (users.length === 0) fetchUsers();
      if (jobTypes.length === 0) fetchJobTypes();
      setUserId('');
      setJobTypeId('');
      setStatus('ToBeDone');
      setDateOfCompletion('');
      setScopeValue('');
    }
  }, [open, users.length, jobTypes.length, fetchUsers, fetchJobTypes]);

  const selectedJobType = jobTypes.find((jt) => jt.id === jobTypeId);
  const measure = selectedJobType?.measure ?? null;
  const trimmedScope = scopeValue.trim();
  // For measured job types the scope must be a positive number; free text is allowed otherwise.
  const scopeInvalid = measure != null && trimmedScope !== '' && !(Number(trimmedScope) > 0);

  const handleSubmit = async () => {
    if (!userId || !jobTypeId || scopeInvalid) return;
    setSubmitting(true);
    try {
      const input: TaskCreateInput = {};
      if (status !== 'ToBeDone') input.status = status;
      if (dateOfCompletion) input.dateOfCompletion = dateOfCompletion;
      if (trimmedScope !== '') {
        if (measure) input.quantity = Number(trimmedScope);
        else input.scopeOfWork = trimmedScope;
      }
      const task = await createTask(userId as number, jobTypeId as number, input);
      addTask(task);
      notify(t('createTask.created'), 'success');
      onClose();
    } catch (e: unknown) {
      notify((e as { message: string }).message ?? t('createTask.createFailed'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
        {t('createTask.title')}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>{t('createTask.worker')}</InputLabel>
            <Select value={userId} onChange={(e) => setUserId(e.target.value as number)} label={t('createTask.worker')} MenuProps={MENU_PROPS}>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{u.username}</Typography>
                    <Typography variant="caption" color="text.secondary">{t(`role.${u.jobRole}`)}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>{t('createTask.jobType')}</InputLabel>
            <Select
              value={jobTypeId}
              onChange={(e) => { setJobTypeId(e.target.value as number); setScopeValue(''); }}
              label={t('createTask.jobType')}
              MenuProps={MENU_PROPS}
            >
              {jobTypes.map((jt) => (
                <MenuItem key={jt.id} value={jt.id}>
                  {jt.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>{t('common.status')}</InputLabel>
            <Select value={status} onChange={(e) => { setStatus(e.target.value as TaskStatus); if (e.target.value !== 'Completed') setDateOfCompletion(''); }} label={t('common.status')}>
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>{t(`status.${s}`)}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {status === 'Completed' && (
            <TextField
              fullWidth
              size="small"
              type="date"
              label={t('common.dateOfCompletion')}
              value={dateOfCompletion}
              onChange={(e) => setDateOfCompletion(e.target.value)}
              slotProps={{ inputLabel: { shrink: true } }}
            />
          )}

          {selectedJobType && (
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
                    : t('createTask.describeWork')
              }
              slotProps={
                measure
                  ? {
                      input: {
                        endAdornment: <InputAdornment position="end">{MEASURE_LABELS[measure]}</InputAdornment>,
                      },
                      htmlInput: { min: 0, step: 'any' },
                    }
                  : undefined
              }
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">{t('common.cancel')}</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !userId || !jobTypeId || scopeInvalid}
          startIcon={submitting ? <CircularProgress size={14} /> : null}
        >
          {t('createTask.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
