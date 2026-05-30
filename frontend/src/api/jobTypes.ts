import { apiClient } from './client';
import type { JobTypeResponse } from '@/types/api';

export const getJobTypes = async (): Promise<JobTypeResponse[]> => {
  const { data } = await apiClient.get('/job-types');
  return data;
};

export const createJobType = async (name: string): Promise<JobTypeResponse> => {
  const { data } = await apiClient.post('/job-types', { name });
  return data;
};

export const updateJobType = async (id: number, name: string): Promise<JobTypeResponse> => {
  const { data } = await apiClient.patch('/job-types', { id, name });
  return data;
};

export const deleteJobType = async (id: number): Promise<void> => {
  await apiClient.delete('/job-types', { data: { id } });
};
