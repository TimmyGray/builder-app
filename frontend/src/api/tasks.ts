import { apiClient } from './client';
import type { TaskResponse, TaskStatus } from '@/types/api';

export const getTasks = async (): Promise<TaskResponse[]> => {
  const { data } = await apiClient.get('/tasks');
  return data;
};

export interface TaskScopeInput {
  quantity?: number;
  scopeOfWork?: string;
}

export interface TaskCreateInput extends TaskScopeInput {
  status?: TaskStatus;
  dateOfCompletion?: string;
}

export const createTask = async (
  userId: number,
  jobTypeId: number,
  input: TaskCreateInput = {},
): Promise<TaskResponse> => {
  const { data } = await apiClient.post('/tasks', { userId, jobTypeId, ...input });
  return data;
};

export const updateTask = async (
  id: number,
  patch: { status?: TaskStatus; dateOfCompletion?: string | null; userId?: number } & TaskScopeInput,
): Promise<TaskResponse> => {
  const { data } = await apiClient.patch('/tasks', { id, ...patch });
  return data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete('/tasks', { data: { id } });
};
