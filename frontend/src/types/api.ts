export type UserJobRole = 'Builder' | 'Supervisor';
export type TaskStatus = 'ToBeDone' | 'InProgress' | 'Completed' | 'Cancelled';

export interface UserResponse {
  id: number;
  username: string;
  jobRole: UserJobRole;
  createdAt: string;
  updatedAt: string;
}

export interface JobTypeResponse {
  id: number;
  name: string;
}

export interface TaskUser {
  id: number;
  username: string;
  jobRole: UserJobRole;
}

export interface TaskResponse {
  id: number;
  user: TaskUser;
  jobType: string;
  status: TaskStatus;
  dateOfCompletion: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
}
