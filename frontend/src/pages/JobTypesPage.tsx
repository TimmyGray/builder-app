import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
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
import { ViewJobTypeModal } from '@/components/modals/ViewJobTypeModal';
import { MEASURE_LABELS, type JobTypeResponse } from '@/types/api';

export function JobTypesPage() {
  const { jobTypes, loading, fetchJobTypes, removeJobType } = useJobTypesStore();
  const notify = useNotifyStore((s) => s.notify);

  const [createOpen, setCreateOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<JobTypeResponse | null>(null);
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
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
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
          <Grid container spacing={2.5}>
            {jobTypes.map((jt) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={jt.id}>
                <Paper
                  onClick={() => setViewTarget(jt)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: alpha('#7c3aed', 0.4),
                      transform: 'translateY(-3px)',
                      boxShadow: `0 10px 36px ${alpha('#7c3aed', 0.18)}`,
                    },
                  }}
                >
                  {/* Card header */}
                  <Box
                    sx={{
                      px: 2.5,
                      pt: 2.5,
                      pb: 2,
                      background: `linear-gradient(135deg, ${alpha('#7c3aed', 0.12)}, ${alpha('#06b6d4', 0.06)})`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${alpha('#7c3aed', 0.35)}, ${alpha('#06b6d4', 0.25)})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <WorkIcon sx={{ fontSize: 22, color: '#a78bfa' }} />
                    </Box>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700, lineHeight: 1.3 }}>
                        {jt.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                        <Typography variant="caption" color="text.disabled">
                          ID #{jt.id}
                        </Typography>
                        {jt.measure && (
                          <Chip
                            label={MEASURE_LABELS[jt.measure]}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              background: alpha('#06b6d4', 0.15),
                              color: '#38d9f5',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>

                  {/* Description body */}
                  <Box sx={{ px: 2.5, py: 2, flex: 1 }}>
                    <Typography
                      variant="body2"
                      color={jt.description ? 'text.secondary' : 'text.disabled'}
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.6,
                        minHeight: '4.8em',
                      }}
                    >
                      {jt.description || 'No description'}
                    </Typography>
                  </Box>

                  {/* Actions */}
                  <Box
                    sx={{
                      px: 2,
                      pb: 1.5,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 0.5,
                      borderTop: `1px solid ${alpha('#7c3aed', 0.08)}`,
                      pt: 1,
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); setEditTarget(jt); }}
                      >
                        <EditIcon fontSize="small" sx={{ color: '#a78bfa' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(jt); }}
                      >
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
        <ViewJobTypeModal open={!!viewTarget} onClose={() => setViewTarget(null)} jobType={viewTarget} />
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
