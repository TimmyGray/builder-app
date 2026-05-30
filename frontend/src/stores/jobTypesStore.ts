import { create } from 'zustand';
import { getJobTypes } from '@/api/jobTypes';
import type { JobTypeResponse } from '@/types/api';

interface JobTypesState {
  jobTypes: JobTypeResponse[];
  loading: boolean;
  fetchJobTypes: () => Promise<void>;
  addJobType: (jt: JobTypeResponse) => void;
  replaceJobType: (jt: JobTypeResponse) => void;
  removeJobType: (id: number) => void;
}

export const useJobTypesStore = create<JobTypesState>((set) => ({
  jobTypes: [],
  loading: false,
  fetchJobTypes: async () => {
    set({ loading: true });
    try {
      const jobTypes = await getJobTypes();
      set({ jobTypes });
    } finally {
      set({ loading: false });
    }
  },
  addJobType: (jt) => set((s) => ({ jobTypes: [...s.jobTypes, jt] })),
  replaceJobType: (jt) =>
    set((s) => ({ jobTypes: s.jobTypes.map((j) => (j.id === jt.id ? jt : j)) })),
  removeJobType: (id) => set((s) => ({ jobTypes: s.jobTypes.filter((j) => j.id !== id) })),
}));
