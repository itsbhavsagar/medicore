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
  error: string | null;
  isInitialized: boolean;
  initialize: () => () => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isInitialized: false,
  initialize: () =>
    subscribeToAuthChanges((user) => {
      set({
        user,
        isInitialized: true,
        isLoading: false,
        error: null,
      });
    }),
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const user = await loginWithEmailPassword(email, password);
      set({ user, isLoading: false, error: null });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in right now.";

      set({ isLoading: false, error: message });
      throw error;
    }
  },
  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });

    try {
      const user = await loginWithGoogle();
      set({ user, isLoading: false, error: null });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to sign in with Google right now.";

      set({ isLoading: false, error: message });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true });

    try {
      await logoutFromFirebase();
      set({ user: null, isLoading: false, error: null });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to sign out right now.";

      set({ isLoading: false, error: message });
      throw error;
    }
  },
  clearError: () => set({ error: null }),
}));
