import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  MenuItem,
  Select,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  Fade,
  Tooltip,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useTasksStore } from '@/stores/tasksStore';
import { useJobTypesStore } from '@/stores/jobTypesStore';
import { useNotifyStore } from '@/stores/notifyStore';
import { deleteTask } from '@/api/tasks';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { EditTaskModal } from '@/components/modals/EditTaskModal';
import { ViewTaskModal } from '@/components/modals/ViewTaskModal';
import { MEASURE_LABELS, type TaskResponse, type TaskStatus } from '@/types/api';

const STATUS_COLORS: Record<TaskStatus, { color: string; bg: string }> = {
  ToBeDone:   { color: '#a78bfa', bg: alpha('#7c3aed', 0.15) },
  InProgress: { color: '#38bdf8', bg: alpha('#0ea5e9', 0.15) },
  Completed:  { color: '#4ade80', bg: alpha('#22c55e', 0.15) },
  Cancelled:  { color: '#f87171', bg: alpha('#ef4444', 0.15) },
};

const DATE_LOCALE: Record<string, string> = { en: 'en-GB', ru: 'ru-RU' };

// Timestamps (createdAt): show in the user's local timezone — "I created this today"
const fmtTimestamp = (d: string | null, locale: string) =>
  d ? new Date(d).toLocaleDateString(DATE_LOCALE[locale] ?? 'en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// Date-only values (dateOfCompletion): stored as UTC midnight, force UTC display so
// it never drifts to the previous day in negative-offset timezones
const fmtDateOnly = (d: string | null, locale: string) =>
  d ? new Date(d).toLocaleDateString(DATE_LOCALE[locale] ?? 'en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '—';

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function TasksPage() {
  const { t, i18n } = useTranslation();
  const { tasks, hasNext, loading, fetchTasks, limit, cursorStack, setLimit, pushCursor, popCursor, removeTask } = useTasksStore();
  const jobTypes = useJobTypesStore((s) => s.jobTypes);
  const fetchJobTypes = useJobTypesStore((s) => s.fetchJobTypes);
  const notify = useNotifyStore((s) => s.notify);

  const [createOpen, setCreateOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<TaskResponse | null>(null);
  const [editTarget, setEditTarget] = useState<TaskResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TaskResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  const currentCursor = cursorStack[cursorStack.length - 1];

  useEffect(() => { fetchTasks(limit, currentCursor); }, [currentCursor, limit, fetchTasks]);
  useEffect(() => { fetchJobTypes(); }, [fetchJobTypes]);

  const handleNext = useCallback(() => {
    const { nextCursor } = useTasksStore.getState();
    if (nextCursor) pushCursor(nextCursor);
  }, [pushCursor]);

  const handlePrev = useCallback(() => { popCursor(); }, [popCursor]);

  const handleLimitChange = useCallback((newLimit: number) => { setLimit(newLimit); }, [setLimit]);

  const descByName = useMemo(
    () => new Map(jobTypes.map((jt) => [jt.name, jt.description])),
    [jobTypes],
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTask(deleteTarget.id);
      removeTask(deleteTarget.id);
      notify(t('tasks.deleted'), 'info');
      setDeleteTarget(null);
    } catch (e: unknown) {
      notify((e as { message: string }).message ?? t('tasks.deleteFailed'), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'jobType',
      headerName: t('tasks.col.jobType'),
      flex: 1.2,
      minWidth: 140,
      renderCell: (params: GridRenderCellParams<TaskResponse, string>) => {
        const description = descByName.get(params.value ?? '') ?? '';
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Typography
              variant="body2"
              noWrap
              title={description || undefined}
              sx={{ fontWeight: 600, cursor: description ? 'help' : 'default' }}
            >
              {params.value}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'scopeOfWork',
      headerName: t('tasks.col.scopeOfWork'),
      flex: 1,
      minWidth: 130,
      sortable: false,
      valueGetter: (_: unknown, row: TaskResponse) =>
        row.measure && row.quantity != null
          ? `${row.quantity} ${MEASURE_LABELS[row.measure]}`
          : (row.scopeOfWork ?? '—'),
      renderCell: (params: GridRenderCellParams<TaskResponse, string>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography variant="body2" color="text.secondary" noWrap title={params.value}>
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'worker',
      headerName: t('tasks.col.worker'),
      flex: 1,
      minWidth: 120,
      valueGetter: (_: unknown, row: TaskResponse) => row.user?.username ?? '',
    },
    {
      field: 'jobRole',
      headerName: t('tasks.col.role'),
      width: 120,
      valueGetter: (_: unknown, row: TaskResponse) => row.user?.jobRole ?? '',
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={t(`role.${params.value}`)}
          size="small"
          sx={{
            background: params.value === 'Supervisor'
              ? alpha('#06b6d4', 0.15)
              : alpha('#7c3aed', 0.15),
            color: params.value === 'Supervisor' ? '#38d9f5' : '#a78bfa',
            fontWeight: 600,
            fontSize: '0.7rem',
          }}
        />
      ),
    },
    {
      field: 'status',
      headerName: t('common.status'),
      width: 130,
      renderCell: (params: GridRenderCellParams<TaskResponse, TaskStatus>) => {
        const s = STATUS_COLORS[params.value!] ?? STATUS_COLORS.ToBeDone;
        return (
          <Chip
            label={t(`status.${params.value}`)}
            size="small"
            sx={{
              background: s.bg,
              color: s.color,
              fontWeight: 600,
              fontSize: '0.7rem',
              boxShadow: `0 0 8px ${s.bg}`,
            }}
          />
        );
      },
    },
    {
      field: 'createdAt',
      headerName: t('tasks.col.created'),
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="caption" color="text.secondary">{fmtTimestamp(params.value, i18n.language)}</Typography>
      ),
    },
    {
      field: 'dateOfCompletion',
      headerName: t('tasks.col.completedOn'),
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="caption" color="text.secondary">{fmtDateOnly(params.value, i18n.language)}</Typography>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      width: 90,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams<TaskResponse>) => (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0.5 }}>
          <Tooltip title={t('common.edit')}>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setEditTarget(params.row); }}
            >
              <EditIcon fontSize="small" sx={{ color: '#a78bfa' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setDeleteTarget(params.row); }}
            >
              <DeleteIcon fontSize="small" sx={{ color: '#f87171' }} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Fade in timeout={400}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
              {t('tasks.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('tasks.count', { count: tasks.length })}
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            {t('tasks.newTask')}
          </Button>
        </Box>

        <Box
          sx={{
            background: alpha('#1a1a3e', 0.5),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#7c3aed', 0.15)}`,
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <DataGrid
            rows={tasks}
            columns={columns}
            loading={loading}
            autoHeight
            disableRowSelectionOnClick
            hideFooterPagination
            hideFooter
            onRowClick={(params) => setViewTarget(params.row as TaskResponse)}
            sx={{
              border: 'none',
              '& .MuiDataGrid-row': { cursor: 'pointer' },
            }}
            getRowId={(row) => row.id}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 1.5,
              px: 2,
              py: 1.5,
              borderTop: `1px solid ${alpha('#7c3aed', 0.1)}`,
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {t('tasks.pagination.rowsPerPage')}
            </Typography>
            <Select
              value={limit}
              onChange={(e) => handleLimitChange(e.target.value as number)}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.8rem', minWidth: 64 }}
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <MenuItem key={n} value={n}>{n}</MenuItem>
              ))}
            </Select>
            <Button
              size="small"
              variant="outlined"
              disabled={cursorStack.length <= 1 || loading}
              onClick={handlePrev}
            >
              {t('tasks.pagination.prev')}
            </Button>
            <Button
              size="small"
              variant="outlined"
              disabled={!hasNext || loading}
              onClick={handleNext}
            >
              {t('tasks.pagination.next')}
            </Button>
          </Box>
        </Box>

        <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
        <ViewTaskModal open={!!viewTarget} onClose={() => setViewTarget(null)} task={viewTarget} />
        <EditTaskModal open={!!editTarget} onClose={() => setEditTarget(null)} task={editTarget} />

        <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
            {t('tasks.delete.title')}
          </DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">
              {t('tasks.delete.confirmText', { name: deleteTarget?.jobType })}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDeleteTarget(null)} color="inherit">{t('common.cancel')}</Button>
            <Button variant="contained" color="error" onClick={handleDelete} disabled={deleting}>
              {t('common.delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Fade>
  );
}
