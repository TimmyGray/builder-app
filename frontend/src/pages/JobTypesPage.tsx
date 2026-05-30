import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  Fade,
  Grid,
  Paper,
  Tooltip,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkIcon from '@mui/icons-material/Work';
import { useJobTypesStore } from '@/stores/jobTypesStore';
import { useNotifyStore } from '@/stores/notifyStore';
import { deleteJobType } from '@/api/jobTypes';
import { CreateJobTypeModal } from '@/components/modals/CreateJobTypeModal';
import { EditJobTypeModal } from '@/components/modals/EditJobTypeModal';
import type { JobTypeResponse } from '@/types/api';

export function JobTypesPage() {
  const { jobTypes, loading, fetchJobTypes, removeJobType } = useJobTypesStore();
  const notify = useNotifyStore((s) => s.notify);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<JobTypeResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<JobTypeResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchJobTypes(); }, [fetchJobTypes]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteJobType(deleteTarget.id);
      removeJobType(deleteTarget.id);
      notify('Job type deleted', 'info');
      setDeleteTarget(null);
    } catch (e: unknown) {
      notify((e as { message: string }).message ?? 'Failed to delete job type', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Fade in timeout={400}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
              Job Types
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {jobTypes.length} type{jobTypes.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            New Job Type
          </Button>
        </Box>

        {!loading && jobTypes.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 10,
              gap: 2,
            }}
          >
            <WorkIcon sx={{ fontSize: 64, color: alpha('#7c3aed', 0.3) }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontFamily: '"Syne", sans-serif' }}>
              No job types yet
            </Typography>
            <Typography variant="body2" color="text.disabled">
              Create your first job type to get started
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)} sx={{ mt: 1 }}>
              Create Job Type
            </Button>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {jobTypes.map((jt) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={jt.id}>
                <Paper
                  sx={{
                    p: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: alpha('#7c3aed', 0.4),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 30px ${alpha('#7c3aed', 0.15)}`,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${alpha('#7c3aed', 0.3)}, ${alpha('#06b6d4', 0.2)})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <WorkIcon sx={{ fontSize: 18, color: '#a78bfa' }} />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        noWrap
                        title={jt.name}
                        sx={{ fontWeight: 700 }}
                      >
                        {jt.name}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        ID #{jt.id}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => setEditTarget(jt)}>
                        <EditIcon fontSize="small" sx={{ color: '#a78bfa' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => setDeleteTarget(jt)}>
                        <DeleteIcon fontSize="small" sx={{ color: '#f87171' }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        <CreateJobTypeModal open={createOpen} onClose={() => setCreateOpen(false)} />
        <EditJobTypeModal open={!!editTarget} onClose={() => setEditTarget(null)} jobType={editTarget} />

        <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
            Delete Job Type?
          </DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">
              Delete <strong>{deleteTarget?.name}</strong>? Any tasks using this job type may be affected.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDeleteTarget(null)} color="inherit">Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
}
