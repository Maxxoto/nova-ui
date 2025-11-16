"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Type your message...",
}: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 p-4 bg-background dark:bg-[oklch(0.205_0_0)] max-w-5xl mx-auto"
    >
      <div className="flex-1">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[56px] resize-none rounded-2xl border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500"
          rows={1}
        />
      </div>
      <Button
        type="submit"
        size="icon"
        disabled={disabled || !message.trim()}
        className="h-12 w-12 rounded-full hover:bg-gray-500 disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-600 dark:disabled:text-gray-400 dark:bg-white-400!"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
