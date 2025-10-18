"use client";

import { useAuthStore } from "@/stores/auth-store";
import { LoginDialog } from "./login-dialog";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, showLoginDialog, login, setShowLoginDialog } = useAuthStore();

  const handleLogin = () => {
    login();
    // In a real implementation, this would redirect to Auth0
    // For now, we'll just simulate successful login
  };

  return (
    <>
      {children}
      {!isAuthenticated && (
        <LoginDialog
          isOpen={showLoginDialog}
          onLogin={handleLogin}
        />
      )}
    </>
  );
}