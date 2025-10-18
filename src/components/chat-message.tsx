"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useState } from "react";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  avatarUrl?: string;
  avatarFallback?: string;
  personaName?: string;
  isStreaming?: boolean;
}

export function ChatMessage({
  message,
  isUser,
  timestamp,
  avatarUrl = isUser ? undefined : "/images/avatars/nova-avatar.jpeg",
  personaName,
  avatarFallback = isUser ? "You" : personaName || "Ai",
  isStreaming = false,
}: ChatMessageProps) {
  const [displayedMessage, setDisplayedMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isUser) {
      setDisplayedMessage(message);
      return;
    }

    if (isStreaming) {
      // For streaming, update immediately when message changes
      // This handles fast chunks without artificial delays
      setDisplayedMessage(message);
      
      // Only show typing indicator if we have content and it's actively streaming
      setIsTyping(message.length > 0);
    } else {
      // For non-streaming messages, show full content immediately
      setDisplayedMessage(message);
      setIsTyping(false);
    }
  }, [message, isUser, isStreaming]);

  // Handle smooth animation for initial streaming when message is empty
  useEffect(() => {
    if (isStreaming && message.length === 0) {
      // Show thinking animation when streaming but no content yet
      setIsTyping(true);
    }
  }, [isStreaming, message.length]);

  return (
    <div
      className={cn("flex gap-3 p-4", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatarUrl} />
        <AvatarFallback className="text-xs">{avatarFallback}</AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        )}
      >
        {isUser ? (
          <p className="text-base leading-relaxed whitespace-pre-wrap">
            {displayedMessage}
          </p>
        ) : (
          <div className="text-base leading-relaxed prose max-w-none">
            {displayedMessage ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedMessage}</ReactMarkdown>
            ) : isStreaming ? (
              <div className="flex items-center space-x-1 text-muted-foreground">
                <span className="text-sm">Thinking</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            ) : null}
            {isTyping && displayedMessage && (
              <span className="inline-block w-2 h-4 bg-current ml-1 animate-pulse" />
            )}
          </div>
        )}
        <p
          className={cn(
            "text-xs mt-1",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {timestamp.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </p>
      </div>
    </div>
  );
}
