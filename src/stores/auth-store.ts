import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  isAuthenticated: boolean;
  showLoginDialog: boolean;
  login: () => void;
  logout: () => void;
  setShowLoginDialog: (show: boolean) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      showLoginDialog: true, // Show by default
      login: () => {
        // TODO: Implement Auth0 login logic
        console.log('Login with Auth0');
        set({ isAuthenticated: true, showLoginDialog: false });
      },
      logout: () => {
        set({ isAuthenticated: false, showLoginDialog: true });
      },
      setShowLoginDialog: (show: boolean) => set({ showLoginDialog: show }),
    }),
    {
      name: 'auth-storage',
    }
  )
);