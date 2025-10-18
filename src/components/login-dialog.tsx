"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield } from "lucide-react";

interface LoginDialogProps {
  isOpen: boolean;
}

export function LoginDialog({ isOpen }: LoginDialogProps) {
  if (!isOpen) return null;

  const handleLogin = () => {
    signIn("auth0");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Blurry background overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-xs" />

      {/* Login dialog */}
      <Card className="relative z-[101] w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Welcome to Nova</CardTitle>
            <CardDescription>
              Your personalized AI companion with memory and conversation
              capabilities
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleLogin} className="w-full" size="lg">
            <Shield className="h-4 w-4 mr-2" />
            Login with Auth0
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
