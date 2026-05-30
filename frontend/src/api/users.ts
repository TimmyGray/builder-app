import { apiClient } from './client';
import type { UserResponse } from '@/types/api';

export const getUsers = async (): Promise<UserResponse[]> => {
  const { data } = await apiClient.get('/users');
  return data;
};

export const updateUser = async (id: number, username: string): Promise<UserResponse> => {
  const { data } = await apiClient.patch('/users', { id, username });
  return data;
};
