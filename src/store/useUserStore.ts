import { create } from 'zustand';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Employee';
  leaveBalance: number;
}

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: user => set({ user }),
  clearUser: () => set({ user: null }),
}));
export default useUserStore;
