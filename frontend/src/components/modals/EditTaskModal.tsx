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
} from '@mui/material';
import { useTasksStore } from '@/stores/tasksStore';
import { useUsersStore } from '@/stores/usersStore';
import { useNotifyStore } from '@/stores/notifyStore';
import { updateTask } from '@/api/tasks';
import type { TaskResponse, TaskStatus } from '@/types/api';

const STATUS_OPTIONS: TaskStatus[] = ['ToBeDone', 'InProgress', 'Completed', 'Cancelled'];

interface Props {
  open: boolean;
  onClose: () => void;
  task: TaskResponse | null;
}

export function EditTaskModal({ open, onClose, task }: Props) {
  const { users, fetchUsers } = useUsersStore();
  const replaceTask = useTasksStore((s) => s.replaceTask);
  const notify = useNotifyStore((s) => s.notify);

  const [status, setStatus] = useState<TaskStatus>('ToBeDone');
  const [userId, setUserId] = useState<number | ''>('');
  const [dateOfCompletion, setDateOfCompletion] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && task) {
      setStatus(task.status);
      setUserId(task.user.id);
      setDateOfCompletion(task.dateOfCompletion ? task.dateOfCompletion.slice(0, 10) : '');
      if (users.length === 0) fetchUsers();
    }
  }, [open, task, users.length, fetchUsers]);

  const handleSubmit = async () => {
    if (!task) return;
    setSubmitting(true);
    try {
      const patch: { status?: TaskStatus; dateOfCompletion?: string | null; userId?: number } = {};
      if (status !== task.status) patch.status = status;
      if (userId && userId !== task.user.id) patch.userId = userId as number;
      const docValue = dateOfCompletion || null;
      if (docValue !== task.dateOfCompletion) patch.dateOfCompletion = docValue;

      const updated = await updateTask(task.id, patch);
      replaceTask(updated);
      notify('Task updated', 'success');
      onClose();
    } catch (e: unknown) {
      notify((e as { message: string }).message ?? 'Failed to update task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
        Edit Task
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} label="Status">
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Reassign Worker</InputLabel>
            <Select value={userId} onChange={(e) => setUserId(e.target.value as number)} label="Reassign Worker">
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>{u.username}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            type="date"
            label="Date of Completion"
            value={dateOfCompletion}
            onChange={(e) => {
              setDateOfCompletion(e.target.value);
              if (e.target.value) setStatus('Completed');
            }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={14} /> : null}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
