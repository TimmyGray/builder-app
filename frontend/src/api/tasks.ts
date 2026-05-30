import { apiClient } from './client';
import type { TaskResponse, TaskStatus } from '@/types/api';

export const getTasks = async (): Promise<TaskResponse[]> => {
  const { data } = await apiClient.get('/tasks');
  return data;
};

export const createTask = async (userId: number, jobTypeId: number): Promise<TaskResponse> => {
  const { data } = await apiClient.post('/tasks', { userId, jobTypeId });
  return data;
};

export const updateTask = async (
  id: number,
  patch: { status?: TaskStatus; dateOfCompletion?: string | null; userId?: number },
): Promise<TaskResponse> => {
  const { data } = await apiClient.patch('/tasks', { id, ...patch });
  return data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete('/tasks', { data: { id } });
};
