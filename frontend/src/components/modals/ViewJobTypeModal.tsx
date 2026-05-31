import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  alpha,
} from '@mui/material';
import { MEASURE_LABELS, type JobTypeResponse } from '@/types/api';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        {label}
      </Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  jobType: JobTypeResponse | null;
}

export function ViewJobTypeModal({ open, onClose, jobType }: Props) {
  if (!jobType) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
        Job Type Details
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 2, alignItems: 'start' }}>
            <Field label="Name">
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {jobType.name}
              </Typography>
            </Field>
            <Field label="Measure">
              {jobType.measure ? (
                <Chip
                  label={MEASURE_LABELS[jobType.measure]}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    background: alpha('#06b6d4', 0.15),
                    color: '#38d9f5',
                  }}
                />
              ) : (
                <Typography variant="body2" color="text.disabled">
                  None
                </Typography>
              )}
            </Field>
          </Box>

          <Divider sx={{ borderColor: alpha('#7c3aed', 0.15) }} />

          <Field label="Description">
            <Typography
              variant="body2"
              color={jobType.description ? 'text.secondary' : 'text.disabled'}
              sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {jobType.description || 'No description'}
            </Typography>
          </Field>

          <Typography variant="caption" color="text.disabled">
            ID #{jobType.id}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
