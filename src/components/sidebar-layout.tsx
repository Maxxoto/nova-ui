"use client";

import { useSidebarStore } from "@/stores/sidebar-store";
import { Navigation } from "./navigation";
import { cn } from "@/lib/utils";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isCollapsed } = useSidebarStore();

  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}