import { useEffect, useMemo, useState } from 'react';
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
  Tooltip,
} from '@mui/material';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

// Timestamps (createdAt): show in the user's local timezone — "I created this today"
const fmtTimestamp = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

// Date-only values (dateOfCompletion): stored as UTC midnight, force UTC display so
// it never drifts to the previous day in negative-offset timezones
const fmtDateOnly = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '—';

export function TasksPage() {
  const { tasks, loading, fetchTasks, removeTask } = useTasksStore();
  const jobTypes = useJobTypesStore((s) => s.jobTypes);
  const fetchJobTypes = useJobTypesStore((s) => s.fetchJobTypes);
  const notify = useNotifyStore((s) => s.notify);

  const [createOpen, setCreateOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState<TaskResponse | null>(null);
  const [editTarget, setEditTarget] = useState<TaskResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TaskResponse | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);
  useEffect(() => { fetchJobTypes(); }, [fetchJobTypes]);

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
      notify('Task deleted', 'info');
      setDeleteTarget(null);
    } catch (e: unknown) {
      notify((e as { message: string }).message ?? 'Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'jobType',
      headerName: 'Job Type',
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
      headerName: 'Scope of Work',
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
      headerName: 'Worker',
      flex: 1,
      minWidth: 120,
      valueGetter: (_: unknown, row: TaskResponse) => row.user?.username ?? '',
    },
    {
      field: 'jobRole',
      headerName: 'Role',
      width: 120,
      valueGetter: (_: unknown, row: TaskResponse) => row.user?.jobRole ?? '',
      renderCell: (params: GridRenderCellParams) => (
        <Chip
          label={params.value}
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
      headerName: 'Status',
      width: 130,
      renderCell: (params: GridRenderCellParams<TaskResponse, TaskStatus>) => {
        const s = STATUS_COLORS[params.value!] ?? STATUS_COLORS.ToBeDone;
        return (
          <Chip
            label={params.value}
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
      headerName: 'Created',
      width: 120,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="caption" color="text.secondary">{fmtTimestamp(params.value)}</Typography>
      ),
    },
    {
      field: 'dateOfCompletion',
      headerName: 'Completed On',
      width: 130,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant="caption" color="text.secondary">{fmtDateOnly(params.value)}</Typography>
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
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(e) => { e.stopPropagation(); setEditTarget(params.row); }}
            >
              <EditIcon fontSize="small" sx={{ color: '#a78bfa' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
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
              Tasks
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tasks.length} task{tasks.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setCreateOpen(true)}>
            New Task
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
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowClick={(params) => setViewTarget(params.row as TaskResponse)}
            sx={{
              border: 'none',
              '& .MuiDataGrid-row': { cursor: 'pointer' },
            }}
            getRowId={(row) => row.id}
          />
        </Box>

        <CreateTaskModal open={createOpen} onClose={() => setCreateOpen(false)} />
        <ViewTaskModal open={!!viewTarget} onClose={() => setViewTarget(null)} task={viewTarget} />
        <EditTaskModal open={!!editTarget} onClose={() => setEditTarget(null)} task={editTarget} />

        <Dialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700 }}>
            Delete Task?
          </DialogTitle>
          <DialogContent>
            <Typography color="text.secondary">
              Are you sure you want to delete the task <strong>{deleteTarget?.jobType}</strong>? This cannot be undone.
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
