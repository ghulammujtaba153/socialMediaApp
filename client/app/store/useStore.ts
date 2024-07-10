import {create} from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface StoreState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useStore = create<StoreState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
