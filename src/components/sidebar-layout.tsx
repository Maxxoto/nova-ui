"use client";

import { useSidebarStore } from "@/stores/sidebar-store";
import { useChatStore } from "@/stores/chat-store";
import { Navigation } from "./navigation";
import { cn } from "@/lib/utils";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const { isCollapsed } = useSidebarStore();
  const { isFullscreen } = useChatStore();

  return (
    <div className="flex min-h-screen">
      {!isFullscreen && <Navigation />}
      <main
        className={cn(
          "flex-1 transition-all duration-300",
          isFullscreen ? "ml-0" : isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        {children}
      </main>
    </div>
  );
}
