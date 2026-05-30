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
import { useUsersStore } from '@/stores/usersStore';
import { useJobTypesStore } from '@/stores/jobTypesStore';
import { useTasksStore } from '@/stores/tasksStore';
import { useNotifyStore } from '@/stores/notifyStore';
import { createTask, type TaskScopeInput } from '@/api/tasks';
import { MEASURE_LABELS } from '@/types/api';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateTaskModal({ open, onClose }: Props) {
  const { users, fetchUsers } = useUsersStore();
  const { jobTypes, fetchJobTypes } = useJobTypesStore();
  const addTask = useTasksStore((s) => s.addTask);
  const notify = useNotifyStore((s) => s.notify);

  const [userId, setUserId] = useState<number | ''>('');
  const [jobTypeId, setJobTypeId] = useState<number | ''>('');
  const [scopeValue, setScopeValue] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (users.length === 0) fetchUsers();
      if (jobTypes.length === 0) fetchJobTypes();
      setUserId('');
      setJobTypeId('');
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
      const scope: TaskScopeInput = {};
      if (trimmedScope !== '') {
        if (measure) scope.quantity = Number(trimmedScope);
        else scope.scopeOfWork = trimmedScope;
      }
      const task = await createTask(userId as number, jobTypeId as number, scope);
      addTask(task);
      notify('Task created', 'success');
      onClose();
    } catch (e: unknown) {
      notify((e as { message: string }).message ?? 'Failed to create task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
        New Task
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Worker</InputLabel>
            <Select value={userId} onChange={(e) => setUserId(e.target.value as number)} label="Worker">
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{u.username}</Typography>
                    <Typography variant="caption" color="text.secondary">{u.jobRole}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Job Type</InputLabel>
            <Select
              value={jobTypeId}
              onChange={(e) => { setJobTypeId(e.target.value as number); setScopeValue(''); }}
              label="Job Type"
            >
              {jobTypes.map((jt) => (
                <MenuItem key={jt.id} value={jt.id}>
                  {jt.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedJobType && (
            <TextField
              fullWidth
              size="small"
              label="Scope of work"
              type={measure ? 'number' : 'text'}
              value={scopeValue}
              onChange={(e) => setScopeValue(e.target.value)}
              error={scopeInvalid}
              helperText={
                scopeInvalid
                  ? 'Enter a positive number'
                  : measure
                    ? `Amount of work done (${MEASURE_LABELS[measure]})`
                    : 'Describe the work done (optional)'
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
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !userId || !jobTypeId || scopeInvalid}
          startIcon={submitting ? <CircularProgress size={14} /> : null}
        >
          Create Task
        </Button>
      </DialogActions>
    </Dialog>
  );
}
