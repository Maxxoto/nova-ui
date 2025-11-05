"use client";

import { useRef, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ChatSidebar } from "./chat-sidebar";
import { Maximize2, Minimize2, PanelLeft, PanelRight } from "lucide-react";
import { useChatStore } from "@/stores/chat-store";
import { usePersonaStore } from "@/stores/persona-store";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "@/stores/chat-store";

export function ChatInterface() {
  const {
    sessions,
    activeSessionId,
    isFullscreen,
    isSidebarOpen,
    isLoading,
    connectionStatus,
    setIsFullscreen,
    setIsSidebarOpen,
    sendMessage,
    createNewSession,
    selectSession,
    testConnection,
    addMessage,
    setIsLoading,
  } = useChatStore();

  const { currentPersona } = usePersonaStore();

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  );

  const activeSession = sessions.find(
    (session) => session.id === activeSessionId
  );

  // React Query mutation for sending chat messages
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!activeSessionId) return;

      // Add user message
      const userMessage = {
        id: Date.now().toString(),
        content,
        isUser: true,
        timestamp: new Date(),
      };

      addMessage(activeSessionId, userMessage);
      setIsLoading(true);

      // Create AI message placeholder
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage = {
        id: aiMessageId,
        content: "",
        isUser: false,
        timestamp: new Date(),
      };

      // Add empty AI message to start streaming
      addMessage(activeSessionId, aiMessage);
      setStreamingMessageId(aiMessageId);

      let accumulatedContent = "";

      // Get the active session to get thread_id
      const { sessions } = useChatStore.getState();
      const activeSession = sessions.find(
        (session) => session.id === activeSessionId
      );
      const thread_id = activeSession?.thread_id;

      // Use the sendChatMessage function with streaming callback
      console.log("🔍 [DEBUG] Sending chat message:", {
        sessionId: activeSessionId,
        hasThreadId: !!thread_id,
        thread_id: thread_id || "NOT_PROVIDED",
        contentLength: content.length,
      });

      await sendChatMessage(
        content,
        (chunk: string, eventThreadId: string) => {
          accumulatedContent += chunk;

          // Debug logging for thread_id updates
          if (eventThreadId && eventThreadId !== thread_id) {
            console.log(
              "🔄 [DEBUG] Received new thread_id from backend:",
              eventThreadId
            );
          }

          // Update the AI message with the accumulated content
          const { sessions } = useChatStore.getState();
          const updatedSessions = sessions.map((session) => {
            if (session.id === activeSessionId) {
              const updatedMessages = session.messages.map((message) => {
                if (message.id === aiMessageId) {
                  return {
                    ...message,
                    content: accumulatedContent,
                  };
                }
                return message;
              });

              // Update session thread_id if provided in event
              const updatedSession = {
                ...session,
                messages: updatedMessages,
                lastMessage: accumulatedContent,
                timestamp: new Date(),
              };

              if (eventThreadId && eventThreadId !== session.thread_id) {
                console.log(
                  "🔄 [DEBUG] Updating session thread_id from",
                  session.thread_id,
                  "to",
                  eventThreadId
                );
                updatedSession.thread_id = eventThreadId;
              }

              return updatedSession;
            }
            return session;
          });
          useChatStore.setState({ sessions: updatedSessions });
        },
        thread_id
      );

      setStreamingMessageId(null);
      return accumulatedContent;
    },
    onError: (error) => {
      console.error("Error sending message:", error);
      setIsLoading(false);
      setStreamingMessageId(null);

      // Update the AI message with error
      if (activeSessionId) {
        const { sessions } = useChatStore.getState();
        const updatedSessions = sessions.map((session) => {
          if (session.id === activeSessionId) {
            const updatedMessages = session.messages.map((message) => {
              if (message.id === (Date.now() + 1).toString()) {
                return {
                  ...message,
                  content:
                    "Sorry, I encountered an error while processing your message. Please try again.",
                };
              }
              return message;
            });
            return {
              ...session,
              messages: updatedMessages,
              lastMessage: "Error occurred",
              timestamp: new Date(),
            };
          }
          return session;
        });
        useChatStore.setState({ sessions: updatedSessions });
      }
    },
    onSettled: () => {
      setIsLoading(false);
      setStreamingMessageId(null);
    },
  });

  const handleSendMessage = async (content: string) => {
    await sendMessageMutation.mutateAsync(content);
  };

  const handleNewChat = () => {
    console.log("🔄 [DEBUG] Creating new chat session from frontend");
    createNewSession();
  };

  const handleSessionSelect = (sessionId: string) => {
    selectSession(sessionId);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Test connection on component mount
  useEffect(() => {
    testConnection();
  }, [testConnection]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector(
          '[data-slot="scroll-area-viewport"]'
        ) as HTMLElement;
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    };

    const timer = setTimeout(scrollToBottom, 0);
    return () => clearTimeout(timer);
  }, [activeSession?.messages]);

  return (
    <div
      className={`flex h-[600px] w-full max-w-[1400px] mx-auto gap-6 ${
        isFullscreen
          ? "fixed inset-0 z-50 h-screen w-screen max-w-none m-0 bg-background p-0"
          : ""
      }`}
    >
      {/* Sidebar */}
      {isSidebarOpen && (
        <div className={`w-80 flex-shrink-0 ${isFullscreen ? "h-full" : ""}`}>
          <ChatSidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSessionSelect={handleSessionSelect}
            onNewChat={handleNewChat}
            className={isFullscreen ? "h-full" : ""}
          />
        </div>
      )}

      {/* Main Chat Area */}
      <Card
        className={`flex flex-col flex-1 border-none shadow-xl ${isFullscreen ? "h-full" : ""}`}
      >
        {/* Header with controls */}
        <div
          className={`flex items-center justify-between border-b px-4 py-3 ${isFullscreen ? "p-2" : ""}`}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="h-8 w-8 p-0"
            >
              {isSidebarOpen ? (
                <PanelLeft className="h-4 w-4" />
              ) : (
                <PanelRight className="h-4 w-4" />
              )}
            </Button>
            <div
              className={`
                            h-3 w-3 rounded-full
                            ${
                              connectionStatus === "connected"
                                ? "bg-green-500"
                                : connectionStatus === "connecting"
                                  ? "bg-yellow-500 animate-pulse"
                                  : "bg-red-500"
                            }
                        `}
            />
            <div>
              <h1 className="font-semibold">Nova AI Assistant</h1>
              <p className="text-sm text-muted-foreground">
                {activeSession?.title || "New Chat"}
                {connectionStatus === "error" && (
                  <span className="text-red-500 ml-2">(Connection Error)</span>
                )}
                {connectionStatus === "connecting" && (
                  <span className="text-yellow-500 ml-2">(Connecting...)</span>
                )}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="h-8 w-8 p-0"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
          <ScrollArea ref={scrollAreaRef} className="h-full">
            <div
              className={`${isFullscreen ? "p-2" : "p-4"} max-w-6xl mx-auto`}
            >
              <div className="space-y-6">
                {activeSession?.messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message.content}
                    isUser={message.isUser}
                    timestamp={message.timestamp}
                    personaName={currentPersona.name}
                    avatarFallback={
                      message.isUser ? "You" : currentPersona.name
                    }
                    isStreaming={
                      !message.isUser && message.id === streamingMessageId
                    }
                  />
                ))}
                {!activeSession?.messages.length && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Start a conversation with Nova</p>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isLoading || sendMessageMutation.isPending}
            placeholder="Send a message..."
          />
        </div>
      </Card>
    </div>
  );
}
