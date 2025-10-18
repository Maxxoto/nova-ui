"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, BookOpen, User, ChevronLeft, ChevronRight, Database, Blocks, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebarStore } from "@/stores/sidebar-store";
import { useAuthStore } from "@/stores/auth-store";

export function Navigation() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebarStore();
    const { logout } = useAuthStore();

    const navItems = [
        {
            href: "/",
            label: "Chat",
            icon: MessageSquare,
        },
        {
            href: "/knowledge",
            label: "Knowledge Source",
            icon: Database,
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
        <div className={cn(
            "fixed left-0 top-0 z-[60] h-screen bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r transition-all duration-300 pointer-events-auto",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className={cn(
                    "flex items-center gap-2 transition-opacity",
                    isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                )}>
                    <Blocks className="h-6 w-6 text-primary shrink-0" />
                    <span className="font-bold text-xl truncate">Nova</span>
                </div>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="h-8 w-8 p-0 shrink-0 relative z-[70] cursor-pointer"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            {/* Navigation Items */}
            <div className="p-2 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Button
                            key={item.href}
                            variant={isActive ? "secondary" : "ghost"}
                            size="sm"
                            asChild
                            className={cn(
                                "w-full justify-start h-10",
                                isCollapsed ? "px-2" : "px-3"
                            )}
                        >
                            <Link href={item.href}>
                                <item.icon className={cn(
                                    "h-4 w-4 shrink-0",
                                    isCollapsed ? "mr-0" : "mr-2"
                                )} />
                                <span className={cn(
                                    "transition-opacity",
                                    isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                                )}>
                                    {item.label}
                                </span>
                            </Link>
                        </Button>
                    );
                })}

                {/* Logout Button */}
                <div className="pt-4 border-t">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className={cn(
                            "w-full justify-start h-10 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer",
                            isCollapsed ? "px-2" : "px-3"
                        )}
                    >
                        <LogOut className={cn(
                            "h-4 w-4 shrink-0",
                            isCollapsed ? "mr-0" : "mr-2"
                        )} />
                        <span className={cn(
                            "transition-opacity",
                            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
                        )}>
                            Logout
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
