export type UserJobRole = 'Builder' | 'Supervisor';
export type TaskStatus = 'ToBeDone' | 'InProgress' | 'Completed' | 'Cancelled';

/** Unit of measurement a job type's work is quantified in (matches the backend `Measure` enum). */
export type Measure = 'm' | 'liters' | 'm^2' | 'm^3' | 'kg';

export const MEASURE_OPTIONS: Measure[] = ['m', 'liters', 'm^2', 'm^3', 'kg'];

/** Human-friendly unit labels (e.g. `m^2` -> `m²`) for display. */
export const MEASURE_LABELS: Record<Measure, string> = {
  m: 'm',
  liters: 'L',
  'm^2': 'm²',
  'm^3': 'm³',
  kg: 'kg',
};

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
  description: string | null;
  measure: Measure | null;
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
  measure: Measure | null;
  quantity: number | null;
  scopeOfWork: string | null;
  status: TaskStatus;
  dateOfCompletion: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
}
