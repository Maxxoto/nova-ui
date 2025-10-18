"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "Chat",
      icon: MessageSquare,
    },
    {
      href: "/memories",
      label: "Memory Log",
      icon: BookOpen,
    },
    {
      href: "/persona",
      label: "Persona",
      icon: User,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">Nova</span>
      </div>
      
      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Button
              key={item.href}
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              asChild
              className={cn(
                "flex items-center gap-2",
                isActive && "bg-primary/10"
              )}
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}