import { create } from 'zustand';
import { getTasks } from '@/api/tasks';
import type { TaskResponse } from '@/types/api';

interface TasksState {
  tasks: TaskResponse[];
  loading: boolean;
  fetchTasks: () => Promise<void>;
  addTask: (task: TaskResponse) => void;
  replaceTask: (task: TaskResponse) => void;
  removeTask: (id: number) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  loading: false,
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const tasks = await getTasks();
      set({ tasks });
    } finally {
      set({ loading: false });
    }
  },
  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  replaceTask: (task) =>
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === task.id ? task : t)) })),
  removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
}));
