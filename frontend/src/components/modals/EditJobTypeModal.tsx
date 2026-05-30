import { useEffect, useState } from 'react';
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
import { updateJobType } from '@/api/jobTypes';
import type { JobTypeResponse } from '@/types/api';

interface Props {
  open: boolean;
  onClose: () => void;
  jobType: JobTypeResponse | null;
}

export function EditJobTypeModal({ open, onClose, jobType }: Props) {
  const replaceJobType = useJobTypesStore((s) => s.replaceJobType);
  const notify = useNotifyStore((s) => s.notify);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && jobType) setName(jobType.name);
  }, [open, jobType]);

  const handleSubmit = async () => {
    if (!jobType || !name.trim()) return;
    setSubmitting(true);
    try {
      const updated = await updateJobType(jobType.id, name.trim());
      replaceJobType(updated);
      notify('Job type updated', 'success');
      onClose();
    } catch (e: unknown) {
      notify((e as { message: string }).message ?? 'Failed to update job type', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
        Edit Job Type
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
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
