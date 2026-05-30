import { apiClient } from './client';
import type { UserJobRole, UserResponse } from '@/types/api';

export const signIn = async (username: string, password: string): Promise<UserResponse> => {
  const { data } = await apiClient.post('/auth/signin', { username, password });
  return data;
};

export const signUp = async (username: string, password: string, jobRole: UserJobRole): Promise<UserResponse> => {
  const { data } = await apiClient.post('/auth/signup', { username, password, jobRole });
  return data;
};

export const signOut = async (): Promise<void> => {
  await apiClient.post('/auth/signout', '');
};

export const deleteUser = async (username: string, password: string): Promise<void> => {
  await apiClient.delete('/auth/delete', { data: { username, password } });
};
