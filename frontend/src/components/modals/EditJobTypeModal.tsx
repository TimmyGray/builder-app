import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material';
import { useJobTypesStore } from '@/stores/jobTypesStore';
import { useNotifyStore } from '@/stores/notifyStore';
import { updateJobType } from '@/api/jobTypes';
import { MEASURE_OPTIONS, MEASURE_LABELS, type JobTypeResponse, type Measure } from '@/types/api';

interface Props {
  open: boolean;
  onClose: () => void;
  jobType: JobTypeResponse | null;
}

export function EditJobTypeModal({ open, onClose, jobType }: Props) {
  const replaceJobType = useJobTypesStore((s) => s.replaceJobType);
  const notify = useNotifyStore((s) => s.notify);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [measure, setMeasure] = useState<Measure | ''>('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open && jobType) {
      setName(jobType.name);
      setDescription(jobType.description ?? '');
      setMeasure(jobType.measure ?? '');
    }
  }, [open, jobType]);

  const handleSubmit = async () => {
    if (!jobType || !name.trim()) return;
    setSubmitting(true);
    try {
      const updated = await updateJobType(jobType.id, name.trim(), {
        description: description.trim() || undefined,
        measure: measure || undefined,
      });
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            size="small"
            label="Description"
            multiline
            minRows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControl fullWidth size="small">
            <InputLabel>Measure</InputLabel>
            <Select
              value={measure}
              onChange={(e) => setMeasure(e.target.value as Measure | '')}
              label="Measure"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {MEASURE_OPTIONS.map((m) => (
                <MenuItem key={m} value={m}>{MEASURE_LABELS[m]}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
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
