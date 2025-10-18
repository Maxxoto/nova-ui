"use client";

import { useSession } from "next-auth/react";
import { LoginDialog } from "./login-dialog";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();

  const isAuthenticated = !!session;
  const isLoading = status === "loading";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {children}
      {!isAuthenticated && (
        <LoginDialog
          isOpen={true}
        />
      )}
    </>
  );
}