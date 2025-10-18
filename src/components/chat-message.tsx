"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
    message: string;
    isUser: boolean;
    timestamp: Date;
    avatarUrl?: string;
    avatarFallback?: string;
    personaName?: string;
}

export function ChatMessage({
    message,
    isUser,
    timestamp,
    avatarUrl = isUser ? undefined : "/images/avatars/nova-avatar.jpeg",
    personaName,
    avatarFallback = isUser ? "You" : personaName || "Ai",
}: ChatMessageProps) {
    return (
        <div
            className={cn(
                "flex gap-3 p-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <Avatar className="h-10 w-10">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-xs">
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>

            <div
                className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                )}
            >
                {isUser ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
                ) : (
                  <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
                  </div>
                )}
                <p
                    className={cn(
                        "text-xs mt-1",
                        isUser ? "text-primary-foreground/70" : "text-muted-foreground"
                    )}
                >
                    {timestamp.toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    })}
                </p>
            </div>
        </div>
    );
}
