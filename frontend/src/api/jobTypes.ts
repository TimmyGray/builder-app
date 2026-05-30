import { apiClient } from './client';
import type { JobTypeResponse, Measure } from '@/types/api';

export interface JobTypeInput {
  description?: string;
  measure?: Measure;
}

export const getJobTypes = async (): Promise<JobTypeResponse[]> => {
  const { data } = await apiClient.get('/job-types');
  return data;
};

export const createJobType = async (name: string, input: JobTypeInput = {}): Promise<JobTypeResponse> => {
  const { data } = await apiClient.post('/job-types', { name, ...input });
  return data;
};

export const updateJobType = async (id: number, name: string, input: JobTypeInput = {}): Promise<JobTypeResponse> => {
  const { data } = await apiClient.patch('/job-types', { id, name, ...input });
  return data;
};

export const deleteJobType = async (id: number): Promise<void> => {
  await apiClient.delete('/job-types', { data: { id } });
};
