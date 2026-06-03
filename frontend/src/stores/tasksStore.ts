import { create } from 'zustand';
import { getTasks } from '@/api/tasks';
import type { TaskResponse } from '@/types/api';

interface TasksState {
  tasks: TaskResponse[];
  nextCursor: string | null;
  hasNext: boolean;
  loading: boolean;
  // Pagination state — persists across navigation
  limit: number;
  cursorStack: (string | undefined)[];
  fetchTasks: (limit?: number, cursor?: string) => Promise<void>;
  setLimit: (limit: number) => void;
  pushCursor: (cursor: string) => void;
  popCursor: () => void;
  addTask: (task: TaskResponse) => void;
  replaceTask: (task: TaskResponse) => void;
  removeTask: (id: number) => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  nextCursor: null,
  hasNext: false,
  loading: false,
  limit: 10,
  cursorStack: [undefined],
  fetchTasks: async (limit = 10, cursor?: string) => {
    set({ loading: true });
    try {
      const result = await getTasks(limit, cursor);
      set({ tasks: result.data, nextCursor: result.nextCursor, hasNext: result.hasNext });
    } finally {
      set({ loading: false });
    }
  },
  setLimit: (limit) => set({ limit, cursorStack: [undefined] }),
  pushCursor: (cursor) => set((s) => ({ cursorStack: [...s.cursorStack, cursor] })),
  popCursor: () => set((s) => ({ cursorStack: s.cursorStack.length > 1 ? s.cursorStack.slice(0, -1) : s.cursorStack })),
  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  replaceTask: (task) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === task.id ? task : t)) })),
  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
}));
