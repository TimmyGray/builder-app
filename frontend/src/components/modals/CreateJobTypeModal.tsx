import { useState } from 'react';
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
import { createJobType } from '@/api/jobTypes';
import { MEASURE_OPTIONS, MEASURE_LABELS, type Measure } from '@/types/api';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateJobTypeModal({ open, onClose }: Props) {
  const addJobType = useJobTypesStore((s) => s.addJobType);
  const notify = useNotifyStore((s) => s.notify);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [measure, setMeasure] = useState<Measure | ''>('');
  const [submitting, setSubmitting] = useState(false);

  const reset = () => { setName(''); setDescription(''); setMeasure(''); };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const jt = await createJobType(name.trim(), {
        description: description.trim() || undefined,
        measure: measure || undefined,
      });
      addJobType(jt);
      notify('Job type created', 'success');
      reset();
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
      onClose={() => { onClose(); reset(); }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
        New Job Type
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
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
