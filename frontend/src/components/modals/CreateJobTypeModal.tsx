import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { useJobTypesStore } from '@/stores/jobTypesStore';
import { useNotifyStore } from '@/stores/notifyStore';
import { createJobType } from '@/api/jobTypes';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateJobTypeModal({ open, onClose }: Props) {
  const addJobType = useJobTypesStore((s) => s.addJobType);
  const notify = useNotifyStore((s) => s.notify);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const jt = await createJobType(name.trim());
      addJobType(jt);
      notify('Job type created', 'success');
      setName('');
      onClose();
    } catch (e: unknown) {
      notify((e as { message: string }).message ?? 'Failed to create job type', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => { onClose(); setName(''); }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
        New Job Type
      </DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          size="small"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          sx={{ mt: 1 }}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting || !name.trim()}
          startIcon={submitting ? <CircularProgress size={14} /> : null}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
