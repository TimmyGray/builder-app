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
import { MEASURE_LABELS, type TaskResponse, type TaskStatus, type UserJobRole } from '@/types/api';

const STATUS_COLORS: Record<TaskStatus, { color: string; bg: string }> = {
  ToBeDone:   { color: '#a78bfa', bg: alpha('#7c3aed', 0.15) },
  InProgress: { color: '#38bdf8', bg: alpha('#0ea5e9', 0.15) },
  Completed:  { color: '#4ade80', bg: alpha('#22c55e', 0.15) },
  Cancelled:  { color: '#f87171', bg: alpha('#ef4444', 0.15) },
};

const fmtTimestamp = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const fmtDateOnly = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    : '—';

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

function RoleChip({ role }: { role: UserJobRole }) {
  return (
    <Chip
      label={role}
      size="small"
      sx={{
        background: role === 'Supervisor' ? alpha('#06b6d4', 0.15) : alpha('#7c3aed', 0.15),
        color: role === 'Supervisor' ? '#38d9f5' : '#a78bfa',
        fontWeight: 600,
        fontSize: '0.7rem',
      }}
    />
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  task: TaskResponse | null;
}

export function ViewTaskModal({ open, onClose, task }: Props) {
  if (!task) return null;

  const s = STATUS_COLORS[task.status] ?? STATUS_COLORS.ToBeDone;
  const scopeDisplay =
    task.measure && task.quantity != null
      ? `${task.quantity} ${MEASURE_LABELS[task.measure]}`
      : (task.scopeOfWork ?? '—');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
        Task Details
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          <Field label="Job Type">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {task.jobType}
              </Typography>
              {task.measure && (
                <Chip
                  label={MEASURE_LABELS[task.measure]}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: '0.68rem',
                    fontWeight: 600,
                    background: alpha('#06b6d4', 0.15),
                    color: '#38d9f5',
                  }}
                />
              )}
            </Box>
          </Field>

          <Divider sx={{ borderColor: alpha('#7c3aed', 0.15) }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
            <Field label="Worker">
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {task.user.username}
              </Typography>
            </Field>
            <Field label="Role">
              <RoleChip role={task.user.jobRole} />
            </Field>
            <Field label="Status">
              <Chip
                label={task.status}
                size="small"
                sx={{
                  background: s.bg,
                  color: s.color,
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  boxShadow: `0 0 8px ${s.bg}`,
                }}
              />
            </Field>
            <Field label="Scope of Work">
              <Typography
                variant="body2"
                color={scopeDisplay === '—' ? 'text.disabled' : 'text.primary'}
              >
                {scopeDisplay}
              </Typography>
            </Field>
          </Box>

          <Divider sx={{ borderColor: alpha('#7c3aed', 0.15) }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5 }}>
            <Field label="Created">
              <Typography variant="body2" color="text.secondary">
                {fmtTimestamp(task.createdAt)}
              </Typography>
            </Field>
            <Field label="Completed On">
              <Typography variant="body2" color="text.secondary">
                {fmtDateOnly(task.dateOfCompletion)}
              </Typography>
            </Field>
          </Box>
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
