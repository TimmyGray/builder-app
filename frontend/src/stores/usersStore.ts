import { create } from 'zustand';
import { getUsers } from '@/api/users';
import type { UserResponse } from '@/types/api';

interface UsersState {
  users: UserResponse[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [],
  loading: false,
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const users = await getUsers();
      set({ users });
    } finally {
      set({ loading: false });
    }
  },
}));
