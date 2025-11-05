"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search, Plus, MessageSquare } from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  className?: string;
}

export function ChatSidebar({
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewChat,
  className = "",
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  return (
    <Card className={`flex flex-col h-full mr-4 shadow-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Chat History</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onNewChat}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Chat Sessions List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats found</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredSessions.map((session) => (
                <Button
                  key={session.id}
                  variant={
                    activeSessionId === session.id ? "secondary" : "ghost"
                  }
                  className={`w-full justify-start h-auto p-3 ${
                    activeSessionId === session.id ? "bg-muted" : ""
                  }`}
                  onClick={() => onSessionSelect(session.id)}
                >
                  <div className="flex flex-col items-start text-left w-full">
                    <div className="flex justify-between w-full mb-1">
                      <span className="font-medium text-sm truncate max-w-[120px]">
                        {session.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(session.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate w-full">
                      {session.lastMessage}
                    </p>
                    <div className="flex justify-between w-full mt-1">
                      <span className="text-xs text-muted-foreground">
                        {session.messageCount} messages
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
