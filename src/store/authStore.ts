import { create } from "zustand";
import {
  loginWithGoogle,
  loginWithEmailPassword,
  logoutFromFirebase,
  subscribeToAuthChanges,
} from "../services/firebase";
import type { AuthUser } from "../types";

interface AuthStoreState {
  user: AuthUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  initialize: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  initialize: () =>
    subscribeToAuthChanges((user) => {
      set({
        user,
        isInitialized: true,
        isLoading: false,
      });
    }),
  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const user = await loginWithEmailPassword(email, password);
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  loginWithGoogle: async () => {
    set({ isLoading: true });

    try {
      const user = await loginWithGoogle();
      set({ user, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true });

    try {
      await logoutFromFirebase();
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
}));
