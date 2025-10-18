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
      setDisplayedMessage("");
      setIsTyping(true);
      
      let currentIndex = 0;
      const messageLength = message.length;
      
      const typeWriter = () => {
        if (currentIndex < messageLength) {
          setDisplayedMessage(message.substring(0, currentIndex + 1));
          currentIndex++;
          setTimeout(typeWriter, 20); // Adjust typing speed here
        } else {
          setIsTyping(false);
        }
      };
      
      typeWriter();
    } else {
      setDisplayedMessage(message);
      setIsTyping(false);
    }
  }, [message, isUser, isStreaming]);

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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedMessage}</ReactMarkdown>
            {isTyping && (
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
